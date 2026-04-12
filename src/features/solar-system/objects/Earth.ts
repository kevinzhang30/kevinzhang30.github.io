import * as THREE from "three";
import { CelestialObject } from "./CelestialObject";
import atmosphereVertShader from "../shaders/atmosphere.vert.glsl?raw";
import atmosphereFragShader from "../shaders/atmosphere.frag.glsl?raw";
import {
  EARTH_POSITION,
  EARTH_RADIUS,
  EARTH_ROTATION_SPEED,
  EARTH_TEXTURE_URL,
  ATMOSPHERE_TEAL,
} from "../constants";

export class Earth extends CelestialObject {
  private earthMesh: THREE.Mesh;

  constructor() {
    super("Earth", { route: "/map", label: "Map", description: "Places I've been" }, EARTH_RADIUS * 1.8);

    // Earth sphere
    const geometry = new THREE.SphereGeometry(EARTH_RADIUS, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(`https:${EARTH_TEXTURE_URL}`);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      emissive: new THREE.Color(0x113355),
      emissiveIntensity: 0.3,
      roughness: 0.8,
      metalness: 0.1,
    });
    this.earthMesh = new THREE.Mesh(geometry, material);
    this.add(this.earthMesh);

    // Atmosphere shell (Fresnel glow)
    const atmosGeometry = new THREE.SphereGeometry(EARTH_RADIUS * 1.03, 64, 64);
    const atmosMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertShader,
      fragmentShader: atmosphereFragShader,
      uniforms: {
        uColor: { value: new THREE.Color(ATMOSPHERE_TEAL) },
        uIntensity: { value: 2.5 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const atmosMesh = new THREE.Mesh(atmosGeometry, atmosMaterial);
    this.add(atmosMesh);

    // Self-illumination light
    const earthLight = new THREE.PointLight(0x00838f, 3, 40);
    this.add(earthLight);

    // Fixed position — Earth is the center of the scene
    this.position.set(EARTH_POSITION.x, EARTH_POSITION.y, EARTH_POSITION.z);
  }

  update(time: number, _delta: number): void {
    // Self-rotation only — no orbit
    this.earthMesh.rotation.y = time * EARTH_ROTATION_SPEED;
  }
}
