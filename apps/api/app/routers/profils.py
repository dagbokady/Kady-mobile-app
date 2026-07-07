# app/routers/profils.py — profil & photos (upload + URLs signées).
from fastapi import APIRouter, File, UploadFile
from sqlalchemy import func, select

from app.core.deps import CurrentUser, Db
from app.core.errors import err
from app.models.user import Photo, Profil
from app.schemas.common import Ok, PhotoOut, ProfilUpdate
from app.utils.medias import cloudinary_pret, supprimer_image, televerser_image, url_signee

router = APIRouter(prefix="/profils", tags=["profils"])

MAX_PHOTOS = 6
MAX_TAILLE = 8 * 1024 * 1024  # 8 Mo


@router.patch("/me", response_model=Ok)
def update_me(data: ProfilUpdate, user: CurrentUser, db: Db):
    p = db.execute(select(Profil).where(Profil.user_id == user.id)).scalars().first()
    if p is None:
        raise err(404, "PROFIL_INTROUVABLE", "Profil introuvable.")
    for champ, val in data.model_dump(exclude_unset=True).items():
        setattr(p, champ, val)
    db.commit()
    return Ok()


@router.get("/me/photos", response_model=list[PhotoOut])
def mes_photos(user: CurrentUser, db: Db):
    photos = db.execute(
        select(Photo).where(Photo.user_id == user.id).order_by(Photo.is_principale.desc(), Photo.ordre)
    ).scalars().all()
    return [PhotoOut(id=p.id, is_principale=p.is_principale, ordre=p.ordre,
                     url=url_signee(p.cloudinary_public_id)) for p in photos]


@router.post("/me/photos", response_model=PhotoOut, status_code=201)
def ajouter_photo(public_id: str, user: CurrentUser, db: Db, is_principale: bool = False, ordre: int = 0):
    if is_principale:
        for p in db.execute(select(Photo).where(Photo.user_id == user.id, Photo.is_principale.is_(True))).scalars():
            p.is_principale = False
    photo = Photo(user_id=user.id, cloudinary_public_id=public_id, is_principale=is_principale, ordre=ordre)
    db.add(photo)
    db.commit()
    return PhotoOut(id=photo.id, is_principale=photo.is_principale, ordre=photo.ordre,
                    url=url_signee(photo.cloudinary_public_id))


@router.post("/me/photos/upload", response_model=PhotoOut, status_code=201)
async def televerser_photo(
    user: CurrentUser,
    db: Db,
    fichier: UploadFile = File(...),
    is_principale: bool = False,
):
    """Téléverse une vraie image vers Cloudinary et enregistre la photo."""
    if not cloudinary_pret():
        raise err(503, "MEDIA_INDISPONIBLE", "Le stockage des photos n'est pas encore configuré.")
    if not (fichier.content_type or "").startswith("image/"):
        raise err(422, "FORMAT_INVALIDE", "Le fichier doit être une image.")
    data = await fichier.read()
    if len(data) > MAX_TAILLE:
        raise err(422, "FICHIER_TROP_LOURD", "Image trop lourde (8 Mo maximum).")

    nb = db.execute(select(func.count(Photo.id)).where(Photo.user_id == user.id)).scalar_one()
    if nb >= MAX_PHOTOS:
        raise err(409, "TROP_DE_PHOTOS", f"Maximum {MAX_PHOTOS} photos.")

    public_id = televerser_image(data, user.id)
    principale = is_principale or nb == 0  # la 1re photo devient la principale
    if principale:
        for p in db.execute(select(Photo).where(Photo.user_id == user.id, Photo.is_principale.is_(True))).scalars():
            p.is_principale = False
    photo = Photo(user_id=user.id, cloudinary_public_id=public_id, is_principale=principale, ordre=nb)
    db.add(photo)
    db.commit()
    return PhotoOut(id=photo.id, is_principale=photo.is_principale, ordre=photo.ordre, url=url_signee(public_id))


@router.delete("/me/photos/{photo_id}", response_model=Ok)
def supprimer_photo(photo_id: str, user: CurrentUser, db: Db):
    photo = db.get(Photo, photo_id)
    if photo is None or photo.user_id != user.id:
        raise err(404, "PHOTO_INTROUVABLE", "Photo introuvable.")
    supprimer_image(photo.cloudinary_public_id)
    db.delete(photo)
    db.commit()
    return Ok()
