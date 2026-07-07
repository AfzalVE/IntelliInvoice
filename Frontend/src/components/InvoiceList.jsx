import { useMemo, useState } from "react";

export default function InvoiceList({
  loading,
  invoices = [],
  onEdit,
  onDelete,
}) {
  const [search, setSearch] = useState("");

  const filteredInvoices = useMemo(() => {
    const value = search.toLowerCase();

    return invoices.filter((invoice) => {
      return (
        invoice.vendor?.toLowerCase().includes(value) ||
        invoice.invoice_number?.toLowerCase().includes(value) ||
        invoice.po_number?.toLowerCase().includes(value) ||
        invoice.attachment_name?.toLowerCase().includes(value)
      );
    });
  }, [search, invoices]);

  function getStatusClass(status) {
    switch ((status || "").toUpperCase()) {
      case "APPROVED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      case "SUBMITTED":
        return "bg-blue-100 text-blue-700";

      case "DRAFT":
        return "bg-yellow-100 text-yellow-700";

      case "EXTRACTED":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-16 text-center text-lg">
        Loading invoices...
      </div>
    );
  }

  return (
    <>
      {/* Search */}

      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <input
          type="text"
          placeholder="Search Vendor, Invoice Number, PO Number or PDF..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-gray-50 border-b">

              <tr>

                <th className="px-6 py-4 text-left font-semibold">
                  PDF
                </th>

                <th className="px-6 py-4 text-left font-semibold">
                  Vendor
                </th>

                <th className="px-6 py-4 text-left font-semibold">
                  Invoice No
                </th>

                <th className="px-6 py-4 text-left font-semibold">
                  PO Number
                </th>

                <th className="px-6 py-4 text-left font-semibold">
                  Invoice Date
                </th>

                <th className="px-6 py-4 text-left font-semibold">
                  Due Date
                </th>

                <th className="px-6 py-4 text-right font-semibold">
                  Amount
                </th>

                <th className="px-6 py-4 text-center font-semibold">
                  Status
                </th>

                <th className="px-6 py-4 text-center font-semibold">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredInvoices.length === 0 && (
                <tr>

                  <td
                    colSpan={9}
                    className="text-center py-12 text-gray-400"
                  >
                    No invoices found.
                  </td>

                </tr>
              )}

              {filteredInvoices.map((invoice) => (

                <tr
                  key={invoice.id || invoice._id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  <td className="px-6 py-4 font-medium">
                    {invoice.attachment_name || "-"}
                  </td>

                  <td className="px-6 py-4">
                    {invoice.vendor || "-"}
                  </td>

                  <td className="px-6 py-4">
                    {invoice.invoice_number || "-"}
                  </td>

                  <td className="px-6 py-4">
                    {invoice.po_number || "-"}
                  </td>

                  <td className="px-6 py-4">
                    {invoice.invoice_date || "-"}
                  </td>

                  <td className="px-6 py-4">
                    {invoice.due_date || "-"}
                  </td>

                  <td className="px-6 py-4 text-right font-semibold">
                    {invoice.currency} {invoice.total_amount}
                  </td>

                  <td className="px-6 py-4 text-center">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                        invoice.status
                      )}`}
                    >
                      {invoice.status}
                    </span>

                  </td>

                  <td className="px-6 py-4">

                    <div className="flex justify-center gap-2">

                      {invoice.attachment_path && (
                        <a
                          href={invoice.attachment_path}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded-lg text-sm"
                        >
                          PDF
                        </a>
                      )}

                      <button
                        onClick={() => onEdit(invoice)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          onDelete(invoice.id || invoice._id)
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t">

          <div className="text-sm text-gray-500">
            Total Invoices:{" "}
            <span className="font-semibold">
              {filteredInvoices.length}
            </span>
          </div>

          <div className="text-sm text-gray-500">
            Invoice Management
          </div>

        </div>

      </div>
    </>
  );
}