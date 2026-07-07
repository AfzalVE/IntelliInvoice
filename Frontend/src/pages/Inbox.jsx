import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  FiSearch,
  FiRefreshCw,
  FiPlus,
  FiFileText,
  FiUploadCloud,
  FiX,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiInbox,
} from "react-icons/fi";

import { API } from "../services/api";


export default function Inbox() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newVendor, setNewVendor] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCurrency, setNewCurrency] = useState("$");
  const [newInvoiceNo, setNewInvoiceNo] = useState("");
  const [newFileName, setNewFileName] = useState("");

  useEffect(() => {
    fetchInvoices();
  }, []);

  async function fetchInvoices() {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/invoice/`);
      setInvoices(res.data.invoices || []);
    } catch (err) {
      console.error("Failed to fetch invoices:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateInvoice(e) {
    e.preventDefault();
    try {
      setCreating(true);
      await axios.post(`${API}/invoice/`, {
        vendor: newVendor || "Unknown Vendor",
        invoice_number: newInvoiceNo || `INV-${Date.now().toString().slice(-4)}`,
        total_amount: parseFloat(newAmount) || 0.0,
        currency: newCurrency,
        attachment_name: newFileName || "uploaded_invoice.pdf",
      });
      setShowUploadModal(false);
      setNewVendor("");
      setNewAmount("");
      setNewInvoiceNo("");
      setNewFileName("");
      fetchInvoices();
    } catch (err) {
      console.error("Error creating invoice:", err);
      alert("Failed to create invoice.");
    } finally {
      setCreating(false);
    }
  }

  // Filter logic
  const filteredInvoices = invoices.filter((inv) => {
    const invNo = inv.invoice_number || `INV-${inv.id || inv._id}`;
    const vendor = inv.vendor || "";
    const matchesSearch =
      !search ||
      vendor.toLowerCase().includes(search.toLowerCase()) ||
      invNo.toLowerCase().includes(search.toLowerCase());

    const status = (inv.status || "").toUpperCase();
    let matchesStatus = true;
    if (statusFilter === "New") {
      matchesStatus = status === "DRAFT" || status === "EXTRACTED";
    } else if (statusFilter === "Review") {
      matchesStatus = status === "REVIEW" || status === "SUBMITTED";
    } else if (statusFilter === "Approved") {
      matchesStatus = status === "APPROVED";
    } else if (statusFilter === "Rejected") {
      matchesStatus = status === "REJECTED";
    }

    return matchesSearch && matchesStatus;
  });

  // Calculate dynamic stats
  const totalCount = invoices.length;
  const newCount = invoices.filter((i) => {
    const s = (i.status || "").toUpperCase();
    return s === "DRAFT" || s === "EXTRACTED";
  }).length;
  const reviewCount = invoices.filter((i) => {
    const s = (i.status || "").toUpperCase();
    return s === "REVIEW" || s === "SUBMITTED";
  }).length;
  const approvedCount = invoices.filter((i) => {
    const s = (i.status || "").toUpperCase();
    return s === "APPROVED";
  }).length;

  function getStatusBadge(status) {
    const s = (status || "").toUpperCase();
    switch (s) {
      case "APPROVED":
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
            Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
            Rejected
          </span>
        );
      case "SUBMITTED":
        return (
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
            Submitted
          </span>
        );
      case "REVIEW":
        return (
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
            Review
          </span>
        );
      case "DRAFT":
      case "EXTRACTED":
      default:
        return (
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
            New
          </span>
        );
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return "Today";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return str;
    }
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3">
                <FiInbox className="text-blue-600 text-3xl" />
                <h1 className="text-3xl font-bold text-gray-800">
                  Invoice Inbox
                </h1>
              </div>
              <p className="text-gray-500 mt-1">
                Manage, review, and process all incoming vendor invoices.
              </p>
            </div>

            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition cursor-pointer"
            >
              <FiPlus size={18} />
              Upload Invoice
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              {/* Search */}
              <div className="relative w-full lg:w-96">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by Invoice # or Vendor..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
                {["All", "New", "Review", "Approved", "Rejected"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      statusFilter === tab
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {tab}
                  </button>
                ))}

                <button
                  onClick={fetchInvoices}
                  title="Refresh Invoices"
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl flex items-center justify-center transition ml-2 cursor-pointer"
                >
                  <FiRefreshCw className={loading ? "animate-spin text-blue-600" : ""} size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Invoice Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr className="text-left text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    <th className="p-5">Invoice No</th>
                    <th className="p-5">Vendor</th>
                    <th className="p-5">Amount</th>
                    <th className="p-5">Date Received</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-gray-400 font-medium">
                        Loading invoices from inbox...
                      </td>
                    </tr>
                  ) : filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-gray-400 font-medium">
                        No invoices match your search or filter.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv) => (
                      <tr
                        key={inv.id || inv._id}
                        className="hover:bg-gray-50/80 transition"
                      >
                        <td className="p-5 font-bold text-blue-600">
                          {inv.invoice_number || `INV-${inv.id || inv._id}`}
                        </td>
                        <td className="p-5 font-semibold text-gray-800">
                          {inv.vendor || "Unknown Vendor"}
                        </td>
                        <td className="p-5 font-bold text-gray-800">
                          {inv.currency || "$"} {inv.total_amount?.toLocaleString() || "0.00"}
                        </td>
                        <td className="p-5 text-sm text-gray-500">
                          {formatDate(inv.invoice_date || inv.created_at)}
                        </td>
                        <td className="p-5">{getStatusBadge(inv.status)}</td>
                        <td className="p-5 text-right">
                          <button
                            onClick={() => navigate(`/review/${inv.id || inv._id}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow hover:shadow-md transition cursor-pointer"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-gray-50 border-t text-right text-xs text-gray-400">
              Showing {filteredInvoices.length} of {totalCount} total invoices
            </div>
          </div>

          {/* Dynamic Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white shadow-lg rounded-2xl p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Invoices</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {loading ? "..." : totalCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl">
                <FiFileText />
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">New / Extracted</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {loading ? "..." : newCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl">
                <FiClock />
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Under Review</p>
                <p className="text-3xl font-bold text-yellow-500 mt-2">
                  {loading ? "..." : reviewCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center text-xl">
                <FiAlertCircle />
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Approved</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {loading ? "..." : approvedCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-xl">
                <FiCheckCircle />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Invoice Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition"
            >
              <FiX size={24} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl">
                <FiUploadCloud />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Upload Invoice</h2>
                <p className="text-xs text-gray-500">AI will automatically extract vendor and line items.</p>
              </div>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-5">
              {/* File Dropzone */}
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-blue-500 hover:bg-blue-50/30 transition cursor-pointer relative">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg"
                  onChange={(e) => setNewFileName(e.target.files[0]?.name || "")}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <FiUploadCloud className="mx-auto text-3xl text-blue-500 mb-2" />
                <p className="text-sm font-semibold text-gray-700">
                  {newFileName ? newFileName : "Click or drag invoice PDF here"}
                </p>
                <p className="text-xs text-gray-400 mt-1">Supports PDF, PNG, JPG up to 10MB</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Vendor Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dell Technologies, HP Enterprise..."
                  value={newVendor}
                  onChange={(e) => setNewVendor(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                    Invoice Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. INV-2026-88"
                    value={newInvoiceNo}
                    onChange={(e) => setNewInvoiceNo(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                    Total Amount
                  </label>
                  <div className="flex">
                    <select
                      value={newCurrency}
                      onChange={(e) => setNewCurrency(e.target.value)}
                      className="bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl px-3 py-3 text-sm font-semibold text-gray-700 outline-none"
                    >
                      <option value="$">$</option>
                      <option value="€">€</option>
                      <option value="£">£</option>
                      <option value="¥">¥</option>
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 font-semibold text-sm transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition disabled:opacity-50"
                >
                  {creating ? "Extracting..." : "Create & Extract"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}