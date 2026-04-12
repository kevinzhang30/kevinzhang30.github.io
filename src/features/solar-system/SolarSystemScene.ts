import * as THREE from "three";
import { Earth } from "./objects/Earth";
import { Moon } from "./objects/Moon";
import { Rocket } from "./objects/Rocket";
import { Satellite } from "./objects/Satellite";
import { StationInterior } from "./interior/StationInterior";
import { HUD } from "./interior/HUD";
import { CameraRig } from "./camera/CameraRig";
import { PostProcessingPipeline } from "./effects/PostProcessing";
import { CelestialObject } from "./objects/CelestialObject";
import type { QualityTier, QualitySettings } from "./types";
import {
  SCENE_BG_COLOR,
  AMBIENT_LIGHT_COLOR,
  AMBIENT_LIGHT_INTENSITY,
  CAMERA_FOV,
  CAMERA_NEAR,
  CAMERA_FAR,
  STAR_FIELD_MIN_RADIUS,
  STAR_FIELD_MAX_RADIUS,
  QUALITY_SETTINGS,
} from "./constants";

export class SolarSystemScene {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private cameraRig: CameraRig;
  private postProcessing: PostProcessingPipeline;

  private earth: Earth;
  private moon: Moon;
  private rocket: Rocket;
  private satellite: Satellite;
  private stationInterior: StationInterior;
  private hud: HUD;

  private celestialObjects: CelestialObject[] = [];
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  private animationId: number | null = null;
  private lastTime = 0;
  private throttled = false;
  private lastFrameTime = 0;
  private quality: QualitySettings;
  private container: HTMLElement;

  private hoveredObject: CelestialObject | null = null;
  private onHover: ((obj: CelestialObject | null, screenPos: { x: number; y: number } | null) => void) | null = null;
  private onClick: ((obj: CelestialObject) => void) | null = null;
  private onReady: (() => void) | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.quality = QUALITY_SETTINGS[this.detectQualityTier()];

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.quality.pixelRatioCap));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(SCENE_BG_COLOR);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      CAMERA_FOV,
      container.clientWidth / container.clientHeight,
      CAMERA_NEAR,
      CAMERA_FAR,
    );

    // Camera rig
    this.cameraRig = new CameraRig(this.camera);

    // Lighting
    const ambient = new THREE.AmbientLight(AMBIENT_LIGHT_COLOR, AMBIENT_LIGHT_INTENSITY);
    this.scene.add(ambient);

    // Directional light simulating distant sunlight on Earth
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(-20, 20, 30);
    sunLight.target.position.set(0, 0, 55);
    this.scene.add(sunLight);
    this.scene.add(sunLight.target);

    // Star field
    this.addStarField();

    // Objects — Earth is the centerpiece
    this.earth = new Earth();
    this.scene.add(this.earth);
    this.celestialObjects.push(this.earth);

    this.moon = new Moon();
    this.scene.add(this.moon);
    this.celestialObjects.push(this.moon);

    this.rocket = new Rocket(this.quality.exhaustParticles);
    this.scene.add(this.rocket);
    this.celestialObjects.push(this.rocket);

    this.satellite = new Satellite();
    this.scene.add(this.satellite);
    this.celestialObjects.push(this.satellite);

    // Station interior
    this.stationInterior = new StationInterior();
    this.scene.add(this.stationInterior);

    // HUD
    this.hud = new HUD();
    this.scene.add(this.hud);

    // Post-processing
    this.postProcessing = new PostProcessingPipeline(
      this.renderer,
      this.scene,
      this.camera,
      this.quality,
    );

    // Events
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.onResize = this.onResize.bind(this);
    container.addEventListener("mousemove", this.onMouseMove);
    container.addEventListener("click", this.onClickHandler);
    window.addEventListener("resize", this.onResize);

    // Start
    this.animate(0);
    // Signal ready on next frame
    requestAnimationFrame(() => this.onReady?.());
  }

  private detectQualityTier(): QualityTier {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl");
    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        const isLow = /intel|mali|adreno 3|adreno 4/i.test(renderer);
        const isMobile = window.innerWidth < 768;
        if (isLow || isMobile) return "low";
        if (window.innerWidth < 1200) return "medium";
      }
    }
    return "high";
  }

  private addStarField(): void {
    const count = this.quality.starCount;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = STAR_FIELD_MIN_RADIUS + Math.random() * (STAR_FIELD_MAX_RADIUS - STAR_FIELD_MIN_RADIUS);
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * 2 * Math.PI;

      positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(theta);
      sizes[i] = 0.5 + Math.random() * 1.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
    });

    this.scene.add(new THREE.Points(geometry, material));
  }

  private onMouseMove(event: MouseEvent): void {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private onClickHandler(event: MouseEvent): void {
    if (this.cameraRig.getState() !== "INTERIOR") return;

    // Update mouse for raycast
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const hitboxes = this.celestialObjects.map((obj) => obj.hitbox);
    const intersects = this.raycaster.intersectObjects(hitboxes, false);

    if (intersects.length > 0) {
      const celestialObj = intersects[0].object.userData.celestialObject as CelestialObject;
      this.onClick?.(celestialObj);
    }
  }

  private onResize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.postProcessing.setSize(width, height);
  }

  private animate = (timestamp: number): void => {
    this.animationId = requestAnimationFrame(this.animate);

    // Throttle to 30fps when content overlay is visible
    if (this.throttled) {
      if (timestamp - this.lastFrameTime < 33) return;
    }
    this.lastFrameTime = timestamp;

    const time = timestamp * 0.001; // to seconds
    const delta = time - this.lastTime;
    this.lastTime = time;

    // Update objects
    for (const obj of this.celestialObjects) {
      obj.update(time, delta);
    }
    this.hud.update(time);

    // Update camera
    this.cameraRig.update(time);

    // Raycasting for hover (only in INTERIOR state)
    if (this.cameraRig.getState() === "INTERIOR") {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const hitboxes = this.celestialObjects.map((obj) => obj.hitbox);
      const intersects = this.raycaster.intersectObjects(hitboxes, false);

      if (intersects.length > 0) {
        const obj = intersects[0].object.userData.celestialObject as CelestialObject;
        if (obj !== this.hoveredObject) {
          this.hoveredObject = obj;
          // Project to screen coords
          const worldPos = obj.getWorldCenter();
          const screenPos = worldPos.clone().project(this.camera);
          this.onHover?.(obj, {
            x: (screenPos.x + 1) / 2 * this.container.clientWidth,
            y: (-screenPos.y + 1) / 2 * this.container.clientHeight,
          });
        }
      } else if (this.hoveredObject) {
        this.hoveredObject = null;
        this.onHover?.(null, null);
      }
    }

    // Render
    this.postProcessing.render();
  };

  // Public API
  setOnHover(cb: (obj: CelestialObject | null, screenPos: { x: number; y: number } | null) => void): void {
    this.onHover = cb;
  }

  setOnClick(cb: (obj: CelestialObject) => void): void {
    this.onClick = cb;
  }

  setOnReady(cb: () => void): void {
    this.onReady = cb;
  }

  flyToObject(obj: CelestialObject, onComplete?: () => void): void {
    const worldPos = obj.getWorldCenter();
    this.cameraRig.flyToObject(worldPos, onComplete);
  }

  returnToStation(onComplete?: () => void): void {
    this.cameraRig.returnToStation(onComplete);
  }

  setThrottled(throttled: boolean): void {
    this.throttled = throttled;
  }

  getCameraState() {
    return this.cameraRig.getState();
  }

  dispose(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }

    this.container.removeEventListener("mousemove", this.onMouseMove);
    this.container.removeEventListener("click", this.onClickHandler);
    window.removeEventListener("resize", this.onResize);

    this.cameraRig.dispose();
    for (const obj of this.celestialObjects) {
      obj.dispose();
    }
    this.stationInterior.dispose();
    this.hud.dispose();
    this.postProcessing.dispose();

    // Traverse and dispose everything
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else if (obj.material) {
          obj.material.dispose();
        }
      }
      if (obj instanceof THREE.Points) {
        obj.geometry.dispose();
        if (obj.material instanceof THREE.Material) {
          obj.material.dispose();
        }
      }
    });

    this.renderer.dispose();
    this.container.removeChild(this.renderer.domElement);
  }
}
