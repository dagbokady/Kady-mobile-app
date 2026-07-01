# app/models/config.py — configuration applicative clé/valeur (mode waitlist, etc.).
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class AppConfig(Base):
    __tablename__ = "app_config"
    cle: Mapped[str] = mapped_column(String(60), primary_key=True)
    valeur: Mapped[str] = mapped_column(String(20), default="false")
