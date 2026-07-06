from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.auth.dependencies import get_current_user

from app.modules.email.email_schema import (
    AnalyzeEmailRequest,
    EmailResponse,
    DraftEmailRequest,
    RewriteEmailRequest,
)

from app.modules.email.email_service import (
    email_service,
)


router = APIRouter(
    prefix="/email",
    tags=["Email Intelligence"],
)


@router.post("/analyze")
def analyze_email(
    request: AnalyzeEmailRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:

        email = email_service.analyze_email(
            db=db,
            user_id=current_user.id,
            email_body=request.email,
            sender=request.sender,
            subject=request.subject,
        )

        return {
            "success": True,
            "message": "Email analyzed successfully.",
            "data": email,
        }

    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


@router.get(
    "/history",
    response_model=list[EmailResponse],
)
def email_history(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    return email_service.get_user_email_history(
        db=db,
        user_id=current_user.id,
    )


@router.get(
    "/leads",
    response_model=list[EmailResponse],
)
def get_leads(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    return email_service.get_user_leads(
        db=db,
        user_id=current_user.id,
    )


@router.get(
    "/leads/hot",
    response_model=list[EmailResponse],
)
def get_hot_leads(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    return email_service.get_hot_leads(
        db=db,
        user_id=current_user.id,
    )


@router.get(
    "/leads/warm",
    response_model=list[EmailResponse],
)
def get_warm_leads(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    return email_service.get_warm_leads(
        db=db,
        user_id=current_user.id,
    )


@router.get(
    "/leads/cold",
    response_model=list[EmailResponse],
)
def get_cold_leads(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    return email_service.get_cold_leads(
        db=db,
        user_id=current_user.id,
    )


@router.post("/draft")
def draft_email(
    request: DraftEmailRequest,
    current_user=Depends(get_current_user),
):
    try:
        res = email_service.draft_email(
            prompt=request.prompt,
            contextText=request.contextText,
        )
        return {
            "success": True,
            "draft": res.get("body", ""),
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


@router.post("/rewrite")
def rewrite_email(
    request: RewriteEmailRequest,
    current_user=Depends(get_current_user),
):
    try:
        res = email_service.rewrite_email(
            email=request.email,
            tone=request.tone,
        )
        return {
            "success": True,
            "rewrite": res.get("body", ""),
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )