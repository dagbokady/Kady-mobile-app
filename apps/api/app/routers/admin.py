# app/routers/admin.py — back-office (protégé par en-tête X-Admin-Token).
import hmac
from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, Header
from sqlalchemy import func, or_, select

from app.core.config import settings
from app.core.deps import Db
from app.core.errors import err
from app.models.billing import Abonnement, Waitlist
from app.models.cercle import Cercle, CercleMembre
from app.models.config import AppConfig
from app.models.relation import Relation
from app.models.securite import Notification, Signalement
from app.models.user import Photo, Profil, User, UserBadge
from app.utils.medias import url_signee

router = APIRouter(prefix="/admin", tags=["admin"])


def guard(x_admin_token: Annotated[str | None, Header()] = None) -> None:
    # .strip() des deux côtés : un espace/retour-ligne parasite (copier-coller
    # d'une variable d'env) ne doit pas casser silencieusement l'auth admin.
    # compare_digest : comparaison en temps constant (anti timing-attack).
    recu = (x_admin_token or "").strip()
    if not recu or not hmac.compare_digest(recu, settings.ADMIN_TOKEN.strip()):
        raise err(403, "ADMIN_REQUIS", "Accès back-office refusé.")


# ── Helpers ──────────────────────────────────────────────────────────────────

def _now() -> datetime:
    return datetime.now(timezone.utc)


def _premium_ids(db: Db) -> set[str]:
    now = _now()
    rows = db.execute(select(Abonnement.user_id).where(
        Abonnement.plan == "premium", Abonnement.statut == "actif",
        or_(Abonnement.fin.is_(None), Abonnement.fin > now))).scalars().all()
    return set(rows)


def _profils(db: Db) -> dict[str, Profil]:
    return {p.user_id: p for p in db.execute(select(Profil)).scalars().all()}


def _photo_url(db: Db, user_id: str) -> str | None:
    p = db.execute(select(Photo).where(Photo.user_id == user_id)
                   .order_by(Photo.is_principale.desc(), Photo.ordre)).scalars().first()
    return url_signee(p.cloudinary_public_id) if p else None


def _age(date_naissance) -> int | None:
    if not date_naissance:
        return None
    today = _now().date()
    return today.year - date_naissance.year - ((today.month, today.day) < (date_naissance.month, date_naissance.day))


def _statut_user(u: User, prem: set[str]) -> str:
    if u.banni or u.is_deleted:
        return "Banni"
    if not u.is_active:
        return "Suspendu"
    if u.id in prem:
        return "Premium"
    if not u.is_verified:
        return "En attente"
    return "Actif"


def _delta_pct(recent: int, avant: int) -> str | None:
    """Variation en % entre deux périodes ; None si pas de base de comparaison."""
    if avant == 0:
        return "+100%" if recent > 0 else None
    pct = round(((recent - avant) / avant) * 100)
    return f"{'+' if pct >= 0 else ''}{pct}%"


def _cercles_signales_ids(db: Db) -> set[str]:
    rows = db.execute(select(Signalement.cercle_id).where(
        Signalement.statut == "ouvert", Signalement.contexte == "cercle",
        Signalement.cercle_id.is_not(None))).scalars().all()
    return set(rows)


def _verif_pending(db: Db) -> list[User]:
    return db.execute(select(User).where(
        User.is_deleted.is_(False), User.is_active.is_(True), User.is_verified.is_(False))
        .order_by(User.created_at.desc())).scalars().all()


def _notifier(db: Db, user_id: str, titre: str, corps: str, type_: str = "moderation") -> None:
    db.add(Notification(user_id=user_id, titre=titre, corps=corps, type=type_))


JOURS_COURTS = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"]


# ── Tableau de bord ──────────────────────────────────────────────────────────

@router.get("/stats")
def stats(db: Db, _: None = Depends(guard)):
    now = _now()
    s7, s14 = now - timedelta(days=7), now - timedelta(days=14)

    users = db.execute(select(func.count(User.id)).where(User.is_deleted.is_(False))).scalar_one()
    users_7j = db.execute(select(func.count(User.id)).where(
        User.is_deleted.is_(False), User.created_at >= s7)).scalar_one()
    users_prec = db.execute(select(func.count(User.id)).where(
        User.is_deleted.is_(False), User.created_at >= s14, User.created_at < s7)).scalar_one()

    cercles = db.execute(select(func.count(Cercle.id)).where(Cercle.statut == "actif")).scalar_one()
    cercles_7j = db.execute(select(func.count(Cercle.id)).where(Cercle.created_at >= s7)).scalar_one()
    cercles_prec = db.execute(select(func.count(Cercle.id)).where(
        Cercle.created_at >= s14, Cercle.created_at < s7)).scalar_one()

    prem = _premium_ids(db)
    prem_7j = db.execute(select(func.count(Abonnement.id)).where(
        Abonnement.statut == "actif", Abonnement.created_at >= s7)).scalar_one()
    prem_prec = db.execute(select(func.count(Abonnement.id)).where(
        Abonnement.statut == "actif", Abonnement.created_at >= s14, Abonnement.created_at < s7)).scalar_one()

    actifs_7j = db.execute(select(func.count(User.id)).where(
        User.is_deleted.is_(False), User.is_active.is_(True), User.dernier_acces >= s7)).scalar_one()
    taux_actifs = round((actifs_7j / users) * 100) if users else 0

    reports = db.execute(select(func.count(Signalement.id)).where(Signalement.statut == "ouvert")).scalar_one()
    verifs = len(_verif_pending(db))
    cercles_signales = len(_cercles_signales_ids(db))
    waitlist = db.execute(select(func.count(Waitlist.id))).scalar_one()

    # Inscriptions par jour sur 14 jours (graphique).
    debut = (now - timedelta(days=13)).replace(hour=0, minute=0, second=0, microsecond=0)
    rows = db.execute(
        select(func.date(User.created_at), func.count(User.id))
        .where(User.created_at >= debut, User.is_deleted.is_(False))
        .group_by(func.date(User.created_at))).all()
    par_jour = {str(d): n for d, n in rows}
    chart = []
    for i in range(14):
        jour = debut + timedelta(days=i)
        chart.append({"d": str(jour.day), "n": par_jour.get(str(jour.date()), 0)})

    return {
        "users": users, "users_delta": _delta_pct(users_7j, users_prec),
        "cercles": cercles, "cercles_delta": _delta_pct(cercles_7j, cercles_prec),
        "premium": len(prem), "premium_delta": _delta_pct(prem_7j, prem_prec),
        "taux_actifs": taux_actifs, "actifs_7j": actifs_7j,
        "reports": reports, "verifs": verifs, "cercles_signales": cercles_signales,
        "waitlist": waitlist, "chart": chart,
    }


# ── Utilisateurs ─────────────────────────────────────────────────────────────

@router.get("/users")
def users(db: Db, _: None = Depends(guard), q: str | None = None, page: int = 1, limit: int = 20):
    """Tous les comptes (bannis inclus), paginés, recherche côté SQL."""
    page = max(1, page)
    limit = min(max(1, limit), 50)

    base = select(User)
    if q:
        par_prenom = select(Profil.user_id).where(Profil.prenom.ilike(f"%{q}%"))
        base = base.where(or_(User.email.ilike(f"%{q}%"), User.id.in_(par_prenom)))
    total = db.execute(select(func.count()).select_from(base.subquery())).scalar_one()
    rows = db.execute(base.order_by(User.created_at.desc())
                      .limit(limit).offset((page - 1) * limit)).scalars().all()

    prem = _premium_ids(db)
    profils = _profils(db)
    items = []
    for u in rows:
        p = profils.get(u.id)
        nom = p.prenom if p else u.email.split("@")[0]
        nb = db.execute(select(func.count(CercleMembre.id)).where(CercleMembre.user_id == u.id)).scalar_one()
        items.append({"id": u.id, "name": nom, "email": u.email, "telephone": u.telephone,
                      "ville": p.ville if p else None,
                      "cercles": nb, "joined": u.created_at.strftime("%d/%m/%y"),
                      "status": _statut_user(u, prem), "is_active": u.is_active,
                      "photo": _photo_url(db, u.id)})
    return {"items": items, "total": total, "page": page, "pages": max(1, -(-total // limit))}


@router.get("/users/{user_id}")
def user_detail(user_id: str, db: Db, _: None = Depends(guard)):
    u = db.get(User, user_id)
    if u is None:
        raise err(404, "INTROUVABLE", "Utilisateur introuvable.")
    p = db.execute(select(Profil).where(Profil.user_id == u.id)).scalars().first()
    prem = _premium_ids(db)
    cercles = db.execute(select(func.count(CercleMembre.id)).where(CercleMembre.user_id == u.id)).scalar_one()
    relations = db.execute(select(func.count(Relation.id)).where(
        or_(Relation.user_a_id == u.id, Relation.user_b_id == u.id))).scalar_one()
    signalements_recus = db.execute(select(func.count(Signalement.id)).where(
        Signalement.signale_id == u.id)).scalar_one()
    verif_label = {"none": "Non vérifié", "selfie": "Vérifié", "id_document": "Vérifié+"}
    return {
        "id": u.id, "name": p.prenom if p else u.email.split("@")[0], "email": u.email,
        "telephone": u.telephone, "banni": u.banni,
        "ville": p.ville if p else None, "bio": p.bio if p else None,
        "genre": p.genre if p else None, "centres_interet": p.centres_interet if p else [],
        "age": _age(u.date_naissance), "joined": u.created_at.strftime("%d/%m/%Y"),
        "status": _statut_user(u, prem), "is_active": u.is_active, "is_deleted": u.is_deleted,
        "verification": verif_label.get(u.verification_level, "Non vérifié"),
        "cercles": cercles, "relations": relations, "photo": _photo_url(db, u.id),
        "en_pause": u.en_pause,
        # Signaux internes réservés à l'admin (jamais exposés à l'utilisateur).
        "score_comportemental": float(p.score_comportemental) if p else 0.0,
        "signalements_recus": signalements_recus,
    }


@router.post("/users/{user_id}/suspend")
def suspend(user_id: str, db: Db, _: None = Depends(guard)):
    u = db.get(User, user_id)
    if u is None:
        raise err(404, "INTROUVABLE", "Utilisateur introuvable.")
    u.is_active = not u.is_active
    if not u.is_active:
        _notifier(db, u.id, "Compte suspendu", "Ton compte a été suspendu par la modération. Contacte le support KADY.")
    db.commit()
    return {"is_active": u.is_active}


@router.post("/users/{user_id}/ban")
def ban(user_id: str, db: Db, _: None = Depends(guard)):
    u = db.get(User, user_id)
    if u is None:
        raise err(404, "INTROUVABLE", "Utilisateur introuvable.")
    u.is_active = False
    u.is_deleted = True
    u.banni = True  # bloque définitivement email + téléphone à la ré-inscription
    db.commit()
    return {"is_deleted": True}


# ── Vérifications d'identité ─────────────────────────────────────────────────

@router.get("/verifications")
def verifications(db: Db, _: None = Depends(guard)):
    profils = _profils(db)
    now = _now()
    out = []
    for u in _verif_pending(db):
        p = profils.get(u.id)
        jours = max(0, (now - u.created_at).days)
        depuis = "aujourd'hui" if jours == 0 else (f"il y a {jours} j" if jours < 30 else f"il y a {jours // 30} mois")
        age = _age(u.date_naissance)
        meta = " · ".join(x for x in [f"{age} ans" if age else None, p.ville if p else None, f"inscrit {depuis}"] if x)
        out.append({"id": u.id, "name": p.prenom if p else u.email.split("@")[0],
                    "meta": meta, "photo": _photo_url(db, u.id)})
    return out


@router.post("/verifications/{user_id}/approve")
def approve_verif(user_id: str, db: Db, _: None = Depends(guard)):
    u = db.get(User, user_id)
    if u is None:
        raise err(404, "INTROUVABLE", "Utilisateur introuvable.")
    u.is_verified = True
    u.verification_level = "selfie"
    deja = db.execute(select(UserBadge).where(UserBadge.user_id == u.id, UserBadge.badge_code == "verifie")).scalars().first()
    if deja is None:
        db.add(UserBadge(user_id=u.id, badge_code="verifie", obtenu_le=_now()))
    _notifier(db, u.id, "Profil vérifié ✓", "Ton identité a été confirmée. Le badge « Vérifié » est à toi !", "verification")
    db.commit()
    return {"is_verified": True}


@router.post("/verifications/{user_id}/reject")
def reject_verif(user_id: str, db: Db, _: None = Depends(guard)):
    u = db.get(User, user_id)
    if u is None:
        raise err(404, "INTROUVABLE", "Utilisateur introuvable.")
    u.is_verified = False
    u.verification_level = "none"
    _notifier(db, u.id, "Vérification refusée", "Ton selfie n'a pas pu être validé. Reprends un selfie bien éclairé, visage découvert.", "verification")
    db.commit()
    return {"is_verified": False}


# ── Cercles ──────────────────────────────────────────────────────────────────

@router.get("/cercles")
def cercles(db: Db, _: None = Depends(guard)):
    signales = _cercles_signales_ids(db)
    rows = db.execute(select(Cercle).order_by(Cercle.mis_en_avant.desc(), Cercle.created_at.desc())).scalars().all()
    out = []
    for c in rows:
        nb = db.execute(select(func.count(CercleMembre.id)).where(CercleMembre.cercle_id == c.id)).scalar_one()
        out.append({"id": c.id, "nom": c.nom, "theme": c.theme, "membres": nb,
                    "statut": c.statut, "signale": c.id in signales, "mis_en_avant": c.mis_en_avant})
    return out


@router.post("/cercles/{cercle_id}/toggle")
def toggle_cercle(cercle_id: str, db: Db, _: None = Depends(guard)):
    c = db.get(Cercle, cercle_id)
    if c is None:
        raise err(404, "INTROUVABLE", "Cercle introuvable.")
    c.statut = "archive" if c.statut == "actif" else "actif"
    db.commit()
    return {"statut": c.statut}


@router.post("/cercles/{cercle_id}/feature")
def feature_cercle(cercle_id: str, db: Db, _: None = Depends(guard)):
    c = db.get(Cercle, cercle_id)
    if c is None:
        raise err(404, "INTROUVABLE", "Cercle introuvable.")
    c.mis_en_avant = not c.mis_en_avant
    db.commit()
    return {"mis_en_avant": c.mis_en_avant}


# ── Signalements ─────────────────────────────────────────────────────────────

@router.get("/signalements")
def signalements(db: Db, _: None = Depends(guard)):
    profils = _profils(db)
    rows = db.execute(select(Signalement).where(Signalement.statut == "ouvert")
                      .order_by(Signalement.created_at.desc())).scalars().all()
    out = []
    for r in rows:
        signale = profils.get(r.signale_id)
        signaleur = profils.get(r.signaleur_id)
        target = signale.prenom if signale else "Utilisateur"
        if r.contexte == "cercle" and r.cercle_id:
            c = db.get(Cercle, r.cercle_id)
            if c:
                target = f"{target} · cercle « {c.nom} »"
        out.append({"id": r.id, "target": target, "signale_id": r.signale_id,
                    "by": signaleur.prenom if signaleur else "Utilisateur",
                    "reason": r.motif or "Sans motif précisé", "contexte": r.contexte,
                    "time": r.created_at.strftime("%d/%m %H:%M")})
    return out


@router.post("/signalements/{sid}/action")
def action_signalement(sid: str, action: str, db: Db, _: None = Depends(guard)):
    r = db.get(Signalement, sid)
    if r is None:
        raise err(404, "INTROUVABLE", "Signalement introuvable.")
    if action == "ignorer":
        r.statut = "rejete"
    elif action == "avertir":
        r.statut = "traite"
        _notifier(db, r.signale_id, "Avertissement de modération",
                  f"Un comportement signalé ({r.motif or 'sans précision'}) enfreint la charte KADY. Merci d'y veiller.")
    elif action == "suspendre":
        r.statut = "traite"
        u = db.get(User, r.signale_id)
        if u:
            u.is_active = False
            _notifier(db, u.id, "Compte suspendu", "Suite à un signalement, ton compte est suspendu. Contacte le support KADY.")
    else:
        raise err(422, "ACTION_INCONNUE", "Action attendue : ignorer, avertir ou suspendre.")
    db.commit()
    return {"statut": r.statut, "action": action}


# ── Premium & revenus ────────────────────────────────────────────────────────

@router.get("/premium")
def premium(db: Db, _: None = Depends(guard)):
    now = _now()
    m1 = now - timedelta(days=30)
    m2 = now - timedelta(days=60)
    actifs = len(_premium_ids(db))
    users = db.execute(select(func.count(User.id)).where(User.is_deleted.is_(False))).scalar_one()
    nouveaux = db.execute(select(func.count(Abonnement.id)).where(
        Abonnement.statut == "actif", Abonnement.created_at >= m1)).scalar_one()
    prec = db.execute(select(func.count(Abonnement.id)).where(
        Abonnement.statut == "actif", Abonnement.created_at >= m2, Abonnement.created_at < m1)).scalar_one()
    mrr = actifs * settings.PREMIUM_AMOUNT_XOF
    conversion = round((actifs / users) * 100, 1) if users else 0.0
    return {
        "abonnes": actifs, "mrr": mrr, "prix": settings.PREMIUM_AMOUNT_XOF,
        "nouveaux_30j": nouveaux, "delta": _delta_pct(nouveaux, prec),
        "conversion": conversion,
        "plans": [{"label": "Mensuel", "count": actifs, "pct": 100 if actifs else 0}],
    }


# ── Configuration ────────────────────────────────────────────────────────────

CONFIG_KEYS = ("waitlist_mode", "maintenance", "auto_verif", "premium_promo")
SITE_MODES = ("open", "waitlist", "maintenance")


def site_mode(rows: dict[str, str]) -> str:
    """Mode effectif du site — maintenance prime sur waitlist prime sur open."""
    if rows.get("maintenance", "false") == "true":
        return "maintenance"
    if rows.get("waitlist_mode", "true") == "true":
        return "waitlist"
    return "open"


def _write_config(db: Db, cle: str, valeur: bool) -> None:
    row = db.get(AppConfig, cle)
    if row is None:
        row = AppConfig(cle=cle)
        db.add(row)
    row.valeur = "true" if valeur else "false"


@router.get("/config")
def get_config(db: Db, _: None = Depends(guard)):
    rows = {c.cle: c.valeur for c in db.execute(select(AppConfig)).scalars().all()}
    waitlist = db.execute(select(func.count(Waitlist.id))).scalar_one()
    return {"mode": site_mode(rows),
            "waitlist_mode": rows.get("waitlist_mode", "true") == "true",
            "maintenance": rows.get("maintenance", "false") == "true",
            "auto_verif": rows.get("auto_verif", "false") == "true",
            "premium_promo": rows.get("premium_promo", "false") == "true",
            "waitlist_count": waitlist}


@router.post("/config")
def set_config(cle: str, valeur: bool, db: Db, _: None = Depends(guard)):
    if cle not in CONFIG_KEYS:
        raise err(422, "CLE_INCONNUE", "Clé de configuration inconnue.")
    _write_config(db, cle, valeur)
    db.commit()
    return {"cle": cle, "valeur": "true" if valeur else "false"}


@router.post("/config/mode")
def set_mode(mode: str, db: Db, _: None = Depends(guard)):
    """Bascule le site en open / waitlist / maintenance de façon atomique."""
    if mode not in SITE_MODES:
        raise err(422, "MODE_INCONNU", "Mode de site inconnu.")
    _write_config(db, "maintenance", mode == "maintenance")
    _write_config(db, "waitlist_mode", mode == "waitlist")
    db.commit()
    return {"mode": mode}
