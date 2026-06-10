from pydantic import BaseModel, EmailStr, field_validator

MAX_PASSWORD_LENGTH = 128
MIN_PASSWORD_LENGTH = 12
COMMON_PASSWORDS = {
    "123456789012",
    "password1234",
    "qwerty123456",
    "letmein123456",
    "admin12345678",
}


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def password_not_empty(cls, v: str) -> str:
        if not v:
            raise ValueError("Password is required.")
        if len(v) > MAX_PASSWORD_LENGTH:
            raise ValueError("Password must be 128 characters or fewer.")
        return v


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < MIN_PASSWORD_LENGTH:
            raise ValueError("Use at least 12 characters.")
        if len(v) > MAX_PASSWORD_LENGTH:
            raise ValueError("Password must be 128 characters or fewer.")
        if v.lower() in COMMON_PASSWORDS:
            raise ValueError("Choose a less common password.")
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
