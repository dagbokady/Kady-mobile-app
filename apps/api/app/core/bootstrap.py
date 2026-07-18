# app/core/bootstrap.py — création du schéma + seed des données de référence.
# Appelé au démarrage de l'app (lifespan dans main.py) ET par `python -m scripts.init_db`.
# Idempotent : peut tourner à chaque boot sans risque.
from sqlalchemy import text

from app.core.database import SessionLocal, init_db

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


def bootstrap() -> None:
    """Crée les tables (create_all), applique les migrations additives idempotentes,
    puis seed badges + villes. Sûr à rappeler à chaque démarrage."""
    from app.models.user import Badge
    from app.models.ville import Ville

    init_db()  # Base.metadata.create_all — crée les tables manquantes.

    db = SessionLocal()
    try:
        # Migrations additives idempotentes (create_all ne modifie pas une table existante).
        db.execute(text("ALTER TABLE cercles ADD COLUMN IF NOT EXISTS mis_en_avant BOOLEAN NOT NULL DEFAULT FALSE"))
        db.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS telephone VARCHAR(30)"))
        db.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS banni BOOLEAN NOT NULL DEFAULT FALSE"))
        db.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ix_users_telephone ON users (telephone)"))
        db.commit()

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


__all__ = ["bootstrap", "BADGES", "VILLES"]
