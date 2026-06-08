from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    message: str
    user_id: str | None = None
    access_token: str | None = None
    refresh_token: str | None = None
    is_new_user: bool = False


class SessionResponse(BaseModel):
    user_id: str
    email: str
    has_profile: bool
