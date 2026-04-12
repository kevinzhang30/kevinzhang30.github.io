import type { Destination, DestinationId } from "./types";

export const HOME_DESTINATION_ID: DestinationId = "home";

export const DESTINATIONS: Destination[] = [
  {
    id: "home",
    route: "/",
    label: "Command Deck",
    caption: "Orbit overview",
    description: "Select a target beyond the glass.",
    accent: "#7acfff",
    cameraPosition: [0, 0.9, 8.8],
    cameraLookAt: [0, 0.7, -9.2],
    objectPosition: [0, 0, 0],
  },
  {
    id: "earth",
    route: "/map",
    label: "Earth",
    caption: "Orbital atlas",
    description: "Travel map and places I've been.",
    accent: "#43d7ff",
    cameraPosition: [5.4, 3.4, -17.2],
    cameraLookAt: [1.4, 1.8, -26.5],
    objectPosition: [1.4, 1.8, -26.5],
  },
  {
    id: "rocket",
    route: "/projects",
    label: "Rocket",
    caption: "Launch bay",
    description: "Projects, builds, and technical experiments.",
    accent: "#ff8656",
    cameraPosition: [-4.3, 0.6, -12.8],
    cameraLookAt: [-6.4, -1.25, -18.5],
    objectPosition: [-6.4, -1.25, -18.5],
  },
  {
    id: "satellite",
    route: "/experience",
    label: "Satellite",
    caption: "Comms relay",
    description: "Experience, internships, and work history.",
    accent: "#73ffb8",
    cameraPosition: [4.8, 3.3, -13.1],
    cameraLookAt: [6.8, 3.35, -20.2],
    objectPosition: [6.8, 3.35, -20.2],
  },
  {
    id: "moon",
    route: "/gallery",
    label: "Moon",
    caption: "Observation deck",
    description: "Photos, personal moments, and side interests.",
    accent: "#d6d8ff",
    cameraPosition: [-1.6, 4.8, -14.6],
    cameraLookAt: [-2.2, 4.8, -21.8],
    objectPosition: [-2.2, 4.8, -21.8],
  },
];

export const DESTINATION_IDS: DestinationId[] = DESTINATIONS.map((d) => d.id);

const BY_ID = new Map<DestinationId, Destination>(
  DESTINATIONS.map((d) => [d.id, d]),
);

const BY_ROUTE = new Map<string, Destination>(
  DESTINATIONS.map((d) => [d.route, d]),
);

export function getDestinationById(id: DestinationId): Destination | undefined {
  return BY_ID.get(id);
}

export function getDestinationByRoute(route: string): Destination | undefined {
  return BY_ROUTE.get(route);
}
