import * as THREE from "three";
import type { NavTarget } from "../types";

export abstract class CelestialObject extends THREE.Group {
  readonly navTarget: NavTarget;
  readonly hitbox: THREE.Mesh;
  protected orbitAngle = Math.random() * Math.PI * 2;

  constructor(
    name: string,
    navTarget: NavTarget,
    hitboxSize: number,
  ) {
    super();
    this.name = name;
    this.navTarget = navTarget;

    // Invisible hitbox for raycasting
    const hitGeo = new THREE.SphereGeometry(hitboxSize, 8, 8);
    const hitMat = new THREE.MeshBasicMaterial({
      visible: false,
    });
    this.hitbox = new THREE.Mesh(hitGeo, hitMat);
    this.hitbox.userData = { celestialObject: this };
    this.add(this.hitbox);
  }

  abstract update(time: number, delta: number): void;

  getWorldCenter(): THREE.Vector3 {
    const pos = new THREE.Vector3();
    this.getWorldPosition(pos);
    return pos;
  }

  dispose(): void {
    this.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
      if (obj instanceof THREE.Points) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
  }
}
