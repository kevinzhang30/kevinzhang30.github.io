import { personal } from "../../../data/personal";
import {
  SCENE_OBJECTS,
  type SceneObjectId,
} from "../scene/config";
import Reticle from "./Reticle";

interface HomeOverlayProps {
  hoveredId: SceneObjectId | null;
  focusedId: SceneObjectId | null;
  isTransitioning: boolean;
  onSelect: (id: SceneObjectId) => void;
  isTouch?: boolean;
}

export default function HomeOverlay({
  hoveredId,
  focusedId,
  isTransitioning,
  onSelect,
  isTouch,
}: HomeOverlayProps) {
  const activeId = focusedId ?? hoveredId ?? "earth";

  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(80,150,255,0.18),_transparent_32%),linear-gradient(180deg,rgba(3,7,18,0.2),rgba(3,7,18,0.92))]" />
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.03)_1px,transparent_1px,transparent_3px)] opacity-20" />
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
          isTransitioning ? "opacity-100" : "opacity-0"
        } bg-[radial-gradient(circle_at_center,_rgba(67,215,255,0.16),_transparent_35%),linear-gradient(180deg,rgba(2,6,17,0.1),rgba(2,6,17,0.82))]`}
      />
      <div
        className={`pointer-events-none absolute left-0 right-0 top-0 bg-slate-950 transition-all duration-700 ${
          isTransitioning ? "h-[16vh] opacity-80" : "h-0 opacity-0"
        }`}
      />
      <div
        className={`pointer-events-none absolute bottom-0 left-0 right-0 bg-slate-950 transition-all duration-700 ${
          isTransitioning ? "h-[18vh] opacity-85" : "h-0 opacity-0"
        }`}
      />

      <Reticle activeId={hoveredId ?? focusedId} isTransitioning={isTransitioning} />

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
              {isTouch
                ? "Tap a target beyond the glass to move through the portfolio."
                : "Seated at the bridge. Select a target beyond the glass to move through the portfolio."}
            </p>
          </div>

          <div className="hidden rounded-full border border-white/10 bg-slate-950/45 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-300 backdrop-blur-md lg:block">
            {isTransitioning ? "Course locked" : "Interactive scene"}
          </div>
        </header>

        <div className="pointer-events-auto flex flex-wrap items-center gap-3">
            {SCENE_OBJECTS.map((target) => {
              const active = target.id === activeId;

              return (
                <button
                  key={target.id}
                  type="button"
                  onClick={() => onSelect(target.id)}
                  disabled={isTransitioning}
                  className={`rounded-full border px-4 py-2 text-left backdrop-blur-md transition-all duration-300 ${
                    active
                      ? "border-white/25 bg-white/12 shadow-[0_18px_50px_rgba(14,165,233,0.16)]"
                      : "border-white/10 bg-slate-950/45 hover:border-white/20 hover:bg-white/10"
                  } ${isTransitioning ? "cursor-not-allowed opacity-70" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: target.accent, boxShadow: `0 0 14px ${target.accent}` }}
                    />
                    <span className="text-xs font-medium uppercase tracking-[0.28em] text-white/90">
                      {target.label}
                    </span>
                  </div>
                </button>
              );
            })}
        </div>

        <div className="pointer-events-none mt-6 hidden items-center justify-between rounded-full border border-white/10 bg-slate-950/38 px-5 py-3 text-[11px] uppercase tracking-[0.28em] text-slate-300 backdrop-blur-md md:flex">
          <span>Primary interface online</span>
          <span>
            {isTouch
              ? hoveredId ?? focusedId
                ? "Target lock ready"
                : "Tap to select target"
              : hoveredId ?? focusedId
                ? "Target lock ready"
                : "Sweep for active targets"}
          </span>
          <span>{personal.contact.location}</span>
        </div>
      </div>
    </>
  );
}
