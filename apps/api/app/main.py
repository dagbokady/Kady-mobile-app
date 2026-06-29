# app/main.py — création de l'app, CORS, montage des routers, gestion d'erreurs.
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.errors import ApiError, api_error_handler
from app.routers import (auth, carnet, cercles, dm, notifications, premium, profils, relations, securite, villes, waitlist)

app = FastAPI(title="KADY API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(ApiError, api_error_handler)

for r in (auth, profils, cercles, relations, dm, securite, carnet, notifications, premium, villes, waitlist):
    app.include_router(r.router)


@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok", "service": "kady-api"}
