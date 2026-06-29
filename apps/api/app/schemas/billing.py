# app/schemas/billing.py
from pydantic import BaseModel, EmailStr


class WaitlistIn(BaseModel):
    prenom: str
    email: EmailStr
    genre: str | None = None
    ville: str | None = None
    centres_interet: list[str] = []
    fonctionnalite_preferee: str | None = None
    parraine_par: str | None = None


class WaitlistOut(BaseModel):
    code_parrainage: str
    rang: int | None
    nb_parrainages: int


class SignalementIn(BaseModel):
    signale_id: str
    contexte: str  # cercle | dm
    cercle_id: str | None = None
    conversation_id: str | None = None
    motif: str | None = None


class PremiumInitOut(BaseModel):
    payment_url: str
    transaction_id: str


class AbonnementOut(BaseModel):
    plan: str
    statut: str
    actif: bool
