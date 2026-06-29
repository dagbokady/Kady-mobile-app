# app/models/billing.py — waitlist & abonnements (CinetPay).
from datetime import datetime

from sqlalchemy import ARRAY, DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.base import PkMixin, TimestampMixin

PLAN = Enum("gratuit", "premium", name="plan")
STATUT_ABO = Enum("actif", "expire", "annule", name="statut_abonnement")


class Waitlist(Base, PkMixin, TimestampMixin):
    __tablename__ = "waitlist"
    prenom: Mapped[str] = mapped_column(String(80), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    genre: Mapped[str | None] = mapped_column(String(20), nullable=True)
    ville: Mapped[str | None] = mapped_column(String(120), nullable=True)
    centres_interet: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    fonctionnalite_preferee: Mapped[str | None] = mapped_column(String(120), nullable=True)
    code_parrainage: Mapped[str] = mapped_column(String(20), unique=True, nullable=False, index=True)
    parraine_par: Mapped[str | None] = mapped_column(String(20), nullable=True)
    nb_parrainages: Mapped[int] = mapped_column(Integer, default=0)
    rang: Mapped[int | None] = mapped_column(Integer, nullable=True)


class Abonnement(Base, PkMixin, TimestampMixin):
    __tablename__ = "abonnements"
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    plan: Mapped[str] = mapped_column(PLAN, default="gratuit")
    statut: Mapped[str] = mapped_column(STATUT_ABO, default="actif")
    debut: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    fin: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    cinetpay_transaction_id: Mapped[str | None] = mapped_column(String(120), unique=True, nullable=True)
