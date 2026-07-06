import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const approvedInvoices = [
  {
    id: "INV-1001",
    vendor: "Dell Technologies",
    amount: "$2,450",
    approvedBy: "John Smith",
    date: "06 Jul 2026",
    comments: "Approved for payment",
  },
  {
    id: "INV-1002",
    vendor: "HP Enterprise",
    amount: "$1,780",
    approvedBy: "Emma Wilson",
    date: "05 Jul 2026",
    comments: "Budget verified",
  },
  {
    id: "INV-1003",
    vendor: "Apple Inc.",
    amount: "$4,250",
    approvedBy: "Michael Lee",
    date: "04 Jul 2026",
    comments: "Urgent purchase",
  },
  {
    id: "INV-1004",
    vendor: "Lenovo",
    amount: "$920",
    approvedBy: "David Brown",
    date: "03 Jul 2026",
    comments: "Approved",
  },
];

export default function Approved() {
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
                All invoices approved by the Department Head.
              </p>

            </div>

            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg">
              Export Report
            </button>

          </div>

          {/* Summary */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            <div className="bg-white rounded-2xl shadow p-6">

              <p className="text-gray-500">
                Approved Today
              </p>

              <h2 className="text-4xl font-bold mt-2 text-green-600">
                24
              </h2>

            </div>

            <div className="bg-white rounded-2xl shadow p-6">

              <p className="text-gray-500">
                Total Approved
              </p>

              <h2 className="text-4xl font-bold mt-2 text-blue-600">
                1,248
              </h2>

            </div>

            <div className="bg-white rounded-2xl shadow p-6">

              <p className="text-gray-500">
                Total Amount
              </p>

              <h2 className="text-4xl font-bold mt-2 text-purple-600">
                $254K
              </h2>

            </div>

          </div>

          {/* Search */}

          <div className="bg-white rounded-2xl shadow p-5 mb-6">

            <div className="flex flex-col md:flex-row gap-4 justify-between">

              <input
                type="text"
                placeholder="Search Invoice..."
                className="border rounded-xl px-4 py-3 w-full md:w-96 outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Table */}

          <div className="bg-white rounded-2xl shadow overflow-hidden">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="text-left p-4">Invoice</th>
                  <th className="text-left p-4">Vendor</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Approved By</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>

                </tr>

              </thead>

              <tbody>

                {approvedInvoices.map((invoice) => (

                  <tr
                    key={invoice.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-4 font-semibold text-blue-600">
                      {invoice.id}
                    </td>

                    <td className="p-4">
                      {invoice.vendor}
                    </td>

                    <td className="p-4">
                      {invoice.amount}
                    </td>

                    <td className="p-4">
                      {invoice.approvedBy}
                    </td>

                    <td className="p-4">
                      {invoice.date}
                    </td>

                    <td className="p-4">

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        Approved
                      </span>

                    </td>

                    <td className="p-4 flex gap-2">

                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        View
                      </button>

                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                        Download PDF
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* Recent Approvals */}

          <div className="mt-8 bg-white rounded-2xl shadow p-6">

            <h2 className="text-xl font-bold mb-5">
              Recent Approval Activity
            </h2>

            <div className="space-y-4">

              <div className="flex justify-between border-b pb-3">

                <div>

                  <p className="font-semibold">
                    Dell Technologies Invoice Approved
                  </p>

                  <p className="text-gray-500 text-sm">
                    Approved by John Smith
                  </p>

                </div>

                <span className="text-gray-400">
                  5 min ago
                </span>

              </div>

              <div className="flex justify-between border-b pb-3">

                <div>

                  <p className="font-semibold">
                    HP Enterprise Invoice Approved
                  </p>

                  <p className="text-gray-500 text-sm">
                    Approved by Emma Wilson
                  </p>

                </div>

                <span className="text-gray-400">
                  20 min ago
                </span>

              </div>

              <div className="flex justify-between">

                <div>

                  <p className="font-semibold">
                    Apple Inc Invoice Approved
                  </p>

                  <p className="text-gray-500 text-sm">
                    Approved by Michael Lee
                  </p>

                </div>

                <span className="text-gray-400">
                  1 hour ago
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}