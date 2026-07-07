import os

from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.invoice.invoice_schema import (
    SignatureSaveRequest,
    SignatureResponse,
    SignatureListResponse,
)
from app.modules.invoice.signature_service import SignatureService


router = APIRouter(
    prefix="/signatures",
    tags=["Signatures"],
)


@router.get(
    "/",
    response_model=SignatureListResponse,
)
def list_signatures(
    db: Session = Depends(get_db),
):
    signatures = SignatureService.get_all_signatures(db)

    return {
        "success": True,
        "count": len(signatures),
        "signatures": signatures,
    }


@router.get(
    "/{signature_id}/image",
)
def get_signature_image(
    signature_id: int,
    db: Session = Depends(get_db),
):
    from fastapi import HTTPException

    signature = SignatureService.get_signature(db, signature_id)

    if not signature.image_path or not os.path.isfile(signature.image_path):
        raise HTTPException(
            status_code=404,
            detail="Signature image file not found on disk.",
        )

    return FileResponse(
        path=signature.image_path,
        media_type="image/png",
        filename=f"signature_{signature_id}.png",
    )


@router.post(
    "/",
    response_model=SignatureResponse,
)
def save_signature(
    request: SignatureSaveRequest,
    db: Session = Depends(get_db),
):
    signature = SignatureService.save_signature(
        db,
        base64_data=request.signature_base64,
        label=request.label,
    )

    return signature


@router.delete(
    "/{signature_id}",
)
def delete_signature(
    signature_id: int,
    db: Session = Depends(get_db),
):
    return SignatureService.delete_signature(db, signature_id)
