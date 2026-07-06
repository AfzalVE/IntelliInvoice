from datetime import datetime

from pydantic import BaseModel


class KnowledgeResponse(BaseModel):

    id: int

    file_name: str

    original_name: str

    file_type: str

    file_size: int

    chunks: int

    status: str

    created_at: datetime

    class Config:

        from_attributes = True

from pydantic import BaseModel


class UploadKnowledgeResponse(BaseModel):

    success: bool

    message: str

    document: KnowledgeResponse

from pydantic import BaseModel


class KnowledgeSearchRequest(BaseModel):

    query: str

    top_k: int = 5

from pydantic import BaseModel


class SearchResult(BaseModel):

    score: float

    source: str

    page: int

    text: str