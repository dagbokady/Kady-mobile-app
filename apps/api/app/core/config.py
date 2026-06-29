# app/core/config.py — toute la configuration vient de l'environnement (.env).
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    DATABASE_URL: str = "postgresql+psycopg://kady:kady@localhost:5432/kady"

    JWT_SECRET: str = "dev-secret-change-me"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_MINUTES: int = 15
    REFRESH_TOKEN_DAYS: int = 30

    MAX_LOGIN_ATTEMPTS: int = 5
    LOCKOUT_MINUTES: int = 15

    CORS_ORIGINS: str = "http://localhost:8081,http://localhost:8083,http://localhost:19006"

    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""
    SIGNED_URL_TTL: int = 600

    CINETPAY_API_KEY: str = ""
    CINETPAY_SITE_ID: str = ""
    CINETPAY_BASE_URL: str = "https://api-checkout.cinetpay.com/v2"
    PREMIUM_AMOUNT_XOF: int = 3000
    APP_RETURN_URL: str = "http://localhost:8083/premium/retour"
    APP_NOTIFY_URL: str = "http://localhost:8000/premium/webhook"

    @property
    def cors_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]


settings = Settings()
