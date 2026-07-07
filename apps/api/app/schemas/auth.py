# app/schemas/auth.py
import re
from datetime import date

from pydantic import BaseModel, EmailStr, Field, field_validator


class RegisterIn(BaseModel):
    email: EmailStr
    telephone: str = Field(min_length=8, max_length=20)
    password: str = Field(min_length=8, max_length=128)
    prenom: str = Field(min_length=1, max_length=80)
    date_naissance: date
    genre: str | None = None
    ville: str | None = None
    centres_interet: list[str] = []

    @field_validator("telephone")
    @classmethod
    def normaliser_telephone(cls, v: str) -> str:
        # Retire espaces/tirets/points/parenthèses ; garde le + initial et les chiffres.
        v = re.sub(r"[\s\-.()]", "", v)
        if not re.fullmatch(r"\+?\d{8,15}", v):
            raise ValueError("Numéro de téléphone invalide (8 à 15 chiffres).")
        return v


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class RefreshIn(BaseModel):
    refresh_token: str


class TokenOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class MeOut(BaseModel):
    id: str
    email: str
    telephone: str | None = None
    is_verified: bool
    verification_level: str
    en_pause: bool
    prenom: str | None = None
    ville: str | None = None
    bio: str | None = None
    genre: str | None = None
    centres_interet: list[str] = []
    premium: bool = False
