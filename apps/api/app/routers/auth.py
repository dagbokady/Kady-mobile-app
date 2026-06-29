# app/routers/auth.py — inscription (18+ bloquant), connexion (anti-brute), refresh, me.
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import APIRouter
from sqlalchemy import select

from app.core.config import settings
from app.core.deps import CurrentUser, Db
from app.core.errors import err
from app.core.security import calc_age, decode_token, hash_password, make_access, make_refresh, verify_password
from app.models.user import Profil, User
from app.schemas.auth import LoginIn, MeOut, RefreshIn, RegisterIn, TokenOut
from app.services.regles import premium_actif

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenOut, status_code=201)
def register(data: RegisterIn, db: Db):
    if calc_age(data.date_naissance) < 18:
        raise err(422, "MINEUR_INTERDIT", "KADY est réservé aux personnes majeures (18 ans et plus).")
    if db.execute(select(User.id).where(User.email == data.email.lower())).first():
        raise err(409, "EMAIL_DEJA_UTILISE", "Un compte existe déjà avec cet email.")

    user = User(email=data.email.lower(), password_hash=hash_password(data.password),
                date_naissance=data.date_naissance, dernier_acces=datetime.now(timezone.utc))
    db.add(user)
    db.flush()
    db.add(Profil(user_id=user.id, prenom=data.prenom, genre=data.genre,
                  ville=data.ville, centres_interet=data.centres_interet))
    db.commit()
    return TokenOut(access_token=make_access(user.id), refresh_token=make_refresh(user.id))


@router.post("/login", response_model=TokenOut)
def login(data: LoginIn, db: Db):
    user = db.execute(select(User).where(User.email == data.email.lower())).scalars().first()
    now = datetime.now(timezone.utc)
    if user is None:
        raise err(401, "IDENTIFIANTS_INVALIDES", "Email ou mot de passe incorrect.")
    if user.locked_until and user.locked_until > now:
        raise err(403, "COMPTE_VERROUILLE", "Trop de tentatives. Réessaie dans quelques minutes.")

    if not verify_password(data.password, user.password_hash):
        user.login_attempts += 1
        if user.login_attempts >= settings.MAX_LOGIN_ATTEMPTS:
            user.locked_until = now + timedelta(minutes=settings.LOCKOUT_MINUTES)
            user.login_attempts = 0
        db.commit()
        raise err(401, "IDENTIFIANTS_INVALIDES", "Email ou mot de passe incorrect.")

    user.login_attempts = 0
    user.locked_until = None
    user.dernier_acces = now
    db.commit()
    return TokenOut(access_token=make_access(user.id), refresh_token=make_refresh(user.id))


@router.post("/refresh", response_model=TokenOut)
def refresh(data: RefreshIn, db: Db):
    try:
        payload = decode_token(data.refresh_token)
        if payload.get("type") != "refresh":
            raise err(401, "TOKEN_INVALIDE", "Token de rafraîchissement invalide.")
        user_id = payload["sub"]
    except jwt.ExpiredSignatureError:
        raise err(401, "TOKEN_EXPIRE", "Reconnecte-toi.")
    except (jwt.PyJWTError, KeyError):
        raise err(401, "TOKEN_INVALIDE", "Token invalide.")
    user = db.get(User, user_id)
    if user is None or user.is_deleted or not user.is_active:
        raise err(401, "UTILISATEUR_INTROUVABLE", "Compte introuvable.")
    return TokenOut(access_token=make_access(user.id), refresh_token=make_refresh(user.id))


@router.get("/me", response_model=MeOut)
def me(user: CurrentUser, db: Db):
    p = db.execute(select(Profil).where(Profil.user_id == user.id)).scalars().first()
    return MeOut(
        id=user.id, email=user.email, is_verified=user.is_verified,
        verification_level=user.verification_level, en_pause=user.en_pause,
        prenom=p.prenom if p else None, ville=p.ville if p else None, bio=p.bio if p else None,
        genre=p.genre if p else None, centres_interet=p.centres_interet if p else [],
        premium=premium_actif(db, user.id),
    )
