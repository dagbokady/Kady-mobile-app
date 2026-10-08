# KADY — Cahier des charges

> Plateforme de rencontres sérieuses pour la Côte d'Ivoire, où les connexions
> naissent dans des **Cercles** thématiques avant tout message privé.

| | |
|---|---|
| **Projet** | KADY |
| **Marché** | Côte d'Ivoire (Abidjan en priorité) |
| **Version du document** | 1.0 |
| **Statut** | MVP V1 en cours de réalisation |

---

## Sommaire

1. [Contexte et objectifs](#1-contexte-et-objectifs)
2. [Cibles et personas](#2-cibles-et-personas)
3. [Principe central du produit](#3-principe-central-du-produit)
4. [Périmètre fonctionnel](#4-périmètre-fonctionnel)
5. [Back-office d'administration](#5-back-office-dadministration)
6. [Modèle économique](#6-modèle-économique)
7. [Exigences de sécurité et de sûreté](#7-exigences-de-sécurité-et-de-sûreté)
8. [Architecture technique](#8-architecture-technique)
9. [Modèle de données](#9-modèle-de-données)
10. [API](#10-api)
11. [Exigences non fonctionnelles](#11-exigences-non-fonctionnelles)
12. [Conformité et protection des données](#12-conformité-et-protection-des-données)
13. [Lancement et déploiement](#13-lancement-et-déploiement)
14. [Planning et lotissement](#14-planning-et-lotissement)
15. [Glossaire](#15-glossaire)

---

## 1. Contexte et objectifs

### 1.1 Contexte

Les applications de rencontre classiques reposent sur le « swipe » : on juge un
profil sur une photo, on écrit en privé à des inconnus, et la confiance n'existe
pas. Il en résulte des faux profils, du harcèlement, des arnaques et une
expérience décevante — en particulier pour les femmes.

KADY propose l'inverse : on se rencontre d'abord **en petit groupe autour d'une
passion commune**, la confiance grandit par **niveaux**, et la conversation privée
n'arrive que lorsqu'elle est méritée.

### 1.2 Objectifs

- Offrir un espace de rencontre **sérieux et sûr**, adapté aux usages ivoiriens.
- Rendre le harcèlement et l'arnaque structurellement difficiles (pas de DM à froid).
- Favoriser des liens authentiques (amoureux **ou** amicaux) fondés sur des
  interactions réelles.
- Monétiser via un abonnement Premium payable en **mobile money**.

### 1.3 Indicateurs de succès (MVP)

- Taux de conversion waitlist → compte actif.
- Nombre de Cercles actifs et taux de remplissage moyen.
- Nombre de relations atteignant le niveau d'ouverture du DM.
- Taux de signalement pour 1 000 messages (doit rester bas).
- Taux de conversion gratuit → Premium.

---

## 2. Cibles et personas

- **Public** : adultes (**18 ans et plus, strictement**) résidant en Côte d'Ivoire,
  à la recherche d'une relation sérieuse ou de nouvelles amitiés.
- **Usage** : majoritairement mobile, réseau parfois instable, paiement par mobile
  money (Orange Money, Wave, MTN MoMo, Moov).
- **Attentes clés** : sécurité, authenticité des profils, discrétion, simplicité.

---

## 3. Principe central du produit

> **Invariant non négociable** : aucun message privé (DM) ne peut exister entre deux
> utilisateurs s'ils ne partagent pas — ou n'ont jamais partagé — au moins un
> Cercle, **et** si leur relation n'a pas atteint le niveau qui ouvre le DM.
>
> Cette règle est vérifiée **côté serveur**, jamais uniquement côté client.

Parcours type :

1. L'utilisateur s'inscrit (âge vérifié) et complète son profil.
2. Il découvre des Cercles thématiques et consulte leur **salle d'accueil**.
3. Il rejoint un Cercle (6 à 10 personnes, équilibre femmes/hommes recherché).
4. Il échange dans le chat du Cercle ; des **relations** se créent avec les autres
   membres.
5. Les relations progressent par niveaux (Mode Rencontre ou Mode Amitié).
6. Au niveau requis, le **DM s'ouvre** entre les deux personnes.

---

## 4. Périmètre fonctionnel

### 4.1 Waitlist et parrainage

- Formulaire : prénom, email, genre, ville, centres d'intérêt, fonctionnalité
  préférée, code de parrainage (facultatif), acceptation des CGU.
- Affichage à l'inscrit : **rang**, **code de parrainage** personnel
  (ex. `KADY-7F2QX`), date d'accès estimée.
- Le parrainage fait remonter dans la file. Rang calculé par
  `nb_parrainages` décroissant puis `created_at` croissant.
- Si l'email est déjà inscrit, l'utilisateur retrouve son statut.

### 4.2 Inscription et authentification

- Inscription par email + mot de passe, date de naissance **obligatoire**.
- Refus de création si l'âge calculé côté serveur est < 18 ans
  (`422 MINEUR_INTERDIT`).
- Acceptation obligatoire des CGU et de la politique de confidentialité.
- Connexion, rafraîchissement de session, déconnexion.
- Verrouillage temporaire après 5 échecs de connexion (15 min).

### 4.3 Vérification d'identité

- **Selfie vivant** : défi gestuel aléatoire (tourner la tête, sourire…), via un
  prestataire tiers de liveness à terme.
- **Correspondance** du selfie avec la photo principale (automatique ou revue
  manuelle dans le back-office).
- **Pièce d'identité** uniquement si nécessaire (badge « Vérifié+ »).
- Résultat : `is_verified`, `verification_level` et badge `verifie` / `verifie_plus`.

### 4.4 Profil

- Champs : prénom, âge (dérivé de la date de naissance), genre, ville, bio
  (~300 caractères), centres d'intérêt, faits de profil (profession, études,
  musique, sport, film favori, langues).
- Photo principale visible de tous.
- Jusqu'à **5 photos supplémentaires**, débloquées par **réciprocité** ou par
  **progression de niveau**, toujours servies via URL signée.

### 4.5 Cercles

- Groupe thématique de **6 à 10 personnes** autour d'une passion commune, avec
  recherche d'**équilibre femmes/hommes**.
- **Salle d'accueil** (lecture seule avant d'adhérer) : description, règles,
  niveau, activité récente, nombre de membres, aperçu des discussions.
- **« Pourquoi ce Cercle ? »** : intérêts communs, proximité géographique,
  activité, compatibilité générale.
- **Durée** : 60 jours par défaut, avec vote de renouvellement.
- **XP et grades** par membre, propres au Cercle :
  Graine → Flamme → Étoile → Diamant → Légendaire.
- **Classement / Découvrir** : mise en avant des Cercles actifs, proches,
  populaires, ou mis en avant par l'administration.
- Création d'un Cercle par un utilisateur (rôle « fondateur »), adhésion, départ.

### 4.6 Chat de Cercle

- Messagerie temps réel (WebSocket) réservée aux membres.
- Historique paginé par curseur.
- **Filtrage automatique** des coordonnées (téléphones, emails, liens) avant
  enregistrement et diffusion.

### 4.7 Relations et niveaux de confiance

Une relation est créée entre deux membres d'un même Cercle (Cercle d'origine
conservé). Elle a un **mode** et un **niveau** de 1 à 5.

| Niveau | Mode Rencontre | Mode Amitié |
|---|---|---|
| 1 | L'Inconnu | L'Inconnu |
| 2 | La Connaissance | La Connaissance |
| 3 | L'Ami(e) | Le Camarade |
| 4 | La Confiance | L'Ami Proche |
| 5 | L'Intimité | Les Complices |

- Progression fondée sur des **interactions réelles** et une **évaluation
  mutuelle** (moyenne ≥ 4/5 pour passer au niveau suivant).
- Déblocages progressifs : photos, audio, vidéo, puis partage volontaire de contact.
- **Le DM s'ouvre au niveau 2** (`dm_ouvert = true`).
- Le score comportemental ne décide **jamais seul** d'un passage de niveau.

### 4.8 Jeu de découverte

- Deviner des informations sur un membre (ville, profession, études, musique,
  sport, film, langues) parmi des propositions.
- Bonnes réponses récompensées en points (10 points par information).

### 4.9 Messages privés (DM)

- Ouverture uniquement si la relation a `dm_ouvert = true` (sinon
  `403 DM_VERROUILLE`) et si aucun blocage n'existe (`403 BLOQUE`).
- Temps réel par WebSocket, statut lu/non lu, même filtrage que le chat de Cercle.
- Limite de conversations actives selon le plan (voir §6).

### 4.10 Sécurité utilisateur

- **Bloquer** : disparition mutuelle totale (Cercles, suggestions, DM, classements).
- **Masquer** : réduction de visibilité, unidirectionnelle.
- **Signaler** : depuis un Cercle ou un DM, avec motif ; envoyé en modération.
- **Pause relationnelle** : l'utilisateur reste dans ses Cercles mais ne reçoit
  plus de nouveaux DM et disparaît des suggestions ; réversible à tout moment.

### 4.11 Carnet personnel

Notes, souvenirs, observations et rappels (éventuellement liés à une personne),
**strictement privés**.

### 4.12 Notifications

Liste des notifications (nouveau message, montée de niveau, vérification,
avertissement de modération…), compteur non lu, « tout marquer comme lu ».

### 4.13 Badges

`pionnier` (premières vagues), `verifie` (selfie validé), `verifie_plus`
(pièce d'identité), `membre_respectueux`.

### 4.14 Comptes fantômes

- 30 jours d'inactivité : rappel.
- 60 jours : compte marqué inactif.
- 90 jours : retrait automatique des Cercles.

Piloté par `dernier_acces` et une tâche planifiée.

### 4.15 Pages légales et informatives

À propos, Conditions générales d'utilisation, Politique de confidentialité,
« Comment ça marche », page de maintenance.

### 4.16 Hors périmètre V1 (prévu V2)

- Carte des relations avancée (visualisation graphique).
- Assistant conversationnel IA enrichi (suggestions de sujets et relances).
- Badges évolutifs, recommandations intelligentes.
- Événements physiques.
- Statistiques avancées.

---

## 5. Back-office d'administration

Application séparée, hébergée sur un domaine non référencé, protégée par un jeton
d'administration (`X-Admin-Token`).

| Section | Fonctions |
|---|---|
| Tableau de bord | KPIs (utilisateurs, Cercles actifs, abonnés Premium, actifs 7 j) avec variation hebdomadaire, inscriptions sur 14 jours, files « À traiter » |
| Utilisateurs | Recherche, filtres (actifs, Premium, suspendus), fiche détaillée, suspendre / réactiver / bannir (un banni ne peut pas être réactivé) |
| Vérifications | File des selfies en attente : approuver (badge + notification) ou rejeter |
| Cercles | Liste par thème et statut, suspendre / réactiver, mise en avant |
| Signalements | Ignorer, avertir (notification), suspendre le compte |
| Premium et revenus | MRR, nouveaux abonnés 30 j, taux de conversion, répartition par formule |
| Réglages | Inscriptions ouvertes, vérification automatique, promo Premium, mode maintenance |

Toute action de modération doit être journalisée. Aucune sanction automatique
fondée uniquement sur le score comportemental.

---

## 6. Modèle économique

| | Gratuit | Premium |
|---|---|---|
| Cercles actifs | 3 | Illimités |
| Conversations DM actives | 3 | Illimitées |
| Fonctionnalités essentielles | ✅ | ✅ |
| Statistiques, personnalisation, rythme personnel | — | ✅ |
| Prix | 0 | 3 000 XOF / mois (paramétrable) |

### Paiement — web-first via CinetPay

Le Premium **n'est pas vendu par achat intégré** dans une app native (commission
de 30 % des stores, pas de mobile money). Il est vendu sur une **page web**, payée
via CinetPay (Orange Money, Wave, MTN MoMo, Moov).

1. L'utilisateur clique « Passer Premium ».
2. Le backend crée une transaction CinetPay (montant, XOF, identifiant unique,
   URL de retour et URL de notification).
3. L'utilisateur paie dans l'interface CinetPay.
4. CinetPay appelle le **webhook** serveur : seule source de vérité, jamais la
   redirection de retour.
5. Le serveur vérifie montant et statut auprès de l'API CinetPay, puis active
   l'abonnement.
6. Le webhook est **idempotent** (une notification reçue deux fois ne crée pas
   deux abonnements).

---

## 7. Exigences de sécurité et de sûreté

| Exigence | Règle |
|---|---|
| Âge | Vérification 18+ côté serveur, bloquante |
| Mots de passe | Hachage argon2, jamais en clair ni dans les logs |
| Sessions | JWT : access token 15 min, refresh token 30 jours |
| Force brute | Verrouillage après 5 échecs pendant 15 min ; rate limiting |
| Secrets | Uniquement par variables d'environnement, jamais dans Git |
| Messages | Filtrage des numéros (formats ivoiriens +225, 10 chiffres), emails, liens ; message marqué `est_filtre` |
| Médias | Cloudinary, URLs signées à expiration courte (10 min), contrôle d'accès préalable |
| DM | Invariant central vérifié côté serveur sur chaque ouverture et chaque message |
| Blocage | Disparition mutuelle sur toutes les surfaces |
| Paiement | Validation serveur via API CinetPay, webhook idempotent |
| Administration | Jeton fort en production, CORS restreint aux domaines officiels |
| Suppression | Logique par défaut ; purge réelle sur demande de l'utilisateur |

---

## 8. Architecture technique

### 8.1 Stack

| Brique | Technologie |
|---|---|
| Backend | Python, FastAPI, SQLAlchemy 2.0, Pydantic |
| Base de données | PostgreSQL 14+, migrations Alembic |
| Temps réel | WebSockets natifs FastAPI (par Cercle et par conversation) |
| Web (prioritaire) | React + Vite + TypeScript, zustand, PWA installable |
| Back-office | React + Vite + TypeScript |
| Mobile (après validation) | Expo / React Native (expo-router) |
| Médias | Cloudinary (URLs signées) |
| Paiement | CinetPay (mobile money) |
| Hébergement | Railway / Render (API + PostgreSQL), Vercel ou équivalent (fronts) |

### 8.2 Organisation du dépôt

```
apps/
├── api/          # Backend FastAPI
│   └── app/
│       ├── core/      # config, database, security, deps, errors, ratelimit
│       ├── models/    # modèles SQLAlchemy par domaine
│       ├── schemas/   # schémas Pydantic
│       ├── routers/   # un router par domaine
│       ├── services/  # règles métier (niveaux, limites, modération)
│       └── utils/     # filtrage texte, URLs signées, parrainage
├── web/          # Application web PWA
├── backoffice/   # Administration
└── mobile/       # Application Expo
```

### 8.3 Conventions

- Identifiants : anglais pour le générique (`User`, `created_at`), français pour
  le métier (`cercle`, `niveau`, `carnet`, `en_pause`).
- Format d'erreur unique : `{ "detail": "...", "code": "MACHINE_CODE" }` avec les
  bons codes HTTP (401, 403, 404, 409, 422).
- Pagination par curseur : `limit` (défaut 20, max 50) + `cursor`.
- Enums PostgreSQL : ajout de valeurs par `ALTER TYPE ... ADD VALUE IF NOT EXISTS`.

---

## 9. Modèle de données

Toutes les tables ont un identifiant en clé primaire, `created_at` et
`updated_at`. Les suppressions sensibles sont logiques.

| Domaine | Tables | Points clés |
|---|---|---|
| Utilisateur | `users`, `profils` | Auth séparée du profil public ; `date_naissance`, `is_verified`, `verification_level`, `en_pause`, `dernier_acces`, tentatives de connexion |
| Photos | `photos` | Une seule principale par utilisateur, `ordre` jusqu'à 5 supplémentaires |
| Cercles | `cercles`, `cercle_membres` (+ `cercle_votes_renouvellement`, à créer) | Capacité 6–10, statut, `expire_le` (+60 j), grade et XP portés par l'adhésion |
| Chat Cercle | `cercle_messages` | Contenu filtré, index (`cercle_id`, `created_at`) |
| Relations | `relations` | Paire (a<b) unique par mode, `niveau` 1–5, `cercle_origine_id`, `dm_ouvert` |
| DM | `conversations`, `dm_messages` | Rattachées à une relation, statut `lu` |
| Sécurité | `blocages`, `masquages`, `signalements` | Contexte (Cercle / DM), statut ouvert / traité / rejeté |
| Personnel | `carnet_entrees`, `badges`, `user_badges` | Carnet privé, catalogue de badges |
| Découverte | `profil_faits`, `decouvertes` | Faits de profil et réponses du jeu |
| Croissance | `waitlist` | Code et rang de parrainage |
| Facturation | `abonnements` | Plan, statut, dates, `cinetpay_transaction_id` |
| Plateforme | `notifications`, `app_config`, `villes` | Réglages administrables |

---

## 10. API

| Domaine | Préfixe | Points d'accès |
|---|---|---|
| Auth | `/auth` | `register`, `login`, `refresh`, `me` |
| Profils | `/profils` | `PATCH /me`, photos (liste, ajout, upload, suppression) |
| Cercles | `/cercles` | liste, création, détail / salle d'accueil, membres, `join`, `leave`, messages, WebSocket `/{id}/ws` |
| Relations | `/relations` | liste, `evaluer` |
| Découverte | `/decouverte` | `/{cible_id}`, `/{cible_id}/deviner` |
| DM | `/dm` | conversations, `ouvrir/{relation_id}`, messages, WebSocket `/{id}/ws` |
| Sécurité | `/securite` | bloquer / débloquer, masquer, signaler, pause |
| Carnet | `/carnet` | liste, ajout, suppression |
| Notifications | `/notifications` | liste, `lues` |
| Premium | `/premium` | `statut`, `init`, `webhook` |
| Waitlist | `/waitlist` | inscription, `statut` |
| Villes | `/villes` | référentiel des villes |
| Admin | `/admin` | stats, utilisateurs, vérifications, Cercles, signalements, premium, config |

Documentation interactive : `/docs` (Swagger). Santé : `/health`.

---

## 11. Exigences non fonctionnelles

- **Performance** : temps de réponse API < 300 ms au 95e centile hors réseau ;
  diffusion des messages temps réel < 1 s.
- **Réseau dégradé** : interface légère, chargements progressifs, reconnexion
  automatique des WebSockets.
- **Disponibilité** : objectif 99,5 % ; mode maintenance activable depuis le
  back-office.
- **Compatibilité** : navigateurs mobiles récents (Chrome Android en priorité),
  PWA installable sur l'écran d'accueil ; iOS et Android pour l'app native.
- **Accessibilité et UX** : interface en français, mode sombre, contrastes
  lisibles, vocabulaire du produit cohérent.
- **Maintenabilité** : code typé (Python et TypeScript), tests sur les règles
  critiques (âge, invariant DM, webhook).
- **Observabilité** : journaux sans données sensibles, journal des actions de
  modération.

---

## 12. Conformité et protection des données

- Le traitement de données personnelles en Côte d'Ivoire relève de l'**ARTCI** :
  vérification des obligations de déclaration avant le lancement public
  (responsabilité du porteur de projet).
- Minimisation des données collectées.
- Droit à la suppression avec purge réelle sur demande.
- Chiffrement des secrets, aucune donnée sensible dans les journaux.
- CGU et politique de confidentialité validées séparément, acceptation obligatoire
  à l'inscription.

---

## 13. Lancement et déploiement

### 13.1 Lancement par vagues

| Vague | Utilisateurs |
|---|---|
| 1 | 100 (badge `pionnier`) |
| 2 | 300 |
| 3 | 1 000 |
| 4 | Ouverture publique |

Le rang dans la waitlist détermine la vague d'accès.

### 13.2 Mise en production

- Backend : PostgreSQL provisionné, variables `DATABASE_URL`, `JWT_SECRET`
  (32+ caractères), `ADMIN_TOKEN`, `CORS_ORIGINS`, `APP_RETURN_URL`,
  `APP_NOTIFY_URL`, clés Cloudinary et CinetPay ; migrations puis démarrage.
- Fronts : `npm run build`, variable `VITE_API_URL`, fallback SPA vers
  `index.html`.
- Back-office sur un domaine séparé et non référencé.

---

## 14. Planning et lotissement

Ordre de construction (chaque étape repose sur la précédente) :

| # | Lot | Contenu |
|---|---|---|
| 1 | Fondation | Configuration, base de données, sécurité, modèle `User`, migrations, healthcheck |
| 2 | Auth + 18 ans | Inscription, connexion, refresh, utilisateur courant |
| 3 | Profils + photos | Profil, photos, Cloudinary, URLs signées |
| 4 | Cercles | Création, salle d'accueil, adhésion équilibrée, durée, XP / grades |
| 5 | Chat de Cercle | WebSocket, persistance, filtrage |
| 6 | Relations + niveaux | Modes Rencontre / Amitié, déblocages |
| 7 | DM | Conversations gardées par l'invariant, WebSocket |
| 8 | Sécurité utilisateur | Bloquer, masquer, signaler, pause |
| 9 | Notifications, Premium, modération | CinetPay, back-office |

**MVP V1** : waitlist, auth, vérification selfie, profils, Cercles, chat Cercle,
DM, Mode Rencontre, Mode Amitié, blocage / signalement, pause, notifications,
Premium, back-office.

**V2** : carte des relations avancée, assistant IA, badges évolutifs,
recommandations intelligentes, événements physiques, statistiques avancées,
application native publiée sur les stores.

---

## 15. Glossaire

| Terme | Définition |
|---|---|
| **Cercle** | Groupe thématique de 6 à 10 personnes, point d'entrée obligatoire |
| **Salle d'accueil** | Aperçu en lecture seule d'un Cercle avant de le rejoindre |
| **Grade** | Rang d'un membre dans un Cercle : Graine → Flamme → Étoile → Diamant → Légendaire |
| **Mode Rencontre** | Progression amoureuse en 5 niveaux |
| **Mode Amitié** | Progression amicale en 5 niveaux |
| **DM** | Message privé, ouvert uniquement au niveau requis |
| **Carnet** | Notes privées, visibles du seul propriétaire |
| **Pause relationnelle** | Plus de nouveaux DM ni de suggestions, réversible |
| **Score comportemental** | Signal interne de recommandation et de priorisation, jamais décisionnel seul |
| **Compte fantôme** | Compte inactif (rappel 30 j, inactif 60 j, retrait 90 j) |
