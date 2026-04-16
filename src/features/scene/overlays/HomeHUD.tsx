import { personal } from "../../../data/personal";
import { DESTINATIONS } from "../config";
import type { Destination, DestinationId } from "../types";

interface HomeHUDProps {
  hoveredId: DestinationId | null;
  isVisible: boolean;
  onSelect: (destination: Destination) => void;
}

export default function HomeHUD({ hoveredId, isVisible, onSelect }: HomeHUDProps) {
  const activeId = hoveredId ?? "earth";
  const visibleDestinations = DESTINATIONS.filter((d) => d.id !== "home");

  return (
    <div
      className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(80,150,255,0.18),_transparent_32%),linear-gradient(180deg,rgba(3,7,18,0.2),rgba(3,7,18,0.92))]" />
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.03)_1px,transparent_1px,transparent_3px)] opacity-20" />

      <div className="absolute inset-0 flex flex-col justify-between px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
        <header className="flex items-start justify-between gap-6">
          <div className="max-w-lg">
            <p className="text-xs uppercase tracking-[0.35em] text-sky-200/80">
              Command Deck
            </p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[5.25rem]">
              {personal.name}
            </h1>
            <p className="mt-3 max-w-xl text-sm uppercase tracking-[0.22em] text-sky-100/75 sm:text-base">
              {personal.tagline}
            </p>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-300 sm:text-base">
              Seated at the bridge. Select a target beyond the glass to move through the portfolio.
            </p>
          </div>
        </header>

        <div className="pointer-events-auto flex flex-wrap items-center gap-3">
          {visibleDestinations.map((destination) => {
            const active = destination.id === activeId;
            return (
              <button
                key={destination.id}
                type="button"
                onClick={() => onSelect(destination)}
                className={`rounded-full border px-4 py-2 text-left backdrop-blur-md transition-all duration-300 ${
                  active
                    ? "border-white/25 bg-white/12 shadow-[0_18px_50px_rgba(14,165,233,0.16)]"
                    : "border-white/10 bg-slate-950/45 hover:border-white/20 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: destination.accent,
                      boxShadow: `0 0 14px ${destination.accent}`,
                    }}
                  />
                  <span className="text-xs font-medium uppercase tracking-[0.28em] text-white/90">
                    {destination.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
