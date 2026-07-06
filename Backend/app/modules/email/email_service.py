from sqlalchemy.orm import Session
import uuid
from datetime import datetime

from app.modules.email.email_model import Email


class EmailService:

    # --------------------------------------------------
    # Helper to Format Suggested Responses
    # --------------------------------------------------

    @staticmethod
    def _format_suggested_responses(raw_suggested: any) -> dict:
        raw_replies = []
        if isinstance(raw_suggested, dict):
            raw_replies = raw_suggested.get("replies", [])
        elif isinstance(raw_suggested, list):
            raw_replies = raw_suggested

        formatted_replies = []
        for index, reply in enumerate(raw_replies):
            formatted_replies.append({
                "id": str(index + 1),
                "subject": reply.get("tone", reply.get("subject", "Reply Option")),
                "body": reply.get("body", reply.get("text", "")),
                "date": datetime.utcnow().strftime("%I:%M %p"),
            })
        return {"replies": formatted_replies}

    # --------------------------------------------------
    # Analyze Email
    # --------------------------------------------------

    @staticmethod
   

    # --------------------------------------------------
    # Route Helper Aliases
    # --------------------------------------------------

    @staticmethod
    def get_user_email_history(
        db: Session,
        user_id: int,
    ):
        return EmailService.get_history(db, user_id)

    @staticmethod
    def get_user_leads(
        db: Session,
        user_id: int,
    ):
        return EmailService.get_leads(db, user_id)


email_service = EmailService()