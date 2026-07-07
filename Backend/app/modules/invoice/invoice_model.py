from datetime import date, datetime

from sqlalchemy import (
    JSON,
    Float,
    Integer,
    String,
    Date,
    DateTime,
    ForeignKey,
    Text,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.core.database import Base


class Invoice(Base):

    __tablename__ = "invoices"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    gmail_message_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
        index=True,
    )

    vendor: Mapped[str | None] = mapped_column(
        String(255),
    )

    invoice_number: Mapped[str | None] = mapped_column(
        String(100),
        index=True,
    )

    po_number: Mapped[str | None] = mapped_column(
        String(100),
    )

    invoice_date: Mapped[date | None] = mapped_column(
        Date,
    )

    due_date: Mapped[date | None] = mapped_column(
        Date,
    )

    tax: Mapped[float | None] = mapped_column(
        Float,
    )

    total_amount: Mapped[float | None] = mapped_column(
        Float,
    )

    currency: Mapped[str | None] = mapped_column(
        String(10),
    )

    line_items: Mapped[list] = mapped_column(
        JSON,
        default=list,
    )

    attachment_name: Mapped[str | None] = mapped_column(
        String(255),
    )

    attachment_path: Mapped[str | None] = mapped_column(
        Text,
    )

    extracted_text: Mapped[str | None] = mapped_column(
        Text,
    )

    ba_comments: Mapped[str | None] = mapped_column(
        Text,
    )

    approver_comments: Mapped[str | None] = mapped_column(
        Text,
    )

    finance_comments: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    approval_pdf: Mapped[str | None] = mapped_column(
        Text,
    )

    signed_pdf: Mapped[str | None] = mapped_column(
        Text,
    )

    status: Mapped[str] = mapped_column(
        String(40),
        default="EXTRACTED",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    source_email: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    user = relationship("User")