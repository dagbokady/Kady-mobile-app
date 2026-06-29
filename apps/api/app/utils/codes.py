# app/utils/codes.py — génération de codes de parrainage type KADY-7F2QX.
import secrets
import string

_ALPHABET = string.ascii_uppercase + string.digits


def code_parrainage() -> str:
    suffixe = "".join(secrets.choice(_ALPHABET) for _ in range(5))
    return f"KADY-{suffixe}"
