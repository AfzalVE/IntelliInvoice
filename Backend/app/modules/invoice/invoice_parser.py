import re
from datetime import datetime, date


class InvoiceParser:

    @staticmethod
    def parse(text: str):

        return {
            "vendor": InvoiceParser.vendor(text),
            "invoice_number": InvoiceParser.invoice_number(text),
            "po_number": InvoiceParser.po_number(text),
            "invoice_date": InvoiceParser.invoice_date(text),
            "due_date": InvoiceParser.due_date(text),
            "tax": InvoiceParser.tax(text),
            "total_amount": InvoiceParser.total_amount(text),
            "currency": InvoiceParser.currency(text),
            "line_items": [],
        }

    @staticmethod
    def vendor(text):

        match = re.search(
            r"Vendor\s*:?\s*\n?\s*(.+)",
            text,
            re.IGNORECASE,
        )

        if match:
            return match.group(1).strip()

        lines = [
            line.strip()
            for line in text.splitlines()
            if line.strip()
        ]

        ignore = {
            "TAX INVOICE",
            "INVOICE",
        }

        for line in lines:
            if line.upper() not in ignore:
                return line

        return None

    @staticmethod
    def invoice_number(text):

        patterns = [
            r"Invoice\s*Number\s*:?\s*([A-Za-z0-9\-_/]+)",
            r"Invoice\s*No\.?\s*:?\s*([A-Za-z0-9\-_/]+)",
            r"Invoice\s*#\s*:?\s*([A-Za-z0-9\-_/]+)",
        ]

        return InvoiceParser._find(patterns, text)

    @staticmethod
    def po_number(text):

        patterns = [
            r"PO\s*Number\s*:?\s*([A-Za-z0-9\-_/]+)",
            r"Purchase\s*Order\s*:?\s*([A-Za-z0-9\-_/]+)",
        ]

        return InvoiceParser._find(patterns, text)

    @staticmethod
    def invoice_date(text):

        value = InvoiceParser._find(
            [
                r"Invoice\s*Date\s*:?\s*([A-Za-z0-9/\-.]+)",
                r"Issue\s*Date\s*:?\s*([A-Za-z0-9/\-.]+)",
            ],
            text,
        )

        return InvoiceParser._parse_date(value)

    @staticmethod
    def due_date(text):

        value = InvoiceParser._find(
            [
                r"Due\s*Date\s*:?\s*([A-Za-z0-9/\-.]+)",
            ],
            text,
        )

        return InvoiceParser._parse_date(value)

    @staticmethod
    def tax(text):

        patterns = [
            r"Tax.*?:\s*[₹$£€]?\s*([\d,]+\.\d+)",
            r"GST.*?:\s*[₹$£€]?\s*([\d,]+\.\d+)",
            r"VAT.*?:\s*[₹$£€]?\s*([\d,]+\.\d+)",
        ]

        value = InvoiceParser._find(patterns, text)

        if value:
            return float(value.replace(",", ""))

        return None

    @staticmethod
    def total_amount(text):

        patterns = [
            r"Total\s*Amount\s*:?\s*[₹$£€]?\s*([\d,]+\.\d+)",
            r"Grand\s*Total\s*:?\s*[₹$£€]?\s*([\d,]+\.\d+)",
            r"Amount\s*Due\s*:?\s*[₹$£€]?\s*([\d,]+\.\d+)",
            r"Total\s*:?\s*[₹$£€]?\s*([\d,]+\.\d+)",
        ]

        value = InvoiceParser._find(patterns, text)

        if value:
            return float(value.replace(",", ""))

        return None

    @staticmethod
    def currency(text):

        for currency in [
            "INR",
            "USD",
            "AUD",
            "EUR",
            "GBP",
        ]:

            if re.search(
                rf"\b{currency}\b",
                text,
                re.IGNORECASE,
            ):
                return currency

        if "₹" in text:
            return "INR"

        if "$" in text:
            return "USD"

        if "£" in text:
            return "GBP"

        if "€" in text:
            return "EUR"

        return None

    @staticmethod
    def _find(patterns, text):

        for pattern in patterns:

            match = re.search(
                pattern,
                text,
                re.IGNORECASE,
            )

            if match:
                return match.group(1).strip()

        return None

    @staticmethod
    def _parse_date(value):

        if not value:
            return None

        formats = [
            "%d-%b-%Y",
            "%d/%m/%Y",
            "%d-%m-%Y",
            "%Y-%m-%d",
            "%d.%m.%Y",
        ]

        for fmt in formats:

            try:
                return datetime.strptime(
                    value,
                    fmt,
                ).date()

            except ValueError:
                pass

        return None