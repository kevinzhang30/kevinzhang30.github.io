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
    caption: "Map",
    description: "Travel map and places I've been.",
    accent: "#43d7ff",
    cameraPosition: [0, 0.9, 8.8],
    cameraLookAt: [0, 0.7, -9.2],
    objectPosition: [-5.8, 3.1, -9.5],
  },
  {
    id: "rocket",
    route: "/projects",
    label: "Shuttle",
    caption: "Projects",
    description: "Projects, builds, and technical experiments.",
    accent: "#ff8656",
    cameraPosition: [2.2, 2.4, -6.5],
    cameraLookAt: [4.2, 1, -11],
    objectPosition: [4.2, 1, -11],
  },
  {
    id: "satellite",
    route: "/experience",
    label: "Satellite",
    caption: "Experience",
    description: "Experience, internships, and work history.",
    accent: "#73ffb8",
    cameraPosition: [18, 6, -18],
    cameraLookAt: [0, 0, -42],
    objectPosition: [0, 0, -42],
  },
  {
    id: "moon",
    route: "/gallery",
    label: "Planet",
    caption: "Gallery",
    description: "Photos, personal moments, and side interests.",
    accent: "#9a6cff",
    cameraPosition: [0, 4, 4],
    cameraLookAt: [0, 0, -42],
    objectPosition: [0, 0, -42],
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
