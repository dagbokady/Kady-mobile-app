# app/utils/filtre.py — masque coordonnées (tél. ivoiriens, email, liens) avant
# enregistrement/diffusion d'un message (Cercle ET DM). Réutilisé partout.
import re

_REMPLACEMENT = "🔒[masqué]"

# Email
_EMAIL = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}")
# URL / lien
_URL = re.compile(r"\b((https?://|www\.)\S+|\S+\.(com|net|org|ci|io|fr|me)(/\S*)?)\b", re.I)
# Téléphone : +225 optionnel puis 8 à 10 chiffres avec séparateurs variés
_TEL = re.compile(r"(\+?225[\s.\-]?)?(\d[\s.\-]?){8,12}")


def filtrer_message(texte: str) -> tuple[str, bool]:
    """Renvoie (texte_filtré, est_filtre)."""
    filtre = False
    out = texte

    def sub(rx: re.Pattern, s: str) -> str:
        nonlocal filtre
        new = rx.sub(_REMPLACEMENT, s)
        if new != s:
            filtre = True
        return new

    out = sub(_EMAIL, out)
    out = sub(_URL, out)
    out = sub(_TEL, out)
    return out, filtre
