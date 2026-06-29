# app/routers/villes.py — référentiel public des villes (pour les selects).
from fastapi import APIRouter
from sqlalchemy import select

from app.core.deps import Db
from app.models.ville import Ville

router = APIRouter(prefix="/villes", tags=["villes"])


@router.get("", response_model=list[str])
def lister(db: Db):
    rows = db.execute(select(Ville).order_by(Ville.ordre, Ville.nom)).scalars().all()
    return [v.nom for v in rows]
