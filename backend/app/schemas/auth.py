from pydantic import BaseModel, EmailStr, field_validator


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def password_not_empty(cls, v: str) -> str:
        if not v or len(v) < 6:
            raise ValueError("Password must be at least 6 characters.")
        if len(v) > 128:
            raise ValueError("Password exceeds maximum length.")
        return v


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters.")
        if len(v) > 128:
            raise ValueError("Password exceeds maximum length.")
        return v


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
