import {
  FiBell,
  FiSearch,
  FiMoon,
  FiCalendar,
  FiMail,
  FiChevronDown,
} from "react-icons/fi";

export default function Navbar() {
  const today = new Date().toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm px-8 py-4 flex items-center justify-between">

      {/* Left Side */}

      <div>

        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard
        </h1>

        <div className="flex items-center gap-2 text-gray-500 mt-1 text-sm">

          <FiCalendar />

          {today}

        </div>

      </div>

      {/* Center */}

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

      {/* Right Side */}

      <div className="flex items-center gap-4">

        {/* Theme */}

        <button className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">

          <FiMoon size={18} />

        </button>

        {/* Mail */}

        <div className="relative">

          <button className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">

            <FiMail size={18} />

          </button>

          <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full text-white text-xs flex items-center justify-center">
            2
          </span>

        </div>

        {/* Notifications */}

        <div className="relative">

          <button className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">

            <FiBell size={18} />

          </button>

          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            5
          </span>

        </div>

        {/* Divider */}

        <div className="w-px h-10 bg-gray-300"></div>

        {/* User */}

        <button className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-xl transition">

          <img
            src="https://ui-avatars.com/api/?name=Business+Analyst&background=2563eb&color=fff"
            alt="profile"
            className="w-11 h-11 rounded-full"
          />

          <div className="hidden md:block text-left">

            <h3 className="font-semibold text-gray-800">
              BA Team
            </h3>

            <p className="text-xs text-gray-500">
              Business Analyst
            </p>

          </div>

          <FiChevronDown />

        </button>

      </div>

    </header>
  );
}