import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  FiUser,
  FiBell,
  FiLock,
  FiMonitor,
  FiSave,
  FiCheckCircle,
} from "react-icons/fi";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);

  const userName = localStorage.getItem("userName") || "User";
  const userEmail = localStorage.getItem("userEmail") || "user@intellii-invoice.ai";
  const role = (localStorage.getItem("role") || "BA").toUpperCase();

  // Form states
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [approvalReminders, setApprovalReminders] = useState(true);
  const [aiWarnings, setAiWarnings] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const getRoleLabel = () => {
    if (role === "BA") return "Business Analyst (Editor & Reviewer)";
    if (role === "ADMIN") return "Admin Head (Approver & Signer)";
    if (role === "FINANCE") return "Finance Team (Austria BMS Entry)";
    return role;
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Account Settings
              </h1>
              <p className="text-gray-500 mt-1">
                Manage your profile, notifications, appearance, and security preferences.
              </p>
            </div>

            {saved && (
              <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl font-semibold text-sm animate-bounce">
                <FiCheckCircle size={18} />
                Settings saved successfully!
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="bg-white rounded-2xl p-4 shadow-lg space-y-2 h-fit">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                  activeTab === "profile"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiUser size={18} />
                Profile Information
              </button>

              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                  activeTab === "notifications"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiBell size={18} />
                Notifications & Alerts
              </button>

              <button
                onClick={() => setActiveTab("appearance")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                  activeTab === "appearance"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiMonitor size={18} />
                Appearance & Theme
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                  activeTab === "security"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiLock size={18} />
                Security & Password
              </button>
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-3 bg-white rounded-2xl shadow-lg p-8">
              {activeTab === "profile" && (
                <form onSubmit={handleSave} className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 border-b pb-4">
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
                      value="IntelliInvoice AI — European & Global Operations"
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
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
                </form>
              )}

              {activeTab === "notifications" && (
                <form onSubmit={handleSave} className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 border-b pb-4">
                    Notifications & Alerts
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <h4 className="font-semibold text-gray-800">Email Notifications</h4>
                        <p className="text-xs text-gray-500">Receive email digests when new invoices are submitted or approved.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={emailAlerts}
                        onChange={(e) => setEmailAlerts(e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <h4 className="font-semibold text-gray-800">Approval Reminders</h4>
                        <p className="text-xs text-gray-500">Get push notifications when invoices require your immediate review or signature.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={approvalReminders}
                        onChange={(e) => setApprovalReminders(e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <h4 className="font-semibold text-gray-800">AI Extraction Warnings</h4>
                        <p className="text-xs text-gray-500">Alert when AI extraction confidence score is below 90% on newly uploaded PDFs.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={aiWarnings}
                        onChange={(e) => setAiWarnings(e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg"
                    >
                      <FiSave />
                      Save Preferences
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "appearance" && (
                <form onSubmit={handleSave} className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 border-b pb-4">
                    Appearance & Theme
                  </h2>

                  <div className="grid grid-cols-3 gap-6">
                    <div
                      onClick={() => setTheme("light")}
                      className={`p-4 rounded-xl border-2 cursor-pointer text-center transition ${
                        theme === "light"
                          ? "border-blue-600 bg-blue-50/50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-full h-24 bg-gray-100 rounded-lg mb-3 border flex items-center justify-center font-bold text-gray-700">
                        ☀️ Light Mode
                      </div>
                      <span className="font-semibold text-sm text-gray-800">Light</span>
                    </div>

                    <div
                      onClick={() => setTheme("dark")}
                      className={`p-4 rounded-xl border-2 cursor-pointer text-center transition ${
                        theme === "dark"
                          ? "border-blue-600 bg-blue-50/50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-full h-24 bg-slate-900 rounded-lg mb-3 border border-slate-700 flex items-center justify-center font-bold text-white">
                        🌙 Dark Mode
                      </div>
                      <span className="font-semibold text-sm text-gray-800">Dark</span>
                    </div>

                    <div
                      onClick={() => setTheme("system")}
                      className={`p-4 rounded-xl border-2 cursor-pointer text-center transition ${
                        theme === "system"
                          ? "border-blue-600 bg-blue-50/50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-full h-24 bg-gradient-to-r from-gray-100 to-slate-900 rounded-lg mb-3 border flex items-center justify-center font-bold text-gray-700">
                        💻 System
                      </div>
                      <span className="font-semibold text-sm text-gray-800">System Default</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg"
                    >
                      <FiSave />
                      Apply Theme
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "security" && (
                <form onSubmit={(e) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 3000); }} className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 border-b pb-4">
                    Security & Password
                  </h2>

                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg"
                    >
                      <FiSave />
                      Update Password
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
