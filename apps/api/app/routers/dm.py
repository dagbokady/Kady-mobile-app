# app/routers/dm.py — messages privés. INVARIANT : pas de DM sans relation dm_ouvert.
from datetime import datetime

from fastapi import APIRouter, Query, WebSocket, WebSocketDisconnect
from sqlalchemy import or_, select

from app.core.database import SessionLocal
from app.core.deps import CurrentUser, Db
from app.core.errors import err
from app.core.security import decode_token
from app.models.relation import Conversation, DmMessage, Relation
from app.schemas.dm import ConversationOut, DmIn, DmOut
from app.services.regles import (FREE_MAX_DM, nb_dm_actifs, paire, premium_actif, prenom_de, sont_bloques)
from app.utils.filtre import filtrer_message
from app.ws.manager import manager

router = APIRouter(prefix="/dm", tags=["dm"])


def _conv_de(db, conversation_id: str, user_id: str) -> Conversation:
    conv = db.get(Conversation, conversation_id)
    if conv is None or user_id not in (conv.user_a_id, conv.user_b_id):
        raise err(404, "CONVERSATION_INTROUVABLE", "Conversation introuvable.")
    return conv


@router.get("", response_model=list[ConversationOut])
def lister(user: CurrentUser, db: Db):
    rows = db.execute(select(Conversation).where(
        or_(Conversation.user_a_id == user.id, Conversation.user_b_id == user.id))).scalars().all()
    out = []
    for conv in rows:
        autre = conv.user_b_id if conv.user_a_id == user.id else conv.user_a_id
        rel = db.get(Relation, conv.relation_id)
        out.append(ConversationOut(id=conv.id, autre_id=autre, prenom=prenom_de(db, autre),
                                   niveau=rel.niveau if rel else 1, relation_id=conv.relation_id))
    return out


@router.post("/ouvrir/{relation_id}", response_model=ConversationOut, status_code=201)
def ouvrir(relation_id: str, user: CurrentUser, db: Db):
    rel = db.get(Relation, relation_id)
    if rel is None or user.id not in (rel.user_a_id, rel.user_b_id):
        raise err(404, "RELATION_INTROUVABLE", "Lien introuvable.")
    # INVARIANT central, vérifié côté serveur.
    if not rel.dm_ouvert:
        raise err(403, "DM_VERROUILLE", "Faites grandir votre lien dans le Cercle avant de discuter en privé.")
    autre = rel.user_b_id if rel.user_a_id == user.id else rel.user_a_id
    if sont_bloques(db, user.id, autre):
        raise err(403, "BLOQUE", "Conversation indisponible.")

    a, b = paire(user.id, autre)
    conv = db.execute(select(Conversation).where(
        Conversation.user_a_id == a, Conversation.user_b_id == b)).scalars().first()
    if conv is None:
        if not premium_actif(db, user.id) and nb_dm_actifs(db, user.id) >= FREE_MAX_DM:
            raise err(403, "LIMITE_DM", f"Le plan gratuit est limité à {FREE_MAX_DM} conversations. Passe Premium pour plus.")
        conv = Conversation(user_a_id=a, user_b_id=b, relation_id=rel.id)
        db.add(conv)
        db.commit()
        db.refresh(conv)
    return ConversationOut(id=conv.id, autre_id=autre, prenom=prenom_de(db, autre), niveau=rel.niveau, relation_id=rel.id)


@router.get("/{conversation_id}/messages", response_model=list[DmOut])
def messages(conversation_id: str, user: CurrentUser, db: Db,
             before: datetime | None = None, limit: int = Query(20, ge=1, le=50)):
    _conv_de(db, conversation_id, user.id)
    stmt = select(DmMessage).where(DmMessage.conversation_id == conversation_id)
    if before:
        stmt = stmt.where(DmMessage.created_at < before)
    rows = db.execute(stmt.order_by(DmMessage.created_at.desc()).limit(limit)).scalars().all()
    return list(reversed(rows))


@router.post("/{conversation_id}/messages", response_model=DmOut, status_code=201)
async def envoyer(conversation_id: str, data: DmIn, user: CurrentUser, db: Db):
    conv = _conv_de(db, conversation_id, user.id)
    rel = db.get(Relation, conv.relation_id)
    if rel is None or not rel.dm_ouvert:
        raise err(403, "DM_VERROUILLE", "Ce lien ne permet pas encore les messages privés.")
    autre = conv.user_b_id if conv.user_a_id == user.id else conv.user_a_id
    if sont_bloques(db, user.id, autre):
        raise err(403, "BLOQUE", "Conversation indisponible.")

    contenu, filtre = filtrer_message(data.contenu)
    msg = DmMessage(conversation_id=conversation_id, auteur_id=user.id, contenu=contenu, est_filtre=filtre)
    db.add(msg)
    db.commit()
    db.refresh(msg)
    out = DmOut.model_validate(msg)
    await manager.broadcast(f"conv:{conversation_id}", {"type": "message", "data": out.model_dump(mode="json")})
    return out


@router.websocket("/{conversation_id}/ws")
async def ws_dm(websocket: WebSocket, conversation_id: str, token: str = Query(...)):
    try:
        user_id = decode_token(token)["sub"]
    except Exception:
        await websocket.close(code=4401)
        return
    db = SessionLocal()
    try:
        conv = db.get(Conversation, conversation_id)
        if conv is None or user_id not in (conv.user_a_id, conv.user_b_id):
            await websocket.close(code=4403)
            return
    finally:
        db.close()
    room = f"conv:{conversation_id}"
    await manager.join(room, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.leave(room, websocket)
