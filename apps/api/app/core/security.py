# app/core/security.py — hachage argon2 + JWT (access / refresh).
from datetime import date, datetime, timedelta, timezone

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

from app.core.config import settings

_ph = PasswordHasher()


def hash_password(plain: str) -> str:
    return _ph.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return _ph.verify(hashed, plain)
    except VerifyMismatchError:
        return False
    except Exception:
        return False


def calc_age(naissance: date, ref: date | None = None) -> int:
    ref = ref or date.today()
    return ref.year - naissance.year - ((ref.month, ref.day) < (naissance.month, naissance.day))


def _make_token(sub: str, kind: str, delta: timedelta) -> str:
    now = datetime.now(timezone.utc)
    payload = {"sub": sub, "type": kind, "iat": now, "exp": now + delta}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def make_access(user_id: str) -> str:
    return _make_token(user_id, "access", timedelta(minutes=settings.ACCESS_TOKEN_MINUTES))


def make_refresh(user_id: str) -> str:
    return _make_token(user_id, "refresh", timedelta(days=settings.REFRESH_TOKEN_DAYS))


def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
