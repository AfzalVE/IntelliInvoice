from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.auth.auth_schema import (
    RegisterRequest,
    LoginRequest,
    ResetPasswordRequest,
    AuthResponse,
    UserResponse,
)
from app.modules.auth.auth_service import auth_service
from app.modules.auth.dependencies import get_current_user
from app.modules.user.user_model import User


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/register", response_model=AuthResponse)
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db),
):
    result = auth_service.register(
        db,
        request.name,
        request.email,
        request.password,
        request.role,
    )
    return {
        "success": True,
        "message": "Registration successful",
        **result,
    }


@router.post("/login", response_model=AuthResponse)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db),
):
    result = auth_service.login(
        db,
        request.email,
        request.password,
    )
    return {
        "success": True,
        "message": "Login successful",
        **result,
    }


@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user),
):
    """Return the currently authenticated user's profile including role."""
    return current_user


@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    return auth_service.reset_password(
        db,
        request.email,
        request.new_password,
    )