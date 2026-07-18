# scripts/init_db.py — crée les tables et seed le catalogue (badges + villes).
# Usage : python -m scripts.init_db
# La logique vit dans app.core.bootstrap (partagée avec le démarrage de l'app).
from app.core.bootstrap import bootstrap


def main() -> None:
    bootstrap()


if __name__ == "__main__":
    main()
