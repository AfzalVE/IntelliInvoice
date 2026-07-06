"""
loader.py

Loads company knowledge documents and converts them into
chunked documents ready for embedding.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import List

import fitz  # PyMuPDF
from docx import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter


SUPPORTED_EXTENSIONS = {
    ".pdf",
    ".docx",
    ".txt",
    ".md",
}


@dataclass
class DocumentChunk:
    """
    Represents one chunk of knowledge.
    """

    text: str
    source: str
    page: int
    chunk: int


class DocumentLoader:
    """
    Loads documents and splits them into chunks.
    """

    def __init__(
        self,
        chunk_size: int = 800,
        chunk_overlap: int = 150,
    ):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=[
                "\n\n",
                "\n",
                ". ",
                " ",
                "",
            ],
        )

    def load(self, file_path: str | Path) -> List[DocumentChunk]:

        path = Path(file_path)

        if not path.exists():
            raise FileNotFoundError(path)

        extension = path.suffix.lower()

        if extension not in SUPPORTED_EXTENSIONS:
            raise ValueError(
                f"Unsupported file type: {extension}"
            )

        if extension == ".pdf":
            return self._load_pdf(path)

        if extension == ".docx":
            return self._load_docx(path)

        if extension == ".txt":
            return self._load_text(path)

        if extension == ".md":
            return self._load_text(path)

        raise ValueError("Unsupported file")

    def _load_pdf(
        self,
        path: Path,
    ) -> List[DocumentChunk]:

        pdf = fitz.open(path)

        chunks: List[DocumentChunk] = []

        chunk_id = 0

        for page_index in range(len(pdf)):

            page = pdf.load_page(page_index)

            text = page.get_text().strip()

            if not text:
                continue

            split_chunks = self.splitter.split_text(text)

            for chunk in split_chunks:

                chunks.append(
                    DocumentChunk(
                        text=chunk,
                        source=path.name,
                        page=page_index + 1,
                        chunk=chunk_id,
                    )
                )

                chunk_id += 1

        pdf.close()

        return chunks

    def _load_docx(
        self,
        path: Path,
    ) -> List[DocumentChunk]:

        doc = Document(path)

        text = "\n".join(
            para.text
            for para in doc.paragraphs
            if para.text.strip()
        )

        return self._chunk_text(
            text,
            path.name,
        )

    def _load_text(
        self,
        path: Path,
    ) -> List[DocumentChunk]:

        text = path.read_text(
            encoding="utf-8",
            errors="ignore",
        )

        return self._chunk_text(
            text,
            path.name,
        )

    def _chunk_text(
        self,
        text: str,
        source: str,
    ) -> List[DocumentChunk]:

        chunks = []

        split_chunks = self.splitter.split_text(text)

        for idx, chunk in enumerate(split_chunks):

            chunks.append(
                DocumentChunk(
                    text=chunk,
                    source=source,
                    page=1,
                    chunk=idx,
                )
            )

        return chunks