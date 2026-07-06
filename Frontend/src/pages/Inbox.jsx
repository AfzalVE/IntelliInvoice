import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const invoices = [
  {
    id: "INV-1001",
    vendor: "Dell Technologies",
    amount: "$2,450",
    date: "06 Jul 2026",
    status: "New",
  },
  {
    id: "INV-1002",
    vendor: "HP Enterprise",
    amount: "$1,780",
    date: "05 Jul 2026",
    status: "Review",
  },
  {
    id: "INV-1003",
    vendor: "Lenovo",
    amount: "$920",
    date: "04 Jul 2026",
    status: "Approved",
  },
  {
    id: "INV-1004",
    vendor: "Apple Inc.",
    amount: "$4,250",
    date: "03 Jul 2026",
    status: "Pending",
  },
];

export default function Inbox() {
  return (
    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-8">

          {/* Header */}

          <div className="flex justify-between items-center mb-6">

            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Invoice Inbox
              </h1>

              <p className="text-gray-500 mt-1">
                View all invoices received from Gmail.
              </p>
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow">
              + Upload Invoice
            </button>

          </div>

          {/* Search & Buttons */}

          <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">

            <div className="flex flex-col md:flex-row gap-4 justify-between">

              <input
                type="text"
                placeholder="Search by Invoice or Vendor..."
                className="border rounded-xl px-4 py-3 w-full md:w-96 focus:ring-2 focus:ring-blue-400 outline-none"
              />

              <div className="flex gap-3">

                <button className="border px-5 py-3 rounded-xl hover:bg-gray-100">
                  Filter
                </button>

                <button className="border px-5 py-3 rounded-xl hover:bg-gray-100">
                  Refresh
                </button>

              </div>

            </div>

          </div>

          {/* Invoice Table */}

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr className="text-left text-gray-700">

                  <th className="p-4">Invoice No</th>
                  <th className="p-4">Vendor</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>

                </tr>

              </thead>

              <tbody>

                {invoices.map((invoice) => (

                  <tr
                    key={invoice.id}
                    className="border-b hover:bg-gray-50 transition"
                  >

                    <td className="p-4 font-semibold text-blue-600">
                      {invoice.id}
                    </td>

                    <td className="p-4">{invoice.vendor}</td>

                    <td className="p-4">{invoice.amount}</td>

                    <td className="p-4">{invoice.date}</td>

                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium
                        ${
                          invoice.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : invoice.status === "Review"
                            ? "bg-yellow-100 text-yellow-700"
                            : invoice.status === "Pending"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {invoice.status}
                      </span>

                    </td>

                    <td className="p-4">

                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                        View
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* Summary Cards */}

          <div className="grid md:grid-cols-4 gap-5 mt-8">

            <div className="bg-white shadow rounded-2xl p-6">
              <h3 className="text-gray-500">Total Invoices</h3>
              <p className="text-3xl font-bold mt-2">248</p>
            </div>

            <div className="bg-white shadow rounded-2xl p-6">
              <h3 className="text-gray-500">New</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">42</p>
            </div>

            <div className="bg-white shadow rounded-2xl p-6">
              <h3 className="text-gray-500">Under Review</h3>
              <p className="text-3xl font-bold text-yellow-500 mt-2">19</p>
            </div>

            <div className="bg-white shadow rounded-2xl p-6">
              <h3 className="text-gray-500">Approved</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">187</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}