import { useLocation } from "react-router-dom";
import type { DestinationId } from "../types";
import { getDestinationByRoute, HOME_DESTINATION_ID } from "../config";

/**
 * Maps the current react-router location to a DestinationId.
 * Unknown routes fall back to `home` so the scene has a safe default pose.
 */
export function useDestinationFromRoute(): DestinationId {
  const { pathname } = useLocation();
  const destination = getDestinationByRoute(pathname);
  return destination?.id ?? HOME_DESTINATION_ID;
}
