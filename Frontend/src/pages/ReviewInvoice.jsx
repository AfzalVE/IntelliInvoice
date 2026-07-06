import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function ReviewInvoice() {
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
                Review Invoice
              </h1>

              <p className="text-gray-500 mt-2">
                Verify AI extracted invoice information before approval.
              </p>
            </div>

            <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold">
              Pending Review
            </span>

          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* LEFT SIDE */}

            <div className="lg:col-span-2">

              <div className="bg-white rounded-2xl shadow-lg p-6">

                <div className="flex justify-between items-center mb-5">

                  <h2 className="text-xl font-bold">
                    Invoice Preview
                  </h2>

                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Download PDF
                  </button>

                </div>

                <div className="h-[700px] border-2 border-dashed rounded-xl bg-gray-50 flex items-center justify-center">

                  <div className="text-center">

                    <div className="text-7xl mb-4">
                      📄
                    </div>

                    <h2 className="text-xl font-semibold">
                      Invoice PDF Preview
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Display uploaded invoice here.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* RIGHT SIDE */}

            <div>

              <div className="bg-white rounded-2xl shadow-lg p-6">

                <h2 className="text-xl font-bold mb-6">
                  AI Extracted Information
                </h2>

                <div className="space-y-5">

                  <div>
                    <label className="block text-sm text-gray-500 mb-2">
                      Vendor
                    </label>

                    <input
                      defaultValue="Dell Technologies"
                      className="w-full border rounded-lg p-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-2">
                      Invoice Number
                    </label>

                    <input
                      defaultValue="INV-1001"
                      className="w-full border rounded-lg p-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-2">
                      PO Number
                    </label>

                    <input
                      defaultValue="PO-2026-001"
                      className="w-full border rounded-lg p-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-2">
                      Invoice Date
                    </label>

                    <input
                      type="date"
                      className="w-full border rounded-lg p-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-2">
                      Due Date
                    </label>

                    <input
                      type="date"
                      className="w-full border rounded-lg p-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-2">
                      Currency
                    </label>

                    <select className="w-full border rounded-lg p-3">

                      <option>AUD</option>
                      <option>USD</option>
                      <option>INR</option>

                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-2">
                      Tax
                    </label>

                    <input
                      defaultValue="$120"
                      className="w-full border rounded-lg p-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-2">
                      Total Amount
                    </label>

                    <input
                      defaultValue="$2450"
                      className="w-full border rounded-lg p-3 font-bold text-blue-600"
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

              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                + Add Item
              </button>

            </div>

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="text-left p-4">Item</th>
                  <th className="text-left p-4">Quantity</th>
                  <th className="text-left p-4">Unit Price</th>
                  <th className="text-left p-4">Total</th>

                </tr>

              </thead>

              <tbody>

                <tr className="border-b">

                  <td className="p-4">Laptop</td>
                  <td className="p-4">2</td>
                  <td className="p-4">$1200</td>
                  <td className="p-4">$2400</td>

                </tr>

                <tr>

                  <td className="p-4">GST</td>
                  <td className="p-4">-</td>
                  <td className="p-4">$50</td>
                  <td className="p-4">$50</td>

                </tr>

              </tbody>

            </table>

          </div>

          {/* Comments */}

          <div className="bg-white rounded-2xl shadow-lg mt-8 p-6">

            <h2 className="text-xl font-bold mb-4">
              BA Comments
            </h2>

            <textarea
              rows="5"
              placeholder="Write comments..."
              className="w-full border rounded-xl p-4"
            />

          </div>

          {/* Action Buttons */}

          <div className="flex justify-end gap-4 mt-8">

            <button className="border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-100">
              Save Draft
            </button>

            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl">
              Request Changes
            </button>

            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl">
              Submit for Approval
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}