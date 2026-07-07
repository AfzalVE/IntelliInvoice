import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const API = "http://localhost:8000";

export default function Approved() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchApprovedInvoices();
  }, []);

  async function fetchApprovedInvoices() {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/invoice`);
      const approved = (res.data.invoices || []).filter(
        (inv) => inv.status.toUpperCase() === "APPROVED"
      );
      setInvoices(approved);
    } catch (err) {
      console.log(err);
      alert("Failed to load approved invoices.");
    } finally {
      setLoading(false);
    }
  }

  const handleDownload = async (invoiceId, filename) => {
    try {
      const response = await axios.get(`${API}/invoice/${invoiceId}/download-pdf`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename || `invoice_${invoiceId}_signed.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Failed to download PDF: " + (err.response?.data?.detail || err.message));
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const value = search.toLowerCase();
    return (
      inv.vendor?.toLowerCase().includes(value) ||
      inv.invoice_number?.toLowerCase().includes(value) ||
      inv.po_number?.toLowerCase().includes(value)
    );
  });

  const totalAmount = invoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Approved Invoices
              </h1>
              <p className="text-gray-500 mt-1">
                All invoices approved and signed by the Department Head.
              </p>
            </div>
            <button
              onClick={fetchApprovedInvoices}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow transition"
            >
              Refresh
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-green-500">
              <p className="text-gray-500 font-medium">Total Approved Invoices</p>
              <h2 className="text-4xl font-extrabold mt-2 text-green-600">
                {invoices.length}
              </h2>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-blue-500">
              <p className="text-gray-500 font-medium">Total Volume Approved</p>
              <h2 className="text-4xl font-extrabold mt-2 text-blue-600">
                INR {totalAmount.toLocaleString()}
              </h2>
            </div>
          </div>

          {/* Search bar */}
          <div className="bg-white rounded-2xl shadow p-5 mb-6">
            <input
              type="text"
              placeholder="Search Vendor, Invoice Number, PO Number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 w-full md:w-96 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Invoices Table */}
          {loading ? (
            <div className="bg-white rounded-2xl shadow p-16 text-center text-lg">
              Loading approved invoices...
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-16 text-center text-lg text-gray-400">
              No approved invoices found.
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-600">Invoice No</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Vendor</th>
                    <th className="text-left p-4 font-semibold text-gray-600">PO Number</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Amount</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Approver Comments</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Status</th>
                    <th className="text-center p-4 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id || inv._id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-semibold text-blue-600">
                        {inv.invoice_number || "—"}
                      </td>
                      <td className="p-4 text-gray-800 font-medium">
                        {inv.vendor}
                      </td>
                      <td className="p-4 text-gray-600">
                        {inv.po_number || "—"}
                      </td>
                      <td className="p-4 text-gray-800 font-bold">
                        {inv.currency} {inv.total_amount?.toLocaleString()}
                      </td>
                      <td className="p-4 text-gray-500 text-sm max-w-xs truncate" title={inv.approver_comments}>
                        {inv.approver_comments || "—"}
                      </td>
                      <td className="p-4">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Approved
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          {inv.signed_pdf ? (
                            <button
                              onClick={() => handleDownload(inv.id, `invoice_${inv.id}_signed.pdf`)}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 transition"
                            >
                              Download Signed PDF ↓
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">No Document</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}