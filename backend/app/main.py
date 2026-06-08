from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes import auth, tasks, profiles, notifications

app = FastAPI(
    title="Ledgerly API",
    description="Backend API for the Ledgerly compliance calendar app.",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(profiles.router)
app.include_router(notifications.router)  # before tasks so /read-all isn't shadowed
app.include_router(tasks.router)


@app.get("/health", tags=["health"])
async def health_check():
    return {
        "status": "ok",
        "app": "Ledgerly API",
        "version": "0.2.0",
        "env": settings.APP_ENV,
        "supabase_configured": bool(settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY),
    }
