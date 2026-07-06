import { FiDownload, FiPrinter } from "react-icons/fi";

export default function PDFViewer() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-xl font-bold">
          Invoice PDF
        </h2>

        <div className="flex gap-3">

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <FiDownload />
            Download
          </button>

          <button className="border px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2">
            <FiPrinter />
            Print
          </button>

        </div>

      </div>

      <div className="h-[700px] border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex items-center justify-center">

        <div className="text-center">

          <div className="text-8xl mb-4">
            📄
          </div>

          <h2 className="text-2xl font-bold">
            Invoice PDF Preview
          </h2>

          <p className="text-gray-500 mt-2">
            PDF will be displayed here after upload.
          </p>

        </div>

      </div>

    </div>
  );
}