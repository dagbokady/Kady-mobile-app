# app/routers/carnet.py — notes privées (visibles du propriétaire seul).
from fastapi import APIRouter
from sqlalchemy import select

from app.core.deps import CurrentUser, Db
from app.core.errors import err
from app.models.securite import CarnetEntree
from app.schemas.common import CarnetIn, CarnetOut, Ok

router = APIRouter(prefix="/carnet", tags=["carnet"])


@router.get("", response_model=list[CarnetOut])
def lister(user: CurrentUser, db: Db):
    return db.execute(select(CarnetEntree).where(CarnetEntree.user_id == user.id)
                      .order_by(CarnetEntree.created_at.desc())).scalars().all()


@router.post("", response_model=CarnetOut, status_code=201)
def ajouter(data: CarnetIn, user: CurrentUser, db: Db):
    if data.type not in ("note", "souvenir", "rappel"):
        raise err(422, "TYPE_INVALIDE", "Type de note invalide.")
    e = CarnetEntree(user_id=user.id, contenu=data.contenu, type=data.type, cible_id=data.cible_id)
    db.add(e)
    db.commit()
    db.refresh(e)
    return e


@router.delete("/{entree_id}", response_model=Ok)
def supprimer(entree_id: str, user: CurrentUser, db: Db):
    e = db.get(CarnetEntree, entree_id)
    if e is None or e.user_id != user.id:
        raise err(404, "NOTE_INTROUVABLE", "Note introuvable.")
    db.delete(e)
    db.commit()
    return Ok()
