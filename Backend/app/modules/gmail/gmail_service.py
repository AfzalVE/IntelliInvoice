import os
import base64
import re
from datetime import datetime
from sqlalchemy.orm import Session

from app.modules.user.user_model import User
from app.modules.email.email_model import Email
from bs4 import BeautifulSoup
from app.modules.gmail.gmail_client import (
    GmailClient,
)
from app.modules.gmail.gmail_mapper import (
    GmailMapper,
)
from sqlalchemy.orm import Session

from app.modules.user.user_model import User

from app.modules.email.email_service import (
    email_service,
)
from app.modules.invoice.invoice_extraction_service import (
    InvoiceExtractionService,
)
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build

from app.core.config import settings


SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
]


class GmailService:

    @staticmethod
    def get_auth_flow(
        redirect_uri: str,
    ) -> Flow:
        """
        Builds the Google OAuth flow using environment variables.
        """

        client_config = {
            "web": {
                "client_id": settings.GOOGLE_CLIENT_ID,
                "project_id": settings.GOOGLE_PROJECT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "auth_uri": os.getenv(
                    "GOOGLE_AUTH_URI",
                    "https://accounts.google.com/o/oauth2/auth",
                ),
                "token_uri": os.getenv(
                    "GOOGLE_TOKEN_URI",
                    "https://oauth2.googleapis.com/token",
                ),
                "auth_provider_x509_cert_url": os.getenv(
                    "GOOGLE_AUTH_PROVIDER_CERT_URL",
                    "https://www.googleapis.com/oauth2/v1/certs",
                ),
            }
        }

        return Flow.from_client_config(
            client_config=client_config,
            scopes=SCOPES,
            redirect_uri=redirect_uri,
        )

    @staticmethod
    def get_user_profile(creds):
        """
        Returns the Gmail profile for the authenticated user.
        """

        service = build(
            "gmail",
            "v1",
            credentials=creds,
        )

        profile = (
            service.users()
            .getProfile(userId="me")
            .execute()
        )

        return {
            "email": profile.get("emailAddress"),
            "messagesTotal": profile.get("messagesTotal"),
            "threadsTotal": profile.get("threadsTotal"),
            "historyId": profile.get("historyId"),
        }





    @staticmethod
    def fetch_recent_emails(
        db: Session,
        user: User,
        creds,
        max_results: int = 10,
    ):
        """
        Fetch recent Gmail emails.

        If an email contains invoice attachments,
        download and extract them into the Invoice table.

        Returns only email details to the frontend.
        """

        service = GmailClient(creds)

        messages = service.list_messages(
            max_results=max_results,
        )

        emails = []
        print(emails)
        for message in messages:

            gmail_email = GmailMapper.map_message(
                service,
                message["id"],
            )

            # ----------------------------------------
            # Extract invoice attachments
            # ----------------------------------------

            if gmail_email["hasAttachments"]:

                for attachment in gmail_email["attachments"]:

                    try:

                        InvoiceExtractionService.extract_from_gmail_attachment(
                                db=db,
                                gmail_client=service,
                                message_id=gmail_email["id"],
                                attachment=attachment,
                                user_id=user.id,
                                source_email=gmail_email["senderEmail"],
)
                    except Exception as e:

                        print(
                            f"Invoice extraction failed: {e}"
                        )

            # ----------------------------------------
            # Frontend response
            # ----------------------------------------

            emails.append(
                {
                    "id": gmail_email["id"],
                    "sender": gmail_email["sender"],
                    "senderEmail": gmail_email["senderEmail"],
                    "subject": gmail_email["subject"],
                    "body": gmail_email["body"],
                    "receivedAt": gmail_email["receivedAt"],
                    "attachments": gmail_email["attachments"],
                    "hasAttachments": gmail_email["hasAttachments"],
                    "isRead": gmail_email["isRead"],
                }
            )

        return emails
    @staticmethod
    def send_email(
        creds,
        to: str,
        subject: str,
        body: str,
    ) -> dict:
        """
        Send an email via Google Gmail API.
        """
        client = GmailClient(creds)
        return client.send_message(
            to=to,
            subject=subject,
            body=body,
        )