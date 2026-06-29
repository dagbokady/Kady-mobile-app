# app/models/relation.py — relations (invariant central), conversations, DM.
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Index, Integer, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.base import PkMixin, TimestampMixin

MODE = Enum("rencontre", "amitie", name="mode_relation")


class Relation(Base, PkMixin, TimestampMixin):
    """Matérialise l'invariant : une relation existe car un cercle_origine existe."""

    __tablename__ = "relations"
    __table_args__ = (UniqueConstraint("user_a_id", "user_b_id", "mode", name="uq_relation"),)

    user_a_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)  # a < b
    user_b_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    mode: Mapped[str] = mapped_column(MODE, default="rencontre")
    niveau: Mapped[int] = mapped_column(Integer, default=1)
    cercle_origine_id: Mapped[str] = mapped_column(ForeignKey("cercles.id"), nullable=False)
    dm_ouvert: Mapped[bool] = mapped_column(Boolean, default=False)


class Conversation(Base, PkMixin, TimestampMixin):
    __tablename__ = "conversations"
    __table_args__ = (UniqueConstraint("user_a_id", "user_b_id", name="uq_conversation"),)

    user_a_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)  # a < b
    user_b_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    relation_id: Mapped[str] = mapped_column(ForeignKey("relations.id"), nullable=False)


class DmMessage(Base, PkMixin, TimestampMixin):
    __tablename__ = "dm_messages"
    __table_args__ = (Index("ix_dm_curseur", "conversation_id", "created_at"),)

    conversation_id: Mapped[str] = mapped_column(ForeignKey("conversations.id"), nullable=False)
    auteur_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    contenu: Mapped[str] = mapped_column(Text, nullable=False)
    est_filtre: Mapped[bool] = mapped_column(Boolean, default=False)
    lu: Mapped[bool] = mapped_column(Boolean, default=False)
