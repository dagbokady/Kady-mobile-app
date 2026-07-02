# KADY

Plateforme de rencontres sérieuses pour la Côte d'Ivoire. Les connexions naissent dans des **Cercles** thématiques (6–10 personnes) avant tout message privé.

## Structure

| Dossier | Rôle | Stack |
|---|---|---|
| `apps/api` | Backend | FastAPI + SQLAlchemy 2.0 + PostgreSQL, WebSockets natifs |
| `apps/web` | Application web (PWA-first) | React + Vite + TypeScript, zustand |
| `apps/backoffice` | Administration | React + Vite + TypeScript |
| `apps/mobile` | Application mobile (natif, plus tard) | Expo / React Native |

## Développement local

```bash
# API (port 8000) — nécessite Postgres local (cf. apps/api/.env)
cd apps/api && source .venv/bin/activate && uvicorn app.main:app --reload --port 8000

# Web (port 5173)
cd apps/web && npm install && npm run dev

# Backoffice (port 5174)
cd apps/backoffice && npm install && npm run dev -- --port 5174
```

Le backoffice se déverrouille avec la valeur de `ADMIN_TOKEN` (défaut dev : `kady-admin`).

## Mise en production

### Backend (Railway ou équivalent)
1. Provisionner PostgreSQL et renseigner `DATABASE_URL`.
2. Variables critiques dans l'environnement (jamais commitées) :
   - `JWT_SECRET` : 32+ caractères aléatoires.
   - `ADMIN_TOKEN` : jeton long et aléatoire (protège tout le back-office).
   - `CORS_ORIGINS` : ajouter les URL prod du web **et** du backoffice (séparées par des virgules).
   - `APP_RETURN_URL` : `https://<domaine-web>/premium/retour` (retour paiement CinetPay).
   - `APP_NOTIFY_URL` : `https://<domaine-api>/premium/webhook`.
   - `CLOUDINARY_*` et `CINETPAY_*` : clés réelles.
3. Lancer les migrations Alembic puis `uvicorn app.main:app`.

### Frontends (Vercel, Railway static, ou équivalent)
1. `npm run build` dans `apps/web` et `apps/backoffice` (sortie dans `dist/`).
2. Variable de build : `VITE_API_URL=https://<domaine-api>` (cf. `.env.example`).
3. Configurer le fallback SPA : toutes les routes doivent servir `index.html`
   (Vercel le fait automatiquement pour Vite ; sinon règle de rewrite `/* → /index.html`).
4. Héberger le backoffice sur un domaine séparé, non référencé.

### Invariant produit (ne jamais casser)
> Aucun message privé ne peut exister entre deux utilisateurs s'ils ne partagent pas au moins un Cercle actif — vérifié côté serveur (`dm_ouvert` sur la relation).
