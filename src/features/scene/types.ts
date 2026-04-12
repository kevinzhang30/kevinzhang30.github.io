export type DestinationId =
  | "home"
  | "earth"
  | "rocket"
  | "satellite"
  | "moon";

export type Vec3 = [number, number, number];

export interface CameraPose {
  position: Vec3;
  lookAt: Vec3;
}

export interface Destination {
  id: DestinationId;
  route: string;
  label: string;
  caption: string;
  description: string;
  accent: string;
  cameraPosition: Vec3;
  cameraLookAt: Vec3;
  objectPosition: Vec3;
}
