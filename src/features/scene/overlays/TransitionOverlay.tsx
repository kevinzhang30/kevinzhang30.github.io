import type { Destination } from "../types";

interface TransitionOverlayProps {
  destination: Destination | null;
  isFlying: boolean;
}

export default function TransitionOverlay({
  destination,
  isFlying,
}: TransitionOverlayProps) {
  const accent = destination?.accent ?? "#7acfff";
  const opacity = isFlying ? 1 : 0;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-40 transition-opacity duration-500"
      style={{
        opacity,
        background: `radial-gradient(circle at center, ${accent}22 0%, rgba(2,6,17,0) 60%)`,
      }}
    />
  );
}
