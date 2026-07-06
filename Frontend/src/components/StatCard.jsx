import { FiArrowUpRight } from "react-icons/fi";

export default function StatCard({
  title,
  value,
  color,
  icon,
  percentage = "+12%"
}) {
  return (
    <div
      className={`${color} rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-white relative overflow-hidden`}
    >
      {/* Background Circle */}

      <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/10 rounded-full"></div>

      <div className="absolute -right-2 bottom-0 w-20 h-20 bg-white/5 rounded-full"></div>

      {/* Top */}

      <div className="flex justify-between items-center">

        <div>
          <p className="text-white/80 text-sm font-medium">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-3">
            {value}
          </h2>
        </div>

        <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-lg">
          {icon}
        </div>

      </div>

      {/* Bottom */}

      <div className="flex justify-between items-center mt-8">

        <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">

          <FiArrowUpRight />

          <span className="text-sm font-semibold">
            {percentage}
          </span>

        </div>

        <span className="text-sm text-white/80">
          This Month
        </span>

      </div>

    </div>
  );
}