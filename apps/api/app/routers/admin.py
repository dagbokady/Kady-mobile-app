# app/routers/admin.py — back-office (protégé par en-tête X-Admin-Token).
from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, Header
from sqlalchemy import func, or_, select

from app.core.config import settings
from app.core.deps import Db
from app.core.errors import err
from app.models.billing import Abonnement, Waitlist
from app.models.cercle import Cercle, CercleMembre
from app.models.config import AppConfig
from app.models.securite import Signalement
from app.models.user import Profil, User

router = APIRouter(prefix="/admin", tags=["admin"])


def guard(x_admin_token: Annotated[str | None, Header()] = None) -> None:
    if x_admin_token != settings.ADMIN_TOKEN:
        raise err(403, "ADMIN_REQUIS", "Accès back-office refusé.")


def _premium_ids(db: Db) -> set[str]:
    now = datetime.now(timezone.utc)
    rows = db.execute(select(Abonnement.user_id).where(
        Abonnement.plan == "premium", Abonnement.statut == "actif",
        or_(Abonnement.fin.is_(None), Abonnement.fin > now))).scalars().all()
    return set(rows)


@router.get("/stats")
def stats(db: Db, _: None = Depends(guard)):
    users = db.execute(select(func.count(User.id)).where(User.is_deleted.is_(False))).scalar_one()
    actifs = db.execute(select(func.count(User.id)).where(User.is_active.is_(True), User.is_deleted.is_(False))).scalar_one()
    cercles = db.execute(select(func.count(Cercle.id)).where(Cercle.statut == "actif")).scalar_one()
    premium = len(_premium_ids(db))
    waitlist = db.execute(select(func.count(Waitlist.id))).scalar_one()
    reports = db.execute(select(func.count(Signalement.id)).where(Signalement.statut == "ouvert")).scalar_one()
    return {"users": users, "actifs": actifs, "cercles": cercles, "premium": premium,
            "waitlist": waitlist, "reports": reports}


@router.get("/users")
def users(db: Db, _: None = Depends(guard), q: str | None = None):
    prem = _premium_ids(db)
    rows = db.execute(select(User).where(User.is_deleted.is_(False)).order_by(User.created_at.desc())).scalars().all()
    out = []
    for u in rows:
        p = db.execute(select(Profil).where(Profil.user_id == u.id)).scalars().first()
        nom = p.prenom if p else u.email.split("@")[0]
        if q and q.lower() not in (nom + u.email).lower():
            continue
        nb = db.execute(select(func.count(CercleMembre.id)).where(CercleMembre.user_id == u.id)).scalar_one()
        statut = "Suspendu" if not u.is_active else ("Premium" if u.id in prem else ("Vérifié" if u.is_verified else "Actif"))
        out.append({"id": u.id, "name": nom, "email": u.email, "ville": p.ville if p else None,
                    "cercles": nb, "joined": u.created_at.strftime("%d/%m/%y"), "status": statut,
                    "is_active": u.is_active})
    return out


@router.post("/users/{user_id}/suspend")
def suspend(user_id: str, db: Db, _: None = Depends(guard)):
    u = db.get(User, user_id)
    if u is None:
        raise err(404, "INTROUVABLE", "Utilisateur introuvable.")
    u.is_active = not u.is_active
    db.commit()
    return {"is_active": u.is_active}


@router.get("/cercles")
def cercles(db: Db, _: None = Depends(guard)):
    rows = db.execute(select(Cercle).order_by(Cercle.created_at.desc())).scalars().all()
    out = []
    for c in rows:
        nb = db.execute(select(func.count(CercleMembre.id)).where(CercleMembre.cercle_id == c.id)).scalar_one()
        out.append({"id": c.id, "nom": c.nom, "theme": c.theme, "membres": nb, "statut": c.statut})
    return out


@router.post("/cercles/{cercle_id}/toggle")
def toggle_cercle(cercle_id: str, db: Db, _: None = Depends(guard)):
    c = db.get(Cercle, cercle_id)
    if c is None:
        raise err(404, "INTROUVABLE", "Cercle introuvable.")
    c.statut = "archive" if c.statut == "actif" else "actif"
    db.commit()
    return {"statut": c.statut}


@router.get("/signalements")
def signalements(db: Db, _: None = Depends(guard)):
    rows = db.execute(select(Signalement).where(Signalement.statut == "ouvert").order_by(Signalement.created_at.desc())).scalars().all()
    return [{"id": r.id, "contexte": r.contexte, "motif": r.motif,
             "time": r.created_at.strftime("%d/%m %H:%M")} for r in rows]


@router.post("/signalements/{sid}/resolve")
def resolve(sid: str, db: Db, _: None = Depends(guard), statut: str = "traite"):
    r = db.get(Signalement, sid)
    if r is None:
        raise err(404, "INTROUVABLE", "Signalement introuvable.")
    r.statut = statut if statut in ("traite", "rejete") else "traite"
    db.commit()
    return {"statut": r.statut}


@router.get("/config")
def get_config(db: Db, _: None = Depends(guard)):
    rows = {c.cle: c.valeur for c in db.execute(select(AppConfig)).scalars().all()}
    return {"waitlist_mode": rows.get("waitlist_mode", "true") == "true",
            "maintenance": rows.get("maintenance", "false") == "true"}


@router.post("/config")
def set_config(cle: str, valeur: bool, db: Db, _: None = Depends(guard)):
    row = db.get(AppConfig, cle)
    if row is None:
        row = AppConfig(cle=cle)
        db.add(row)
    row.valeur = "true" if valeur else "false"
    db.commit()
    return {"cle": cle, "valeur": row.valeur}
