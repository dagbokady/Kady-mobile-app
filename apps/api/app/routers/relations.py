# app/routers/relations.py — relations partagées & évaluation (passage de niveau).
from fastapi import APIRouter
from sqlalchemy import or_, select

from app.core.deps import CurrentUser, Db
from app.core.errors import err
from app.models.relation import Relation
from app.schemas.dm import EvaluationIn, NiveauOut, RelationOut
from app.services.regles import appliquer_niveau, prenom_de

router = APIRouter(prefix="/relations", tags=["relations"])

# Une évaluation moyenne ≥ 4/5 fait progresser le lien d'un niveau.
SEUIL_EVOLUTION = 4.0


@router.get("", response_model=list[RelationOut])
def lister(user: CurrentUser, db: Db):
    rows = db.execute(select(Relation).where(
        or_(Relation.user_a_id == user.id, Relation.user_b_id == user.id))).scalars().all()
    out = []
    for r in rows:
        autre = r.user_b_id if r.user_a_id == user.id else r.user_a_id
        out.append(RelationOut(id=r.id, autre_id=autre, prenom=prenom_de(db, autre), mode=r.mode,
                               niveau=r.niveau, dm_ouvert=r.dm_ouvert, cercle_origine_id=r.cercle_origine_id))
    return out


@router.post("/evaluer", response_model=NiveauOut)
def evaluer(data: EvaluationIn, user: CurrentUser, db: Db):
    rel = db.get(Relation, data.relation_id)
    if rel is None or user.id not in (rel.user_a_id, rel.user_b_id):
        raise err(404, "RELATION_INTROUVABLE", "Lien introuvable.")
    a_evolue = False
    if data.moyenne >= SEUIL_EVOLUTION:
        a_evolue = appliquer_niveau(rel, rel.niveau + 1)
        db.commit()
    return NiveauOut(relation_id=rel.id, niveau=rel.niveau, dm_ouvert=rel.dm_ouvert, a_evolue=a_evolue)
