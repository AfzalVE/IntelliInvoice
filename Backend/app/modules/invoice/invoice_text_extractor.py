import os

import pdfplumber

from docx import Document

import pytesseract

from PIL import Image


class InvoiceTextExtractor:

    @staticmethod
    def extract(path: str):

        extension = os.path.splitext(path)[1].lower()

        if extension == ".pdf":
            return InvoiceTextExtractor.from_pdf(path)

        if extension == ".docx":
            return InvoiceTextExtractor.from_docx(path)

        if extension in [
            ".png",
            ".jpg",
            ".jpeg",
        ]:
            return InvoiceTextExtractor.from_image(path)

        raise Exception("Unsupported file.")

    @staticmethod
    def from_pdf(path):

        text = ""

        with pdfplumber.open(path) as pdf:

            for page in pdf.pages:

                extracted = page.extract_text()

                if extracted:
                    text += extracted + "\n"

        return text

    @staticmethod
    def from_docx(path):

        document = Document(path)

        return "\n".join(
            paragraph.text
            for paragraph in document.paragraphs
        )

    @staticmethod
    def from_image(path):

        image = Image.open(path)

        return pytesseract.image_to_string(image)