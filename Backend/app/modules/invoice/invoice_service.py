from datetime import datetime

from sqlalchemy.orm import Session

from fastapi import HTTPException

from app.modules.invoice.invoice_model import Invoice
from app.modules.invoice.invoice_schema import InvoiceUpdateRequest


class InvoiceService:

    # ---------------------------------------------------------
    # Create Invoice
    # ---------------------------------------------------------

    @staticmethod
    def create_invoice(
        db: Session,
        *,
        vendor: str | None = None,
        invoice_number: str | None = None,
        po_number: str | None = None,
        invoice_date=None,
        due_date=None,
        tax: float | None = None,
        total_amount: float | None = None,
        currency: str | None = None,
        line_items: list | None = None,
        source_email: str | None = None,
        attachment_name: str | None = None,
    ) -> Invoice:

        invoice = Invoice(
            
            vendor=vendor,
            invoice_number=invoice_number,
            po_number=po_number,
            invoice_date=invoice_date,
            due_date=due_date,
            tax=tax,
            total_amount=total_amount,
            currency=currency,
            line_items=line_items or [],
            source_email=source_email,
            attachment_name=attachment_name,
            status="Draft",
        )

        db.add(invoice)
        db.commit()
        db.refresh(invoice)

        return invoice

    # ---------------------------------------------------------
    # Get All
    # ---------------------------------------------------------

    @staticmethod
    def get_all_invoices(
        db: Session,
    ):

        return (
            db.query(Invoice)
            .order_by(
                Invoice.created_at.desc(),
            )
            .all()
        )

    # ---------------------------------------------------------
    # Get By ID
    # ---------------------------------------------------------

    @staticmethod
    def get_invoice(
        db: Session,
        invoice_id: int,
    ) -> Invoice:

        invoice = (
            db.query(Invoice)
            .filter(
                Invoice.id == invoice_id,
            )
            .first()
        )

        if not invoice:

            raise HTTPException(
                status_code=404,
                detail="Invoice not found.",
            )

        return invoice

    # ---------------------------------------------------------
    # Update Invoice
    # ---------------------------------------------------------

    @staticmethod
    def update_invoice(
        db: Session,
        invoice_id: int,
        request: InvoiceUpdateRequest,
    ) -> Invoice:

        invoice = InvoiceService.get_invoice(
            db,
            invoice_id,
        )

        update_data = request.model_dump(
            exclude_unset=True,
        )

        for key, value in update_data.items():

            setattr(
                invoice,
                key,
                value,
            )

        invoice.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(invoice)

        return invoice

    # ---------------------------------------------------------
    # Submit Invoice (BA Team)
    # ---------------------------------------------------------

    @staticmethod
    def submit_invoice(
        db: Session,
        invoice_id: int,
    ) -> Invoice:

        invoice = InvoiceService.get_invoice(
            db,
            invoice_id,
        )

        invoice.status = "Submitted"

        invoice.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(invoice)

        return invoice

    # ---------------------------------------------------------
    # Department Head Comment
    # ---------------------------------------------------------

    @staticmethod
    def add_comment(
        db: Session,
        invoice_id: int,
        comments: str,
    ) -> Invoice:

        invoice = InvoiceService.get_invoice(
            db,
            invoice_id,
        )

        invoice.approval_comments = comments

        invoice.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(invoice)

        return invoice

    # ---------------------------------------------------------
    # Approve Invoice
    # ---------------------------------------------------------

    @staticmethod
    def approve_invoice(
        db: Session,
        invoice_id: int,
        signed_document: str | None = None,
    ) -> Invoice:

        invoice = InvoiceService.get_invoice(
            db,
            invoice_id,
        )

        invoice.status = "Approved"

        invoice.signed_document = signed_document

        invoice.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(invoice)

        return invoice

    # ---------------------------------------------------------
    # Reject Invoice
    # ---------------------------------------------------------

    @staticmethod
    def reject_invoice(
        db: Session,
        invoice_id: int,
        comments: str | None = None,
    ) -> Invoice:

        invoice = InvoiceService.get_invoice(
            db,
            invoice_id,
        )

        invoice.status = "Rejected"

        if comments:

            invoice.approval_comments = comments

        invoice.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(invoice)

        return invoice

    # ---------------------------------------------------------
    # Delete Invoice
    # ---------------------------------------------------------

    @staticmethod
    def delete_invoice(
        db: Session,
        invoice_id: int,
    ):

        invoice = InvoiceService.get_invoice(
            db,
            invoice_id,
        )

        db.delete(invoice)

        db.commit()

        return {
            "success": True,
            "message": "Invoice deleted successfully.",
        }