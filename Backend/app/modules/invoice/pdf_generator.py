"""
PDF Generator for Invoice Approval Documents.

Uses ReportLab to produce a professional invoice PDF
containing all extracted/edited fields, line items,
and the BA approval stamp.
"""

import os
from datetime import datetime
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


# ---------------------------------------------------------------------------
# Output directory
# ---------------------------------------------------------------------------

PDF_OUTPUT_DIR = Path(__file__).resolve().parents[3] / "generated_pdfs"
PDF_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------------------------
# Colour palette
# ---------------------------------------------------------------------------

BRAND_BLUE = colors.HexColor("#1a56db")
BRAND_DARK = colors.HexColor("#1e293b")
LIGHT_GRAY = colors.HexColor("#f1f5f9")
BORDER_GRAY = colors.HexColor("#cbd5e1")
GREEN_BG = colors.HexColor("#dcfce7")
GREEN_TEXT = colors.HexColor("#166534")


# ---------------------------------------------------------------------------
# Helper: build paragraph styles
# ---------------------------------------------------------------------------

def _styles():
    ss = getSampleStyleSheet()

    ss.add(ParagraphStyle(
        "DocTitle",
        parent=ss["Title"],
        fontSize=22,
        leading=26,
        textColor=BRAND_BLUE,
        spaceAfter=4 * mm,
    ))

    ss.add(ParagraphStyle(
        "SectionHead",
        parent=ss["Heading2"],
        fontSize=13,
        leading=16,
        textColor=BRAND_DARK,
        spaceBefore=6 * mm,
        spaceAfter=3 * mm,
    ))

    ss.add(ParagraphStyle(
        "FieldLabel",
        parent=ss["Normal"],
        fontSize=9,
        textColor=colors.gray,
    ))

    ss.add(ParagraphStyle(
        "FieldValue",
        parent=ss["Normal"],
        fontSize=11,
        textColor=BRAND_DARK,
        spaceBefore=1 * mm,
        spaceAfter=2 * mm,
    ))

    ss.add(ParagraphStyle(
        "ApprovalStamp",
        parent=ss["Normal"],
        fontSize=12,
        textColor=GREEN_TEXT,
        alignment=1,  # centre
    ))

    return ss


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def generate_invoice_pdf(invoice, signature_path: str | None = None) -> str:
    """
    Generate an approval PDF for the given invoice ORM object.

    Returns the absolute path to the generated file.
    """

    prefix = "signed_" if signature_path else ""
    filename = f"{prefix}invoice_{invoice.id}_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}.pdf"
    filepath = str(PDF_OUTPUT_DIR / filename)

    doc = SimpleDocTemplate(
        filepath,
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm,
    )

    styles = _styles()
    elements: list = []

    # ------------------------------------------------------------------
    # Title
    # ------------------------------------------------------------------

    elements.append(Paragraph("Invoice Approval Document", styles["DocTitle"]))
    elements.append(Spacer(1, 2 * mm))

    # Subtitle line
    elements.append(Paragraph(
        f"Generated on {datetime.utcnow().strftime('%d %b %Y, %H:%M UTC')}",
        styles["FieldLabel"],
    ))
    elements.append(Spacer(1, 6 * mm))

    # ------------------------------------------------------------------
    # Invoice Details (two-column grid)
    # ------------------------------------------------------------------

    elements.append(Paragraph("Invoice Details", styles["SectionHead"]))

    def _field(label, value):
        return [
            Paragraph(label, styles["FieldLabel"]),
            Paragraph(str(value or "—"), styles["FieldValue"]),
        ]

    detail_data = [
        [
            _field("Vendor", invoice.vendor),
            _field("Invoice Number", invoice.invoice_number),
        ],
        [
            _field("PO Number", invoice.po_number),
            _field("Invoice Date", _format_date(invoice.invoice_date)),
        ],
        [
            _field("Due Date", _format_date(invoice.due_date)),
            _field("Currency", invoice.currency),
        ],
        [
            _field("Tax", _format_amount(invoice.tax, invoice.currency)),
            _field("Total Amount", _format_amount(invoice.total_amount, invoice.currency)),
        ],
    ]

    # Flatten inner lists into table cells (each cell is a mini-flow)
    table_rows = []
    for row in detail_data:
        table_rows.append([cell for pair in row for cell in pair])

    detail_table = Table(
        table_rows,
        colWidths=[35 * mm, 50 * mm, 35 * mm, 50 * mm],
    )

    detail_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LINEBELOW", (0, 0), (-1, -1), 0.5, BORDER_GRAY),
    ]))

    elements.append(detail_table)
    elements.append(Spacer(1, 4 * mm))

    # ------------------------------------------------------------------
    # Line Items Table
    # ------------------------------------------------------------------

    line_items = invoice.line_items or []

    if line_items:
        elements.append(Paragraph("Line Items", styles["SectionHead"]))

        header = ["#", "Description", "Qty", "Unit Price", "Amount"]
        li_data = [header]

        for idx, item in enumerate(line_items, start=1):
            desc = item.get("description", "—") if isinstance(item, dict) else "—"
            qty = item.get("quantity", "—") if isinstance(item, dict) else "—"
            unit = item.get("unit_price", "—") if isinstance(item, dict) else "—"
            amt = item.get("amount", "—") if isinstance(item, dict) else "—"

            li_data.append([
                str(idx),
                str(desc),
                str(qty),
                _format_amount(unit, invoice.currency) if unit != "—" else "—",
                _format_amount(amt, invoice.currency) if amt != "—" else "—",
            ])

        li_table = Table(
            li_data,
            colWidths=[12 * mm, 68 * mm, 20 * mm, 35 * mm, 35 * mm],
            repeatRows=1,
        )

        li_table.setStyle(TableStyle([
            # Header row
            ("BACKGROUND", (0, 0), (-1, 0), BRAND_BLUE),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, 0), 10),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 6),
            ("TOPPADDING", (0, 0), (-1, 0), 6),

            # Body rows
            ("FONTSIZE", (0, 1), (-1, -1), 9),
            ("TOPPADDING", (0, 1), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 1), (-1, -1), 4),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHT_GRAY]),

            # Grid
            ("LINEBELOW", (0, 0), (-1, -1), 0.5, BORDER_GRAY),
            ("ALIGN", (2, 0), (-1, -1), "RIGHT"),
        ]))

        elements.append(li_table)
        elements.append(Spacer(1, 4 * mm))

    # ------------------------------------------------------------------
    # Totals row
    # ------------------------------------------------------------------

    elements.append(Spacer(1, 2 * mm))

    totals_data = [
        ["", "Tax:", _format_amount(invoice.tax, invoice.currency)],
        ["", "Total Amount:", _format_amount(invoice.total_amount, invoice.currency)],
    ]

    totals_table = Table(
        totals_data,
        colWidths=[100 * mm, 35 * mm, 35 * mm],
    )

    totals_table.setStyle(TableStyle([
        ("ALIGN", (1, 0), (-1, -1), "RIGHT"),
        ("FONTNAME", (1, 0), (-1, -1), "Helvetica-Bold"),
        ("FONTSIZE", (1, 0), (-1, -1), 11),
        ("TEXTCOLOR", (2, 1), (2, 1), BRAND_BLUE),
        ("LINEABOVE", (1, 0), (-1, 0), 1, BORDER_GRAY),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))

    elements.append(totals_table)



    # ------------------------------------------------------------------
    # BA Comments (if any custom text)
    # ------------------------------------------------------------------

    if invoice.ba_comments and invoice.ba_comments.lower() != "approved":
        elements.append(Spacer(1, 4 * mm))
        elements.append(Paragraph("BA Comments", styles["SectionHead"]))
        elements.append(Paragraph(invoice.ba_comments, styles["FieldValue"]))

    # ------------------------------------------------------------------
    # Department Head Approval & Digital Signature
    # ------------------------------------------------------------------

    if signature_path and os.path.exists(signature_path):
        from reportlab.platypus import Image

        elements.append(Spacer(1, 10 * mm))
        elements.append(Paragraph("Department Head Approval & Digital Signature", styles["SectionHead"]))

        # Render approver comments
        if invoice.approver_comments:
            elements.append(Paragraph("<b>Approver Comments:</b>", styles["FieldLabel"]))
            elements.append(Paragraph(invoice.approver_comments, styles["FieldValue"]))
            elements.append(Spacer(1, 3 * mm))

        # Render signature image alongside approval date in a table
        try:
            # signature_path is absolute path. Render it.
            sig_img = Image(signature_path, width=40 * mm, height=15 * mm)
            sig_img.hAlign = 'LEFT'
        except Exception as e:
            sig_img = Paragraph(f"[Signature Image Error: {str(e)}]", styles["FieldValue"])

        sig_data = [
            [
                Paragraph("<b>Digitally Signed By:</b><br/>Department Head", styles["FieldValue"]),
                Paragraph(f"<b>Approval Date:</b><br/>{datetime.utcnow().strftime('%d %b %Y')}", styles["FieldValue"]),
                sig_img
            ]
        ]
        
        sig_table = Table(sig_data, colWidths=[60 * mm, 50 * mm, 60 * mm])
        sig_table.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("LINEABOVE", (0, 0), (-1, -1), 0.5, BORDER_GRAY),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]))
        elements.append(sig_table)

    # ------------------------------------------------------------------
    # Finance Team BMS Entry Notes (if any)
    # ------------------------------------------------------------------

    if hasattr(invoice, "finance_comments") and invoice.finance_comments:
        elements.append(Spacer(1, 8 * mm))
        elements.append(Paragraph("Finance Team — Austria BMS Entry Notes", styles["SectionHead"]))

        bms_data = [[
            Paragraph(invoice.finance_comments, styles["FieldValue"]),
        ]]
        bms_table = Table(bms_data, colWidths=[170 * mm])
        bms_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#eff6ff")),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ("LEFTPADDING", (0, 0), (-1, -1), 10),
            ("RIGHTPADDING", (0, 0), (-1, -1), 10),
            ("LINEBELOW", (0, 0), (-1, -1), 0.5, BORDER_GRAY),
        ]))
        elements.append(bms_table)

    # ------------------------------------------------------------------
    # Build PDF
    # ------------------------------------------------------------------

    doc.build(elements)

    return filepath


# ---------------------------------------------------------------------------
# Private helpers
# ---------------------------------------------------------------------------

def _format_date(d) -> str:
    if d is None:
        return "—"
    if hasattr(d, "strftime"):
        return d.strftime("%d %b %Y")
    return str(d)


def _format_amount(value, currency: str | None = None) -> str:
    if value is None:
        return "—"
    try:
        formatted = f"{float(value):,.2f}"
    except (ValueError, TypeError):
        return str(value)

    if currency:
        return f"{currency} {formatted}"
    return formatted
