import { Link } from "react-router-dom";

export default function BackToStation() {
  return (
    <Link
      to="/"
      className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full border border-teal-500/30 bg-gray-950/80 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-teal-300/90 backdrop-blur-md transition-all hover:border-teal-400/50 hover:bg-gray-900/90 hover:text-teal-200 hover:shadow-[0_0_16px_rgba(0,131,143,0.25)]"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
        />
      </svg>
      Back to Station
    </Link>
  );
}
