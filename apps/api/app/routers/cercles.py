# app/routers/cercles.py — découvrir, salle d'accueil, adhésion, chat de cercle (WS).
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Query, WebSocket, WebSocketDisconnect
from sqlalchemy import func, select

from app.core.database import SessionLocal
from app.core.deps import CurrentUser, Db
from app.core.errors import err
from app.core.security import decode_token
from app.models.cercle import Cercle, CercleMembre, CercleMessage
from app.models.relation import Relation
from app.models.user import Profil, User
from app.schemas.cercle import (CercleCreate, CercleMessageIn, CercleMessageOut, CercleOut, MembreOut)
from app.schemas.common import Ok
from app.services.regles import FREE_MAX_CERCLES, paire, premium_actif
from app.utils.filtre import filtrer_message
from app.ws.manager import manager

router = APIRouter(prefix="/cercles", tags=["cercles"])


def _nb_membres(db, cercle_id: str) -> int:
    return db.execute(select(func.count(CercleMembre.id)).where(CercleMembre.cercle_id == cercle_id)).scalar_one()


def _est_membre(db, cercle_id: str, user_id: str) -> CercleMembre | None:
    return db.execute(
        select(CercleMembre).where(CercleMembre.cercle_id == cercle_id, CercleMembre.user_id == user_id)
    ).scalars().first()


@router.get("", response_model=list[CercleOut])
def lister(user: CurrentUser, db: Db, q: str | None = None):
    stmt = select(Cercle).where(Cercle.statut == "actif")
    if q:
        like = f"%{q.lower()}%"
        stmt = stmt.where(func.lower(Cercle.nom).like(like) | func.lower(Cercle.theme).like(like))
    out = []
    for c in db.execute(stmt.order_by(Cercle.created_at.desc())).scalars():
        out.append(CercleOut(id=c.id, nom=c.nom, theme=c.theme, description=c.description,
                             niveau=c.niveau, statut=c.statut, capacite_max=c.capacite_max,
                             membres=_nb_membres(db, c.id), expire_le=c.expire_le,
                             rejoint=_est_membre(db, c.id, user.id) is not None))
    return out


@router.post("", response_model=CercleOut, status_code=201)
def creer(data: CercleCreate, user: CurrentUser, db: Db):
    actifs = db.execute(select(func.count(CercleMembre.id)).where(CercleMembre.user_id == user.id)).scalar_one()
    if not premium_actif(db, user.id) and actifs >= FREE_MAX_CERCLES:
        raise err(403, "LIMITE_CERCLES", f"Le plan gratuit est limité à {FREE_MAX_CERCLES} Cercles. Passe Premium pour plus.")
    c = Cercle(nom=data.nom, theme=data.theme, description=data.description, regles=data.regles,
               capacite_max=data.capacite_max, created_by=user.id,
               expire_le=datetime.now(timezone.utc) + timedelta(days=60))
    db.add(c)
    db.flush()
    db.add(CercleMembre(cercle_id=c.id, user_id=user.id, role="fondateur", rejoint_le=datetime.now(timezone.utc)))
    db.commit()
    return CercleOut(id=c.id, nom=c.nom, theme=c.theme, description=c.description, niveau=c.niveau,
                     statut=c.statut, capacite_max=c.capacite_max, membres=1, expire_le=c.expire_le, rejoint=True)


@router.get("/{cercle_id}", response_model=CercleOut)
def salle_accueil(cercle_id: str, user: CurrentUser, db: Db):
    c = db.get(Cercle, cercle_id)
    if c is None:
        raise err(404, "CERCLE_INTROUVABLE", "Ce Cercle n'existe pas.")
    return CercleOut(id=c.id, nom=c.nom, theme=c.theme, description=c.description, niveau=c.niveau,
                     statut=c.statut, capacite_max=c.capacite_max, membres=_nb_membres(db, c.id),
                     expire_le=c.expire_le, rejoint=_est_membre(db, c.id, user.id) is not None)


@router.get("/{cercle_id}/membres", response_model=list[MembreOut])
def membres(cercle_id: str, user: CurrentUser, db: Db):
    rows = db.execute(select(CercleMembre).where(CercleMembre.cercle_id == cercle_id)).scalars().all()
    out = []
    for m in rows:
        prenom = db.execute(select(Profil.prenom).where(Profil.user_id == m.user_id)).scalar_one_or_none()
        out.append(MembreOut(user_id=m.user_id, prenom=prenom, role=m.role, grade=m.grade))
    return out


@router.post("/{cercle_id}/join", response_model=Ok, status_code=201)
def rejoindre(cercle_id: str, user: CurrentUser, db: Db):
    c = db.get(Cercle, cercle_id)
    if c is None or c.statut != "actif":
        raise err(404, "CERCLE_INTROUVABLE", "Ce Cercle n'est pas disponible.")
    if _est_membre(db, cercle_id, user.id):
        raise err(409, "DEJA_MEMBRE", "Tu fais déjà partie de ce Cercle.")
    if _nb_membres(db, cercle_id) >= c.capacite_max:
        raise err(409, "CERCLE_COMPLET", "Ce Cercle est complet.")
    actifs = db.execute(select(func.count(CercleMembre.id)).where(CercleMembre.user_id == user.id)).scalar_one()
    if not premium_actif(db, user.id) and actifs >= FREE_MAX_CERCLES:
        raise err(403, "LIMITE_CERCLES", f"Le plan gratuit est limité à {FREE_MAX_CERCLES} Cercles.")

    # Adhésion + matérialisation de l'invariant : une relation par membre existant.
    db.add(CercleMembre(cercle_id=cercle_id, user_id=user.id, rejoint_le=datetime.now(timezone.utc)))
    autres = db.execute(select(CercleMembre.user_id).where(
        CercleMembre.cercle_id == cercle_id, CercleMembre.user_id != user.id)).scalars().all()
    for autre in autres:
        a, b = paire(user.id, autre)
        existe = db.execute(select(Relation.id).where(
            Relation.user_a_id == a, Relation.user_b_id == b, Relation.mode == "rencontre")).first()
        if not existe:
            db.add(Relation(user_a_id=a, user_b_id=b, mode="rencontre", niveau=1,
                            cercle_origine_id=cercle_id, dm_ouvert=False))
    db.commit()
    return Ok()


@router.post("/{cercle_id}/leave", response_model=Ok)
def quitter(cercle_id: str, user: CurrentUser, db: Db):
    m = _est_membre(db, cercle_id, user.id)
    if m is None:
        raise err(404, "PAS_MEMBRE", "Tu n'es pas membre de ce Cercle.")
    db.delete(m)
    db.commit()
    return Ok()


@router.get("/{cercle_id}/messages", response_model=list[CercleMessageOut])
def messages(cercle_id: str, user: CurrentUser, db: Db,
             before: datetime | None = None, limit: int = Query(20, ge=1, le=50)):
    if _est_membre(db, cercle_id, user.id) is None:
        raise err(403, "PAS_MEMBRE", "Rejoins le Cercle pour voir les messages.")
    stmt = select(CercleMessage).where(CercleMessage.cercle_id == cercle_id)
    if before:
        stmt = stmt.where(CercleMessage.created_at < before)
    rows = db.execute(stmt.order_by(CercleMessage.created_at.desc()).limit(limit)).scalars().all()
    return list(reversed(rows))


@router.post("/{cercle_id}/messages", response_model=CercleMessageOut, status_code=201)
async def poster_message(cercle_id: str, data: CercleMessageIn, user: CurrentUser, db: Db):
    if _est_membre(db, cercle_id, user.id) is None:
        raise err(403, "PAS_MEMBRE", "Rejoins le Cercle pour écrire.")
    contenu, filtre = filtrer_message(data.contenu)
    msg = CercleMessage(cercle_id=cercle_id, auteur_id=user.id, contenu=contenu, est_filtre=filtre)
    db.add(msg)
    db.commit()
    db.refresh(msg)
    out = CercleMessageOut.model_validate(msg)
    await manager.broadcast(f"cercle:{cercle_id}", {"type": "message", "data": out.model_dump(mode="json")})
    return out


@router.websocket("/{cercle_id}/ws")
async def ws_cercle(websocket: WebSocket, cercle_id: str, token: str = Query(...)):
    try:
        user_id = decode_token(token)["sub"]
    except Exception:
        await websocket.close(code=4401)
        return
    db = SessionLocal()
    try:
        if _est_membre(db, cercle_id, user_id) is None:
            await websocket.close(code=4403)
            return
    finally:
        db.close()
    room = f"cercle:{cercle_id}"
    await manager.join(room, websocket)
    try:
        while True:
            await websocket.receive_text()  # ping/keepalive ; l'écriture passe par POST
    except WebSocketDisconnect:
        manager.leave(room, websocket)
