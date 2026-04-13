import type { Destination, DestinationId } from "../types";

export interface SceneObjectProps {
  destination: Destination;
  isActive: boolean;
  isHovered: boolean;
  onHoverChange: (id: DestinationId | null) => void;
  onSelect: (destination: Destination) => void;
}
