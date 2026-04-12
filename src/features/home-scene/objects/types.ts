import type { SceneNavTarget } from "../scene/config";

export interface SceneNodeProps {
  target: SceneNavTarget;
  active: boolean;
  focused: boolean;
  transitioning: boolean;
  onHoverChange: (id: SceneNavTarget["id"] | null) => void;
  onSelect: (id: SceneNavTarget["id"]) => void;
}
