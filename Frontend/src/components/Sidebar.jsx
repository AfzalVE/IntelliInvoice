import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiInbox,
  FiCheckCircle,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiMail,
} from "react-icons/fi";

export default function Sidebar() {
  const navigate = useNavigate();
  const role = (localStorage.getItem("role") || "BA").toUpperCase();
  const userName = localStorage.getItem("userName") || "User";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Define menu items for each role
  const allMenuItems = {
    BA: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: <FiHome size={20} />,
      },
      {
        name: "Connect Gmail",
        path: "/gmail",
        icon: <FiMail size={20} />,
      },
      {
        name: "Invoice Inbox",
        path: "/inbox",
        icon: <FiInbox size={20} />,
      },
      {
        name: "Review Invoice",
        path: "/review/1",
        icon: <FiFileText size={20} />,
      },
    ],
    ADMIN: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: <FiHome size={20} />,
      },
      {
        name: "Approval",
        path: "/approval",
        icon: <FiCheckCircle size={20} />,
      },
      {
        name: "Approved",
        path: "/approved",
        icon: <FiCheckCircle size={20} />,
      },
    ],
    FINANCE: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: <FiHome size={20} />,
      },
      {
        name: "Finance Inbox",
        path: "/finance-inbox",
        icon: <FiInbox size={20} />,
      },
    ],
  };

  const menuItems = allMenuItems[role] || allMenuItems["BA"];

  const getRoleLabel = () => {
    if (role === "BA") return "Business Analyst";
    if (role === "ADMIN") return "Admin Head";
    if (role === "FINANCE") return "Finance Team";
    return role;
  };

  return (
    <div className="w-72 min-h-screen bg-slate-900 text-white flex flex-col shadow-2xl">

      {/* Logo */}

      <div className="p-8 border-b border-slate-700">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center text-2xl font-bold shadow-lg">
            AI
          </div>

          <div>

            <h2 className="text-2xl font-bold">
              Invoice AI
            </h2>

            <p className="text-slate-400 text-sm">
              Invoice Processing System
            </p>

          </div>

        </div>

      </div>

      {/* Menu */}

      <div className="flex-1 px-5 py-8">

        <p className="text-slate-500 uppercase text-xs tracking-widest mb-5">
          Main Menu
        </p>

        <div className="space-y-3">

          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "hover:bg-slate-800 text-slate-300"
                }`
              }
            >
              {item.icon}

              <span className="font-medium">
                {item.name}
              </span>
            </NavLink>
          ))}

        </div>

      </div>

      {/* Storage Card */}

      <div className="mx-5 mb-6 bg-slate-800 rounded-2xl p-5">

        <div className="flex justify-between">

          <span className="text-slate-300">
            Storage
          </span>

          <span className="text-blue-400">
            75%
          </span>

        </div>

        <div className="w-full bg-slate-700 rounded-full h-2 mt-3">

          <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>

        </div>

        <p className="text-xs text-slate-400 mt-3">
          7.5 GB of 10 GB used
        </p>

      </div>

      {/* User */}

      <div className="border-t border-slate-700 p-6">

        <div className="flex items-center gap-4">

          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2563eb&color=fff`}
            alt="profile"
            className="w-12 h-12 rounded-full"
          />

          <div className="flex-1 min-w-0">

            <h3 className="font-semibold truncate" title={userName}>
              {userName}
            </h3>

            <p className="text-slate-400 text-sm truncate">
              {getRoleLabel()}
            </p>

          </div>

          <button onClick={handleLogout} className="hover:text-red-400 transition" title="Logout">
            <FiLogOut size={20} />
          </button>

        </div>

      </div>

      {/* Footer */}

      <div className="px-6 pb-5">

        <button className="w-full flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl transition">

          <FiSettings />

          Settings

        </button>

      </div>

    </div>
  );
}