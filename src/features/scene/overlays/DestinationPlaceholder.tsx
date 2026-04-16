import type { Destination } from "../types";

interface DestinationPlaceholderProps {
  destination: Destination;
}

export default function DestinationPlaceholder({ destination }: DestinationPlaceholderProps) {
  return (
    <div className="pointer-events-none absolute bottom-8 left-1/2 w-[min(90vw,28rem)] -translate-x-1/2">
      <div className="pointer-events-auto rounded-2xl border border-white/15 bg-slate-950/70 px-6 py-5 backdrop-blur-xl">
        <p
          className="text-[11px] uppercase tracking-[0.35em]"
          style={{ color: destination.accent }}
        >
          {destination.caption}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          {destination.label}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          {destination.description}
        </p>
        <p className="mt-3 text-[11px] uppercase tracking-[0.28em] text-slate-500">
          Content arriving in a later phase.
        </p>
      </div>
    </div>
  );
}
