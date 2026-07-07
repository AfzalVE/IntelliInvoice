import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, ShieldCheck } from "lucide-react";
import axios from "axios";

import { API } from "../services/api";

const ROLE_HOME = {
  BA: "/review/1",
  ADMIN: "/approval",
  FINANCE: "/finance-inbox",
};

const ROLES = [
  {
    value: "BA",
    label: "Business Analyst (BA)",
    desc: "Review, edit and submit invoices for approval",
    color: "blue",
  },
  {
    value: "ADMIN",
    label: "Admin Head",
    desc: "Approve or reject submitted invoices with digital signature",
    color: "purple",
  },
  {
    value: "FINANCE",
    label: "Finance Team",
    desc: "Receive approved invoices and add BMS entry notes",
    color: "green",
  },
];

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "BA",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");

    if (newPassword !== confirmNewPassword) {
      setForgotError("Passwords do not match.");
      return;
    }

    try {
      setForgotLoading(true);
      const { data } = await axios.post(`${API}/auth/reset-password`, {
        email: forgotEmail,
        new_password: newPassword,
      });
      setForgotSuccess(data.message || "Password reset successfully!");
    } catch (err) {
      setForgotError(
        err.response?.data?.detail || "Failed to reset password. Please check your email."
      );
    } finally {
      setForgotLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(`${API}/auth/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      // Save session
      if (data.token?.access_token) {
        localStorage.setItem("accessToken", data.token.access_token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", data.user.role || "BA");
        localStorage.setItem("userName", data.user.name || "");
      }

      const role = (data.user?.role || "BA").toUpperCase();
      navigate(ROLE_HOME[role] || "/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white flex-col justify-center px-20">
        <h1 className="text-5xl font-bold leading-tight">
          IntelliInvoice
          <br />
          <span className="text-blue-300">3-Role Workflow</span>
        </h1>
        <p className="mt-6 text-lg text-blue-100 leading-8">
          Choose your role and join the automated invoice management workflow.
        </p>
        <div className="mt-12 space-y-5">
          {ROLES.map((r) => (
            <div
              key={r.value}
              className={`flex items-start gap-4 p-4 rounded-xl ${
                form.role === r.value ? "bg-white/20" : "bg-white/5"
              } transition`}
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 font-bold text-sm">
                {r.value}
              </div>
              <div>
                <h3 className="font-semibold">{r.label}</h3>
                <p className="text-blue-100 text-sm mt-0.5">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex justify-center items-center bg-slate-100 p-8">
        <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl shadow-lg">
              AI
            </div>
            <h2 className="text-3xl font-bold mt-6 text-slate-800">Create Account</h2>
            <p className="text-slate-500 mt-2">Register to get started</p>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="mt-8 space-y-4">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-4 top-4 text-gray-400" size={20} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            </div>

            {/* Role Selector */}
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-4 text-gray-400" size={20} />
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition appearance-none bg-white"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-xl text-lg font-semibold transition-all shadow-lg"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <div className="flex justify-between items-center text-sm text-gray-500 mt-6">
            <span>
              Already have an account?{" "}
              <Link to="/" className="text-blue-600 hover:underline font-medium">
                Login
              </Link>
            </span>
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-blue-600 hover:underline font-medium"
            >
              Forgot Password?
            </button>
          </div>

          <p className="text-center text-gray-400 text-sm mt-4">
            © 2026 IntelliInvoice — AI Invoice Processing System
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Reset Password</h3>
            <p className="text-slate-500 text-sm mb-6">
              Enter your registered email address and set a new password for your account.
            </p>

            {forgotError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                {forgotError}
              </div>
            )}

            {forgotSuccess ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  ✓
                </div>
                <p className="text-green-700 font-semibold mb-6">
                  {forgotSuccess}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSuccess("");
                    setForgotEmail("");
                    setNewPassword("");
                    setConfirmNewPassword("");
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition shadow-lg"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
                  <input
                    type="email"
                    placeholder="Registered Email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      setForgotError("");
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3.5 rounded-xl font-semibold transition shadow-lg"
                  >
                    {forgotLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}