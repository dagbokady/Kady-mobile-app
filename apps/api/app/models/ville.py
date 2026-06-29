# app/models/ville.py — référentiel des villes (Côte d'Ivoire).
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Ville(Base):
    __tablename__ = "villes"
    nom: Mapped[str] = mapped_column(String(120), primary_key=True)
    ordre: Mapped[int] = mapped_column(Integer, default=100)  # plus petit = plus haut
