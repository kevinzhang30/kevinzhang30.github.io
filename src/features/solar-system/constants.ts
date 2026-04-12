import type { QualitySettings, QualityTier } from "./types";

// Earth (center of the scene, visible through window)
export const EARTH_POSITION = { x: 0, y: 0, z: 55 };
export const EARTH_RADIUS = 8;
export const EARTH_ROTATION_SPEED = 0.1;

// Moon (orbits Earth)
export const MOON_RADIUS = 2.5;
export const MOON_ORBIT_RADIUS = 18;
export const MOON_ORBIT_SPEED = 0.04;

// Satellite (orbits Earth)
export const SATELLITE_ORBIT_RADIUS = 24;
export const SATELLITE_ORBIT_SPEED = 0.025;

// Rocket (flies around Earth area)
export const ROCKET_SPEED = 0.04;

// Star field
export const STAR_FIELD_MIN_RADIUS = 2000;
export const STAR_FIELD_MAX_RADIUS = 4000;

// Camera
export const STATION_CAMERA_POSITION = { x: 0, y: 2, z: -20 };
export const STATION_LOOK_AT = { x: 0, y: 0, z: 50 };
export const CAMERA_FOV = 75;
export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR = 10000;
export const TRANSITION_DURATION = 2000; // ms
export const IDLE_SWAY_AMPLITUDE = 0.15;
export const IDLE_SWAY_SPEED = 0.3;
export const MOUSE_PARALLAX_FACTOR = 1.0;

// Scene
export const SCENE_BG_COLOR = 0x020210;
export const AMBIENT_LIGHT_COLOR = 0x111133;
export const AMBIENT_LIGHT_INTENSITY = 0.8;

// Post-processing
export const BLOOM_STRENGTH = 0.8;
export const BLOOM_RADIUS = 0.4;
export const BLOOM_THRESHOLD = 0.6;

// Station interior
export const WINDOW_WIDTH = 34;
export const WINDOW_HEIGHT = 20;
export const STATION_DEPTH = 25;
export const WALL_THICKNESS = 4;

// Colors
export const ATMOSPHERE_TEAL = 0x00838f;
export const ROCKET_WHITE = 0xf0f0f0;
export const ROCKET_STRIPE = 0xff4444;
export const SATELLITE_SILVER = 0xcccccc;
export const SATELLITE_PANEL = 0x1a237e;

// Quality tiers
export const QUALITY_SETTINGS: Record<QualityTier, QualitySettings> = {
  high: {
    starCount: 15000,
    sunDetail: 64,
    bloomResolution: 1,
    godRaySamples: 0,
    asteroidCount: 500,
    nebulaParticles: 5000,
    exhaustParticles: 500,
    pixelRatioCap: 2,
  },
  medium: {
    starCount: 8000,
    sunDetail: 32,
    bloomResolution: 0.5,
    godRaySamples: 0,
    asteroidCount: 200,
    nebulaParticles: 2000,
    exhaustParticles: 200,
    pixelRatioCap: 1.5,
  },
  low: {
    starCount: 3000,
    sunDetail: 16,
    bloomResolution: 0.25,
    godRaySamples: 0,
    asteroidCount: 80,
    nebulaParticles: 500,
    exhaustParticles: 50,
    pixelRatioCap: 1,
  },
};

// Earth texture URL
export const EARTH_TEXTURE_URL =
  "//unpkg.com/three-globe/example/img/earth-dark.jpg";

// Rocket path — weaves around Earth
export const ROCKET_PATH_POINTS = [
  { x: 18, y: 4, z: 40 },
  { x: 28, y: -2, z: 55 },
  { x: 12, y: 6, z: 72 },
  { x: -10, y: -3, z: 62 },
  { x: -25, y: 2, z: 45 },
  { x: -15, y: -4, z: 65 },
  { x: 8, y: 5, z: 48 },
];
