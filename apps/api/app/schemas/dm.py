# app/schemas/dm.py
from datetime import datetime

from pydantic import BaseModel, Field


class RelationOut(BaseModel):
    id: str
    autre_id: str
    prenom: str | None
    mode: str
    niveau: int
    dm_ouvert: bool
    cercle_origine_id: str


class ConversationOut(BaseModel):
    id: str
    autre_id: str
    prenom: str | None
    niveau: int
    relation_id: str


class DmIn(BaseModel):
    contenu: str = Field(min_length=1, max_length=2000)


class DmOut(BaseModel):
    id: str
    auteur_id: str
    contenu: str
    est_filtre: bool
    lu: bool
    created_at: datetime
    model_config = {"from_attributes": True}


class EvaluationIn(BaseModel):
    """Évaluation (Quiz) : moyenne /5. ≥ 4 autorise le passage de niveau."""

    relation_id: str
    moyenne: float = Field(ge=0, le=5)
    commentaire: str | None = None


class NiveauOut(BaseModel):
    relation_id: str
    niveau: int
    dm_ouvert: bool
    a_evolue: bool
