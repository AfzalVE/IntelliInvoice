import os
import tempfile

from app.modules.invoice.invoice_model import Invoice
from app.modules.invoice.invoice_parser import InvoiceParser
from app.modules.invoice.invoice_text_extractor import InvoiceTextExtractor


class InvoiceExtractionService:

    SUPPORTED_EXTENSIONS = {
        ".pdf",
        ".png",
        ".jpg",
        ".jpeg",
        ".docx",
    }

    @staticmethod
    def extract_from_gmail_attachment(
        db,
        gmail_client,
        message_id: str,
        attachment: dict,
        user_id: int,
        source_email: str | None = None,
    ):
        """
        Download Gmail attachment, extract invoice,
        and save into database.
        """

        filename = attachment["filename"]
        print("Filenme: ",filename)

        extension = os.path.splitext(filename)[1].lower()

        if extension not in InvoiceExtractionService.SUPPORTED_EXTENSIONS:
            return None

        # Prevent duplicate extraction
        existing = (
            db.query(Invoice)
            .filter(
                Invoice.gmail_message_id == message_id,
                Invoice.attachment_name == filename,
            )
            .first()
        )
        print("Existing: ",existing)
        if existing:
            return existing

        attachment_bytes = gmail_client.download_attachment(
            message_id=message_id,
            attachment_id=attachment["attachmentId"],
        )
        print("Attachment Bytes: ",attachment_bytes)
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=extension,
        ) as temp:

            temp.write(attachment_bytes)
            temp_path = temp.name

        try:

            text = InvoiceTextExtractor.extract(temp_path)
            print(text)

            data = InvoiceParser.parse(text)
            print(data)
            invoice = Invoice(
                user_id=user_id,
                gmail_message_id=message_id,
                vendor=data["vendor"],
                invoice_number=data["invoice_number"],
                po_number=data["po_number"],
                invoice_date=data["invoice_date"],
                due_date=data["due_date"],
                tax=data["tax"],
                total_amount=data["total_amount"],
                currency=data["currency"],
                line_items=data["line_items"],
                source_email=source_email,
                attachment_name=filename,
                attachment_path=temp_path,
                extracted_text=text,
                status="Draft",
            )

            db.add(invoice)
            db.commit()
            db.refresh(invoice)

            return invoice

        finally:

            if os.path.exists(temp_path):
                os.remove(temp_path)