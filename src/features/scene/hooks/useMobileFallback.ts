import { useState } from "react";

const MOBILE_MAX_WIDTH = 768;

export function shouldUseMobileFallback(
  pointerIsCoarse: boolean,
  innerWidth: number,
): boolean {
  return pointerIsCoarse && innerWidth < MOBILE_MAX_WIDTH;
}

function detectMobile(): boolean {
  if (typeof window === "undefined") return false;
  const pointerIsCoarse =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches;
  return shouldUseMobileFallback(pointerIsCoarse, window.innerWidth);
}

/**
 * Detects once at mount whether the current device should get the mobile
 * fallback (small touchscreens). Does NOT react to window resizes — this is
 * intentional per the spec: desktop users resizing a window below 768px do
 * not get hot-swapped into the mobile view.
 */
export function useMobileFallback(): boolean {
  const [isMobile] = useState<boolean>(detectMobile);
  return isMobile;
}
