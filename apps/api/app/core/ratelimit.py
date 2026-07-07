# app/core/ratelimit.py — limiteur de débit en mémoire (fenêtre glissante par IP).
# Suffisant pour une instance unique (Railway) ; passer à Redis si scaling horizontal.
import time
from collections import defaultdict, deque


class RateLimiter:
    def __init__(self) -> None:
        self._hits: dict[str, deque[float]] = defaultdict(deque)
        self._dernier_menage = time.monotonic()

    def allow(self, key: str, limit: int, window: float = 60.0) -> bool:
        now = time.monotonic()
        dq = self._hits[key]
        while dq and now - dq[0] > window:
            dq.popleft()
        if len(dq) >= limit:
            return False
        dq.append(now)
        self._menage(now, window)
        return True

    def _menage(self, now: float, window: float) -> None:
        # Purge périodique pour borner la mémoire (clés inactives).
        if now - self._dernier_menage < 300:
            return
        self._dernier_menage = now
        mortes = [k for k, dq in self._hits.items() if not dq or now - dq[-1] > window]
        for k in mortes:
            del self._hits[k]


limiter = RateLimiter()

# Limites par minute pour les routes sensibles (préfixe méthode+chemin exact).
REGLES: dict[tuple[str, str], int] = {
    ("POST", "/auth/login"): 10,       # anti force-brute distribué (en plus du lockout par compte)
    ("POST", "/auth/register"): 5,     # anti-création massive de comptes
    ("POST", "/auth/refresh"): 30,
    ("POST", "/waitlist"): 5,          # anti-spam waitlist
    ("GET", "/waitlist/statut"): 20,
    ("POST", "/profils/me/photos/upload"): 15,
}
LIMITE_GLOBALE = 300  # requêtes/min/IP toutes routes confondues
