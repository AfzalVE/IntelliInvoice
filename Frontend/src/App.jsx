import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inbox from "./pages/Inbox";
import ReviewInvoice from "./pages/ReviewInvoice";
import Approval from "./pages/Approval";
import Approved from "./pages/Approved";
import FinanceInbox from "./pages/FinanceInbox";
import NotFound from "./pages/NotFound";
import Gmail from "./pages/Gmail";
import Register from "./pages/Register";
import Settings from "./pages/Settings";

// Real auth check — verify token exists in localStorage
function isAuthenticated() {
  return !!localStorage.getItem("accessToken");
}

function getRole() {
  return (localStorage.getItem("role") || "BA").toUpperCase();
}

// Protected Route — redirects to login if not authenticated
function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// Role-protected route — additionally checks role
function RoleRoute({ children, allowedRoles }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  if (!allowedRoles.includes(getRole())) {
    return <Navigate to="/not-authorized" replace />;
  }
  return children;
}

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard — all roles */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Settings — all roles */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Gmail — BA only */}
        <Route
          path="/gmail"
          element={
            <RoleRoute allowedRoles={["BA"]}>
              <Gmail />
            </RoleRoute>
          }
        />

        {/* Invoice Inbox — BA only */}
        <Route
          path="/inbox"
          element={
            <RoleRoute allowedRoles={["BA"]}>
              <Inbox />
            </RoleRoute>
          }
        />

        {/* Review Invoice — BA only */}
        <Route
          path="/review/:id"
          element={
            <RoleRoute allowedRoles={["BA"]}>
              <ReviewInvoice />
            </RoleRoute>
          }
        />

        {/* Approval — ADMIN only */}
        <Route
          path="/approval"
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <Approval />
            </RoleRoute>
          }
        />

        {/* Approved — ADMIN only (admin views approved invoices) */}
        <Route
          path="/approved"
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <Approved />
            </RoleRoute>
          }
        />

        {/* Finance Inbox — FINANCE only */}
        <Route
          path="/finance-inbox"
          element={
            <RoleRoute allowedRoles={["FINANCE"]}>
              <FinanceInbox />
            </RoleRoute>
          }
        />

        {/* Not Authorized */}
        <Route
          path="/not-authorized"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <p className="text-5xl mb-4">🚫</p>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
                <p className="text-gray-500 mb-6">You do not have permission to view this page.</p>
                <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
                  Back to Login
                </a>
              </div>
            </div>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;