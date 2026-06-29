# app/models/__init__.py — enregistre tous les modèles sur Base.
from app.models.billing import Abonnement, Waitlist
from app.models.cercle import Cercle, CercleMembre, CercleMessage
from app.models.relation import Conversation, DmMessage, Relation
from app.models.securite import Blocage, CarnetEntree, Masquage, Notification, Signalement
from app.models.user import Badge, Photo, Profil, User, UserBadge
from app.models.ville import Ville

__all__ = [
    "User", "Profil", "Photo", "Badge", "UserBadge",
    "Cercle", "CercleMembre", "CercleMessage",
    "Relation", "Conversation", "DmMessage",
    "Blocage", "Masquage", "Signalement", "CarnetEntree", "Notification",
    "Waitlist", "Abonnement",
]
