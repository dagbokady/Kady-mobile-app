# app/models/decouverte.py — jeu de découverte de profil (persistant).
# ProfilFait : faits devinables d'un utilisateur. Decouverte : ce qu'un user a deviné.
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.base import PkMixin, TimestampMixin


class ProfilFait(Base, PkMixin):
    __tablename__ = "profil_faits"
    __table_args__ = (UniqueConstraint("user_id", "champ", name="uq_profil_fait"),)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    champ: Mapped[str] = mapped_column(String(30), nullable=False)
    valeur: Mapped[str] = mapped_column(String(120), nullable=False)


class Decouverte(Base, PkMixin, TimestampMixin):
    __tablename__ = "decouvertes"
    __table_args__ = (UniqueConstraint("decouvreur_id", "cible_id", "champ", name="uq_decouverte"),)
    decouvreur_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    cible_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    champ: Mapped[str] = mapped_column(String(30), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
