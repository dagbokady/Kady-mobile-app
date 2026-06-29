# app/services/regles.py — règles métier transverses (invariant, blocage, plan, niveaux).
from datetime import datetime, timezone

from sqlalchemy import and_, func, or_, select
from sqlalchemy.orm import Session

from app.models.billing import Abonnement
from app.models.cercle import CercleMembre
from app.models.relation import Conversation, DmMessage, Relation
from app.models.securite import Blocage
from app.models.user import Profil, User

# Limites du plan gratuit (appliquées en logique, pas en base).
FREE_MAX_CERCLES = 3
FREE_MAX_DM = 3
# Le DM s'ouvre dès le niveau 2 (« La Connaissance »).
NIVEAU_OUVERTURE_DM = 2
NIVEAU_MAX = 5


def paire(a: str, b: str) -> tuple[str, str]:
    """Ordonne deux user_id (a < b) pour l'unicité des relations/conversations."""
    return (a, b) if a < b else (b, a)


def sont_bloques(db: Session, a: str, b: str) -> bool:
    q = select(Blocage.id).where(
        or_(
            and_(Blocage.bloqueur_id == a, Blocage.bloque_id == b),
            and_(Blocage.bloqueur_id == b, Blocage.bloque_id == a),
        )
    )
    return db.execute(q).first() is not None


def premium_actif(db: Session, user_id: str) -> bool:
    now = datetime.now(timezone.utc)
    q = select(Abonnement.id).where(
        Abonnement.user_id == user_id,
        Abonnement.plan == "premium",
        Abonnement.statut == "actif",
        or_(Abonnement.fin.is_(None), Abonnement.fin > now),
    )
    return db.execute(q).first() is not None


def prenom_de(db: Session, user_id: str) -> str | None:
    return db.execute(select(Profil.prenom).where(Profil.user_id == user_id)).scalar_one_or_none()


def nb_cercles_actifs(db: Session, user_id: str) -> int:
    return db.execute(
        select(func.count(CercleMembre.id)).where(CercleMembre.user_id == user_id)
    ).scalar_one()


def nb_dm_actifs(db: Session, user_id: str) -> int:
    q = select(func.count(Conversation.id)).where(
        or_(Conversation.user_a_id == user_id, Conversation.user_b_id == user_id)
    )
    return db.execute(q).scalar_one()


def relation_partagee(db: Session, me: str, autre: str) -> Relation | None:
    """Renvoie une relation existante entre deux users (peu importe le mode)."""
    a, b = paire(me, autre)
    return db.execute(
        select(Relation).where(Relation.user_a_id == a, Relation.user_b_id == b)
    ).scalars().first()


def appliquer_niveau(rel: Relation, nouveau: int) -> bool:
    """Met à jour le niveau et ouvre le DM si le seuil est atteint. Renvoie a_evolue."""
    nouveau = max(1, min(nouveau, NIVEAU_MAX))
    evolue = nouveau != rel.niveau
    rel.niveau = nouveau
    if rel.niveau >= NIVEAU_OUVERTURE_DM:
        rel.dm_ouvert = True
    return evolue
