import * as THREE from "three";
import { CelestialObject } from "./CelestialObject";
import {
  ROCKET_WHITE,
  ROCKET_STRIPE,
  ROCKET_SPEED,
  ROCKET_PATH_POINTS,
} from "../constants";

export class Rocket extends CelestialObject {
  private path: THREE.CatmullRomCurve3;
  private pathT = 0;
  private exhaustParticles: THREE.Points;
  private exhaustPositions: Float32Array;
  private exhaustCount: number;

  constructor(exhaustParticleCount: number = 200) {
    super("Rocket", { route: "/projects", label: "Projects", description: "Things I've built" }, 5);
    this.exhaustCount = exhaustParticleCount;

    // Build rocket body
    const rocketGroup = new THREE.Group();

    // Nose cone
    const noseGeo = new THREE.ConeGeometry(1.2, 3, 16);
    const noseMat = new THREE.MeshStandardMaterial({
      color: ROCKET_WHITE,
      emissive: new THREE.Color(0x444444),
      emissiveIntensity: 0.4,
      roughness: 0.3,
      metalness: 0.4,
    });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.y = 4;
    rocketGroup.add(nose);

    // Body cylinder
    const bodyGeo = new THREE.CylinderGeometry(1.2, 1.2, 5, 16);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: ROCKET_WHITE,
      emissive: new THREE.Color(0x444444),
      emissiveIntensity: 0.4,
      roughness: 0.3,
      metalness: 0.4,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0;
    rocketGroup.add(body);

    // Colored stripe
    const stripeGeo = new THREE.CylinderGeometry(1.25, 1.25, 0.5, 16);
    const stripeMat = new THREE.MeshStandardMaterial({
      color: ROCKET_STRIPE,
      roughness: 0.5,
      emissive: new THREE.Color(ROCKET_STRIPE),
      emissiveIntensity: 0.8,
    });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.y = 1;
    rocketGroup.add(stripe);

    // Fins (3 radially placed)
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      const finShape = new THREE.Shape();
      finShape.moveTo(0, 0);
      finShape.lineTo(2, 0);
      finShape.lineTo(0, 3);
      finShape.closePath();

      const finGeo = new THREE.ExtrudeGeometry(finShape, {
        depth: 0.15,
        bevelEnabled: false,
      });
      const finMat = new THREE.MeshStandardMaterial({
        color: ROCKET_STRIPE,
        roughness: 0.5,
        metalness: 0.3,
      });
      const fin = new THREE.Mesh(finGeo, finMat);
      fin.position.set(
        Math.cos(angle) * 1.1,
        -2.5,
        Math.sin(angle) * 1.1,
      );
      fin.rotation.y = -angle + Math.PI / 2;
      fin.rotation.x = -Math.PI / 2;
      rocketGroup.add(fin);
    }

    // Engine nozzle
    const nozzleGeo = new THREE.CylinderGeometry(0.8, 1.0, 1, 16);
    const nozzleMat = new THREE.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.2,
      metalness: 0.9,
    });
    const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
    nozzle.position.y = -3;
    rocketGroup.add(nozzle);

    // Self-illumination light
    const rocketLight = new THREE.PointLight(0x6688ff, 2, 30);
    rocketLight.position.set(0, -3, 0);
    rocketGroup.add(rocketLight);

    rocketGroup.scale.set(1.5, 1.5, 1.5);
    this.add(rocketGroup);

    // Create path from control points
    const points = ROCKET_PATH_POINTS.map(
      (p) => new THREE.Vector3(p.x, p.y, p.z),
    );
    this.path = new THREE.CatmullRomCurve3(points, true);

    // Exhaust particles
    this.exhaustPositions = new Float32Array(this.exhaustCount * 3);
    const exhaustGeo = new THREE.BufferGeometry();
    exhaustGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(this.exhaustPositions, 3),
    );

    const exhaustMat = new THREE.PointsMaterial({
      color: 0x66aaff,
      size: 1.2,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    this.exhaustParticles = new THREE.Points(exhaustGeo, exhaustMat);
    this.add(this.exhaustParticles);

    // Initialize position
    const startPos = this.path.getPointAt(0);
    this.position.copy(startPos);
  }

  update(time: number, _delta: number): void {
    // Move along path
    this.pathT = (time * ROCKET_SPEED * 0.3) % 1;
    const pos = this.path.getPointAt(this.pathT);
    this.position.copy(pos);

    // Orient along path tangent
    const tangent = this.path.getTangentAt(this.pathT);
    const up = new THREE.Vector3(0, 1, 0);
    const lookTarget = pos.clone().add(tangent);
    const mat4 = new THREE.Matrix4().lookAt(pos, lookTarget, up);
    const quat = new THREE.Quaternion().setFromRotationMatrix(mat4);
    this.quaternion.slerp(quat, 0.1);

    // Update exhaust particles
    const worldPos = this.getWorldCenter();
    const backDir = tangent.clone().negate();
    for (let i = 0; i < this.exhaustCount; i++) {
      const age = ((time * 3 + i * 0.1) % 1);
      const spread = age * 2;
      this.exhaustPositions[i * 3] = worldPos.x + backDir.x * age * 8 + (Math.random() - 0.5) * spread;
      this.exhaustPositions[i * 3 + 1] = worldPos.y + backDir.y * age * 8 + (Math.random() - 0.5) * spread;
      this.exhaustPositions[i * 3 + 2] = worldPos.z + backDir.z * age * 8 + (Math.random() - 0.5) * spread;
    }
    this.exhaustParticles.geometry.attributes.position.needsUpdate = true;
    // Keep exhaust in world space
    this.exhaustParticles.position.copy(this.position.clone().negate());
  }
}
