# app/routers/decouverte.py — jeu de découverte : deviner les infos d'un membre.
import random
from datetime import datetime, timezone

from fastapi import APIRouter
from sqlalchemy import select

from app.core.deps import CurrentUser, Db
from app.core.errors import err
from app.models.decouverte import Decouverte, ProfilFait
from app.models.user import Profil
from app.schemas.common import Ok  # noqa: F401 (garde la cohérence d'import)

router = APIRouter(prefix="/decouverte", tags=["decouverte"])

CHAMPS = [
    ("ville", "Ville"), ("job", "Profession"), ("etudes", "Études"),
    ("musique", "Musique"), ("sport", "Sport"), ("film", "Film favori"), ("langue", "Langues"),
]
LABELS = dict(CHAMPS)
POINTS_PAR_INFO = 10

# Leurres de repli si peu de données réelles dans la base.
POOL = {
    "ville": ["Cocody", "Yopougon", "Marcory", "Plateau", "Treichville"],
    "job": ["Architecte", "Développeur", "Journaliste", "Coach sportif", "Designer"],
    "etudes": ["Informatique", "Médecine", "Droit", "Commerce", "Beaux-Arts"],
    "musique": ["Afrobeats", "Coupé-décalé", "Gospel", "Jazz", "Rap"],
    "sport": ["Football", "Basket", "Natation", "Yoga", "Running"],
    "film": ["Black Panther", "Inception", "La La Land", "Creed", "Le Roi Lion"],
    "langue": ["FR · Anglais", "FR · Dioula", "FR · Baoulé", "FR · Espagnol", "FR · Bambara"],
}


def _faits(db: Db, cible_id: str) -> dict[str, str]:
    faits = {f.champ: f.valeur for f in db.execute(
        select(ProfilFait).where(ProfilFait.user_id == cible_id)).scalars().all()}
    # La ville vient du profil si non déjà en fait explicite.
    if "ville" not in faits:
        v = db.execute(select(Profil.ville).where(Profil.user_id == cible_id)).scalar_one_or_none()
        if v:
            faits["ville"] = v
    return faits


def _options(db: Db, champ: str, correct: str) -> list[str]:
    # 2 leurres : autres valeurs réelles pour ce champ, complétées par le pool.
    autres = db.execute(select(ProfilFait.valeur).where(
        ProfilFait.champ == champ, ProfilFait.valeur != correct).distinct()).scalars().all()
    pool = [x for x in (list(autres) + POOL.get(champ, [])) if x != correct]
    random.shuffle(pool)
    opts = [correct] + pool[:2]
    while len(opts) < 3:
        opts.append(f"Option {len(opts)}")
    random.shuffle(opts)
    return opts


@router.get("/{cible_id}")
def etat(cible_id: str, user: CurrentUser, db: Db):
    faits = _faits(db, cible_id)
    revele = {d.champ for d in db.execute(select(Decouverte).where(
        Decouverte.decouvreur_id == user.id, Decouverte.cible_id == cible_id)).scalars().all()}
    champs = []
    for cle, label in CHAMPS:
        if cle not in faits:
            continue
        if cle in revele:
            champs.append({"champ": cle, "label": label, "revele": True, "valeur": faits[cle]})
        else:
            champs.append({"champ": cle, "label": label, "revele": False, "options": _options(db, cle, faits[cle])})
    return {"points": len(revele) * POINTS_PAR_INFO, "total": len(faits),
            "decouverts": len(revele), "champs": champs}


@router.post("/{cible_id}/deviner")
def deviner(cible_id: str, user: CurrentUser, db: Db, champ: str, valeur: str):
    faits = _faits(db, cible_id)
    correct = faits.get(champ)
    if correct is None:
        raise err(404, "CHAMP_INTROUVABLE", "Cette info n'est pas renseignée.")
    if valeur.strip().lower() != correct.strip().lower():
        return {"correct": False}
    exists = db.execute(select(Decouverte.id).where(
        Decouverte.decouvreur_id == user.id, Decouverte.cible_id == cible_id, Decouverte.champ == champ)).first()
    if not exists:
        db.add(Decouverte(decouvreur_id=user.id, cible_id=cible_id, champ=champ,
                          created_at=datetime.now(timezone.utc)))
        db.commit()
    return {"correct": True, "valeur": correct}
