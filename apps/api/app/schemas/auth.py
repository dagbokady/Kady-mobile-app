# app/schemas/auth.py
from datetime import date

from pydantic import BaseModel, EmailStr, Field


class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    prenom: str = Field(min_length=1, max_length=80)
    date_naissance: date
    genre: str | None = None
    ville: str | None = None
    centres_interet: list[str] = []


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
    is_verified: bool
    verification_level: str
    en_pause: bool
    prenom: str | None = None
    ville: str | None = None
    bio: str | None = None
    genre: str | None = None
    centres_interet: list[str] = []
    premium: bool = False
