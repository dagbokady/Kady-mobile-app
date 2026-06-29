# app/routers/notifications.py
from fastapi import APIRouter
from sqlalchemy import select, update

from app.core.deps import CurrentUser, Db
from app.models.securite import Notification
from app.schemas.common import NotificationOut, Ok

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("", response_model=list[NotificationOut])
def lister(user: CurrentUser, db: Db):
    return db.execute(select(Notification).where(Notification.user_id == user.id)
                      .order_by(Notification.created_at.desc())).scalars().all()


@router.post("/lues", response_model=Ok)
def tout_marquer_lu(user: CurrentUser, db: Db):
    db.execute(update(Notification).where(Notification.user_id == user.id, Notification.lu.is_(False)).values(lu=True))
    db.commit()
    return Ok()
