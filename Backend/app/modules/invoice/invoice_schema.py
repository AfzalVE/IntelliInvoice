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