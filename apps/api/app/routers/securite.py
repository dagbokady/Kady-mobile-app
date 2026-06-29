# app/routers/securite.py — blocage, masquage, signalement, pause relationnelle.
from sqlalchemy import select

from fastapi import APIRouter

from app.core.deps import CurrentUser, Db
from app.core.errors import err
from app.models.securite import Blocage, Masquage, Signalement
from app.schemas.billing import SignalementIn
from app.schemas.common import Ok

router = APIRouter(prefix="/securite", tags=["securite"])


@router.post("/bloquer/{cible_id}", response_model=Ok, status_code=201)
def bloquer(cible_id: str, user: CurrentUser, db: Db):
    if cible_id == user.id:
        raise err(422, "AUTO_BLOCAGE", "Tu ne peux pas te bloquer toi-même.")
    existe = db.execute(select(Blocage.id).where(
        Blocage.bloqueur_id == user.id, Blocage.bloque_id == cible_id)).first()
    if not existe:
        db.add(Blocage(bloqueur_id=user.id, bloque_id=cible_id))
        db.commit()
    return Ok()


@router.delete("/bloquer/{cible_id}", response_model=Ok)
def debloquer(cible_id: str, user: CurrentUser, db: Db):
    b = db.execute(select(Blocage).where(
        Blocage.bloqueur_id == user.id, Blocage.bloque_id == cible_id)).scalars().first()
    if b:
        db.delete(b)
        db.commit()
    return Ok()


@router.post("/masquer/{cible_id}", response_model=Ok, status_code=201)
def masquer(cible_id: str, user: CurrentUser, db: Db):
    existe = db.execute(select(Masquage.id).where(
        Masquage.user_id == user.id, Masquage.masque_id == cible_id)).first()
    if not existe:
        db.add(Masquage(user_id=user.id, masque_id=cible_id))
        db.commit()
    return Ok()


@router.post("/signaler", response_model=Ok, status_code=201)
def signaler(data: SignalementIn, user: CurrentUser, db: Db):
    if data.contexte not in ("cercle", "dm"):
        raise err(422, "CONTEXTE_INVALIDE", "Contexte de signalement invalide.")
    db.add(Signalement(signaleur_id=user.id, signale_id=data.signale_id, contexte=data.contexte,
                       cercle_id=data.cercle_id, conversation_id=data.conversation_id, motif=data.motif))
    db.commit()
    return Ok()


@router.post("/pause", response_model=Ok)
def basculer_pause(user: CurrentUser, db: Db, actif: bool = True):
    user.en_pause = actif
    db.commit()
    return Ok()
