# app/main.py — création de l'app, sécurité (headers, rate-limit, garde-fous prod), CORS, routers.
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.deps import Db
from app.core.errors import ApiError, api_error_handler
from app.core.ratelimit import LIMITE_GLOBALE, REGLES, limiter
from app.routers import (admin, auth, carnet, cercles, decouverte, dm, notifications, premium, profils, relations, securite, villes, waitlist)

# ── Garde-fous prod : on refuse de démarrer avec des secrets par défaut ──────
if settings.est_prod:
    if settings.JWT_SECRET == "dev-secret-change-me" or len(settings.JWT_SECRET) < 32:
        raise RuntimeError("ENV=prod : JWT_SECRET manquant ou trop court (32+ caractères requis).")
    if settings.ADMIN_TOKEN.strip() in ("", "kady-admin"):
        raise RuntimeError("ENV=prod : ADMIN_TOKEN par défaut interdit — définis un jeton fort.")

# En prod, pas de documentation publique de l'API.
_docs = {"docs_url": None, "redoc_url": None, "openapi_url": None} if settings.est_prod else {}
app = FastAPI(title="KADY API", version="1.0.0", **_docs)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_BODY = 12 * 1024 * 1024  # 12 Mo — au-delà de l'upload photo (8 Mo) + marge multipart


@app.middleware("http")
async def securite_http(request: Request, call_next):
    # 1) Taille de corps plafonnée (Content-Length déclaré).
    taille = request.headers.get("content-length")
    if taille and taille.isdigit() and int(taille) > MAX_BODY:
        return JSONResponse(status_code=413, content={"detail": "Corps de requête trop volumineux.", "code": "CORPS_TROP_GROS"})

    # 2) Rate-limiting par IP (fenêtre glissante 60 s).
    ip = request.client.host if request.client else "?"
    route = (request.method, request.url.path)
    limite = REGLES.get(route)
    if (limite and not limiter.allow(f"{ip}:{route[0]}{route[1]}", limite)) or not limiter.allow(ip, LIMITE_GLOBALE):
        return JSONResponse(status_code=429, content={"detail": "Trop de requêtes, réessaie dans une minute.", "code": "TROP_DE_REQUETES"})

    response = await call_next(request)

    # 3) En-têtes de sécurité sur toutes les réponses.
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "no-referrer")
    response.headers.setdefault("Cache-Control", "no-store")
    if settings.est_prod:
        response.headers.setdefault("Strict-Transport-Security", "max-age=63072000; includeSubDomains")
    return response


app.add_exception_handler(ApiError, api_error_handler)

for r in (auth, profils, cercles, relations, dm, securite, carnet, notifications, premium, villes, waitlist, admin, decouverte):
    app.include_router(r.router)


@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok", "service": "kady-api"}


@app.get("/config", tags=["meta"])
def public_config(db: Db):
    """Config publique lue par la web : pilote l'affichage waitlist vs auth."""
    from sqlalchemy import select

    from app.models.config import AppConfig

    rows = {c.cle: c.valeur for c in db.execute(select(AppConfig)).scalars().all()}
    maintenance = rows.get("maintenance", "false") == "true"
    waitlist_on = rows.get("waitlist_mode", "true") == "true"
    mode = "maintenance" if maintenance else "waitlist" if waitlist_on else "open"
    return {"mode": mode, "waitlist_mode": waitlist_on, "maintenance": maintenance}
