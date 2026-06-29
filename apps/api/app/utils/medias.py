# app/utils/medias.py — URLs signées Cloudinary à expiration courte.
# Aucune photo privée n'est servie par URL publique permanente.
import time

from app.core.config import settings

try:
    import cloudinary
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


def url_signee(public_id: str) -> str:
    """URL signée valable SIGNED_URL_TTL secondes. Repli local : placeholder."""
    if not _OK:
        return f"https://placehold.co/600x800?text={public_id}"
    expire = int(time.time()) + settings.SIGNED_URL_TTL
    url, _ = cloudinary.utils.cloudinary_url(
        public_id, type="authenticated", sign_url=True, auth_token={"duration": settings.SIGNED_URL_TTL}, expires_at=expire
    )
    return url
