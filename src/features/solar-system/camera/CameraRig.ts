import * as THREE from "three";
import type { CameraState, CameraTarget } from "../types";
import {
  STATION_CAMERA_POSITION,
  STATION_LOOK_AT,
  IDLE_SWAY_AMPLITUDE,
  IDLE_SWAY_SPEED,
  MOUSE_PARALLAX_FACTOR,
  TRANSITION_DURATION,
} from "../constants";

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export class CameraRig {
  readonly camera: THREE.PerspectiveCamera;
  private state: CameraState = "INTERIOR";
  private mouseX = 0;
  private mouseY = 0;

  // Interior default positions
  private interiorPos = new THREE.Vector3(
    STATION_CAMERA_POSITION.x,
    STATION_CAMERA_POSITION.y,
    STATION_CAMERA_POSITION.z,
  );
  private interiorLookAt = new THREE.Vector3(
    STATION_LOOK_AT.x,
    STATION_LOOK_AT.y,
    STATION_LOOK_AT.z,
  );

  // Transition state
  private transitionStartTime = 0;
  private transitionDuration = TRANSITION_DURATION;
  private startPos = new THREE.Vector3();
  private startLookAt = new THREE.Vector3();
  private targetPos = new THREE.Vector3();
  private targetLookAt = new THREE.Vector3();
  private currentLookAt = new THREE.Vector3();
  private onTransitionComplete: (() => void) | null = null;

  // Focused state — store base position to prevent drift
  private focusedBasePos = new THREE.Vector3();

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.camera.position.copy(this.interiorPos);
    this.currentLookAt.copy(this.interiorLookAt);
    this.camera.lookAt(this.currentLookAt);

    this.onMouseMove = this.onMouseMove.bind(this);
    window.addEventListener("mousemove", this.onMouseMove);
  }

  private onMouseMove(e: MouseEvent): void {
    this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  getState(): CameraState {
    return this.state;
  }

  flyTo(target: CameraTarget, onComplete?: () => void): void {
    this.state = "TRANSITIONING";
    this.transitionStartTime = performance.now();
    this.startPos.copy(this.camera.position);
    this.startLookAt.copy(this.currentLookAt);
    this.targetPos.copy(target.position);
    this.targetLookAt.copy(target.lookAt);
    this.onTransitionComplete = onComplete ?? null;
  }

  flyToObject(objectWorldPos: THREE.Vector3, onComplete?: () => void): void {
    // Position camera at a viewing distance from the object
    const dir = objectWorldPos.clone().normalize();
    const cameraPos = objectWorldPos.clone().sub(dir.multiplyScalar(25));
    cameraPos.y += 5;

    this.flyTo(
      { position: cameraPos, lookAt: objectWorldPos },
      onComplete,
    );
  }

  returnToStation(onComplete?: () => void): void {
    this.flyTo(
      { position: this.interiorPos.clone(), lookAt: this.interiorLookAt.clone() },
      () => {
        this.state = "INTERIOR";
        onComplete?.();
      },
    );
  }

  update(time: number): void {
    if (this.state === "INTERIOR") {
      // Idle sway
      const swayX = Math.sin(time * IDLE_SWAY_SPEED) * IDLE_SWAY_AMPLITUDE;
      const swayY = Math.cos(time * IDLE_SWAY_SPEED * 0.7) * IDLE_SWAY_AMPLITUDE * 0.5;

      // Mouse parallax
      const parallaxX = this.mouseX * MOUSE_PARALLAX_FACTOR;
      const parallaxY = -this.mouseY * MOUSE_PARALLAX_FACTOR;

      this.camera.position.set(
        this.interiorPos.x + swayX + parallaxX,
        this.interiorPos.y + swayY + parallaxY,
        this.interiorPos.z,
      );

      this.currentLookAt.set(
        this.interiorLookAt.x + parallaxX * 0.5,
        this.interiorLookAt.y + parallaxY * 0.5,
        this.interiorLookAt.z,
      );
      this.camera.lookAt(this.currentLookAt);
    } else if (this.state === "TRANSITIONING") {
      const elapsed = performance.now() - this.transitionStartTime;
      const progress = Math.min(elapsed / this.transitionDuration, 1);
      const eased = easeInOutCubic(progress);

      this.camera.position.lerpVectors(this.startPos, this.targetPos, eased);
      this.currentLookAt.lerpVectors(this.startLookAt, this.targetLookAt, eased);
      this.camera.lookAt(this.currentLookAt);

      if (progress >= 1) {
        this.state = "FOCUSED";
        this.focusedBasePos.copy(this.camera.position);
        this.onTransitionComplete?.();
        this.onTransitionComplete = null;
      }
    } else if (this.state === "FOCUSED") {
      // Subtle idle movement from fixed base — no drift
      this.camera.position.set(
        this.focusedBasePos.x + Math.sin(time * 0.3) * 0.5,
        this.focusedBasePos.y + Math.cos(time * 0.2) * 0.3,
        this.focusedBasePos.z,
      );
      this.camera.lookAt(this.currentLookAt);
    }
  }

  dispose(): void {
    window.removeEventListener("mousemove", this.onMouseMove);
  }
}
