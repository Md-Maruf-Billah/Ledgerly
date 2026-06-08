import logging

from fastapi import APIRouter, HTTPException, Request, status, Depends
from app.schemas.auth import LoginRequest, RegisterRequest, AuthResponse, SessionResponse
from app.services import auth_service
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])
logger = logging.getLogger("ledgerly.auth")

# Generic message shown on all auth failures — prevents email enumeration
_AUTH_FAIL = "Incorrect email or password."


@router.post("/register", response_model=AuthResponse)
async def register(payload: RegisterRequest, request: Request):
    rid = getattr(request.state, "request_id", "-")
    try:
        result = await auth_service.sign_up(payload.email, payload.password)
        logger.info("register.success email=*** rid=%s", rid)
        return AuthResponse(message="Account created successfully.", **result)
    except ValueError as exc:
        # Surface safe validation messages (e.g. "check your email to confirm")
        logger.warning("register.fail reason=%s rid=%s", exc, rid)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except Exception:
        logger.exception("register.error rid=%s", rid)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed. Please try again.",
        )


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest, request: Request):
    rid = getattr(request.state, "request_id", "-")
    try:
        result = await auth_service.sign_in(payload.email, payload.password)
        logger.info("login.success email=*** rid=%s", rid)
        return AuthResponse(message="Signed in successfully.", **result)
    except ValueError:
        # Do NOT forward Supabase error — it may reveal whether email exists
        logger.warning("login.fail rid=%s", rid)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=_AUTH_FAIL)
    except Exception:
        logger.exception("login.error rid=%s", rid)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Sign-in failed. Please try again.",
        )


@router.post("/logout")
async def logout(request: Request, user: dict = Depends(get_current_user)):
    rid = getattr(request.state, "request_id", "-")
    await auth_service.sign_out(user["token"])
    logger.info("logout.success user_id=%s rid=%s", user["user_id"], rid)
    return {"message": "Signed out successfully."}


@router.get("/me", response_model=SessionResponse)
async def get_me(user: dict = Depends(get_current_user)):
    from app.services import db
    rows = await db.select("business_profiles", user["token"], {
        "select": "id", "user_id": f"eq.{user['user_id']}", "limit": "1",
    })
    return SessionResponse(
        user_id=user["user_id"],
        email=user["email"],
        has_profile=len(rows) > 0,
    )
