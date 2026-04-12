import * as THREE from "three";
import { CelestialObject } from "./CelestialObject";
import {
  SATELLITE_SILVER,
  SATELLITE_PANEL,
  SATELLITE_ORBIT_RADIUS,
  SATELLITE_ORBIT_SPEED,
  EARTH_POSITION,
} from "../constants";

export class Satellite extends CelestialObject {
  constructor() {
    super("Satellite", { route: "/gallery", label: "Gallery", description: "Photos & moments" }, 6);

    // Body
    const bodyGeo = new THREE.BoxGeometry(1.5, 1, 1);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: SATELLITE_SILVER,
      emissive: new THREE.Color(0x333333),
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.9,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    this.add(body);

    // Dish (parabolic profile via LatheGeometry)
    const dishPoints: THREE.Vector2[] = [];
    for (let i = 0; i <= 16; i++) {
      const t = i / 16;
      const x = t * 1.2;
      const y = t * t * 0.6;
      dishPoints.push(new THREE.Vector2(x, y));
    }
    const dishGeo = new THREE.LatheGeometry(dishPoints, 16);
    const dishMat = new THREE.MeshStandardMaterial({
      color: SATELLITE_SILVER,
      roughness: 0.3,
      metalness: 0.8,
      side: THREE.DoubleSide,
    });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.position.set(0, 0.8, 0);
    dish.rotation.x = -Math.PI / 4;
    this.add(dish);

    // Solar panels (2 on arms)
    for (const side of [-1, 1]) {
      // Arm
      const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
      const armMat = new THREE.MeshStandardMaterial({
        color: SATELLITE_SILVER,
        metalness: 0.8,
        roughness: 0.3,
      });
      const arm = new THREE.Mesh(armGeo, armMat);
      arm.position.set(side * 2.25, 0, 0);
      arm.rotation.z = Math.PI / 2;
      this.add(arm);

      // Panel
      const panelGeo = new THREE.PlaneGeometry(3, 1);
      const panelMat = new THREE.MeshStandardMaterial({
        color: SATELLITE_PANEL,
        emissive: new THREE.Color(SATELLITE_PANEL),
        emissiveIntensity: 1.0,
        roughness: 0.5,
        metalness: 0.6,
        side: THREE.DoubleSide,
      });
      const panel = new THREE.Mesh(panelGeo, panelMat);
      panel.position.set(side * 3.5, 0, 0);
      panel.rotation.y = Math.PI / 2;
      this.add(panel);
    }

    // Antenna mast
    const antennaGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8);
    const antennaMat = new THREE.MeshStandardMaterial({
      color: SATELLITE_SILVER,
      metalness: 0.9,
      roughness: 0.1,
    });
    const antenna = new THREE.Mesh(antennaGeo, antennaMat);
    antenna.position.set(0, -0.8, 0.4);
    this.add(antenna);

    // Blinking indicator light on body
    const indicatorGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const indicatorMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
    });
    const indicator = new THREE.Mesh(indicatorGeo, indicatorMat);
    indicator.position.set(0, 0.6, 0.5);
    this.add(indicator);

    // Self-illumination light
    const satLight = new THREE.PointLight(0x4488cc, 3, 30);
    this.add(satLight);

    // Scale up for visibility
    this.scale.set(3, 3, 3);

    // Initial orbit position (centered on Earth)
    this.position.set(
      EARTH_POSITION.x + Math.cos(this.orbitAngle) * SATELLITE_ORBIT_RADIUS,
      EARTH_POSITION.y + 5,
      EARTH_POSITION.z + Math.sin(this.orbitAngle) * SATELLITE_ORBIT_RADIUS,
    );
  }

  update(time: number, _delta: number): void {
    // Orbit around Earth
    this.orbitAngle = time * SATELLITE_ORBIT_SPEED;
    this.position.set(
      EARTH_POSITION.x + Math.cos(this.orbitAngle) * SATELLITE_ORBIT_RADIUS,
      EARTH_POSITION.y + Math.sin(this.orbitAngle * 0.5) * 1.5,
      EARTH_POSITION.z + Math.sin(this.orbitAngle) * SATELLITE_ORBIT_RADIUS,
    );

    // Slow rotation
    this.rotation.y = time * 0.2;
  }
}
