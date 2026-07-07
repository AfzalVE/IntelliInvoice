from datetime import datetime

from sqlalchemy import (
    Integer,
    String,
    DateTime,
    Text,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)

from app.core.database import Base


class Signature(Base):

    __tablename__ = "signatures"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    label: Mapped[str] = mapped_column(
        String(100),
        default="Signature",
    )

    image_path: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )
