"""
retriever.py

Production Retriever

Responsibilities
----------------
- Embed user query
- Search FAISS
- Return ranked chunks
- Build prompt context
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import List

from rag.embedding import EmbeddingService
from rag.faiss_store import FaissVectorStore
from rag.loader import DocumentChunk


@dataclass
class RetrievedChunk:
    """
    Represents one retrieved document chunk.
    """

    score: float
    text: str
    source: str
    page: int
    chunk: int


class Retriever:
    """
    High-level retrieval service.

    This class hides all FAISS implementation details.
    """

    def __init__(
        self,
        embedder: EmbeddingService,
        vector_store: FaissVectorStore,
    ):
        self.embedder = embedder
        self.vector_store = vector_store

    def retrieve(
        self,
        query: str,
        top_k: int = 5,
        minimum_score: float = 0.30,
    ) -> List[RetrievedChunk]:
        """
        Retrieve the most relevant chunks.
        """

        embedding = self.embedder.embed_text(query)

        results = self.vector_store.search(
            embedding,
            top_k=top_k,
        )

        retrieved: List[RetrievedChunk] = []

        for result in results:

            score = result["score"]
            chunk: DocumentChunk = result["chunk"]

            if score < minimum_score:
                continue

            retrieved.append(
                RetrievedChunk(
                    score=score,
                    text=chunk.text,
                    source=chunk.source,
                    page=chunk.page,
                    chunk=chunk.chunk,
                )
            )

        return retrieved

    def build_context(
        self,
        query: str,
        top_k: int = 5,
        minimum_score: float = 0.30,
    ) -> str:
        """
        Build a formatted context block
        that can be injected directly
        into the LLM prompt.
        """

        chunks = self.retrieve(
            query=query,
            top_k=top_k,
            minimum_score=minimum_score,
        )

        if not chunks:
            return "No relevant company knowledge found."

        context = []

        for index, chunk in enumerate(chunks, start=1):

            context.append(
                (
                    f"[Document {index}]\n"
                    f"Source: {chunk.source}\n"
                    f"Page: {chunk.page}\n\n"
                    f"{chunk.text}"
                )
            )

        return "\n\n-------------------------\n\n".join(
            context
        )

    def retrieve_sources(
        self,
        query: str,
        top_k: int = 5,
    ) -> List[str]:
        """
        Returns unique source filenames.
        Useful for citations/debugging.
        """

        chunks = self.retrieve(
            query=query,
            top_k=top_k,
        )

        sources = []

        for chunk in chunks:

            if chunk.source not in sources:
                sources.append(chunk.source)

        return sources

    def retrieve_chunks(
        self,
        query: str,
        top_k: int = 5,
    ) -> List[str]:
        """
        Returns only the retrieved text chunks.
        Useful if another service formats the prompt.
        """

        chunks = self.retrieve(
            query=query,
            top_k=top_k,
        )

        return [
            chunk.text
            for chunk in chunks
        ]