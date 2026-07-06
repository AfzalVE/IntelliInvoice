import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await axios.post(
        "http://localhost:8000/auth/login", // Change to your API
        {
          email,
          password,
        }
      );

      // Save access token
      localStorage.setItem("accessToken", data.token.access_token);
      console.log("Access Token:", data.token.access_token);
      console.log(localStorage.getItem("accessToken"));

      // Optional: Save refresh token if returned
      if (data.token.refresh_token) {
        localStorage.setItem("refreshToken", data.token.refresh_token);
      }

      // Optional: Save user information
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate("/dashboard");
    } catch (err) {
      alert(
        err.response?.data?.detail ||
        "Invalid email or password."
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
          Automate invoice extraction, review,
          approval and document management with AI.
        </p>

        <div className="mt-14 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              📧
            </div>

            <div>
              <h3 className="font-semibold">Email Integration</h3>
              <p className="text-blue-100 text-sm">
                Download invoices automatically.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              🤖
            </div>

            <div>
              <h3 className="font-semibold">AI Extraction</h3>
              <p className="text-blue-100 text-sm">
                Read invoice details instantly.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              ✅
            </div>

            <div>
              <h3 className="font-semibold">Approval Workflow</h3>
              <p className="text-blue-100 text-sm">
                Digital approval & document tracking.
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
              Welcome Back
            </h2>

            <p className="text-slate-500 mt-2">
              Sign in to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8">
            <div className="relative mb-5">
              <Mail
                className="absolute left-4 top-4 text-gray-400"
                size={20}
              />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            </div>

            <div className="relative">
              <Lock
                className="absolute left-4 top-4 text-gray-400"
                size={20}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            </div>

            <div className="flex justify-between items-center mt-5 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember Me
              </label>

              <button
                type="button"
                className="text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
              <Link
                to="/register"
                className="text-blue-600 hover:underline"
              >
                Register
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {loading ? "Signing In..." : "Login"}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-8">
            © 2026 AI Invoice Processing System
          </p>
        </div>
      </div>
    </div>
  );
}