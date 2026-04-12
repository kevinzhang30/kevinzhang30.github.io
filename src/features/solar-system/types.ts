import type * as THREE from "three";

export interface NavTarget {
  route: string;
  label: string;
  description: string;
}

export interface CelestialObjectConfig {
  name: string;
  route: string;
  label: string;
  description: string;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
}

export type CameraState = "INTERIOR" | "TRANSITIONING" | "FOCUSED";

export interface CameraTarget {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
}

export type QualityTier = "high" | "medium" | "low";

export interface QualitySettings {
  starCount: number;
  sunDetail: number;
  bloomResolution: number;
  godRaySamples: number;
  asteroidCount: number;
  nebulaParticles: number;
  exhaustParticles: number;
  pixelRatioCap: number;
}
