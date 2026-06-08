from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_ENV: str = "local"
    # Stored as a plain string; use .cors_origins property for the list
    BACKEND_CORS_ORIGINS: str = "http://localhost:5173,http://localhost:4173"

    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    DATABASE_URL: str = ""
    SECRET_KEY: str = "dev-secret-change-in-production"

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.BACKEND_CORS_ORIGINS.split(",") if o.strip()]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
