import { FiEye, FiDownload } from "react-icons/fi";

const invoices = [
  {
    id: "INV-1001",
    vendor: "Dell Technologies",
    amount: "$2,450",
    status: "Pending",
    date: "06 Jul 2026",
  },
  {
    id: "INV-1002",
    vendor: "HP Enterprise",
    amount: "$1,850",
    status: "Approved",
    date: "05 Jul 2026",
  },
  {
    id: "INV-1003",
    vendor: "Apple Inc.",
    amount: "$4,250",
    status: "Review",
    date: "04 Jul 2026",
  },
];

export default function InvoiceTable() {
  const statusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Review":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

      <div className="flex justify-between items-center p-6 border-b">

        <h2 className="text-xl font-bold">
          Recent Invoices
        </h2>

        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
          View All
        </button>

      </div>

      <table className="w-full">

        <thead className="bg-gray-50">

          <tr>

            <th className="text-left p-4">Invoice</th>
            <th className="text-left p-4">Vendor</th>
            <th className="text-left p-4">Amount</th>
            <th className="text-left p-4">Date</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Action</th>

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
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor(
                    invoice.status
                  )}`}
                >
                  {invoice.status}
                </span>

              </td>

              <td className="p-4 flex gap-3">

                <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
                  <FiEye />
                </button>

                <button className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700">
                  <FiDownload />
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}