from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    APP_ENV: str = "local"
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:4173",
    ]

    # Supabase — populated after Supabase project is created
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    DATABASE_URL: str = ""
    SECRET_KEY: str = "dev-secret-change-in-production"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
