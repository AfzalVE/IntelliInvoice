from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.config import settings
from app.modules.user.user_model import User


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """Decode JWT and return the authenticated User ORM object (with role)."""
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=["HS256"],
        )
        user_id = payload.get("user_id")
        if not user_id:
            raise ValueError("No user_id in token")
    except (JWTError, ValueError):
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


def require_role(*allowed_roles: str):
    """
    Dependency factory — gates an endpoint to users whose role is in allowed_roles.

    Usage:
        @router.post("/approve")
        def approve(current_user: User = Depends(require_role("ADMIN"))):
            ...
    """
    def _check(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role.upper() not in [r.upper() for r in allowed_roles]:
            raise HTTPException(
                status_code=403,
                detail=f"Access denied. Required role(s): {', '.join(allowed_roles)}",
            )
        return current_user

    return _check