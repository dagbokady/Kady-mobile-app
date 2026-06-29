# app/routers/premium.py — Premium via CinetPay (mobile money), web-first.
# La validation se fait au WEBHOOK serveur, jamais sur la redirection de retour.
import uuid
from datetime import datetime, timedelta, timezone

import httpx
from fastapi import APIRouter, Request
from sqlalchemy import select

from app.core.config import settings
from app.core.deps import CurrentUser, Db
from app.core.errors import err
from app.models.billing import Abonnement
from app.schemas.billing import AbonnementOut, PremiumInitOut
from app.schemas.common import Ok
from app.services.regles import premium_actif

router = APIRouter(prefix="/premium", tags=["premium"])


@router.get("/statut", response_model=AbonnementOut)
def statut(user: CurrentUser, db: Db):
    actif = premium_actif(db, user.id)
    return AbonnementOut(plan="premium" if actif else "gratuit", statut="actif" if actif else "expire", actif=actif)


@router.post("/init", response_model=PremiumInitOut, status_code=201)
def init_paiement(user: CurrentUser, db: Db):
    if premium_actif(db, user.id):
        raise err(409, "DEJA_PREMIUM", "Tu es déjà Premium.")
    tx = f"KADYPREM-{uuid.uuid4().hex[:16]}"
    # Abonnement « en attente » (annule) jusqu'à confirmation du webhook.
    db.add(Abonnement(user_id=user.id, plan="premium", statut="annule", cinetpay_transaction_id=tx))
    db.commit()

    if not settings.CINETPAY_API_KEY:
        # Repli local : pas de clé CinetPay → URL stub (le webhook reste la vérité).
        return PremiumInitOut(payment_url=f"{settings.APP_RETURN_URL}?transaction_id={tx}&stub=1", transaction_id=tx)

    payload = {
        "apikey": settings.CINETPAY_API_KEY, "site_id": settings.CINETPAY_SITE_ID,
        "transaction_id": tx, "amount": settings.PREMIUM_AMOUNT_XOF, "currency": "XOF",
        "description": "KADY Premium", "return_url": settings.APP_RETURN_URL,
        "notify_url": settings.APP_NOTIFY_URL, "channels": "ALL",
    }
    try:
        r = httpx.post(f"{settings.CINETPAY_BASE_URL}/payment", json=payload, timeout=20)
        data = r.json()
    except Exception:
        raise err(502, "CINETPAY_INDISPONIBLE", "Le service de paiement est momentanément indisponible.")
    url = (data.get("data") or {}).get("payment_url")
    if not url:
        raise err(502, "CINETPAY_ERREUR", "Impossible d'initialiser le paiement.")
    return PremiumInitOut(payment_url=url, transaction_id=tx)


def _activer(db, abo: Abonnement) -> None:
    now = datetime.now(timezone.utc)
    abo.statut = "actif"
    abo.debut = now
    abo.fin = now + timedelta(days=30)


@router.post("/webhook", response_model=Ok)
async def webhook(request: Request, db: Db):
    # CinetPay envoie en form-url-encoded ; on tolère aussi le JSON.
    try:
        form = await request.form()
        tx = form.get("cpm_trans_id") or form.get("transaction_id")
    except Exception:
        body = await request.json()
        tx = body.get("cpm_trans_id") or body.get("transaction_id")
    if not tx:
        raise err(422, "TRANSACTION_MANQUANTE", "transaction_id absent.")

    abo = db.execute(select(Abonnement).where(Abonnement.cinetpay_transaction_id == tx)).scalars().first()
    if abo is None:
        raise err(404, "ABONNEMENT_INTROUVABLE", "Transaction inconnue.")
    if abo.statut == "actif":
        return Ok()  # idempotent : une notification reçue deux fois n'active qu'une fois.

    # Vérifie le statut RÉEL côté CinetPay avant d'activer (jamais la redirection seule).
    if settings.CINETPAY_API_KEY:
        try:
            r = httpx.post(f"{settings.CINETPAY_BASE_URL}/payment/check",
                           json={"apikey": settings.CINETPAY_API_KEY, "site_id": settings.CINETPAY_SITE_ID, "transaction_id": tx},
                           timeout=20)
            data = r.json()
        except Exception:
            raise err(502, "CINETPAY_INDISPONIBLE", "Vérification du paiement impossible.")
        if str((data.get("data") or {}).get("status")) != "ACCEPTED":
            raise err(402, "PAIEMENT_NON_CONFIRME", "Paiement non confirmé.")

    _activer(db, abo)
    db.commit()
    return Ok()
