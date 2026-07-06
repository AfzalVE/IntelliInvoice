import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  FiMail,
  FiCheckCircle,
  FiRefreshCw,
  FiXCircle,
} from "react-icons/fi";

const API_BASE_URL = "http://localhost:8000";

export default function Gmail() {
  const token = localStorage.getItem("accessToken");

  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const [connected, setConnected] = useState(false);
  const [gmailEmail, setGmailEmail] = useState("");

  const [emails, setEmails] = useState([]);

  const [stats, setStats] = useState({
    processed: 0,
    invoices: 0,
  });

  useEffect(() => {
    loadStatus();
  }, []);

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const loadStatus = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${API_BASE_URL}/oauth/google/status`,
        authHeaders
      );

      setConnected(data.connected);

      if (data.connected) {
        setGmailEmail(data.email || "");
        await loadRecentEmails();
      } else {
        setEmails([]);
        setStats({
          processed: 0,
          invoices: 0,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentEmails = async () => {
    try {
      setSyncing(true);

      const { data } = await axios.get(
        `${API_BASE_URL}/gmail/recent`,
        authHeaders
      );

      const recentEmails = data.emails || [];

      setEmails(recentEmails);

      setStats({
        processed: recentEmails.length,
        invoices: recentEmails.filter(
          (email) => email.isInvoice
        ).length,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSyncing(false);
    }
  };

  const handleConnectGmail = async () => {
    try {
      setConnecting(true);

      const { data } = await axios.post(
        `${API_BASE_URL}/oauth/google/connect`,
        null,
        authHeaders
      );

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
          "Unable to connect Gmail."
      );
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    const confirmDisconnect = window.confirm(
      "Are you sure you want to disconnect Gmail?"
    );

    if (!confirmDisconnect) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/oauth/google`,
        authHeaders
      );

      setConnected(false);
      setGmailEmail("");
      setEmails([]);

      setStats({
        processed: 0,
        invoices: 0,
      });
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
          "Unable to disconnect Gmail."
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-8">
          {/* Header */}

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Gmail Integration
            </h1>

            <p className="mt-2 text-gray-500">
              Connect your Gmail account to automatically receive invoice
              emails.
            </p>
          </div>

          {/* Gmail Card */}

          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                <FiMail className="text-4xl text-red-600" />
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  Gmail Account
                </h2>

                <p className="mt-2 text-gray-500">
                  {connected
                    ? "Your Gmail account is connected."
                    : "Connect Gmail to automatically download invoice attachments."}
                </p>

                {connected && (
                  <p className="mt-2 font-medium text-blue-600">
                    {gmailEmail}
                  </p>
                )}
              </div>

              {connected ? (
                <button
                  onClick={handleDisconnect}
                  className="rounded-xl bg-red-600 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-red-700"
                >
                  Disconnect Gmail
                </button>
              ) : (
                <button
                  onClick={handleConnectGmail}
                  disabled={connecting}
                  className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                >
                  {connecting
                    ? "Connecting..."
                    : "Connect Gmail"}
                </button>
              )}
            </div>
          </div>

          {/* Stats */}

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow">
              <div className="flex items-center gap-3">
                {connected ? (
                  <FiCheckCircle className="text-2xl text-green-600" />
                ) : (
                  <FiXCircle className="text-2xl text-red-600" />
                )}

                <div>
                  <h3 className="font-bold">
                    Connection Status
                  </h3>

                  <p
                    className={
                      connected
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {loading
                      ? "Checking..."
                      : connected
                      ? "Connected"
                      : "Not Connected"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow">
              <h3 className="font-bold">
                Emails Processed
              </h3>

              <h1 className="mt-3 text-4xl font-bold text-blue-600">
                {stats.processed}
              </h1>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow">
              <h3 className="font-bold">
                Invoice Emails
              </h3>

              <h1 className="mt-3 text-4xl font-bold text-orange-500">
                {stats.invoices}
              </h1>
            </div>
          </div>

          {/* Recent Emails */}

          <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-lg">
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="text-xl font-bold">
                Recent Invoice Emails
              </h2>

              <button
                onClick={loadRecentEmails}
                disabled={!connected || syncing}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                <FiRefreshCw
                  className={syncing ? "animate-spin" : ""}
                />

                {syncing ? "Syncing..." : "Sync Gmail"}
              </button>
            </div>

            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left">From</th>
                  <th className="p-4 text-left">Subject</th>
                  <th className="p-4 text-left">Received</th>
                  <th className="p-4 text-left">Attachment</th>
                  <th className="p-4 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-10 text-center text-gray-500"
                    >
                      Loading Gmail data...
                    </td>
                  </tr>
                ) : !connected ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-10 text-center text-gray-500"
                    >
                      Connect your Gmail account to view recent emails.
                    </td>
                  </tr>
                ) : emails.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-10 text-center text-gray-500"
                    >
                      No recent emails found.
                    </td>
                  </tr>
                ) : (
                  emails.map((email, index) => (
                    <tr
                      key={email.id || index}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-4">
                        {email.senderName ||
                          email.sender_name ||
                          email.sender ||
                          email.from ||
                          "-"}
                      </td>

                      <td className="p-4 max-w-md truncate">
                        {email.subject || "-"}
                      </td>

                      <td className="p-4">
                        {email.date ||
                          email.receivedAt ||
                          email.received_at ||
                          "-"}
                      </td>

                      <td className="p-4">
                        {email.attachments?.length > 0 ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                            {email.attachments.length} Attachment
                            {email.attachments.length > 1 ? "s" : ""}
                          </span>
                        ) : email.hasAttachment ||
                          email.has_attachment ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                            Yes
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                            No
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        {email.isInvoice ||
                        email.is_invoice ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                            Invoice
                          </span>
                        ) : (
                          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
                            General
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}