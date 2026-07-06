from pathlib import Path
import hashlib
import shutil

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.modules.knowledge.knowledge_model import KnowledgeDocument
from rag.pipeline import RAGPipeline


class KnowledgeService:

    def __init__(self):

        self.rag = RAGPipeline()

    def upload_document(

        self,

        db: Session,

        user_id: int,

        file: UploadFile,

    ):

        upload_dir = Path("uploads")

        upload_dir.mkdir(
            exist_ok=True
        )

        content = file.file.read()

        file_hash = hashlib.sha256(
            content
        ).hexdigest()

        existing = (

            db.query(KnowledgeDocument)

            .filter(

                KnowledgeDocument.file_hash == file_hash

            )

            .first()

        )

        if existing:

            return existing

        filename = f"{file_hash}_{file.filename}"

        save_path = upload_dir / filename

        with open(save_path, "wb") as f:

            f.write(content)

        chunks = self.rag.ingest_document(
            save_path
        )

        document = KnowledgeDocument(

            user_id=user_id,

            file_name=filename,

            original_name=file.filename,

            file_type=file.content_type,

            file_size=len(content),

            file_hash=file_hash,

            storage_path=str(save_path),

            chunks=chunks,

            status="indexed",

        )

        db.add(document)

        db.commit()

        db.refresh(document)

        return document

    def list_documents(

    self,

    db: Session,

    user_id: int,

):

        return (

            db.query(KnowledgeDocument)

            .filter(

                KnowledgeDocument.user_id == user_id

            )

            .order_by(

                KnowledgeDocument.created_at.desc()

            )

            .all()

        )
    def delete_document(

    self,

    db: Session,

    document_id: int,

):

        document = (

            db.query(KnowledgeDocument)

            .filter(

                KnowledgeDocument.id == document_id

            )

            .first()

        )

        if not document:

            return None

        Path(document.storage_path).unlink(
            missing_ok=True
        )

        db.delete(document)

        db.commit()

        return True