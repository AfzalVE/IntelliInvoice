import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  FiUser,
  FiSave,
  FiCheckCircle,
  FiTrash2,
  FiAlertTriangle,
} from "react-icons/fi";

const API = "http://localhost:8000";

export default function Settings() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDeleteAccount = async () => {
    setDeleteError("");
    try {
      setDeleteLoading(true);
      const token = localStorage.getItem("accessToken");
      if (token) {
        await axios.delete(`${API}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      localStorage.clear();
      navigate("/");
    } catch (err) {
      setDeleteError(
        err.response?.data?.detail || "Failed to delete account. Please try again."
      );
      setDeleteLoading(false);
    }
  };

  const userName = localStorage.getItem("userName") || "User";
  const userEmail = localStorage.getItem("userEmail") || "user@intellii-invoice.ai";
  const role = (localStorage.getItem("role") || "BA").toUpperCase();

  // Form states
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const getRoleLabel = () => {
    if (role === "BA") return "Business Analyst (Editor & Reviewer)";
    if (role === "ADMIN") return "Admin Head (Approver & Signer)";
    if (role === "FINANCE") return "Finance Team (Austria BMS Entry)";
    return role;
  };

  const getDepartment = () => {
    if (role === "BA") return "BA";
    if (role === "ADMIN") return "Admin";
    if (role === "FINANCE") return "Finance";
    return role;
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Account Settings
              </h1>
              <p className="text-gray-500 mt-1">
                Manage your profile information and account preferences.
              </p>
            </div>

            {saved && (
              <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl font-semibold text-sm animate-bounce">
                <FiCheckCircle size={18} />
                Settings saved successfully!
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSave} className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-4 flex items-center gap-2">
                <FiUser className="text-blue-600" size={22} />
                Profile Information
              </h2>

              <div className="flex items-center gap-6">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff&size=128`}
                  alt="avatar"
                  className="w-20 h-20 rounded-full shadow-md border-2 border-blue-500"
                />
                <div>
                  <h3 className="font-bold text-gray-800">{name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{getRoleLabel()}</p>
                  <span className="inline-block mt-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                    Active Role: {role}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department / Organization
                </label>
                <input
                  type="text"
                  disabled
                  value={getDepartment()}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed font-medium"
                />
              </div>

              <div className="pt-4 border-t flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg hover:shadow-xl"
                >
                  <FiSave />
                  Save Changes
                </button>
              </div>

              <div className="pt-6 mt-8 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-red-600 flex items-center gap-2">
                    <FiTrash2 /> Delete Account
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm hover:shadow"
                >
                  Delete Account...
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              <FiAlertTriangle size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 text-center mb-2">Delete Account?</h3>
            <p className="text-slate-500 text-sm text-center mb-6">
              Are you sure you want to permanently delete your account (<span className="font-semibold text-slate-700">{userEmail}</span>)? All your invoices, reviews, and data will be permanently removed.
            </p>

            {deleteError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                {deleteError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteError("");
                }}
                disabled={deleteLoading}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3.5 rounded-xl font-semibold transition shadow-lg"
              >
                {deleteLoading ? "Deleting..." : "Yes, Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
