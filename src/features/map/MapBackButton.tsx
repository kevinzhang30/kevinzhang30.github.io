import { Link } from "react-router-dom";

export default function MapBackButton() {
  return (
    <Link
      to="/"
      className="fixed top-4 left-4 z-20 flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-lg backdrop-blur-sm transition-colors hover:bg-white"
    >
      <svg
        className="h-4 w-4 text-gray-700"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
        />
      </svg>
      <span className="hidden text-sm font-semibold text-gray-900 sm:inline">
        Kevin Zhang
      </span>
    </Link>
  );
}
