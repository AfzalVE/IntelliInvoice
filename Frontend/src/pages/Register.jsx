import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        "http://localhost:8000/auth/register",
        {
          name: form.name,
          email: form.email,
          password: form.password,
        }
      );

      // Save tokens if backend returns them
      if (data.access_token) {
        localStorage.setItem("accessToken", data.access_token);
      }

      if (data.refresh_token) {
        localStorage.setItem("refreshToken", data.refresh_token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // If backend doesn't auto-login after registration,
      // replace this with navigate("/login")
      navigate("/dashboard");
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white flex-col justify-center px-20">
        <h1 className="text-5xl font-bold leading-tight">
          AI Invoice
          <br />
          Processing System
        </h1>

        <p className="mt-6 text-lg text-blue-100 leading-8">
          Create your account to automate invoice extraction,
          document management and approval workflows.
        </p>

        <div className="mt-14 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              📧
            </div>

            <div>
              <h3 className="font-semibold">
                Gmail Integration
              </h3>

              <p className="text-blue-100 text-sm">
                Automatically receive invoice emails.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              🤖
            </div>

            <div>
              <h3 className="font-semibold">
                AI Processing
              </h3>

              <p className="text-blue-100 text-sm">
                Extract invoice data within seconds.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              ✅
            </div>

            <div>
              <h3 className="font-semibold">
                Secure Platform
              </h3>

              <p className="text-blue-100 text-sm">
                Store and manage invoices securely.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex justify-center items-center bg-slate-100 p-8">
        <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl shadow-lg">
              AI
            </div>

            <h2 className="text-3xl font-bold mt-6 text-slate-800">
              Create Account
            </h2>

            <p className="text-slate-500 mt-2">
              Register to get started
            </p>
          </div>

          <form onSubmit={handleRegister} className="mt-8 space-y-5">
            <div className="relative">
              <User
                className="absolute left-4 top-4 text-gray-400"
                size={20}
              />

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>

            <div className="relative">
              <Mail
                className="absolute left-4 top-4 text-gray-400"
                size={20}
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>

            <div className="relative">
              <Lock
                className="absolute left-4 top-4 text-gray-400"
                size={20}
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>

            <div className="relative">
              <Lock
                className="absolute left-4 top-4 text-gray-400"
                size={20}
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-xl text-lg font-semibold transition"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Login
            </Link>
          </p>

          <p className="text-center text-gray-400 text-sm mt-8">
            © 2026 AI Invoice Processing System
          </p>
        </div>
      </div>
    </div>
  );
}   