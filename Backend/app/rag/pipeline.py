"""
pipeline.py

High-level RAG Pipeline

Responsibilities
----------------
- Ingest company documents
- Generate embeddings
- Store vectors
- Retrieve context
- Expose a simple API for the application
"""

from __future__ import annotations

from pathlib import Path
from typing import List

from rag.embedding import EmbeddingService
from rag.faiss_store import FaissVectorStore
from rag.loader import DocumentLoader
from rag.loader import DocumentChunk
from rag.retriever import Retriever


class RAGPipeline:

    def __init__(self):

        self.embedder = EmbeddingService()

        self.loader = DocumentLoader()

        self.vector_store = FaissVectorStore(
            embedding_dimension=self.embedder.dimension
        )

        self.retriever = Retriever(
            embedder=self.embedder,
            vector_store=self.vector_store,
        )

    ##################################################################
    # INGEST
    ##################################################################

    def ingest_document(
        self,
        file_path: str | Path,
    ) -> int:
        """
        Loads one document and stores it inside FAISS.

        Returns:
            Number of chunks indexed.
        """

        chunks = self.loader.load(file_path)

        if not chunks:
            return 0

        embeddings = self.embedder.embed_documents(
            [chunk.text for chunk in chunks]
        )

        self.vector_store.add_documents(
            embeddings,
            chunks,
        )

        return len(chunks)

    ##################################################################
    # BULK INGEST
    ##################################################################

    def ingest_directory(
        self,
        directory: str | Path,
    ) -> int:
        """
        Index every supported document
        inside a folder.

        Returns total indexed chunks.
        """

        directory = Path(directory)

        total_chunks = 0

        for file in directory.iterdir():

            if not file.is_file():
                continue

            try:

                indexed = self.ingest_document(file)

                total_chunks += indexed

            except Exception as e:

                print(
                    f"Skipping {file.name}: {e}"
                )

        return total_chunks

    ##################################################################
    # QUERY
    ##################################################################

    def search(
        self,
        query: str,
        top_k: int = 5,
    ):
        """
        Returns retrieved chunks.
        """

        return self.retriever.retrieve(
            query=query,
            top_k=top_k,
        )

    ##################################################################
    # CONTEXT
    ##################################################################

    def get_context(
        self,
        query: str,
        top_k: int = 5,
    ) -> str:
        """
        Returns formatted context
        for LLM prompt.
        """

        return self.retriever.build_context(
            query=query,
            top_k=top_k,
        )

    ##################################################################
    # CLEAR INDEX
    ##################################################################

    def reset(self):
        """
        Deletes all indexed vectors.
        """

        self.vector_store.clear()

    ##################################################################
    # STATS
    ##################################################################

    def stats(self):

        return {
            "documents": self.vector_store.total_documents
        }

    ##################################################################
    # SMART PROMPT
    ##################################################################

    def build_prompt(
        self,
        email: str,
        instructions: str = "",
        top_k: int = 5,
    ) -> str:
        """
        Builds the complete prompt
        that will be sent to Groq.
        """

        context = self.get_context(
            email,
            top_k=top_k,
        )

        return f"""
You are an enterprise AI Email Assistant.

Use ONLY the provided company knowledge.
If the answer is unavailable, politely say that
the requested information is unavailable.

=========================
COMPANY KNOWLEDGE
=========================

{context}

=========================
CUSTOMER EMAIL
=========================

{email}

=========================
USER INSTRUCTIONS
=========================

{instructions}

=========================
TASK
=========================

Generate THREE different replies.

Reply 1
--------
Professional

Reply 2
--------
Friendly

Reply 3
--------
Concise

Requirements

- Never hallucinate
- Never invent pricing
- Never invent policies
- Use company knowledge
- Answer every customer question
- Return VALID JSON ONLY

{
    "replies":[
        {
            "id":"1",
            "tone":"Professional",
            "subject":"",
            "body":""
        },
        {
            "id":"2",
            "tone":"Friendly",
            "subject":"",
            "body":""
        },
        {
            "id":"3",
            "tone":"Concise",
            "subject":"",
            "body":""
        }
    ]
}
"""