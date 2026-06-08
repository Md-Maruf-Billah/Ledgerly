from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str


class AuthResponse(BaseModel):
    message: str
    user_id: str | None = None
    access_token: str | None = None
