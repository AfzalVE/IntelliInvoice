from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.invoice.invoice_schema import (
    InvoiceUpdateRequest,
    InvoiceSubmitRequest,
    ApprovalCommentRequest,
    InvoiceDetailResponse,
    InvoiceListResponse,
)
from app.modules.invoice.invoice_service import InvoiceService


router = APIRouter(
    prefix="/invoice",
    tags=["Invoice"],
)


@router.get(
    "/",
    response_model=InvoiceListResponse,
)
def get_all_invoices(
    db: Session = Depends(get_db),
):

    invoices = InvoiceService.get_all_invoices(db)

    return {
        "success": True,
        "count": len(invoices),
        "invoices": invoices,
    }


@router.get(
    "/{invoice_id}",
    response_model=InvoiceDetailResponse,
)
def get_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
):

    invoice = InvoiceService.get_invoice(
        db,
        invoice_id,
    )

    return {
        "success": True,
        "invoice": invoice,
    }


@router.put(
    "/{invoice_id}",
    response_model=InvoiceDetailResponse,
)
def update_invoice(
    invoice_id: int,
    request: InvoiceUpdateRequest,
    db: Session = Depends(get_db),
):

    invoice = InvoiceService.update_invoice(
        db,
        invoice_id,
        request,
    )

    return {
        "success": True,
        "invoice": invoice,
    }


@router.post(
    "/{invoice_id}/submit",
    response_model=InvoiceDetailResponse,
)
def submit_invoice(
    invoice_id: int,
    request: InvoiceSubmitRequest,
    db: Session = Depends(get_db),
):

    invoice = InvoiceService.submit_invoice(
        db,
        invoice_id,
    )

    return {
        "success": True,
        "invoice": invoice,
    }


@router.post(
    "/{invoice_id}/comment",
    response_model=InvoiceDetailResponse,
)
def add_comment(
    invoice_id: int,
    request: ApprovalCommentRequest,
    db: Session = Depends(get_db),
):

    invoice = InvoiceService.add_comment(
        db,
        invoice_id,
        request.comments,
    )

    return {
        "success": True,
        "invoice": invoice,
    }


@router.post(
    "/{invoice_id}/approve",
    response_model=InvoiceDetailResponse,
)
def approve_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
):

    invoice = InvoiceService.approve_invoice(
        db,
        invoice_id,
    )

    return {
        "success": True,
        "invoice": invoice,
    }


@router.post(
    "/{invoice_id}/reject",
    response_model=InvoiceDetailResponse,
)
def reject_invoice(
    invoice_id: int,
    request: ApprovalCommentRequest,
    db: Session = Depends(get_db),
):

    invoice = InvoiceService.reject_invoice(
        db,
        invoice_id,
        request.comments,
    )

    return {
        "success": True,
        "invoice": invoice,
    }


@router.delete(
    "/{invoice_id}",
)
def delete_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
):

    return InvoiceService.delete_invoice(
        db,
        invoice_id,
    )