import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8000";

export default function EditInvoiceModal({
  open,
  invoice,
  onClose,
  onUpdated,
}) {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

useEffect(() => {
  if (open && invoice) {
    setForm({
      ...invoice,
      invoice_date: invoice.invoice_date
        ? invoice.invoice_date.split("T")[0]
        : "",
      due_date: invoice.due_date
        ? invoice.due_date.split("T")[0]
        : "",
      line_items: invoice.line_items || [],
    });
  }
}, [open, invoice]);
  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }
  console.log("Form data:", form); // Debugging line to check form state
  console.log("Invoice data:", invoice); // Debugging line to check invoice prop

  function updateLineItem(index, field, value) {
    const updated = [...form.line_items];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setForm((prev) => ({
      ...prev,
      line_items: updated,
    }));
  }

  function addLineItem() {
    setForm((prev) => ({
      ...prev,
      line_items: [
        ...prev.line_items,
        {
          description: "",
          quantity: 1,
          unit_price: 0,
          amount: 0,
        },
      ],
    }));
  }

  function deleteLineItem(index) {
    const updated = form.line_items.filter((_, i) => i !== index);

    setForm((prev) => ({
      ...prev,
      line_items: updated,
    }));
  }

  async function handleSave() {
    try {
      setSaving(true);

      await axios.put(`${API}/invoice/${form.id || form._id}`, {
        vendor: form.vendor,
        invoice_number: form.invoice_number,
        po_number: form.po_number,
        invoice_date: form.invoice_date,
        due_date: form.due_date,
        tax: Number(form.tax),
        total_amount: Number(form.total_amount),
        currency: form.currency,
        line_items: form.line_items,
        ba_comments: form.ba_comments,
        approver_comments: form.approver_comments,
      });

      onUpdated();
      onClose();
    } catch (err) {
      console.log(err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (!open || !form) return null;
    return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[95%] max-w-6xl max-h-[90vh] overflow-y-auto rounded-xl p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Invoice</h2>

          <span className="px-3 py-1 rounded-full text-sm bg-gray-200">
            {form.status || "DRAFT"}
          </span>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* LEFT: BASIC FIELDS */}
          <div className="space-y-4">

            <div>
              <label className="text-sm font-medium">Vendor</label>
              <input
                value={form.vendor || ""}
                onChange={(e) => updateField("vendor", e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Invoice Number</label>
              <input
                value={form.invoice_number || ""}
                onChange={(e) =>
                  updateField("invoice_number", e.target.value)
                }
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="text-sm font-medium">PO Number</label>
              <input
                value={form.po_number || ""}
                onChange={(e) => updateField("po_number", e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Invoice Date</label>
              <input
                type="date"
                value={form.invoice_date || ""}
                onChange={(e) =>
                  updateField("invoice_date", e.target.value)
                }
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Due Date</label>
              <input
                type="date"
                value={form.due_date || ""}
                onChange={(e) => updateField("due_date", e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">

              <div>
                <label className="text-sm font-medium">Tax</label>
                <input
                  type="number"
                  value={form.tax || 0}
                  onChange={(e) => updateField("tax", e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Total</label>
                <input
                  type="number"
                  value={form.total_amount || 0}
                  onChange={(e) =>
                    updateField("total_amount", e.target.value)
                  }
                  className="w-full border p-2 rounded"
                />
              </div>

            </div>

            <div>
              <label className="text-sm font-medium">Currency</label>
              <input
                value={form.currency || ""}
                onChange={(e) => updateField("currency", e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          {/* RIGHT: PDF + LINE ITEMS */}
          <div className="space-y-4">

            {/* PDF */}
            <div>
              <label className="text-sm font-medium">PDF</label>

              {form.attachment_path ? (
                <a
                  href={form.attachment_path}
                  target="_blank"
                  rel="noreferrer"
                  className="block bg-blue-600 text-white px-4 py-2 rounded text-center"
                >
                  Open PDF
                </a>
              ) : (
                <div className="p-3 bg-gray-100 rounded text-gray-500">
                  No PDF Available
                </div>
              )}
            </div>

            {/* LINE ITEMS */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">
                  Line Items
                </label>

                <button
                  onClick={addLineItem}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  + Add
                </button>
              </div>

              <div className="space-y-2 max-h-[250px] overflow-y-auto">

                {form.line_items?.length === 0 && (
                  <p className="text-gray-400 text-sm">
                    No items
                  </p>
                )}

                {form.line_items?.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-2"
                  >

                    <input
                      placeholder="Desc"
                      value={item.description || ""}
                      onChange={(e) =>
                        updateLineItem(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      className="border p-1 rounded text-sm"
                    />

                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity || 0}
                      onChange={(e) =>
                        updateLineItem(
                          index,
                          "quantity",
                          e.target.value
                        )
                      }
                      className="border p-1 rounded text-sm"
                    />

                    <input
                      type="number"
                      placeholder="Unit"
                      value={item.unit_price || 0}
                      onChange={(e) =>
                        updateLineItem(
                          index,
                          "unit_price",
                          e.target.value
                        )
                      }
                      className="border p-1 rounded text-sm"
                    />

                    <button
                      onClick={() => deleteLineItem(index)}
                      className="bg-red-600 text-white rounded text-sm"
                    >
                      Delete
                    </button>

                  </div>
                ))}

              </div>
            </div>

          </div>
        </div>
                {/* COMMENTS */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">

          <div>
            <label className="text-sm font-medium">BA Comments</label>
            <textarea
              rows={5}
              value={form.ba_comments || ""}
              onChange={(e) =>
                updateField("ba_comments", e.target.value)
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Approver Comments
            </label>
            <textarea
              rows={5}
              value={form.approver_comments || ""}
              onChange={(e) =>
                updateField(
                  "approver_comments",
                  e.target.value
                )
              }
              className="w-full border p-2 rounded"
            />
          </div>

        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex justify-end gap-3 mt-6 border-t pt-4">

          <button
            onClick={onClose}
            className="px-5 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </div>
    </div>
  );
}