import * as THREE from "three";
import { CelestialObject } from "./CelestialObject";
import {
  MOON_RADIUS,
  MOON_ORBIT_RADIUS,
  MOON_ORBIT_SPEED,
  EARTH_POSITION,
} from "../constants";

export class Moon extends CelestialObject {
  private moonMesh: THREE.Mesh;

  constructor() {
    super("Moon", { route: "/experience", label: "Experience", description: "Work history & education" }, 4);

    // Moon sphere with procedural crater bump map
    const geometry = new THREE.SphereGeometry(MOON_RADIUS, 32, 32);

    // Generate crater bump map via canvas
    const bumpCanvas = document.createElement("canvas");
    bumpCanvas.width = 256;
    bumpCanvas.height = 128;
    const ctx = bumpCanvas.getContext("2d")!;
    ctx.fillStyle = "#888";
    ctx.fillRect(0, 0, 256, 128);

    // Draw craters as darker circles
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 128;
      const r = 2 + Math.random() * 8;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,0,0,${0.2 + Math.random() * 0.3})`;
      ctx.fill();
    }

    const bumpTexture = new THREE.CanvasTexture(bumpCanvas);

    const material = new THREE.MeshStandardMaterial({
      color: 0xaaaaaa,
      emissive: new THREE.Color(0x333333),
      emissiveIntensity: 0.4,
      roughness: 0.9,
      metalness: 0.0,
      bumpMap: bumpTexture,
      bumpScale: 0.3,
    });

    this.moonMesh = new THREE.Mesh(geometry, material);
    this.add(this.moonMesh);

    // Self-illumination light
    const moonLight = new THREE.PointLight(0x888888, 1.5, 20);
    this.add(moonLight);

    // Initial orbit position around Earth
    this.position.set(
      EARTH_POSITION.x + Math.cos(this.orbitAngle) * MOON_ORBIT_RADIUS,
      EARTH_POSITION.y,
      EARTH_POSITION.z + Math.sin(this.orbitAngle) * MOON_ORBIT_RADIUS,
    );
  }

  update(time: number, _delta: number): void {
    // Orbit around Earth
    this.orbitAngle = time * MOON_ORBIT_SPEED;
    this.position.set(
      EARTH_POSITION.x + Math.cos(this.orbitAngle) * MOON_ORBIT_RADIUS,
      EARTH_POSITION.y + Math.sin(this.orbitAngle * 0.3) * 1.0,
      EARTH_POSITION.z + Math.sin(this.orbitAngle) * MOON_ORBIT_RADIUS,
    );

    // Slow self-rotation
    this.moonMesh.rotation.y = time * 0.05;
  }
}
