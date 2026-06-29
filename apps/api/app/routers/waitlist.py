# app/routers/waitlist.py — liste d'attente + parrainage (recalcul du rang).
from fastapi import APIRouter
from sqlalchemy import select

from app.core.deps import Db
from app.core.errors import err
from app.models.billing import Waitlist
from app.schemas.billing import WaitlistIn, WaitlistOut
from app.utils.codes import code_parrainage

router = APIRouter(prefix="/waitlist", tags=["waitlist"])


def _recalculer_rangs(db) -> None:
    # Rang = ordre par (nb_parrainages décroissant, created_at croissant).
    rows = db.execute(select(Waitlist).order_by(
        Waitlist.nb_parrainages.desc(), Waitlist.created_at.asc())).scalars().all()
    for i, w in enumerate(rows, start=1):
        w.rang = i


@router.post("", response_model=WaitlistOut, status_code=201)
def inscrire(data: WaitlistIn, db: Db):
    if db.execute(select(Waitlist.id).where(Waitlist.email == data.email.lower())).first():
        raise err(409, "EMAIL_DEJA_INSCRIT", "Cet email est déjà sur la liste d'attente.")

    # Code unique.
    code = code_parrainage()
    while db.execute(select(Waitlist.id).where(Waitlist.code_parrainage == code)).first():
        code = code_parrainage()

    w = Waitlist(prenom=data.prenom, email=data.email.lower(), genre=data.genre, ville=data.ville,
                 centres_interet=data.centres_interet, fonctionnalite_preferee=data.fonctionnalite_preferee,
                 code_parrainage=code, parraine_par=data.parraine_par)
    db.add(w)

    # Crédite le parrain s'il existe.
    if data.parraine_par:
        parrain = db.execute(select(Waitlist).where(
            Waitlist.code_parrainage == data.parraine_par)).scalars().first()
        if parrain:
            parrain.nb_parrainages += 1
    db.flush()
    _recalculer_rangs(db)
    db.commit()
    db.refresh(w)
    return WaitlistOut(code_parrainage=w.code_parrainage, rang=w.rang, nb_parrainages=w.nb_parrainages)
