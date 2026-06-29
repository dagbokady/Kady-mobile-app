# app/models/cercle.py — cercles, adhésions, messages de cercle.
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Index, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.base import PkMixin, TimestampMixin

STATUT_CERCLE = Enum("actif", "expire", "archive", name="statut_cercle")
ROLE = Enum("membre", "fondateur", name="role_membre")
GRADE = Enum("graine", "flamme", "etoile", "diamant", "legendaire", name="grade")


class Cercle(Base, PkMixin, TimestampMixin):
    __tablename__ = "cercles"

    nom: Mapped[str] = mapped_column(String(120), nullable=False)
    theme: Mapped[str | None] = mapped_column(String(80), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    regles: Mapped[str | None] = mapped_column(Text, nullable=True)
    niveau: Mapped[int] = mapped_column(Integer, default=1)
    xp: Mapped[int] = mapped_column(Integer, default=0)
    capacite_max: Mapped[int] = mapped_column(Integer, default=10)
    statut: Mapped[str] = mapped_column(STATUT_CERCLE, default="actif")
    expire_le: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_by: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True)


class CercleMembre(Base, PkMixin):
    __tablename__ = "cercle_membres"
    __table_args__ = (UniqueConstraint("cercle_id", "user_id", name="uq_cercle_membre"),)

    cercle_id: Mapped[str] = mapped_column(ForeignKey("cercles.id"), nullable=False, index=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    role: Mapped[str] = mapped_column(ROLE, default="membre")
    xp_dans_cercle: Mapped[int] = mapped_column(Integer, default=0)
    grade: Mapped[str] = mapped_column(GRADE, default="graine")
    rejoint_le: Mapped[datetime] = mapped_column(DateTime(timezone=True))


class CercleMessage(Base, PkMixin, TimestampMixin):
    __tablename__ = "cercle_messages"
    __table_args__ = (Index("ix_cercle_msg_curseur", "cercle_id", "created_at"),)

    cercle_id: Mapped[str] = mapped_column(ForeignKey("cercles.id"), nullable=False)
    auteur_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    contenu: Mapped[str] = mapped_column(Text, nullable=False)
    est_filtre: Mapped[bool] = mapped_column(Boolean, default=False)
