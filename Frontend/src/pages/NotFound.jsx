import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center px-6">

      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center">

        {/* Error Code */}

        <h1 className="text-8xl font-extrabold text-blue-600">
          404
        </h1>

        <h2 className="text-3xl font-bold text-gray-800 mt-4">
          Page Not Found
        </h2>

        <p className="text-gray-500 mt-4 leading-7">
          Sorry, the page you are looking for doesn't exist or has been moved.
          Please return to the dashboard.
        </p>

        {/* Illustration */}

        <div className="text-8xl mt-8">
          📄
        </div>

        {/* Action Buttons */}

        <div className="flex justify-center gap-4 mt-10">

          <Link
            to="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition"
          >
            Go to Dashboard
          </Link>

          <Link
            to="/"
            className="border border-gray-300 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition"
          >
            Back to Login
          </Link>

        </div>

        {/* Footer */}

        <div className="border-t mt-10 pt-6 text-sm text-gray-400">
          AI Invoice Processing System • 2026
        </div>

      </div>

    </div>
  );
}