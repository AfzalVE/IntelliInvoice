import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import {
  FiFileText,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiActivity,
} from "react-icons/fi";

const API = "http://localhost:8000";

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const userName = localStorage.getItem("userName") || "User";
  const role = (localStorage.getItem("role") || "BA").toUpperCase();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/invoice?view=all`);
      setInvoices(res.data.invoices || []);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }

  // Calculate statistics dynamically
  const totalInvoices = invoices.length;
  
  const pendingReview = invoices.filter((inv) => {
    const s = (inv.status || "").toUpperCase();
    return s === "DRAFT" || s === "EXTRACTED" || s === "REVIEW";
  }).length;

  const pendingApproval = invoices.filter((inv) => {
    const s = (inv.status || "").toUpperCase();
    return s === "SUBMITTED";
  }).length;

  const approved = invoices.filter((inv) => {
    const s = (inv.status || "").toUpperCase();
    return s === "APPROVED";
  }).length;

  // Helper for Status Badge
  function getStatusBadge(status) {
    const s = (status || "").toUpperCase();
    switch (s) {
      case "APPROVED":
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
            Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
            Rejected
          </span>
        );
      case "SUBMITTED":
        return (
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
            Pending Approval
          </span>
        );
      case "DRAFT":
      case "EXTRACTED":
      case "REVIEW":
        return (
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
            Pending Review
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
            {status || "Unknown"}
          </span>
        );
    }
  }

  // Helper for relative timestamps in Activity feed
  function getRelativeTime(dateString) {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes > 1 ? "s" : ""} ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  }

  // Helper to generate dynamic activity content
  function getActivityDetails(inv) {
    const s = (inv.status || "").toUpperCase();
    const invNo = inv.invoice_number || `INV-${inv.id || inv._id}`;
    const vendor = inv.vendor || "Vendor";
    const amount = `${inv.currency || "$"}${inv.total_amount?.toLocaleString() || "0"}`;

    switch (s) {
      case "APPROVED":
        return {
          title: `Invoice ${invNo} Approved`,
          desc: `Admin Head approved ${vendor} invoice (${amount})`,
          dotColor: "bg-green-500",
        };
      case "REJECTED":
        return {
          title: `Invoice ${invNo} Rejected`,
          desc: `Admin Head rejected ${vendor} invoice (${amount})`,
          dotColor: "bg-red-500",
        };
      case "SUBMITTED":
        return {
          title: `BA submitted ${invNo}`,
          desc: `${vendor} invoice submitted for Admin approval`,
          dotColor: "bg-purple-500",
        };
      case "DRAFT":
      case "EXTRACTED":
      default:
        return {
          title: `AI extracted ${vendor} invoice`,
          desc: `New invoice ${invNo} extracted and ready for BA review`,
          dotColor: "bg-blue-500",
        };
    }
  }

  // Sort invoices by updated_at or created_at for recent lists
  const recentInvoices = [...invoices].slice(0, 7);
  const activityInvoices = [...invoices]
    .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
    .slice(0, 6);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-3xl p-8 text-white shadow-xl mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold">
                Welcome Back, {userName} 👋
              </h1>
              <p className="mt-3 text-blue-100">
                Monitor invoices, approvals and AI extraction in one place.
              </p>
            </div>
            <div className="hidden md:block bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
              <p className="text-xs uppercase tracking-wider text-blue-200">Active Role</p>
              <p className="text-lg font-bold mt-0.5">{role}</p>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Invoices"
              value={loading ? "..." : totalInvoices.toLocaleString()}
              color="bg-blue-600"
              icon={<FiFileText />}
            />

            <StatCard
              title="Pending Review"
              value={loading ? "..." : pendingReview.toLocaleString()}
              color="bg-yellow-500"
              icon={<FiClock />}
            />

            <StatCard
              title="Pending Approval"
              value={loading ? "..." : pendingApproval.toLocaleString()}
              color="bg-purple-600"
              icon={<FiAlertCircle />}
            />

            <StatCard
              title="Approved"
              value={loading ? "..." : approved.toLocaleString()}
              color="bg-green-600"
              icon={<FiCheckCircle />}
            />
          </div>

          {/* Bottom Section (Quick Actions removed, balanced 2:1 grid) */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Recent Invoices Table */}
            <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col justify-between">
              <div>
                <div className="p-6 border-b flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">
                    Recent Invoices
                  </h2>
                  <button
                    onClick={fetchDashboardData}
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition"
                  >
                    Refresh
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-semibold text-gray-600">Invoice</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Vendor</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Amount</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {loading ? (
                        <tr>
                          <td colSpan={4} className="p-12 text-center text-gray-400 font-medium">
                            Loading recent invoices...
                          </td>
                        </tr>
                      ) : recentInvoices.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-12 text-center text-gray-400 font-medium">
                            No recent invoices found.
                          </td>
                        </tr>
                      ) : (
                        recentInvoices.map((inv) => (
                          <tr key={inv.id || inv._id} className="hover:bg-gray-50 transition">
                            <td className="p-4 font-semibold text-blue-600">
                              {inv.invoice_number || `INV-${inv.id || inv._id}`}
                            </td>
                            <td className="p-4 font-medium text-gray-800">
                              {inv.vendor || "Unknown Vendor"}
                            </td>
                            <td className="p-4 font-bold text-gray-800">
                              {inv.currency || "$"} {inv.total_amount?.toLocaleString() || "0"}
                            </td>
                            <td className="p-4">{getStatusBadge(inv.status)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t text-right text-xs text-gray-400">
                Showing top {recentInvoices.length} of {totalInvoices} invoices
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="xl:col-span-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6 border-b pb-4">
                  <FiActivity className="text-blue-600 text-xl" />
                  <h2 className="text-xl font-bold text-gray-800">
                    Recent Activity
                  </h2>
                </div>

                {loading ? (
                  <div className="p-12 text-center text-gray-400 font-medium">
                    Loading activity...
                  </div>
                ) : activityInvoices.length === 0 ? (
                  <div className="p-12 text-center text-gray-400 font-medium">
                    No recent activity recorded.
                  </div>
                ) : (
                  <div className="space-y-6 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                    {activityInvoices.map((inv) => {
                      const details = getActivityDetails(inv);
                      return (
                        <div key={inv.id || inv._id} className="flex items-start gap-4 relative pl-8">
                          {/* Timeline Dot */}
                          <div
                            className={`absolute left-1 top-1.5 w-3.5 h-3.5 rounded-full ring-4 ring-white ${details.dotColor} shadow`}
                          ></div>

                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 text-sm truncate">
                              {details.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                              {details.desc}
                            </p>
                            <p className="text-xs font-medium text-gray-400 mt-1">
                              {getRelativeTime(inv.updated_at || inv.created_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t text-center text-xs text-gray-400">
                Live AI Workflow Activity
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}