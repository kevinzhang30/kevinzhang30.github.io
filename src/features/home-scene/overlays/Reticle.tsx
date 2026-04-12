import type { SceneObjectId } from "../scene/config";

interface ReticleProps {
  activeId: SceneObjectId | null;
  isTransitioning: boolean;
}

export default function Reticle({ activeId, isTransitioning }: ReticleProps) {
  const accentMap: Record<SceneObjectId, string> = {
    earth: "#43d7ff",
    rocket: "#ff8656",
    satellite: "#73ffb8",
    moon: "#d6d8ff",
  };

  const accent = activeId ? accentMap[activeId] : "#8ed8ff";

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="relative h-32 w-32">
        <div
          className={`absolute inset-0 rounded-full border transition-all duration-300 ${
            isTransitioning ? "scale-125 opacity-90" : "scale-100 opacity-60"
          }`}
          style={{ borderColor: accent }}
        />
        <div
          className="absolute left-1/2 top-0 h-5 w-px -translate-x-1/2"
          style={{ backgroundColor: accent }}
        />
        <div
          className="absolute bottom-0 left-1/2 h-5 w-px -translate-x-1/2"
          style={{ backgroundColor: accent }}
        />
        <div
          className="absolute left-0 top-1/2 h-px w-5 -translate-y-1/2"
          style={{ backgroundColor: accent }}
        />
        <div
          className="absolute right-0 top-1/2 h-px w-5 -translate-y-1/2"
          style={{ backgroundColor: accent }}
        />
        <div
          className={`absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border ${
            isTransitioning ? "scale-125" : ""
          }`}
          style={{ borderColor: accent }}
        />
      </div>
    </div>
  );
}
