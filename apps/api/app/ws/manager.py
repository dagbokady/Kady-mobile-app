# app/ws/manager.py — un hub de connexions par « salle » (cercle:ID ou conv:ID).
from collections import defaultdict

from fastapi import WebSocket


class WsManager:
    def __init__(self) -> None:
        self._rooms: dict[str, set[WebSocket]] = defaultdict(set)

    async def join(self, room: str, ws: WebSocket) -> None:
        await ws.accept()
        self._rooms[room].add(ws)

    def leave(self, room: str, ws: WebSocket) -> None:
        self._rooms[room].discard(ws)
        if not self._rooms[room]:
            self._rooms.pop(room, None)

    async def broadcast(self, room: str, message: dict) -> None:
        morts: list[WebSocket] = []
        for ws in list(self._rooms.get(room, ())):
            try:
                await ws.send_json(message)
            except Exception:
                morts.append(ws)
        for ws in morts:
            self.leave(room, ws)


manager = WsManager()
