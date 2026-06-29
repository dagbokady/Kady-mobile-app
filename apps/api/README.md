# KADY API — Backend (FastAPI + PostgreSQL)

API de la plateforme de rencontres KADY. Stack : **FastAPI · SQLAlchemy 2.0 ·
PostgreSQL · JWT (argon2) · WebSockets natifs**.

> Invariant central : aucun DM possible entre deux utilisateurs sans Cercle partagé
> et un lien dont le niveau a ouvert le DM. Vérifié côté serveur, jamais délégué au front.

---

## 1. Prérequis

- **Python 3.12+** (testé en 3.14)
- **PostgreSQL 14+** — ici via **Postgres.app** (`/Applications/Postgres.app`)

Ajoute les binaires Postgres au PATH (sinon utilise le chemin complet) :

```bash
export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"
```

## 2. Base de données locale

Crée le rôle et la base (idempotent) :

```bash
psql -d postgres -c "CREATE ROLE kady LOGIN PASSWORD 'kady';"
psql -d postgres -c "CREATE DATABASE kady OWNER kady;"
```

## 3. Environnement Python

```bash
cd apps/api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## 4. Configuration

```bash
cp .env.example .env
```

Le `.env` par défaut pointe déjà sur `postgresql+psycopg://kady:kady@localhost:5432/kady`.
Pour la prod, renseigne `JWT_SECRET`, les clés **Cloudinary** (médias) et **CinetPay**
(paiement). En local, ces clés peuvent rester vides : les médias renvoient un
placeholder et le paiement utilise une URL stub (le webhook reste la source de vérité).

## 5. Créer le schéma + seed

```bash
python -m scripts.init_db
```

> Crée les 18 tables et le catalogue de badges. Pour la prod, bascule sur Alembic
> (`alembic.ini` à ajouter) ; en local `init_db` suffit.

## 6. Lancer l'API

```bash
uvicorn app.main:app --reload --port 8000
```

- Santé : http://localhost:8000/health
- Docs interactives (Swagger) : http://localhost:8000/docs

## 7. Connecter le front mobile

Dans l'app Expo, pointe le client API sur `http://<ip-locale>:8000`. Ajoute cette
origine à `CORS_ORIGINS` dans `.env` si besoin. Les WebSockets sont sur
`ws://<host>:8000/cercles/{id}/ws?token=<access>` et `…/dm/{id}/ws?token=<access>`.

---

## Cartographie des routes

| Domaine | Préfixe | Points clés |
|---|---|---|
| Auth | `/auth` | `register` (18+ bloquant), `login` (anti-force-brute), `refresh`, `me` |
| Profils | `/profils` | profil, photos (URLs signées) |
| Cercles | `/cercles` | découvrir, salle d'accueil, `join` (crée les relations), chat + WS |
| Relations | `/relations` | liste, `evaluer` (passage de niveau ≥ 4/5) |
| DM | `/dm` | `ouvrir/{relation}` (invariant), messages + WS |
| Sécurité | `/securite` | bloquer, masquer, signaler, pause |
| Carnet | `/carnet` | notes privées |
| Notifications | `/notifications` | liste, tout marquer lu |
| Premium | `/premium` | `init` CinetPay, `webhook` (idempotent), `statut` |
| Waitlist | `/waitlist` | inscription + parrainage (recalcul du rang) |

## Sécurité appliquée

- Vérification d'âge serveur (refus < 18 ans).
- Mots de passe **argon2**, jamais en clair ni loggés ; verrouillage après N échecs.
- **Filtrage** des numéros (formats ivoiriens), emails et liens dans tous les messages.
- **URLs Cloudinary signées** à expiration courte pour les médias privés.
- Invariant DM vérifié côté serveur ; blocage = disparition mutuelle.
- Webhook CinetPay **idempotent**, validé via l'API CinetPay avant activation.
