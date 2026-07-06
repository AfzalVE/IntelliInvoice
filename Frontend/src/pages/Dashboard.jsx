import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  console.log(localStorage.getItem("accessToken"));
  return (
    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-8">

          {/* Welcome */}

          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-3xl p-8 text-white shadow-xl mb-8">

            <h1 className="text-4xl font-bold">
              Welcome Back 👋
            </h1>

            <p className="mt-3 text-blue-100">
              Monitor invoices, approvals and AI extraction in one place.
            </p>

          </div>

          {/* Statistics */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

            <StatCard
              title="Total Invoices"
              value="1,248"
              color="bg-blue-600"
            />

            <StatCard
              title="Pending Review"
              value="38"
              color="bg-yellow-500"
            />

            <StatCard
              title="Pending Approval"
              value="12"
              color="bg-purple-600"
            />

            <StatCard
              title="Approved"
              value="1,198"
              color="bg-green-600"
            />

          </div>

          {/* Bottom Section */}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Recent Invoices */}

            <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg">

              <div className="p-6 border-b">

                <h2 className="text-xl font-bold">
                  Recent Invoices
                </h2>

              </div>

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="text-left p-4">Invoice</th>
                    <th className="text-left p-4">Vendor</th>
                    <th className="text-left p-4">Amount</th>
                    <th className="text-left p-4">Status</th>

                  </tr>

                </thead>

                <tbody>

                  <tr className="border-b hover:bg-gray-50">

                    <td className="p-4">INV-1001</td>
                    <td className="p-4">Dell</td>
                    <td className="p-4">$2,400</td>

                    <td className="p-4">

                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                        Pending
                      </span>

                    </td>

                  </tr>

                  <tr className="border-b hover:bg-gray-50">

                    <td className="p-4">INV-1002</td>
                    <td className="p-4">HP</td>
                    <td className="p-4">$1,850</td>

                    <td className="p-4">

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        Approved
                      </span>

                    </td>

                  </tr>

                  <tr className="hover:bg-gray-50">

                    <td className="p-4">INV-1003</td>
                    <td className="p-4">Lenovo</td>
                    <td className="p-4">$980</td>

                    <td className="p-4">

                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        Review
                      </span>

                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

            {/* Right Panel */}

            <div className="space-y-6">

              {/* Activity */}

              <div className="bg-white rounded-2xl shadow-lg p-6">

                <h2 className="text-xl font-bold mb-4">
                  Recent Activity
                </h2>

                <div className="space-y-5">

                  <div>

                    <p className="font-semibold">
                      Invoice INV-1002 Approved
                    </p>

                    <p className="text-sm text-gray-500">
                      5 minutes ago
                    </p>

                  </div>

                  <div>

                    <p className="font-semibold">
                      AI extracted Dell invoice
                    </p>

                    <p className="text-sm text-gray-500">
                      18 minutes ago
                    </p>

                  </div>

                  <div>

                    <p className="font-semibold">
                      BA submitted invoice
                    </p>

                    <p className="text-sm text-gray-500">
                      30 minutes ago
                    </p>

                  </div>

                </div>

              </div>

              {/* Quick Actions */}

              <div className="bg-white rounded-2xl shadow-lg p-6">

                <h2 className="text-xl font-bold mb-5">
                  Quick Actions
                </h2>

                <div className="space-y-3">

                  <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition">
                    Upload Invoice
                  </button>

                  <button className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition">
                    Review Invoices
                  </button>

                  <button className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition">
                    Generate Report
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}