from sqlalchemy.orm import Session

from passlib.context import CryptContext

from fastapi import HTTPException

from app.modules.user.user_model import User

from app.modules.auth.jwt import (
    create_access_token,
)



password_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=10,  # Default is 12; 10 is still secure but ~4x faster
)



class AuthService:



    def register(
        self,
        db: Session,
        name: str,
        email: str,
        password: str,
        role: str = "BA",
    ):


        existing_user = (
            db.query(User)
            .filter(
                User.email == email
            )
            .first()
        )


        if existing_user:

            raise HTTPException(
                status_code=400,
                detail="Email already registered",
            )


        hashed_password = (
            password_context.hash(
                password
            )
        )


        user = User(

            name=name,

            email=email,

            password=hashed_password,

            role=role.upper(),

        )


        db.add(user)

        db.commit()

        db.refresh(user)



        token = create_access_token(

            {
                "user_id": user.id,

                "email": user.email,

            }

        )


        return {

            "user": user,

            "token": {

                "access_token": token,

                "token_type": "bearer",

            }

        }




    def login(
        self,
        db: Session,
        email: str,
        password: str,
    ):


        user = (
            db.query(User)
            .filter(
                User.email == email
            )
            .first()
        )


        if not user:

            raise HTTPException(
                status_code=401,
                detail="Invalid email or password",
            )



        password_valid = (
            password_context.verify(
                password,
                user.password,
            )
        )



        if not password_valid:

            raise HTTPException(
                status_code=401,
                detail="Invalid email or password",
            )



        token = create_access_token(

            {
                "user_id": user.id,

                "email": user.email,

            }

        )



        return {

            "user": user,

            "token": {

                "access_token": token,

                "token_type": "bearer",

            }

        }


    def reset_password(
        self,
        db: Session,
        email: str,
        new_password: str,
    ):
        user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )
        if not user:
            raise HTTPException(
                status_code=404,
                detail="No account found with this email address.",
            )
        user.password = password_context.hash(new_password)
        db.commit()
        return {"success": True, "message": "Password reset successfully."}



auth_service = AuthService()