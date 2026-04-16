import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { DestinationId } from "../types";
import { HOME_DESTINATION_ID } from "../config";

interface UseBackToHomeOptions {
  activeDestination: DestinationId;
  onBack?: () => void; // allows callers to collapse a sub-selection first
}

/**
 * Wires Escape key to return the user to the home destination when they are
 * not already there. Exposes an imperative `goBack` callback for UI consumers
 * (back-to-station button, click-empty-space handler).
 *
 * Two-level behavior: if the caller provides `onBack`, it is invoked first
 * and allowed to handle the event (e.g. collapse an open sub-selection).
 * A second press of Escape would then be called with `onBack` doing nothing,
 * which falls through to the navigate call.
 */
export function useBackToHome({ activeDestination, onBack }: UseBackToHomeOptions) {
  const navigate = useNavigate();

  const goBack = useCallback(() => {
    if (onBack) {
      onBack();
    }
    if (activeDestination !== HOME_DESTINATION_ID) {
      navigate("/");
    }
  }, [navigate, activeDestination, onBack]);

  useEffect(() => {
    function handler(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (activeDestination === HOME_DESTINATION_ID) return;
      goBack();
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeDestination, goBack]);

  return { goBack };
}
