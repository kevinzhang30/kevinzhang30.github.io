interface BackToStationProps {
  onClick: () => void;
}

export default function BackToStation({ onClick }: BackToStationProps) {
  return (
    <button
      onClick={onClick}
      className="fixed left-6 top-6 z-30 flex items-center gap-2 rounded-lg border border-teal-400/30 bg-black/60 px-4 py-2 text-sm font-medium text-teal-300 backdrop-blur-sm transition-all hover:border-teal-400/60 hover:bg-black/80"
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
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      Back to station
    </button>
  );
}
