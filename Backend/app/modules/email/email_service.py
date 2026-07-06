from sqlalchemy.orm import Session
import uuid
from datetime import datetime

from app.modules.email.email_model import Email

from app.modules.email.email_ai_service import (
    email_ai_service,
)


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
    def analyze_email(
        db: Session,
        user_id: int,
        sender: str,
        subject: str,
        email_body: str,
    ) -> Email:

        ai = email_ai_service.analyze_inbox_email(
            email_body,
        )

        suggested = EmailService._format_suggested_responses(
            ai.get("suggestedResponses", {})
        )

        email = Email(
            user_id=user_id,
            gmail_message_id=str(uuid.uuid4()),
            sender=sender,
            sender_email=sender,
            subject=subject,
            email_body=email_body,

            # ---------------- AI ----------------
            ai_summary=ai.get("summary", ""),
            score=ai.get("score", "Cold"),
            sentiment=ai.get("sentiment", 50),
            intent=ai.get("intent", 50),
            engagement=ai.get("engagement", 50),
            recommended_nudge=ai.get("recommendedNudge", ""),
            suggested_responses=suggested,
        )

        db.add(
            email,
        )

        db.commit()

        db.refresh(
            email,
        )

        return email
    

    @staticmethod
    def analyze_inbox_email(
        email_body: str,
    ) -> dict:

        ai = email_ai_service.analyze_inbox_email(
            email_body,
        )
        print("AI Analysis Result:", ai)  # Debugging line to print the AI analysis result
        
        suggested = EmailService._format_suggested_responses(
            ai.get("suggestedResponses", {})
        )

        return {

            "score": ai["score"],

            "aiSummary": ai["summary"],

            "sentiment": ai["sentiment"],

            "intent": ai["intent"],

            "engagement": ai["engagement"],

            "suggestedResponses": suggested,

            "recommendedNudge": ai[
                "recommendedNudge"
            ],
        }
    # --------------------------------------------------
    # History
    # --------------------------------------------------

    @staticmethod
    def get_history(
        db: Session,
        user_id: int,
    ):

        return (

            db.query(
                Email,
            )

            .filter(
                Email.user_id == user_id,
            )

            .order_by(
                Email.created_at.desc(),
            )

            .all()

        )

    # --------------------------------------------------
    # Leads
    # --------------------------------------------------

    @staticmethod
    def get_leads(
        db: Session,
        user_id: int,
    ):
        return (
            db.query(Email)
            .filter(
                Email.user_id == user_id,
                Email.score.in_(["Hot", "Warm"]),
            )
            .order_by(Email.created_at.desc())
            .all()
        )

    # --------------------------------------------------
    # Hot Leads
    # --------------------------------------------------

    @staticmethod
    def get_hot_leads(
        db: Session,
        user_id: int,
    ):
        return (
            db.query(Email)
            .filter(
                Email.user_id == user_id,
                Email.score == "Hot",
            )
            .order_by(Email.created_at.desc())
            .all()
        )

    # --------------------------------------------------
    # Warm Leads
    # --------------------------------------------------

    @staticmethod
    def get_warm_leads(
        db: Session,
        user_id: int,
    ):
        return (
            db.query(Email)
            .filter(
                Email.user_id == user_id,
                Email.score == "Warm",
            )
            .order_by(Email.created_at.desc())
            .all()
        )

    # --------------------------------------------------
    # Cold Leads
    # --------------------------------------------------

    @staticmethod
    def get_cold_leads(
        db: Session,
        user_id: int,
    ):
        return (
            db.query(Email)
            .filter(
                Email.user_id == user_id,
                Email.score == "Cold",
            )
            .order_by(Email.created_at.desc())
            .all()
        )

    # --------------------------------------------------
    # Draft Email
    # --------------------------------------------------

    @staticmethod
    def draft_email(
        prompt: str,
        contextText: str = None,
    ):

        return email_ai_service.draft_email(
            prompt,
            contextText,
        )

    # --------------------------------------------------
    # Rewrite Email
    # --------------------------------------------------

    @staticmethod
    def rewrite_email(
        email: str,
        tone: str,
    ):

        return email_ai_service.rewrite_email(
            email,
            tone,
        )

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