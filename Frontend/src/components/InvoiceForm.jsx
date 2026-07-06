export default function InvoiceForm() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">
        AI Extracted Details
      </h2>

      <div className="grid grid-cols-1 gap-5">

        <div>
          <label className="text-gray-600 text-sm">
            Vendor
          </label>

          <input
            defaultValue="Dell Technologies"
            className="w-full border rounded-lg p-3 mt-2"
          />
        </div>

        <div>
          <label className="text-gray-600 text-sm">
            Invoice Number
          </label>

          <input
            defaultValue="INV-1001"
            className="w-full border rounded-lg p-3 mt-2"
          />
        </div>

        <div>
          <label className="text-gray-600 text-sm">
            PO Number
          </label>

          <input
            defaultValue="PO-2026-001"
            className="w-full border rounded-lg p-3 mt-2"
          />
        </div>

        <div>
          <label className="text-gray-600 text-sm">
            Invoice Date
          </label>

          <input
            type="date"
            className="w-full border rounded-lg p-3 mt-2"
          />
        </div>

        <div>
          <label className="text-gray-600 text-sm">
            Due Date
          </label>

          <input
            type="date"
            className="w-full border rounded-lg p-3 mt-2"
          />
        </div>

        <div>
          <label className="text-gray-600 text-sm">
            Currency
          </label>

          <select className="w-full border rounded-lg p-3 mt-2">

            <option>AUD</option>
            <option>USD</option>
            <option>INR</option>

          </select>

        </div>

        <div>
          <label className="text-gray-600 text-sm">
            Tax
          </label>

          <input
            defaultValue="$120"
            className="w-full border rounded-lg p-3 mt-2"
          />
        </div>

        <div>
          <label className="text-gray-600 text-sm">
            Total Amount
          </label>

          <input
            defaultValue="$2450"
            className="w-full border rounded-lg p-3 mt-2 font-bold text-blue-600"
          />
        </div>

      </div>

      <div className="mt-8">

        <h3 className="font-bold text-lg mb-4">
          BA Comments
        </h3>

        <textarea
          rows="5"
          placeholder="Write your comments..."
          className="w-full border rounded-xl p-4"
        />

      </div>

      <div className="flex gap-4 mt-8">

        <button className="border px-5 py-3 rounded-xl hover:bg-gray-100">
          Save Draft
        </button>

        <button className="bg-orange-500 text-white px-5 py-3 rounded-xl hover:bg-orange-600">
          Request Changes
        </button>

        <button className="bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700">
          Submit for Approval
        </button>

      </div>

    </div>
  );
}