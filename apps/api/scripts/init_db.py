# scripts/init_db.py — crée les tables et seed le catalogue de badges.
# Usage : python -m scripts.init_db
from datetime import datetime, timezone

from app.core.database import SessionLocal, init_db
from app.models.user import Badge
from app.models.ville import Ville

BADGES = [
    ("pionnier", "Pionnier"),
    ("verifie", "Vérifié"),
    ("verifie_plus", "Vérifié +"),
    ("membre_respectueux", "Membre respectueux"),
]

# Principales villes de Côte d'Ivoire (les plus peuplées d'abord).
VILLES = [
    "Abidjan", "Yamoussoukro", "Bouaké", "Daloa", "Korhogo", "San-Pédro", "Gagnoa",
    "Man", "Divo", "Abengourou", "Anyama", "Agboville", "Grand-Bassam", "Dabou",
    "Bingerville", "Soubré", "Séguéla", "Odienné", "Bondoukou", "Ferkessédougou",
    "Adzopé", "Toumodi", "Sinfra", "Katiola", "Bouna", "Issia", "Duékoué", "Tiassalé",
    "Aboisso", "Boundiali", "Dimbokro", "Guiglo", "Bouaflé", "Oumé", "Sassandra",
    "Tabou", "Touba", "Danané", "Akoupé", "Bangolo",
]


def main() -> None:
    init_db()
    db = SessionLocal()
    try:
        for code, libelle in BADGES:
            if db.get(Badge, code) is None:
                db.add(Badge(code=code, libelle=libelle))
        for i, nom in enumerate(VILLES):
            if db.get(Ville, nom) is None:
                db.add(Ville(nom=nom, ordre=i))
        db.commit()
        print(f"✅ Tables, badges et {len(VILLES)} villes initialisés.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
