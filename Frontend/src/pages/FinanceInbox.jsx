import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FiSearch, FiDownload, FiMessageSquare } from "react-icons/fi";

import { API } from "../services/api";


export default function FinanceInbox() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [financeComments, setFinanceComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    fetchApprovedInvoices();
  }, []);

  useEffect(() => {
    if (selectedInvoice) {
      setFinanceComments(selectedInvoice.finance_comments || "");
      loadPdfPreview(selectedInvoice.id || selectedInvoice._id);
    } else {
      setFinanceComments("");
      setPdfUrl(null);
    }
  }, [selectedInvoice]);

  async function fetchApprovedInvoices() {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/invoice/`);
      const approved = (res.data.invoices || []).filter(
        (inv) => inv.status.toUpperCase() === "APPROVED"
      );
      setInvoices(approved);
      if (approved.length > 0) {
        setSelectedInvoice(approved[0]);
      } else {
        setSelectedInvoice(null);
      }
    } catch (err) {
      console.log(err);
      alert("Failed to load approved invoices.");
    } finally {
      setLoading(false);
    }
  }

  async function loadPdfPreview(invoiceId) {
    try {
      const res = await axios.get(`${API}/invoice/${invoiceId}/download-pdf`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      setPdfUrl(url);
    } catch (err) {
      console.error("Error loading PDF preview:", err);
      setPdfUrl(null);
    }
  }

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const handleDownload = async (invoiceId, filename) => {
    try {
      const response = await axios.get(`${API}/invoice/${invoiceId}/download-pdf`, {
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

  async function handleAddComment() {
    if (!selectedInvoice) return;
    try {
      setSubmitting(true);
      const res = await axios.post(`${API}/invoice/${selectedInvoice.id || selectedInvoice._id}/finance-comment`, {
        comments: financeComments
      });
      alert("BMS comments saved successfully!");
      
      // Update local invoice list with new comment
      setInvoices(prev => prev.map(inv => 
        (inv.id || inv._id) === (selectedInvoice.id || selectedInvoice._id) 
          ? res.data.invoice 
          : inv
      ));
      setSelectedInvoice(res.data.invoice);
      
      // Reload PDF to reflect updated comments
      loadPdfPreview(selectedInvoice.id || selectedInvoice._id);
    } catch (err) {
      console.error(err);
      alert("Failed to save comments: " + (err.response?.data?.detail || err.message));
    } finally {
      setSubmitting(false);
    }
  }

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
                Finance Team Inbox
              </h1>
              <p className="text-gray-500 mt-2">
                Process Admin-approved invoices and record entry notes for Austria BMS.
              </p>
            </div>
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
              Approved Invoices: {invoices.length}
            </span>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-green-500">
              <p className="text-gray-500 font-medium">Approved Invoices Queue</p>
              <h2 className="text-4xl font-extrabold mt-2 text-green-600">
                {invoices.length}
              </h2>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-blue-500">
              <p className="text-gray-500 font-medium">Total Volume to Process</p>
              <h2 className="text-4xl font-extrabold mt-2 text-blue-600">
                INR {totalAmount.toLocaleString()}
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl shadow p-16 text-center text-lg">
              Loading approved invoices...
            </div>
          ) : invoices.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-16 text-center text-lg text-gray-500">
              No approved invoices to process.
            </div>
          ) : (
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Left Selector Panel */}
              <div className="lg:col-span-1 space-y-4">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search Vendor, Inv..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl pl-9 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                
                <h3 className="font-bold text-gray-700 uppercase text-xs tracking-wider mt-4">
                  Select Approved Invoice
                </h3>
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                  {filteredInvoices.map((inv) => (
                    <button
                      key={inv.id || inv._id}
                      onClick={() => setSelectedInvoice(inv)}
                      className={`w-full text-left p-4 rounded-xl shadow transition border-2 ${
                        selectedInvoice && (selectedInvoice.id || selectedInvoice._id) === (inv.id || inv._id)
                          ? "border-blue-600 bg-blue-50/50"
                          : "border-transparent bg-white hover:bg-gray-50"
                      }`}
                    >
                      <h4 className="font-semibold text-gray-800 truncate">
                        {inv.vendor || "Unknown Vendor"}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Invoice No: {inv.invoice_number || "—"}
                      </p>
                      <p className="text-sm font-bold text-blue-600 mt-2">
                        {inv.currency} {inv.total_amount?.toLocaleString() || "0"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Middle Section (PDF Preview & Timeline) */}
              <div className="lg:col-span-2 space-y-6">
                {selectedInvoice && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">Signed PDF Document</h2>
                      {pdfUrl && (
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1"
                        >
                          Open in Fullscreen ↗
                        </a>
                      )}
                    </div>

                    <div className="h-[550px] border border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                      {pdfUrl ? (
                        <iframe
                          src={pdfUrl}
                          title="PDF Preview"
                          className="w-full h-full"
                          border="0"
                        />
                      ) : (
                        <div className="text-center text-gray-500">
                          <p className="text-5xl mb-2">📄</p>
                          <p className="font-semibold">Loading PDF Preview...</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Section (BMS Processing Panel) */}
              <div className="lg:col-span-1 space-y-6">
                {selectedInvoice && (
                  <>
                    {/* Invoice Meta */}
                    <div className="bg-white rounded-2xl shadow p-6">
                      <h2 className="text-xl font-bold mb-4">Invoice Information</h2>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-gray-500">Vendor</p>
                          <h4 className="font-semibold text-gray-800">{selectedInvoice.vendor}</h4>
                        </div>
                        <div>
                          <p className="text-gray-500">Invoice Number</p>
                          <h4 className="font-semibold text-gray-800">{selectedInvoice.invoice_number}</h4>
                        </div>
                        <div>
                          <p className="text-gray-500">PO Number</p>
                          <h4 className="font-semibold text-gray-800">{selectedInvoice.po_number || "—"}</h4>
                        </div>
                        <div>
                          <p className="text-gray-500">Approver Notes (Admin)</p>
                          <p className="p-2 bg-gray-50 rounded text-gray-700 italic border-l-4 border-gray-300">
                            {selectedInvoice.approver_comments || "No comments from admin"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Austria BMS Entry Comments */}
                    <div className="bg-white rounded-2xl shadow p-6">
                      <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                        <FiMessageSquare className="text-blue-500" />
                        Austria BMS Notes
                      </h2>
                      <textarea
                        rows="4"
                        placeholder="Add manual entry details, entry logs, or Austria BMS confirmation code..."
                        value={financeComments}
                        onChange={(e) => setFinanceComments(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleAddComment}
                        disabled={submitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow transition mt-3 text-sm"
                      >
                        {submitting ? "Saving..." : "Save BMS Notes"}
                      </button>
                    </div>

                    {/* Document Download Actions */}
                    <div className="bg-white rounded-2xl shadow p-6 space-y-3">
                      <button
                        onClick={() => handleDownload(selectedInvoice.id, `invoice_${selectedInvoice.id}_signed.pdf`)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow transition flex items-center justify-center gap-2"
                      >
                        Download Signed PDF
                      </button>
                      <p className="text-xs text-gray-400 text-center">
                        Note: PDF will include all latest modifications, admin signature, and BMS entry notes.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
