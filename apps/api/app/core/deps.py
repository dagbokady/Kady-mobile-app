# app/core/deps.py — dépendances d'authentification.
from typing import Annotated

import jwt
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.errors import err
from app.core.security import decode_token
from app.models.user import User

_bearer = HTTPBearer(auto_error=False)


def get_current_user(
    creds: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    if creds is None:
        raise err(401, "NON_AUTHENTIFIE", "Authentification requise.")
    try:
        payload = decode_token(creds.credentials)
        if payload.get("type") != "access":
            raise err(401, "TOKEN_INVALIDE", "Token d'accès invalide.")
        user_id = payload["sub"]
    except jwt.ExpiredSignatureError:
        raise err(401, "TOKEN_EXPIRE", "Session expirée, reconnecte-toi.")
    except (jwt.PyJWTError, KeyError):
        raise err(401, "TOKEN_INVALIDE", "Token invalide.")

    user = db.get(User, user_id)
    if user is None or user.is_deleted:
        raise err(401, "UTILISATEUR_INTROUVABLE", "Compte introuvable.")
    return user


def get_current_active_user(
    user: Annotated[User, Depends(get_current_user)],
) -> User:
    if not user.is_active:
        raise err(403, "COMPTE_INACTIF", "Ce compte est désactivé.")
    return user


CurrentUser = Annotated[User, Depends(get_current_active_user)]
Db = Annotated[Session, Depends(get_db)]
