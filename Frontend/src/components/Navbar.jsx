import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBell,
  FiSearch,
  FiMoon,
  FiSun,
  FiCalendar,
  FiMail,
  FiChevronDown,
  FiUser,
  FiSettings,
  FiLogOut,
  FiCheck,
  FiInbox,
} from "react-icons/fi";

export default function Navbar() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  
  // Dropdown open states
  const [showMail, setShowMail] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Badge counts
  const [unreadMail, setUnreadMail] = useState(2);
  const [unreadNotif, setUnreadNotif] = useState(5);

  const today = new Date().toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const role = (localStorage.getItem("role") || "BA").toUpperCase();
  const userName = localStorage.getItem("userName") || "User";

  const getRoleLabel = () => {
    if (role === "BA") return "Business Analyst";
    if (role === "ADMIN") return "Admin Head";
    if (role === "FINANCE") return "Finance Team";
    return role;
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Close dropdowns when clicking outside
  const navRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setShowMail(false);
        setShowNotif(false);
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      ref={navRef}
      className="bg-white border-b border-gray-200 shadow-sm px-8 py-4 flex items-center justify-between relative z-50"
    >
      {/* Left Side */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-2 text-gray-500 mt-1 text-sm">
          <FiCalendar />
          {today}
        </div>
      </div>

      {/* Center Search */}
      <div className="hidden lg:flex relative w-[420px]">
        <FiSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search invoices, vendors..."
          className="w-full bg-gray-100 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
        />
      </div>

      {/* Right Side Buttons */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={handleToggleTheme}
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition cursor-pointer"
        >
          {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} className="text-amber-500" />}
        </button>

        {/* Mail Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowMail(!showMail);
              setShowNotif(false);
              setShowProfile(false);
            }}
            title="Messages & Inbox"
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition cursor-pointer ${
              showMail ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            <FiMail size={18} />
          </button>
          {unreadMail > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full text-white text-xs flex items-center justify-center font-bold">
              {unreadMail}
            </span>
          )}

          {showMail && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 py-4 px-2 z-50 animate-fadeIn">
              <div className="flex justify-between items-center px-4 pb-3 border-b">
                <h4 className="font-bold text-gray-800">Messages & Inbox</h4>
                {unreadMail > 0 && (
                  <button
                    onClick={() => setUnreadMail(0)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Mark read
                  </button>
                )}
              </div>
              <div className="divide-y max-h-64 overflow-y-auto my-2">
                <div className="p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer">
                  <p className="text-sm font-semibold text-gray-800">New Invoice Received</p>
                  <p className="text-xs text-gray-500 mt-0.5">Dell Technologies — $2,400.00</p>
                  <p className="text-[10px] text-gray-400 mt-1">10 minutes ago</p>
                </div>
                <div className="p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer">
                  <p className="text-sm font-semibold text-gray-800">BMS Entry Required</p>
                  <p className="text-xs text-gray-500 mt-0.5">HP Enterprise — $1,850.00</p>
                  <p className="text-[10px] text-gray-400 mt-1">1 hour ago</p>
                </div>
              </div>
              <div className="pt-2 border-t px-2">
                <button
                  onClick={() => {
                    setShowMail(false);
                    navigate(role === "FINANCE" ? "/finance-inbox" : "/inbox");
                  }}
                  className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 rounded-xl text-xs font-semibold transition"
                >
                  View All Messages
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotif(!showNotif);
              setShowMail(false);
              setShowProfile(false);
            }}
            title="Notifications"
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition cursor-pointer ${
              showNotif ? "bg-red-500 text-white shadow-md" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            <FiBell size={18} />
          </button>
          {unreadNotif > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold animate-pulse">
              {unreadNotif}
            </span>
          )}

          {showNotif && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 py-4 px-2 z-50 animate-fadeIn">
              <div className="flex justify-between items-center px-4 pb-3 border-b">
                <h4 className="font-bold text-gray-800">Notifications</h4>
                {unreadNotif > 0 && (
                  <button
                    onClick={() => setUnreadNotif(0)}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    <FiCheck size={14} /> Mark all read
                  </button>
                )}
              </div>
              <div className="divide-y max-h-64 overflow-y-auto my-2">
                <div className="p-3 hover:bg-gray-50 rounded-xl transition">
                  <p className="text-sm font-semibold text-gray-800">Invoice INV-1002 Approved</p>
                  <p className="text-xs text-gray-500 mt-0.5">Admin Head signed and approved invoice.</p>
                  <p className="text-[10px] text-gray-400 mt-1">5 minutes ago</p>
                </div>
                <div className="p-3 hover:bg-gray-50 rounded-xl transition">
                  <p className="text-sm font-semibold text-gray-800">AI Extraction Complete</p>
                  <p className="text-xs text-gray-500 mt-0.5">Extracted data from 3 new vendor PDFs.</p>
                  <p className="text-[10px] text-gray-400 mt-1">18 minutes ago</p>
                </div>
                <div className="p-3 hover:bg-gray-50 rounded-xl transition">
                  <p className="text-sm font-semibold text-gray-800">BA Submitted Invoice</p>
                  <p className="text-xs text-gray-500 mt-0.5">INV-1003 submitted for approval.</p>
                  <p className="text-[10px] text-gray-400 mt-1">30 minutes ago</p>
                </div>
              </div>
              <div className="pt-2 border-t px-2">
                <button
                  onClick={() => {
                    setShowNotif(false);
                    navigate("/dashboard");
                  }}
                  className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 py-2 rounded-xl text-xs font-semibold transition"
                >
                  View Activity Feed
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-gray-300"></div>

        {/* User Profile Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowMail(false);
              setShowNotif(false);
            }}
            className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-xl transition cursor-pointer"
          >
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2563eb&color=fff`}
              alt="profile"
              className="w-11 h-11 rounded-full border border-blue-500"
            />
            <div className="hidden md:block text-left">
              <h3 className="font-semibold text-gray-800">{userName}</h3>
              <p className="text-xs text-gray-500">{getRoleLabel()}</p>
            </div>
            <FiChevronDown className={`transition-transform duration-200 ${showProfile ? "rotate-180" : ""}`} />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 px-2 z-50 animate-fadeIn">
              <div className="px-4 py-3 border-b mb-2 bg-blue-50/50 rounded-xl">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Signed in as</p>
                <p className="font-bold text-gray-800 text-sm truncate">{userName}</p>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">{role}</p>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    setShowProfile(false);
                    navigate("/settings");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                >
                  <FiUser className="text-gray-500" />
                  My Profile
                </button>

                <button
                  onClick={() => {
                    setShowProfile(false);
                    navigate("/settings");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                >
                  <FiSettings className="text-gray-500" />
                  Account Settings
                </button>
              </div>

              <div className="mt-2 pt-2 border-t">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
                >
                  <FiLogOut />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}