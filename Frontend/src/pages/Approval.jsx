import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { API } from "../services/api";

export default function Approval() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Canvas ref for signature
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  // Signature tabs & saved signatures
  const [sigTab, setSigTab] = useState("draw"); // "draw" | "saved"
  const [savedSignatures, setSavedSignatures] = useState([]);
  const [selectedSigId, setSelectedSigId] = useState(null);
  const [loadingSigs, setLoadingSigs] = useState(false);

  // Authenticated PDF URL
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    fetchSubmittedInvoices();
    fetchSavedSignatures();
  }, []);

  useEffect(() => {
    if (selectedInvoice) {
      loadPdfPreview(selectedInvoice.id || selectedInvoice._id);
    } else {
      setPdfUrl(null);
    }
  }, [selectedInvoice]);

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

  async function fetchSubmittedInvoices() {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/invoice/`);
      // Filter for submitted invoices
      const submitted = (res.data.invoices || []).filter(
        (inv) => inv.status.toUpperCase() === "SUBMITTED"
      );
      setInvoices(submitted);
      if (submitted.length > 0) {
        setSelectedInvoice(submitted[0]);
      } else {
        setSelectedInvoice(null);
      }
    } catch (err) {
      console.log(err);
      alert("Failed to load submitted invoices.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchSavedSignatures() {
    try {
      setLoadingSigs(true);
      const res = await axios.get(`${API}/signatures/`);
      setSavedSignatures(res.data.signatures || []);
    } catch (err) {
      console.log("Error fetching saved signatures:", err);
    } finally {
      setLoadingSigs(false);
    }
  }

  async function handleDeleteSignature(sigId, e) {
    e.stopPropagation();
    if (!window.confirm("Delete this saved signature?")) return;
    try {
      await axios.delete(`${API}/signatures/${sigId}`);
      if (selectedSigId === sigId) setSelectedSigId(null);
      fetchSavedSignatures();
    } catch (err) {
      console.log("Error deleting signature:", err);
      alert("Failed to delete signature.");
    }
  }

  // Draw signature pad handlers
  useEffect(() => {
    if (selectedInvoice && canvasRef.current && sigTab === "draw") {
      initCanvas();
    }
  }, [selectedInvoice, sigTab]);

  function initCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#1e293b"; // dark charcoal color
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    // Set background color to white explicitly so it encodes nicely as PNG
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function getMousePos(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    // Support mouse or touch
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  function startDrawing(e) {
    e.preventDefault();
    isDrawing.current = true;
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getMousePos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function draw(e) {
    if (!isDrawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getMousePos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function stopDrawing() {
    isDrawing.current = false;
  }

  function clearCanvas() {
    initCanvas();
  }

  async function handleApprove() {
    if (!selectedInvoice) return;

    const payload = {
      comments: comments || "Approved by Department Head",
    };

    if (sigTab === "saved" && selectedSigId) {
      // Reuse a saved signature
      payload.signature_id = selectedSigId;
    } else if (sigTab === "draw") {
      // Get signature image from canvas
      const canvas = canvasRef.current;
      const signatureBase64 = canvas.toDataURL("image/png");
      payload.signature_base64 = signatureBase64;
    }

    try {
      setSubmitting(true);
      await axios.post(`${API}/invoice/${selectedInvoice.id || selectedInvoice._id}/approve`, payload);

      alert("Invoice approved successfully!");
      setComments("");
      setSelectedSigId(null);
      fetchSubmittedInvoices();
      fetchSavedSignatures(); // Refresh saved signatures (new one may have been auto-saved)
    } catch (err) {
      console.log(err);
      alert("Approval failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReject() {
    if (!selectedInvoice) return;
    if (!comments.trim()) {
      alert("Please enter rejection comments first.");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(`${API}/invoice/${selectedInvoice.id || selectedInvoice._id}/reject`, {
        comments: comments,
      });

      alert("Invoice rejected.");
      setComments("");
      fetchSubmittedInvoices();
    } catch (err) {
      console.log(err);
      alert("Rejection failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setSubmitting(false);
    }
  }

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
                Invoice Approval
              </h1>
              <p className="text-gray-500 mt-2">
                Review submitted invoices, add comments, and digitally sign them.
              </p>
            </div>
            <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold">
              Pending Invoices: {invoices.length}
            </span>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl shadow p-16 text-center text-lg">
              Loading submitted invoices...
            </div>
          ) : invoices.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-16 text-center text-lg text-gray-500">
              No invoices pending approval.
            </div>
          ) : (
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Left Selector Panel */}
              <div className="lg:col-span-1 space-y-4">
                <h3 className="font-bold text-gray-700 uppercase text-xs tracking-wider">
                  Select Submitted Invoice
                </h3>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {invoices.map((inv) => (
                    <button
                      key={inv.id || inv._id}
                      onClick={() => {
                        setSelectedInvoice(inv);
                        setComments("");
                      }}
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
                      <h2 className="text-xl font-bold">Invoice Preview</h2>
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

              {/* Right Section (Details & Action Panel) */}
              <div className="lg:col-span-1 space-y-6">
                {selectedInvoice && (
                  <>
                    {/* Details */}
                    <div className="bg-white rounded-2xl shadow p-6">
                      <h2 className="text-xl font-bold mb-4">Details</h2>
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
                          <p className="text-gray-500">Total Amount</p>
                          <h4 className="text-2xl font-extrabold text-blue-600 mt-1">
                            {selectedInvoice.currency} {selectedInvoice.total_amount?.toLocaleString()}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* Comments */}
                    <div className="bg-white rounded-2xl shadow p-6">
                      <h2 className="text-xl font-bold mb-3">Approver Comments</h2>
                      <textarea
                        rows="3"
                        placeholder="Add internal comments/notes..."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Signature — Tabbed Panel */}
                    <div className="bg-white rounded-2xl shadow p-6">
                      <h2 className="text-xl font-bold mb-3">Digital Signature</h2>

                      {/* Tab Selector */}
                      <div className="flex rounded-lg bg-gray-100 p-1 mb-4">
                        <button
                          onClick={() => {
                            setSigTab("draw");
                            setSelectedSigId(null);
                          }}
                          className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-all duration-200 ${
                            sigTab === "draw"
                              ? "bg-white text-blue-600 shadow-sm"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          ✏️ Draw New
                        </button>
                        <button
                          onClick={() => setSigTab("saved")}
                          className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-all duration-200 ${
                            sigTab === "saved"
                              ? "bg-white text-blue-600 shadow-sm"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          📂 Saved ({savedSignatures.length})
                        </button>
                      </div>

                      {/* Draw Tab */}
                      {sigTab === "draw" && (
                        <div>
                          <div className="flex justify-end mb-2">
                            <button
                              onClick={clearCanvas}
                              className="text-xs text-red-600 hover:text-red-700 font-semibold transition-colors"
                            >
                              Clear
                            </button>
                          </div>
                          <div className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-inner">
                            <canvas
                              ref={canvasRef}
                              width={240}
                              height={120}
                              onMouseDown={startDrawing}
                              onMouseMove={draw}
                              onMouseUp={stopDrawing}
                              onMouseLeave={stopDrawing}
                              onTouchStart={startDrawing}
                              onTouchMove={draw}
                              onTouchEnd={stopDrawing}
                              className="w-full h-[120px] cursor-crosshair block"
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-2 text-center">
                            Draw your signature inside the box above
                          </p>
                          <p className="text-xs text-green-600 mt-1 text-center font-medium">
                            ✓ Will be auto-saved for future use
                          </p>
                        </div>
                      )}

                      {/* Saved Signatures Tab */}
                      {sigTab === "saved" && (
                        <div>
                          {loadingSigs ? (
                            <div className="text-center text-gray-400 py-8 text-sm">
                              Loading saved signatures...
                            </div>
                          ) : savedSignatures.length === 0 ? (
                            <div className="text-center py-8">
                              <p className="text-4xl mb-2">✍️</p>
                              <p className="text-gray-500 text-sm font-medium">
                                No saved signatures yet
                              </p>
                              <p className="text-gray-400 text-xs mt-1">
                                Draw & approve once — it'll appear here automatically
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-3 max-h-[260px] overflow-y-auto pr-1">
                              {savedSignatures.map((sig) => (
                                <div
                                  key={sig.id}
                                  onClick={() => setSelectedSigId(sig.id)}
                                  className={`relative group rounded-xl border-2 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md ${
                                    selectedSigId === sig.id
                                      ? "border-blue-600 ring-2 ring-blue-200 shadow-md"
                                      : "border-gray-200 hover:border-blue-300"
                                  }`}
                                >
                                  {/* Selection checkmark */}
                                  {selectedSigId === sig.id && (
                                    <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center z-10">
                                      <span className="text-white text-xs font-bold">✓</span>
                                    </div>
                                  )}

                                  {/* Delete button */}
                                  <button
                                    onClick={(e) => handleDeleteSignature(sig.id, e)}
                                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 text-xs"
                                    title="Delete signature"
                                  >
                                    🗑
                                  </button>

                                  {/* Signature image */}
                                  <div className="bg-white p-1">
                                    <img
                                      src={`${API}/signatures/${sig.id}/image`}
                                      alt={sig.label}
                                      className="w-full h-[55px] object-contain"
                                    />
                                  </div>

                                  {/* Label */}
                                  <div className={`px-2 py-1.5 text-center border-t ${
                                    selectedSigId === sig.id
                                      ? "bg-blue-50 border-blue-200"
                                      : "bg-gray-50 border-gray-100"
                                  }`}>
                                    <p className="text-[10px] font-semibold text-gray-700 truncate">
                                      {sig.label}
                                    </p>
                                    <p className="text-[9px] text-gray-400">
                                      {new Date(sig.created_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="bg-white rounded-2xl shadow p-6 space-y-3">
                      <button
                        onClick={handleApprove}
                        disabled={submitting || (sigTab === "saved" && !selectedSigId)}
                        className={`w-full font-semibold py-3 rounded-xl shadow transition ${
                          submitting || (sigTab === "saved" && !selectedSigId)
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                      >
                        {submitting ? "Signing..." : "✅ Approve & Sign"}
                      </button>
                      {sigTab === "saved" && !selectedSigId && (
                        <p className="text-xs text-amber-600 text-center font-medium">
                          Select a saved signature to approve
                        </p>
                      )}
                      <button
                        onClick={handleReject}
                        disabled={submitting}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl shadow transition"
                      >
                        ❌ Reject
                      </button>
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