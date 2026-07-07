# app/utils/medias.py — upload + URLs signées Cloudinary (photos privées).
# Aucune photo privée n'est servie par URL publique permanente : livraison en
# `authenticated` avec URL signée (signature simple, compatible plan gratuit).
import uuid

from app.core.config import settings

try:
    import cloudinary
    import cloudinary.uploader
    import cloudinary.utils

    if settings.CLOUDINARY_CLOUD_NAME:
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
            secure=True,
        )
    _OK = bool(settings.CLOUDINARY_CLOUD_NAME)
except Exception:  # pragma: no cover
    _OK = False


def cloudinary_pret() -> bool:
    """True si les clés Cloudinary sont configurées."""
    return _OK


def televerser_image(data: bytes, user_id: str) -> str:
    """Téléverse une image privée dans le dossier de l'utilisateur.

    Renvoie le `public_id` complet (dossier inclus). Lève RuntimeError si
    Cloudinary n'est pas configuré (l'appelant doit vérifier `cloudinary_pret()`).
    """
    if not _OK:
        raise RuntimeError("Cloudinary non configuré")
    res = cloudinary.uploader.upload(
        data,
        folder=f"kady/users/{user_id}",
        public_id=uuid.uuid4().hex,
        type="authenticated",
        resource_type="image",
        overwrite=False,
    )
    return res["public_id"]


def supprimer_image(public_id: str) -> None:
    """Supprime l'asset Cloudinary (best-effort, ne lève pas)."""
    if not _OK:
        return
    try:
        cloudinary.uploader.destroy(public_id, type="authenticated", resource_type="image")
    except Exception:  # pragma: no cover
        pass


def url_signee(public_id: str) -> str:
    """URL signée d'une photo privée. Repli local : placeholder."""
    if not _OK:
        return f"https://placehold.co/600x800?text={public_id}"
    url, _ = cloudinary.utils.cloudinary_url(public_id, type="authenticated", sign_url=True, secure=True)
    return url
