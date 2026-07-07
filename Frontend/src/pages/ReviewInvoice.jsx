import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import InvoiceList from "../components/InvoiceList";
import EditInvoice from "../components/EditInvoiceModal";

import { API } from "../services/api";

export default function ReviewInvoice() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);

  const [activeTab, setActiveTab] = useState("list");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  async function fetchInvoices() {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/invoice`);

      setInvoices(res.data.invoices || []);
    } catch (err) {
      console.log(err);
      alert("Unable to load invoices.");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(invoice) {
    setSelectedInvoice(invoice);
    setActiveTab("edit");
  }

  async function handleDelete(id) {
    try {
      await axios.delete(`${API}/invoice/${id}`);

      setInvoices((prev) =>
        prev.filter((item) => (item.id || item._id) !== id)
      );

      if (
        selectedInvoice &&
        (selectedInvoice.id || selectedInvoice._id) === id
      ) {
        setSelectedInvoice(null);
        setActiveTab("list");
      }
    } catch (err) {
      console.log(err);
      alert("Unable to delete invoice.");
    }
  }

  function handleBack() {
    setSelectedInvoice(null);
    setActiveTab("list");
  }

  async function handleUpdated() {
    await fetchInvoices();
    setActiveTab("list");
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
              <h1 className="text-3xl font-bold">
                Invoice Management
              </h1>

              <p className="text-gray-500 mt-2">
                Review and edit extracted invoices.
              </p>
            </div>

            <button
              onClick={fetchInvoices}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
            >
              Refresh
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b mb-6">
            <button
              onClick={() => setActiveTab("list")}
              className={`px-6 py-3 font-medium border-b-2 transition ${activeTab === "list"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-black"
                }`}
            >
              Invoice List
            </button>

            <button
              disabled={!selectedInvoice}
              onClick={() =>
                selectedInvoice && setActiveTab("edit")
              }
              className={`px-6 py-3 font-medium border-b-2 transition ${activeTab === "edit"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-black"
                } ${!selectedInvoice
                  ? "opacity-50 cursor-not-allowed"
                  : ""
                }`}
            >
              Edit Invoice
            </button>
          </div>

          {/* Content */}
          {activeTab === "list" ? (
            <InvoiceList
              loading={loading}
              invoices={invoices}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <EditInvoice
              open={true}
              invoice={selectedInvoice}
              onClose={handleBack}
              onUpdated={handleUpdated}
            />
          )}
        </div>
      </div>
    </div>
  );
}