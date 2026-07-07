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
        status_filter: list[str] | None = None,
    ):
        """
        Return invoices optionally filtered by status list.
        E.g. status_filter=["Submitted"] for ADMIN, ["Approved"] for FINANCE.
        """
        query = db.query(Invoice)

        if status_filter:
            query = query.filter(Invoice.status.in_(status_filter))

        return query.order_by(Invoice.created_at.desc()).all()

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
        print(f"Retrieved invoice: {invoice}")  # Debugging line

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

        # Regenerate approval PDF if it has already been generated
        if invoice.approval_pdf:
            from app.modules.invoice.pdf_generator import generate_invoice_pdf
            try:
                invoice.approval_pdf = generate_invoice_pdf(invoice)
                db.commit()
                db.refresh(invoice)
            except Exception as e:
                print("Error regenerating approval PDF on update:", e)

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
        invoice.ba_comments = "Approved"

        invoice.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(invoice)

        # Generate the approval PDF after commit so all fields are final
        from app.modules.invoice.pdf_generator import generate_invoice_pdf

        pdf_path = generate_invoice_pdf(invoice)
        invoice.approval_pdf = pdf_path
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

        invoice.approver_comments = comments

        invoice.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(invoice)

        # Regenerate signed PDF if it already exists
        if invoice.signed_pdf:
            from app.modules.invoice.pdf_generator import generate_invoice_pdf
            from pathlib import Path
            sig_dir = Path(__file__).resolve().parents[3] / "signatures"
            sig_path = sig_dir / f"signature_{invoice_id}.png"
            sig_path_str = str(sig_path) if sig_path.exists() else None
            try:
                invoice.signed_pdf = generate_invoice_pdf(invoice, signature_path=sig_path_str)
                db.commit()
                db.refresh(invoice)
            except Exception as e:
                print("Error regenerating signed PDF on comment:", e)

        return invoice

    # ---------------------------------------------------------
    # Approve Invoice
    # ---------------------------------------------------------

    @staticmethod
    def approve_invoice(
        db: Session,
        invoice_id: int,
        comments: str | None = None,
        signature_base64: str | None = None,
        signature_id: int | None = None,
    ) -> Invoice:
        import base64
        from pathlib import Path

        invoice = InvoiceService.get_invoice(
            db,
            invoice_id,
        )

        invoice.status = "Approved"
        if comments:
            invoice.approver_comments = comments

        invoice.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(invoice)

        # Resolve signature path
        sig_path_str = None

        # Option 1: Reuse a previously saved signature
        if signature_id:
            from app.modules.invoice.signature_service import SignatureService
            try:
                saved_sig = SignatureService.get_signature(db, signature_id)
                sig_path_str = saved_sig.image_path
            except Exception as e:
                print("Error loading saved signature:", e)

        # Option 2: New signature drawn on canvas
        elif signature_base64:
            try:
                if "," in signature_base64:
                    header, base64_data = signature_base64.split(",", 1)
                else:
                    base64_data = signature_base64

                sig_bytes = base64.b64decode(base64_data)

                sig_dir = Path(__file__).resolve().parents[3] / "signatures"
                sig_dir.mkdir(parents=True, exist_ok=True)
                sig_path = sig_dir / f"signature_{invoice_id}.png"
                with open(sig_path, "wb") as f:
                    f.write(sig_bytes)
                sig_path_str = str(sig_path)

                # Auto-save the new signature for future reuse
                from app.modules.invoice.signature_service import SignatureService
                try:
                    SignatureService.save_signature(
                        db,
                        base64_data=signature_base64,
                    )
                except Exception as save_err:
                    print("Error auto-saving signature for reuse:", save_err)

            except Exception as e:
                print("Error saving signature base64:", e)

        # Generate signed PDF
        from app.modules.invoice.pdf_generator import generate_invoice_pdf
        try:
            signed_pdf_path = generate_invoice_pdf(invoice, signature_path=sig_path_str)
            invoice.signed_pdf = signed_pdf_path
            invoice.updated_at = datetime.utcnow()
            db.commit()
            db.refresh(invoice)
        except Exception as e:
            print("Error generating signed PDF:", e)

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

            invoice.approver_comments = comments

        invoice.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(invoice)

        return invoice

    # ---------------------------------------------------------
    # Finance Comment (BMS entry notes)
    # ---------------------------------------------------------

    @staticmethod
    def add_finance_comment(
        db: Session,
        invoice_id: int,
        comments: str,
    ) -> Invoice:

        invoice = InvoiceService.get_invoice(db, invoice_id)

        invoice.finance_comments = comments
        invoice.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(invoice)

        # Regenerate signed PDF if it exists to include finance comments
        if invoice.signed_pdf:
            from app.modules.invoice.pdf_generator import generate_invoice_pdf
            from pathlib import Path
            sig_dir = Path(__file__).resolve().parents[3] / "signatures"
            sig_path = sig_dir / f"signature_{invoice_id}.png"
            sig_path_str = str(sig_path) if sig_path.exists() else None
            try:
                invoice.signed_pdf = generate_invoice_pdf(invoice, signature_path=sig_path_str)
                db.commit()
                db.refresh(invoice)
            except Exception as e:
                print("Error regenerating signed PDF on finance comment:", e)

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