from sqlalchemy.orm import Session

from .user_model import User



class UserService:


    def get_user_by_id(
        self,
        db:Session,
        user_id:int
    ):

        return (
            db.query(User)
            .filter(
                User.id == user_id
            )
            .first()
        )



    def get_user_by_email(
        self,
        db:Session,
        email:str
    ):

        return (
            db.query(User)
            .filter(
                User.email == email
            )
            .first()
        )



    def update_user(
        self,
        db:Session,
        user:User,
        name:str
    ):

        user.name = name

        db.commit()

        db.refresh(user)

        return user


    def delete_user(
        self,
        db: Session,
        user: User,
    ):
        from app.modules.invoice.invoice_model import Invoice
        from app.modules.email.email_model import Email
        from app.modules.oauth.oauth_model import OAuthAccount, OAuthState

        db.query(Invoice).filter(Invoice.user_id == user.id).delete(synchronize_session=False)
        db.query(Email).filter(Email.user_id == user.id).delete(synchronize_session=False)
        db.query(OAuthAccount).filter(OAuthAccount.user_id == user.id).delete(synchronize_session=False)
        db.query(OAuthState).filter(OAuthState.user_id == user.id).delete(synchronize_session=False)
        db.delete(user)
        db.commit()
        return {"success": True, "message": "Account deleted successfully."}



user_service = UserService()