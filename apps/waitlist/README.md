# KADY — Waitlist (React + Vite)

Page de liste d'attente (PRD §22), branchée sur le **même backend** que l'app mobile
(`POST /waitlist`). Collecte prénom, email, genre, ville, centres d'intérêt,
fonctionnalité préférée et code de parrainage ; affiche le rang, le code de
parrainage et la vague d'accès estimée.

## Lancer

```bash
cd apps/waitlist
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:8000
npm run dev            # http://localhost:5173
```

> L'origine `http://localhost:5173` est déjà dans `CORS_ORIGINS` du backend.
> Assure-toi que l'API tourne (`apps/api` → `uvicorn app.main:app --port 8000`).

## Parrainage

Le lien de partage est `https://<domaine>/?ref=KADY-XXXXX`. À l'ouverture, le code
`?ref` est lu et envoyé comme `parraine_par` : chaque inscription via ce lien fait
remonter le parrain dans la file (rang recalculé côté serveur).

## Build production

```bash
npm run build   # génère dist/
npm run preview
```
