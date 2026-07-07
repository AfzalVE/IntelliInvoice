"""
Invoice routes with full RBAC.

Role-based access:
  BA     – edit invoices, submit (BA-approve), download approval_pdf
  ADMIN  – comment, approve, reject, download signed_pdf
  FINANCE – add finance/BMS comments, download signed_pdf
  ALL    – GET invoice list (filtered by role), GET single invoice
"""

import os

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.auth.dependencies import get_current_user, require_role
from app.modules.user.user_model import User
from app.modules.invoice.invoice_schema import (
    InvoiceCreateRequest,
    InvoiceUpdateRequest,
    InvoiceSubmitRequest,
    ApprovalCommentRequest,
    FinanceCommentRequest,
    InvoiceApproveRequest,
    InvoiceDetailResponse,
    InvoiceListResponse,
)
from app.modules.invoice.invoice_service import InvoiceService


router = APIRouter(
    prefix="/invoice",
    tags=["Invoice"],
)


# ---------------------------------------------------------------------------
# GET /invoice  — each role sees a filtered view
# ---------------------------------------------------------------------------

@router.get("/", response_model=InvoiceListResponse)
def get_all_invoices(
    view: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    role = current_user.role.upper()

    # If view == "all" (e.g., Dashboard stats), return all invoices across roles
    if view == "all":
        invoices = InvoiceService.get_all_invoices(db)
    # BA sees everything they can work on (Draft + Submitted + Rejected)
    elif role == "BA":
        invoices = InvoiceService.get_all_invoices(db)
    # Admin sees only Submitted (pending their approval)
    elif role == "ADMIN":
        invoices = InvoiceService.get_all_invoices(db, status_filter=["Submitted"])
    # Finance sees only fully Approved invoices
    elif role == "FINANCE":
        invoices = InvoiceService.get_all_invoices(db, status_filter=["Approved"])
    else:
        invoices = InvoiceService.get_all_invoices(db)

    return {
        "success": True,
        "count": len(invoices),
        "invoices": invoices,
    }


# ---------------------------------------------------------------------------
# GET /invoice/{id}
# ---------------------------------------------------------------------------

@router.get("/{invoice_id}", response_model=InvoiceDetailResponse)
def get_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    invoice = InvoiceService.get_invoice(db, invoice_id)
    return {"success": True, "invoice": invoice}


# ---------------------------------------------------------------------------
# POST /invoice — BA only (manual creation / upload)
# ---------------------------------------------------------------------------

@router.post("/", response_model=InvoiceDetailResponse)
def create_invoice(
    request: InvoiceCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("BA")),
):
    from datetime import datetime
    invoice = InvoiceService.create_invoice(
        db,
        vendor=request.vendor or "New Vendor",
        invoice_number=request.invoice_number or f"INV-{int(datetime.utcnow().timestamp())}",
        po_number=request.po_number,
        invoice_date=request.invoice_date,
        due_date=request.due_date,
        tax=request.tax or 0.0,
        total_amount=request.total_amount or 0.0,
        currency=request.currency or "$",
        line_items=[item.model_dump() for item in request.line_items] if request.line_items else [],
        attachment_name=request.attachment_name or "uploaded_invoice.pdf",
    )
    return {"success": True, "invoice": invoice}


# ---------------------------------------------------------------------------
# PUT /invoice/{id} — BA only
# ---------------------------------------------------------------------------

@router.put("/{invoice_id}", response_model=InvoiceDetailResponse)
def update_invoice(
    invoice_id: int,
    request: InvoiceUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("BA")),
):
    invoice = InvoiceService.update_invoice(db, invoice_id, request)
    return {"success": True, "invoice": invoice}


# ---------------------------------------------------------------------------
# POST /invoice/{id}/submit — BA only (BA approves + generates BA PDF)
# ---------------------------------------------------------------------------

@router.post("/{invoice_id}/submit", response_model=InvoiceDetailResponse)
def submit_invoice(
    invoice_id: int,
    request: InvoiceSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("BA")),
):
    invoice = InvoiceService.submit_invoice(db, invoice_id)
    return {"success": True, "invoice": invoice}


# ---------------------------------------------------------------------------
# GET /invoice/{id}/download-pdf — role-aware
#   BA  → approval_pdf  (their edited version)
#   ADMIN / FINANCE → signed_pdf  (admin-signed final)
# ---------------------------------------------------------------------------

@router.get("/{invoice_id}/download-pdf")
def download_invoice_pdf(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    invoice = InvoiceService.get_invoice(db, invoice_id)
    role = current_user.role.upper()

    if role == "BA":
        pdf_path = invoice.approval_pdf
        filename = f"invoice_{invoice_id}_ba_approved.pdf"
        if not pdf_path or not os.path.isfile(pdf_path):
            raise HTTPException(
                status_code=404,
                detail="BA approval PDF not found. Please submit the invoice first.",
            )
    else:
        # ADMIN and FINANCE get the signed PDF
        pdf_path = invoice.signed_pdf or invoice.approval_pdf
        filename = f"invoice_{invoice_id}_signed.pdf"
        if not pdf_path or not os.path.isfile(pdf_path):
            raise HTTPException(
                status_code=404,
                detail="Signed PDF not found. Please ensure the invoice has been approved.",
            )

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=filename,
        headers={"Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"},
    )


# ---------------------------------------------------------------------------
# POST /invoice/{id}/comment — ADMIN only
# ---------------------------------------------------------------------------

@router.post("/{invoice_id}/comment", response_model=InvoiceDetailResponse)
def add_comment(
    invoice_id: int,
    request: ApprovalCommentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN")),
):
    invoice = InvoiceService.add_comment(db, invoice_id, request.comments)
    return {"success": True, "invoice": invoice}


# ---------------------------------------------------------------------------
# POST /invoice/{id}/approve — ADMIN only
# ---------------------------------------------------------------------------

@router.post("/{invoice_id}/approve", response_model=InvoiceDetailResponse)
def approve_invoice(
    invoice_id: int,
    request: InvoiceApproveRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN")),
):
    invoice = InvoiceService.approve_invoice(
        db,
        invoice_id,
        comments=request.comments,
        signature_base64=request.signature_base64,
        signature_id=request.signature_id,
    )
    return {"success": True, "invoice": invoice}


# ---------------------------------------------------------------------------
# POST /invoice/{id}/reject — ADMIN only
# ---------------------------------------------------------------------------

@router.post("/{invoice_id}/reject", response_model=InvoiceDetailResponse)
def reject_invoice(
    invoice_id: int,
    request: ApprovalCommentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN")),
):
    invoice = InvoiceService.reject_invoice(db, invoice_id, request.comments)
    return {"success": True, "invoice": invoice}


# ---------------------------------------------------------------------------
# POST /invoice/{id}/finance-comment — FINANCE only
# ---------------------------------------------------------------------------

@router.post("/{invoice_id}/finance-comment", response_model=InvoiceDetailResponse)
def add_finance_comment(
    invoice_id: int,
    request: FinanceCommentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("FINANCE")),
):
    """Finance team adds BMS entry notes to an approved invoice."""
    invoice = InvoiceService.add_finance_comment(db, invoice_id, request.comments)
    return {"success": True, "invoice": invoice}


# ---------------------------------------------------------------------------
# DELETE /invoice/{id} — BA only
# ---------------------------------------------------------------------------

@router.delete("/{invoice_id}")
def delete_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("BA")),
):
    return InvoiceService.delete_invoice(db, invoice_id)