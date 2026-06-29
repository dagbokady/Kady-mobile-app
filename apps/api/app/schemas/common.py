# app/schemas/common.py — schémas partagés.
from datetime import datetime

from pydantic import BaseModel


class Ok(BaseModel):
    ok: bool = True


class ProfilUpdate(BaseModel):
    prenom: str | None = None
    ville: str | None = None
    bio: str | None = None
    genre: str | None = None
    centres_interet: list[str] | None = None


class PhotoOut(BaseModel):
    id: str
    is_principale: bool
    ordre: int
    url: str | None = None


class CarnetIn(BaseModel):
    contenu: str
    type: str = "note"
    cible_id: str | None = None


class CarnetOut(BaseModel):
    id: str
    contenu: str
    type: str
    cible_id: str | None
    created_at: datetime
    model_config = {"from_attributes": True}


class NotificationOut(BaseModel):
    id: str
    titre: str
    corps: str | None
    type: str
    lu: bool
    created_at: datetime
    model_config = {"from_attributes": True}
