"""
faiss_store.py

Persistent FAISS vector store.

Responsibilities
----------------
- Create index
- Load existing index
- Save index
- Store metadata
- Add new chunks
- Similarity search
"""

from __future__ import annotations

import pickle
from pathlib import Path
from typing import List

import faiss
import numpy as np

from rag.loader import DocumentChunk


class FaissVectorStore:

    def __init__(
        self,
        embedding_dimension: int,
        index_path: str = "vector_store/company.index",
        metadata_path: str = "vector_store/metadata.pkl",
    ):

        self.dimension = embedding_dimension

        self.index_path = Path(index_path)
        self.metadata_path = Path(metadata_path)

        self.index_path.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        if (
            self.index_path.exists()
            and self.metadata_path.exists()
        ):

            self.index = faiss.read_index(
                str(self.index_path)
            )

            with open(
                self.metadata_path,
                "rb",
            ) as f:

                self.metadata: List[DocumentChunk] = pickle.load(f)

        else:

            self.index = faiss.IndexFlatIP(
                self.dimension
            )

            self.metadata = []

    @property
    def total_documents(self):

        return len(self.metadata)

    def add_documents(
        self,
        embeddings: np.ndarray,
        chunks: List[DocumentChunk],
    ):

        if len(embeddings) != len(chunks):
            raise ValueError(
                "Embeddings and chunks length mismatch."
            )

        self.index.add(embeddings)

        self.metadata.extend(chunks)

        self.save()

    def search(
        self,
        query_embedding: np.ndarray,
        top_k: int = 5,
    ):

        if self.index.ntotal == 0:
            return []

        query = np.expand_dims(
            query_embedding,
            axis=0,
        )

        scores, indices = self.index.search(
            query,
            top_k,
        )

        results = []

        for score, idx in zip(
            scores[0],
            indices[0],
        ):

            if idx == -1:
                continue

            results.append(
                {
                    "score": float(score),
                    "chunk": self.metadata[idx],
                }
            )

        return results

    def save(self):

        faiss.write_index(
            self.index,
            str(self.index_path),
        )

        with open(
            self.metadata_path,
            "wb",
        ) as f:

            pickle.dump(
                self.metadata,
                f,
            )

    def clear(self):

        self.index = faiss.IndexFlatIP(
            self.dimension
        )

        self.metadata = []

        self.save()