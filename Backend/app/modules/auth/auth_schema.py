from typing import Literal

from pydantic import (
    BaseModel,
    EmailStr,
    ConfigDict,
)



class RegisterRequest(BaseModel):

    name: str

    email: EmailStr

    password: str

    # Allowed roles: BA, ADMIN, FINANCE
    role: Literal["BA", "ADMIN", "FINANCE"] = "BA"



class LoginRequest(BaseModel):

    email: EmailStr

    password: str



class TokenResponse(BaseModel):

    access_token: str

    token_type: str = "bearer"



class UserResponse(BaseModel):

    id: int

    name: str

    email: EmailStr

    role: str = "BA"

    model_config = ConfigDict(
        from_attributes=True
    )



class AuthResponse(BaseModel):

    success: bool

    message: str

    user: UserResponse

    token: TokenResponse