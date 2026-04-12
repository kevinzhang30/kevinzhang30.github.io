export type SceneObjectId = "earth" | "rocket" | "satellite" | "moon";

export interface SceneNavTarget {
  id: SceneObjectId;
  label: string;
  route: string;
  description: string;
  caption: string;
  accent: string;
  position: [number, number, number];
  focusPosition: [number, number, number];
}

export const SCENE_OBJECTS: SceneNavTarget[] = [
  {
    id: "earth",
    label: "Earth",
    route: "/map",
    description: "Travel map and places I've been.",
    caption: "Orbital atlas",
    accent: "#43d7ff",
    position: [1.4, 1.8, -26.5],
    focusPosition: [5.4, 3.4, -17.2],
  },
  {
    id: "rocket",
    label: "Rocket",
    route: "/projects",
    description: "Projects, builds, and technical experiments.",
    caption: "Launch bay",
    accent: "#ff8656",
    position: [-6.4, -1.25, -18.5],
    focusPosition: [-4.3, 0.6, -12.8],
  },
  {
    id: "satellite",
    label: "Satellite",
    route: "/experience",
    description: "Experience, internships, and work history.",
    caption: "Comms relay",
    accent: "#73ffb8",
    position: [6.8, 3.35, -20.2],
    focusPosition: [4.8, 3.3, -13.1],
  },
  {
    id: "moon",
    label: "Moon",
    route: "/gallery",
    description: "Photos, personal moments, and side interests.",
    caption: "Observation deck",
    accent: "#d6d8ff",
    position: [-2.2, 4.8, -21.8],
    focusPosition: [-1.6, 4.8, -14.6],
  },
];

export const DEFAULT_CAMERA_POSITION: [number, number, number] = [0, 0.9, 8.8];
export const DEFAULT_CAMERA_LOOK_AT: [number, number, number] = [0, 0.7, -9.2];
