# app/schemas/cercle.py
from datetime import datetime

from pydantic import BaseModel, Field


class CercleCreate(BaseModel):
    nom: str = Field(min_length=1, max_length=120)
    theme: str | None = None
    description: str | None = None
    regles: str | None = None
    capacite_max: int = Field(default=10, ge=6, le=10)


class CercleOut(BaseModel):
    id: str
    nom: str
    theme: str | None
    description: str | None
    niveau: int
    statut: str
    capacite_max: int
    membres: int
    expire_le: datetime | None
    rejoint: bool = False
    model_config = {"from_attributes": True}


class MembreOut(BaseModel):
    user_id: str
    prenom: str | None
    role: str
    grade: str
    en_ligne: bool = False


class CercleMessageIn(BaseModel):
    contenu: str = Field(min_length=1, max_length=2000)


class CercleMessageOut(BaseModel):
    id: str
    auteur_id: str
    contenu: str
    est_filtre: bool
    created_at: datetime
    model_config = {"from_attributes": True}
