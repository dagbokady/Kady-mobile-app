# KADY Admin — back-office

Back-office de modération et de pilotage de KADY (React + Vite + TypeScript), fidèle à la
maquette Claude Design `KADY Admin.dc.html`.

## Sections

- **Tableau de bord** — KPIs (utilisateurs, cercles actifs, abonnés Premium, actifs / 7 j)
  avec variations semaine/semaine, graphe des inscriptions sur 14 jours, files « À traiter ».
- **Utilisateurs** — recherche (header), filtres (Tous / Actifs / Premium / Suspendus),
  fiche détaillée en drawer (stats, infos, intérêts), suspendre / réactiver / bannir.
- **Vérifications** — file des selfies en attente : approuver (badge « Vérifié » +
  notification) ou rejeter (notification de reprise).
- **Cercles** — cartes par thème, statut (Actif / Signalé / Archivé), suspendre / réactiver,
  mise en avant (étoile) qui remonte le cercle dans Découvrir côté app.
- **Signalements** — ignorer / avertir (notification) / suspendre (compte désactivé + notification).
- **Premium & revenus** — MRR réel (abonnés actifs × `PREMIUM_AMOUNT_XOF`), nouveaux abonnés
  sur 30 j, taux de conversion, répartition par formule.
- **Réglages** — inscriptions ouvertes (waitlist), vérification auto (IA), promo Premium,
  mode maintenance — persistés dans `app_config`.

## Lancer en dev

```bash
npm install
npm run dev -- --port 5174
```

L'API doit tourner (par défaut `http://localhost:8000`, configurable via `VITE_API_URL`).

## Authentification

Connexion par jeton d'administration : la valeur de `ADMIN_TOKEN` côté API
(`apps/api/app/core/config.py`, défaut dev `kady-admin`), envoyée en header `X-Admin-Token`.
**En production, définir un `ADMIN_TOKEN` fort.**

## Build

```bash
npm run build   # tsc -b && vite build → dist/
```
