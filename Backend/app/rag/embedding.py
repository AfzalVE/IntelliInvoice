"""
embedding.py

Embedding service for the RAG pipeline.

Responsibilities:
- Load embedding model once
- Generate embeddings
- Batch embeddings
- Normalize embeddings
"""

from __future__ import annotations

from typing import List

import numpy as np
from sentence_transformers import SentenceTransformer


class EmbeddingService:
    """
    Singleton wrapper around SentenceTransformer.
    """

    _model = None

    def __init__(
        self,
        model_name: str = "BAAI/bge-small-en-v1.5",
    ):
        if EmbeddingService._model is None:
            EmbeddingService._model = SentenceTransformer(
                model_name
            )

        self.model = EmbeddingService._model

    @property
    def dimension(self) -> int:
        """
        Returns embedding dimension.
        """
        return self.model.get_sentence_embedding_dimension()

    def embed_text(
        self,
        text: str,
    ) -> np.ndarray:
        """
        Generate embedding for a single string.
        """

        embedding = self.model.encode(
            text,
            normalize_embeddings=True,
            convert_to_numpy=True,
        )

        return embedding.astype("float32")

    def embed_documents(
        self,
        documents: List[str],
    ) -> np.ndarray:
        """
        Generate embeddings for multiple documents.
        """

        embeddings = self.model.encode(
            documents,
            normalize_embeddings=True,
            convert_to_numpy=True,
            show_progress_bar=False,
        )

        return embeddings.astype("float32")