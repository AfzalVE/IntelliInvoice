import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Approval() {
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
                Review the invoice and approve or reject it.
              </p>
            </div>

            <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold">
              Pending Approval
            </span>

          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* Left Section */}

            <div className="lg:col-span-2 space-y-6">

              {/* PDF Preview */}

              <div className="bg-white rounded-2xl shadow-lg p-6">

                <h2 className="text-xl font-bold mb-4">
                  Invoice Preview
                </h2>

                <div className="h-[550px] border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">

                  <div className="text-center">

                    <div className="text-6xl mb-3">📄</div>

                    <h3 className="text-xl font-semibold">
                      Invoice PDF Preview
                    </h3>

                    <p className="text-gray-500 mt-2">
                      The invoice PDF will appear here.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* Right Section */}

            <div className="space-y-6">

              {/* Invoice Summary */}

              <div className="bg-white rounded-2xl shadow-lg p-6">

                <h2 className="text-xl font-bold mb-5">
                  Invoice Details
                </h2>

                <div className="space-y-4">

                  <div>
                    <p className="text-gray-500 text-sm">Vendor</p>
                    <h3 className="font-semibold">
                      Dell Technologies
                    </h3>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">Invoice Number</p>
                    <h3 className="font-semibold">
                      INV-1001
                    </h3>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">PO Number</p>
                    <h3 className="font-semibold">
                      PO-2026-001
                    </h3>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">Invoice Date</p>
                    <h3 className="font-semibold">
                      06 Jul 2026
                    </h3>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">Due Date</p>
                    <h3 className="font-semibold">
                      20 Jul 2026
                    </h3>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">Total Amount</p>
                    <h2 className="text-3xl font-bold text-blue-600">
                      $2,450
                    </h2>
                  </div>

                </div>

              </div>

              {/* Comments */}

              <div className="bg-white rounded-2xl shadow-lg p-6">

                <h2 className="text-xl font-bold mb-4">
                  Approval Comments
                </h2>

                <textarea
                  rows="5"
                  placeholder="Enter your comments..."
                  className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* Signature */}

              <div className="bg-white rounded-2xl shadow-lg p-6">

                <h2 className="text-xl font-bold mb-4">
                  Digital Signature
                </h2>

                <div className="border-2 border-dashed rounded-xl h-28 flex items-center justify-center bg-gray-50">

                  <span className="text-gray-500">
                    Upload or Draw Signature
                  </span>

                </div>

                <button className="mt-4 w-full border border-blue-600 text-blue-600 py-3 rounded-xl hover:bg-blue-50">
                  Upload Signature
                </button>

              </div>

              {/* Action Buttons */}

              <div className="bg-white rounded-2xl shadow-lg p-6">

                <h2 className="text-xl font-bold mb-5">
                  Actions
                </h2>

                <div className="space-y-4">

                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold">
                    ✅ Approve Invoice
                  </button>

                  <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold">
                    ❌ Reject Invoice
                  </button>

                  <button className="w-full border border-gray-300 hover:bg-gray-100 py-3 rounded-xl font-semibold">
                    Save as Draft
                  </button>

                </div>

              </div>

            </div>

          </div>

          {/* Approval Timeline */}

          <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

            <h2 className="text-xl font-bold mb-6">
              Approval Timeline
            </h2>

            <div className="grid md:grid-cols-4 gap-6">

              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">
                  ✓
                </div>
                <p className="font-semibold mt-3">Invoice Received</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">
                  ✓
                </div>
                <p className="font-semibold mt-3">AI Extraction</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">
                  ✓
                </div>
                <p className="font-semibold mt-3">BA Review</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-yellow-500 text-white flex items-center justify-center mx-auto">
                  ⏳
                </div>
                <p className="font-semibold mt-3">Department Approval</p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}