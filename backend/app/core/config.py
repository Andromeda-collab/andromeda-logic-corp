from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Central app configuration.
    Values are sourced from environment / .env (see .env.example).
    """

    APP_NAME: str = "Andromeda Logic Corp API"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174"

    # MySQL — Section 11.2
    DATABASE_URL: str = "mysql+pymysql://alc_user:changeme@localhost:3306/andromeda_logic_corp"

    # NOVA — Section 10.5 / 10.6 (Gemini free tier)
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-3.6-flash"

    # Export-control gating — Section 9.14 / 14.1
    EXPORT_CONTROL_GATING_ENABLED: bool = True

    # Admin CMS auth — Section 12.1 CMS Roles & Permissions.
    # Real admin accounts (admin_users table) + JWT bearer tokens.
    JWT_SECRET_KEY: str = "dev-only-change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 480

    # Admin image uploads — local disk storage, served at /uploads/<file>.
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 25

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()