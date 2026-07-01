# app/main.py — création de l'app, CORS, montage des routers, gestion d'erreurs.
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.deps import Db
from app.core.errors import ApiError, api_error_handler
from app.routers import (admin, auth, carnet, cercles, decouverte, dm, notifications, premium, profils, relations, securite, villes, waitlist)

app = FastAPI(title="KADY API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    return {"waitlist_mode": rows.get("waitlist_mode", "true") == "true",
            "maintenance": rows.get("maintenance", "false") == "true"}
