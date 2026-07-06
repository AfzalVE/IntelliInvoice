import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inbox from "./pages/Inbox";
import ReviewInvoice from "./pages/ReviewInvoice";
import Approval from "./pages/Approval";
import Approved from "./pages/Approved";
import NotFound from "./pages/NotFound";
import Gmail from "./pages/Gmail";
import Register from "./pages/Register";
// Demo Authentication
const isAuthenticated = true;

// Protected Route
function ProtectedRoute({ children }) {
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Inbox */}
        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <Inbox />
            </ProtectedRoute>
          }
        />

        {/* Review Invoice */}
        <Route
          path="/review/:id"
          element={
            <ProtectedRoute>
              <ReviewInvoice />
            </ProtectedRoute>
          }
        />

        {/* Approval */}
        <Route
          path="/approval"
          element={
            <ProtectedRoute>
              <Approval />
            </ProtectedRoute>
          }
        />

        {/* Approved Invoices */}
        <Route
          path="/approved"
          element={
            <ProtectedRoute>
              <Approved />
            </ProtectedRoute>
          }
        />
        <Route
  path="/gmail"
  element={
    <ProtectedRoute>
      <Gmail />
    </ProtectedRoute>
  }
/>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;