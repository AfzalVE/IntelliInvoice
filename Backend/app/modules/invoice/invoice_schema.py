from datetime import date, datetime
from typing import Any

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


# --------------------------------------------------
# Line Item
# --------------------------------------------------

class LineItem(BaseModel):

    description: str | None = None

    quantity: float | None = None

    unit_price: float | None = None

    amount: float | None = None


# --------------------------------------------------
# Create Invoice Request (BA Team Upload)
# --------------------------------------------------

class InvoiceCreateRequest(BaseModel):

    vendor: str | None = Field(default=None, max_length=255)

    invoice_number: str | None = Field(default=None, max_length=100)

    po_number: str | None = Field(default=None, max_length=100)

    invoice_date: date | None = None

    due_date: date | None = None

    tax: float | None = None

    total_amount: float | None = None

    currency: str | None = Field(default="$", max_length=10)

    line_items: list[LineItem] = Field(default_factory=list)

    attachment_name: str | None = None


# --------------------------------------------------
# Update Invoice Request (BA Team)
# --------------------------------------------------

class InvoiceUpdateRequest(BaseModel):

    vendor: str | None = Field(
        default=None,
        max_length=255,
    )

    invoice_number: str | None = Field(
        default=None,
        max_length=100,
    )

    po_number: str | None = Field(
        default=None,
        max_length=100,
    )

    invoice_date: date | None = None

    due_date: date | None = None

    tax: float | None = None

    total_amount: float | None = None

    currency: str | None = Field(
        default=None,
        max_length=10,
    )

    line_items: list[LineItem] = Field(
        default_factory=list,
    )

    ba_comments: str | None = None


# --------------------------------------------------
# BA Submit
# --------------------------------------------------

class InvoiceSubmitRequest(BaseModel):

    comments: str | None = None


# --------------------------------------------------
# Department Head Approval
# --------------------------------------------------

class ApprovalCommentRequest(BaseModel):

    comments: str = Field(
        ...,
        min_length=1,
    )


# --------------------------------------------------
# Finance Comment Request (BMS Entry Notes)
# --------------------------------------------------

class FinanceCommentRequest(BaseModel):

    comments: str = Field(
        ...,
        min_length=1,
    )


# --------------------------------------------------
# Department Head Approval With Signature
# --------------------------------------------------

class InvoiceApproveRequest(BaseModel):

    comments: str | None = None

    signature_base64: str | None = None

    signature_id: int | None = None


# --------------------------------------------------
# Invoice Response
# --------------------------------------------------

class InvoiceResponse(BaseModel):

    id: int

    user_id: int

    gmail_message_id: str | None

    vendor: str | None

    invoice_number: str | None

    po_number: str | None

    invoice_date: date | None

    due_date: date | None

    tax: float | None

    total_amount: float | None

    currency: str | None

    line_items: list[LineItem]

    attachment_name: str | None

    attachment_path: str | None

    ba_comments: str | None = None

    approver_comments: str | None = None

    finance_comments: str | None = None

    approval_pdf: str | None = None

    signed_pdf: str | None = None

    status: str

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


# --------------------------------------------------
# Invoice List Response
# --------------------------------------------------

class InvoiceListResponse(BaseModel):

    success: bool

    count: int

    invoices: list[InvoiceResponse]


# --------------------------------------------------
# Single Invoice Response
# --------------------------------------------------

class InvoiceDetailResponse(BaseModel):

    success: bool

    invoice: InvoiceResponse


# --------------------------------------------------
# Signature Schemas
# --------------------------------------------------

class SignatureSaveRequest(BaseModel):

    signature_base64: str

    label: str | None = None


class SignatureResponse(BaseModel):

    id: int

    label: str

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class SignatureListResponse(BaseModel):

    success: bool

    count: int

    signatures: list[SignatureResponse]