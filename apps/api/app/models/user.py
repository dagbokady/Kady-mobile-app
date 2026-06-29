# app/models/user.py — utilisateur, profil, photos, badges.
from datetime import date, datetime

from sqlalchemy import ARRAY, Boolean, Date, DateTime, Enum, ForeignKey, Integer, Numeric, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.base import PkMixin, SoftDeleteMixin, TimestampMixin

VERIF = Enum("none", "selfie", "id_document", name="verification_level")
GENRE = Enum("femme", "homme", name="genre")


class User(Base, PkMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    date_naissance: Mapped[date] = mapped_column(Date, nullable=False)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    verification_level: Mapped[str] = mapped_column(VERIF, default="none")
    en_pause: Mapped[bool] = mapped_column(Boolean, default=False)
    dernier_acces: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Anti-force-brute (mappés en base, pas seulement au constructeur).
    login_attempts: Mapped[int] = mapped_column(Integer, default=0)
    locked_until: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class Profil(Base, PkMixin, TimestampMixin):
    __tablename__ = "profils"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), unique=True, nullable=False)
    prenom: Mapped[str] = mapped_column(String(80), nullable=False)
    genre: Mapped[str | None] = mapped_column(GENRE, nullable=True)
    ville: Mapped[str | None] = mapped_column(String(120), nullable=True)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    centres_interet: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    score_comportemental: Mapped[float] = mapped_column(Numeric(6, 2), default=0)


class Photo(Base, PkMixin, TimestampMixin):
    __tablename__ = "photos"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    cloudinary_public_id: Mapped[str] = mapped_column(String(255), nullable=False)
    is_principale: Mapped[bool] = mapped_column(Boolean, default=False)
    ordre: Mapped[int] = mapped_column(Integer, default=0)


class Badge(Base):
    __tablename__ = "badges"
    code: Mapped[str] = mapped_column(String(40), primary_key=True)
    libelle: Mapped[str] = mapped_column(String(120), nullable=False)


class UserBadge(Base, PkMixin):
    __tablename__ = "user_badges"
    __table_args__ = (UniqueConstraint("user_id", "badge_code", name="uq_user_badge"),)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    badge_code: Mapped[str] = mapped_column(ForeignKey("badges.code"), nullable=False)
    obtenu_le: Mapped[datetime] = mapped_column(DateTime(timezone=True))
