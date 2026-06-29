# app/models/securite.py — blocage, masquage, signalement, carnet, notifications.
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.base import PkMixin, TimestampMixin

CONTEXTE = Enum("cercle", "dm", name="contexte_signalement")
STATUT_SIGN = Enum("ouvert", "traite", "rejete", name="statut_signalement")
TYPE_NOTE = Enum("note", "souvenir", "rappel", name="type_note")


class Blocage(Base, PkMixin, TimestampMixin):
    __tablename__ = "blocages"
    __table_args__ = (UniqueConstraint("bloqueur_id", "bloque_id", name="uq_blocage"),)
    bloqueur_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    bloque_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)


class Masquage(Base, PkMixin, TimestampMixin):
    __tablename__ = "masquages"
    __table_args__ = (UniqueConstraint("user_id", "masque_id", name="uq_masquage"),)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    masque_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)


class Signalement(Base, PkMixin, TimestampMixin):
    __tablename__ = "signalements"
    signaleur_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    signale_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    contexte: Mapped[str] = mapped_column(CONTEXTE, nullable=False)
    cercle_id: Mapped[str | None] = mapped_column(ForeignKey("cercles.id"), nullable=True)
    conversation_id: Mapped[str | None] = mapped_column(ForeignKey("conversations.id"), nullable=True)
    motif: Mapped[str | None] = mapped_column(Text, nullable=True)
    statut: Mapped[str] = mapped_column(STATUT_SIGN, default="ouvert")


class CarnetEntree(Base, PkMixin, TimestampMixin):
    __tablename__ = "carnet_entrees"
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    cible_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    contenu: Mapped[str] = mapped_column(Text, nullable=False)
    type: Mapped[str] = mapped_column(TYPE_NOTE, default="note")


class Notification(Base, PkMixin, TimestampMixin):
    __tablename__ = "notifications"
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    titre: Mapped[str] = mapped_column(String(160), nullable=False)
    corps: Mapped[str | None] = mapped_column(Text, nullable=True)
    type: Mapped[str] = mapped_column(String(40), default="info")
    lu: Mapped[bool] = mapped_column(Boolean, default=False)
