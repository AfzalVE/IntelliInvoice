from app.modules.invoice.invoice_model import Invoice
from app.modules.invoice.invoice_parser import InvoiceParser
from app.modules.invoice.invoice_text_extractor import InvoiceTextExtractor


class InvoiceExtractionService:

    @staticmethod
    def extract_invoice(
        db,
        file_path,
        source_email=None,
    ):

        text = InvoiceTextExtractor.extract(
            file_path,
        )

        data = InvoiceParser.parse(text)

        invoice = Invoice(
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
            attachment_name=file_path.split("/")[-1],
            extracted_text=text,
            status="Draft",
        )

        db.add(invoice)

        db.commit()

        db.refresh(invoice)

        return invoice