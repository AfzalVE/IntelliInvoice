import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const API = "http://localhost:8000";

export default function ReviewInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [invoice, setInvoice] = useState({
    vendor: "",
    invoice_number: "",
    po_number: "",
    invoice_date: "",
    due_date: "",
    tax: "",
    total_amount: "",
    currency: "AUD",
    line_items: [],
    attachment_path: "",
    attachment_name: "",
    status: "",
  });

  const [comments, setComments] = useState("");

  useEffect(() => {
    fetchInvoice();
  }, []);

  async function fetchInvoice() {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/invoice/${id}`
      );

      const data = res.data.invoice;

      setInvoice({
        vendor: data.vendor || "",
        invoice_number: data.invoice_number || "",
        po_number: data.po_number || "",
        invoice_date: data.invoice_date || "",
        due_date: data.due_date || "",
        tax: data.tax || "",
        total_amount: data.total_amount || "",
        currency: data.currency || "AUD",
        line_items: data.line_items || [],
        attachment_path: data.attachment_path || "",
        attachment_name: data.attachment_name || "",
        status: data.status || "",
      });

      setComments(data.ba_comments || "");
    } catch (err) {
      console.log(err);
      alert("Unable to load invoice.");
    } finally {
      setLoading(false);
    }
  }

  async function saveInvoice() {
    try {
      setSaving(true);

      await axios.put(
        `${API}/invoice/${id}`,
        {
          vendor: invoice.vendor,
          invoice_number: invoice.invoice_number,
          po_number: invoice.po_number,
          invoice_date: invoice.invoice_date,
          due_date: invoice.due_date,
          tax: Number(invoice.tax),
          total_amount: Number(invoice.total_amount),
          currency: invoice.currency,
          line_items: invoice.line_items,
        }
      );

      alert("Invoice updated successfully.");
    } catch (err) {
      console.log(err);
      alert("Unable to update invoice.");
    } finally {
      setSaving(false);
    }
  }

  async function submitInvoice() {
    try {
      await saveInvoice();

      await axios.post(
        `${API}/invoice/${id}/submit`,
        {
          comments,
        }
      );

      alert("Invoice submitted.");

      navigate("/invoices");
    } catch (err) {
      console.log(err);
      alert("Unable to submit invoice.");
    }
  }

  function updateField(field, value) {
    setInvoice((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateLineItem(index, field, value) {
    const items = [...invoice.line_items];

    items[index][field] = value;

    setInvoice({
      ...invoice,
      line_items: items,
    });
  }

  function addLineItem() {
    setInvoice({
      ...invoice,
      line_items: [
        ...invoice.line_items,
        {
          description: "",
          quantity: 1,
          unit_price: 0,
          amount: 0,
        },
      ],
    });
  }

  function deleteLineItem(index) {
    const items = [...invoice.line_items];

    items.splice(index, 1);

    setInvoice({
      ...invoice,
      line_items: items,
    });
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-2xl font-semibold">
        Loading Invoice...
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-8">

          <div className="flex justify-between items-center mb-8">

            <div>

              <h1 className="text-3xl font-bold">
                Review Invoice
              </h1>

              <p className="text-gray-500 mt-2">
                Verify AI extracted invoice before approval.
              </p>

            </div>

            <span className="bg-yellow-100 text-yellow-700 px-5 py-2 rounded-full font-semibold">
              {invoice.status}
            </span>

          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* PDF */}

            <div className="lg:col-span-2">

              <div className="bg-white rounded-2xl shadow-lg p-6">

                <div className="flex justify-between items-center mb-5">

                  <h2 className="text-xl font-bold">
                    Invoice Preview
                  </h2>

                  {invoice.attachment_path && (
                    <a
                      href={invoice.attachment_path}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      Open PDF
                    </a>
                  )}

                </div>

                <div className="h-[700px] rounded-xl border overflow-hidden">

                  {invoice.attachment_path ? (

                    <iframe
                      title="Invoice"
                      src={invoice.attachment_path}
                      className="w-full h-full"
                    />

                  ) : (

                    <div className="h-full flex items-center justify-center text-gray-400">

                      No Invoice Preview

                    </div>

                  )}

                </div>

              </div>

            </div>

            {/* Right Panel */}

            <div>

              <div className="bg-white rounded-2xl shadow-lg p-6">

                <h2 className="text-xl font-bold mb-6">
                  Extracted Information
                </h2>
                                <div className="space-y-5">

                  <div>
                    <label className="block text-sm text-gray-500 mb-2">
                      Vendor
                    </label>

                    <input
                      value={invoice.vendor}
                      onChange={(e) =>
                        updateField("vendor", e.target.value)
                      }
                      className="w-full border rounded-lg p-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-2">
                      Invoice Number
                    </label>

                    <input
                      value={invoice.invoice_number}
                      onChange={(e) =>
                        updateField(
                          "invoice_number",
                          e.target.value
                        )
                      }
                      className="w-full border rounded-lg p-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-2">
                      PO Number
                    </label>

                    <input
                      value={invoice.po_number}
                      onChange={(e) =>
                        updateField(
                          "po_number",
                          e.target.value
                        )
                      }
                      className="w-full border rounded-lg p-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-2">
                      Invoice Date
                    </label>

                    <input
                      type="date"
                      value={invoice.invoice_date}
                      onChange={(e) =>
                        updateField(
                          "invoice_date",
                          e.target.value
                        )
                      }
                      className="w-full border rounded-lg p-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-2">
                      Due Date
                    </label>

                    <input
                      type="date"
                      value={invoice.due_date}
                      onChange={(e) =>
                        updateField(
                          "due_date",
                          e.target.value
                        )
                      }
                      className="w-full border rounded-lg p-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-2">
                      Currency
                    </label>

                    <select
                      value={invoice.currency}
                      onChange={(e) =>
                        updateField(
                          "currency",
                          e.target.value
                        )
                      }
                      className="w-full border rounded-lg p-3"
                    >
                      <option value="AUD">AUD</option>
                      <option value="USD">USD</option>
                      <option value="INR">INR</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-2">
                      Tax
                    </label>

                    <input
                      type="number"
                      value={invoice.tax}
                      onChange={(e) =>
                        updateField(
                          "tax",
                          e.target.value
                        )
                      }
                      className="w-full border rounded-lg p-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-2">
                      Total Amount
                    </label>

                    <input
                      type="number"
                      value={invoice.total_amount}
                      onChange={(e) =>
                        updateField(
                          "total_amount",
                          e.target.value
                        )
                      }
                      className="w-full border rounded-lg p-3 font-bold text-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-2">
                      Attachment
                    </label>

                    <input
                      value={invoice.attachment_name}
                      readOnly
                      className="w-full border rounded-lg p-3 bg-gray-100"
                    />
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* Line Items */}

          <div className="bg-white rounded-2xl shadow-lg mt-8 p-6">

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-xl font-bold">
                Invoice Line Items
              </h2>

              <button
                onClick={addLineItem}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                + Add Item
              </button>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="p-3 text-left">
                      Description
                    </th>

                    <th className="p-3 text-left">
                      Qty
                    </th>

                    <th className="p-3 text-left">
                      Unit Price
                    </th>

                    <th className="p-3 text-left">
                      Amount
                    </th>

                    <th className="p-3 text-center">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {invoice.line_items.length === 0 && (

                    <tr>

                      <td
                        colSpan="5"
                        className="text-center p-6 text-gray-400"
                      >
                        No Line Items
                      </td>

                    </tr>

                  )}

                  {invoice.line_items.map(
                    (
                      item,
                      index
                    ) => (

                      <tr
                        key={index}
                        className="border-b"
                      >

                        <td className="p-3">

                          <input
                            value={item.description}
                            onChange={(e) =>
                              updateLineItem(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full border rounded-lg p-2"
                          />

                        </td>

                        <td className="p-3">

                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateLineItem(
                                index,
                                "quantity",
                                Number(e.target.value)
                              )
                            }
                            className="w-24 border rounded-lg p-2"
                          />

                        </td>

                        <td className="p-3">

                          <input
                            type="number"
                            value={item.unit_price}
                            onChange={(e) =>
                              updateLineItem(
                                index,
                                "unit_price",
                                Number(e.target.value)
                              )
                            }
                            className="w-32 border rounded-lg p-2"
                          />

                        </td>

                        <td className="p-3">

                          <input
                            type="number"
                            value={item.amount}
                            onChange={(e) =>
                              updateLineItem(
                                index,
                                "amount",
                                Number(e.target.value)
                              )
                            }
                            className="w-32 border rounded-lg p-2"
                          />

                        </td>

                        <td className="p-3 text-center">

                          <button
                            onClick={() =>
                              deleteLineItem(index)
                            }
                            className="bg-red-500 text-white px-3 py-2 rounded-lg"
                          >
                            Delete
                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>
                    {/* BA Comments */}

          <div className="bg-white rounded-2xl shadow-lg mt-8 p-6">

            <h2 className="text-xl font-bold mb-4">
              BA Comments
            </h2>

            <textarea
              rows={5}
              value={comments}
              onChange={(e) =>
                setComments(e.target.value)
              }
              placeholder="Enter review comments..."
              className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* Action Buttons */}

          <div className="flex flex-wrap justify-end gap-4 mt-8">

            <button
              onClick={saveInvoice}
              disabled={saving}
              className="border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-100"
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>

            <button
              onClick={async () => {
                try {
                  await axios.post(
                    `${API}/invoice/${id}/comment`,
                    {
                      comments,
                    }
                  );

                  alert("Comments added.");
                } catch (err) {
                  console.log(err);
                  alert("Unable to save comments.");
                }
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl"
            >
              Save Comments
            </button>

            <button
              onClick={submitInvoice}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
            >
              Submit For Approval
            </button>

          </div>

          {/* Department Head */}

          <div className="bg-white rounded-2xl shadow-lg mt-10 p-6">

            <h2 className="text-2xl font-bold mb-6">
              Department Head Approval
            </h2>

            <p className="text-gray-500 mb-5">
              Review BA comments and approve or reject this invoice.
            </p>

            <textarea
              rows={5}
              value={comments}
              onChange={(e) =>
                setComments(e.target.value)
              }
              placeholder="Department Head Comments..."
              className="w-full border rounded-xl p-4"
            />

            <div className="flex gap-4 mt-6">

              <button
                onClick={async () => {
                  try {

                    await axios.post(
                      `${API}/invoice/${id}/comment`,
                      {
                        comments,
                      }
                    );

                    await axios.post(
                      `${API}/invoice/${id}/approve`
                    );

                    alert("Invoice Approved.");

                    navigate("/invoices");

                  } catch (err) {

                    console.log(err);

                    alert("Unable to approve invoice.");

                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
              >
                Approve Invoice
              </button>

              <button
                onClick={async () => {
                  try {

                    await axios.post(
                      `${API}/invoice/${id}/reject`,
                      {
                        comments,
                      }
                    );

                    alert("Invoice Rejected.");

                    navigate("/invoices");

                  } catch (err) {

                    console.log(err);

                    alert("Unable to reject invoice.");

                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
              >
                Reject Invoice
              </button>

            </div>

          </div>

          {/* Finance Team */}

          <div className="bg-white rounded-2xl shadow-lg mt-10 p-6 mb-10">

            <h2 className="text-2xl font-bold mb-4">
              Finance Team
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <div>

                <label className="block text-gray-500 mb-2">
                  Current Status
                </label>

                <input
                  value={invoice.status}
                  readOnly
                  className="w-full border rounded-lg p-3 bg-gray-100"
                />

              </div>

              <div>

                <label className="block text-gray-500 mb-2">
                  Approval Comments
                </label>

                <textarea
                  value={comments}
                  readOnly
                  rows={4}
                  className="w-full border rounded-lg p-3 bg-gray-100"
                />

              </div>

            </div>

            <div className="mt-6 p-5 rounded-xl bg-green-50 border border-green-200">

              <h3 className="font-semibold text-green-700 mb-2">
                Ready for Finance Processing
              </h3>

              <p className="text-gray-600">
                Once approved, Finance Team can manually enter the
                invoice into the Australian BMS system using the
                extracted invoice data and approval comments.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}