import base64
import os
import uuid
from datetime import datetime
from pathlib import Path

from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.modules.invoice.signature_model import Signature


class SignatureService:

    # Directory where signature PNGs are stored
    SIG_DIR = Path(__file__).resolve().parents[3] / "signatures"

    # ---------------------------------------------------------
    # Save a new signature from base64
    # ---------------------------------------------------------

    @staticmethod
    def save_signature(
        db: Session,
        base64_data: str,
        label: str | None = None,
    ) -> Signature:

        # Strip data URI header if present
        if "," in base64_data:
            _, base64_data = base64_data.split(",", 1)

        try:
            sig_bytes = base64.b64decode(base64_data)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid base64 signature data: {e}",
            )

        # Generate unique filename
        SignatureService.SIG_DIR.mkdir(parents=True, exist_ok=True)
        filename = f"saved_sig_{uuid.uuid4().hex[:12]}.png"
        file_path = SignatureService.SIG_DIR / filename

        with open(file_path, "wb") as f:
            f.write(sig_bytes)

        # Auto-generate label if not provided
        if not label:
            count = db.query(Signature).count()
            label = f"Signature #{count + 1}"

        signature = Signature(
            label=label,
            image_path=str(file_path),
            created_at=datetime.utcnow(),
        )

        db.add(signature)
        db.commit()
        db.refresh(signature)

        return signature

    # ---------------------------------------------------------
    # List all saved signatures
    # ---------------------------------------------------------

    @staticmethod
    def get_all_signatures(
        db: Session,
    ) -> list[Signature]:

        return (
            db.query(Signature)
            .order_by(Signature.created_at.desc())
            .all()
        )

    # ---------------------------------------------------------
    # Get a single signature by ID
    # ---------------------------------------------------------

    @staticmethod
    def get_signature(
        db: Session,
        signature_id: int,
    ) -> Signature:

        signature = (
            db.query(Signature)
            .filter(Signature.id == signature_id)
            .first()
        )

        if not signature:
            raise HTTPException(
                status_code=404,
                detail="Signature not found.",
            )

        return signature

    # ---------------------------------------------------------
    # Delete a signature (file + DB row)
    # ---------------------------------------------------------

    @staticmethod
    def delete_signature(
        db: Session,
        signature_id: int,
    ):

        signature = SignatureService.get_signature(db, signature_id)

        # Remove file from disk
        if signature.image_path and os.path.isfile(signature.image_path):
            try:
                os.remove(signature.image_path)
            except OSError:
                pass  # File already gone, not critical

        db.delete(signature)
        db.commit()

        return {
            "success": True,
            "message": "Signature deleted successfully.",
        }
