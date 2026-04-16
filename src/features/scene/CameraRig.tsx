import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { CameraPose, DestinationId } from "./types";
import { getDestinationById, HOME_DESTINATION_ID } from "./config";
import { useCameraFlyTo } from "./hooks/useCameraFlyTo";

interface CameraRigProps {
  activeDestination: DestinationId;
  reducedMotion: boolean;
  mousePositionRef: RefObject<{ x: number; y: number }>;
  satelliteWorldRef: RefObject<THREE.Vector3>;
  rocketWorldRef: RefObject<THREE.Vector3>;
}

const SATELLITE_CAMERA_OFFSET: [number, number, number] = [5, 2.5, 5];
const ROCKET_CAMERA_OFFSET: [number, number, number] = [3, 1.5, 4];

function destinationToPose(id: DestinationId): CameraPose {
  const d = getDestinationById(id) ?? getDestinationById(HOME_DESTINATION_ID)!;
  return {
    position: d.cameraPosition,
    lookAt: d.cameraLookAt,
  };
}

function poseFromSatellitePosition(p: THREE.Vector3): CameraPose {
  return {
    position: [
      p.x + SATELLITE_CAMERA_OFFSET[0],
      p.y + SATELLITE_CAMERA_OFFSET[1],
      p.z + SATELLITE_CAMERA_OFFSET[2],
    ],
    lookAt: [p.x, p.y, p.z],
  };
}

export default function CameraRig({
  activeDestination,
  reducedMotion,
  mousePositionRef,
  satelliteWorldRef,
  rocketWorldRef,
}: CameraRigProps) {
  const { camera } = useThree();
  const perspectiveCamera = camera as THREE.PerspectiveCamera;

  const [targetPose, setTargetPose] = useState<CameraPose>(() =>
    destinationToPose(activeDestination),
  );

  useEffect(() => {
    if (activeDestination === "satellite" && satelliteWorldRef.current) {
      setTargetPose(poseFromSatellitePosition(satelliteWorldRef.current));
    } else {
      setTargetPose(destinationToPose(activeDestination));
    }
  }, [activeDestination, satelliteWorldRef]);

  const { read } = useCameraFlyTo({ targetPose, reducedMotion });

  // Scratch vectors to avoid per-frame allocations.
  const lookAtVec = useRef(new THREE.Vector3());

  useFrame((state) => {
    const now = performance.now();
    const { currentPose } = read(now);

    const isHome = activeDestination === HOME_DESTINATION_ID;
    const isSatellite = activeDestination === "satellite";
    const isRocket = activeDestination === "rocket";
    const t = state.clock.elapsedTime;

    // Live-tracking branch: follow a moving object each frame via damped lerp.
    // Bypasses the tween entirely so the camera naturally eases in from wherever
    // it was and keeps chasing the moving target.
    const liveTarget =
      isSatellite && satelliteWorldRef.current
        ? { pos: satelliteWorldRef.current, offset: SATELLITE_CAMERA_OFFSET }
        : isRocket && rocketWorldRef.current
          ? { pos: rocketWorldRef.current, offset: ROCKET_CAMERA_OFFSET }
          : null;

    if (liveTarget) {
      const p = liveTarget.pos;
      const o = liveTarget.offset;
      const targetX = p.x + o[0];
      const targetY = p.y + o[1];
      const targetZ = p.z + o[2];
      const lerpFactor = reducedMotion ? 0.4 : 0.06;
      perspectiveCamera.position.x += (targetX - perspectiveCamera.position.x) * lerpFactor;
      perspectiveCamera.position.y += (targetY - perspectiveCamera.position.y) * lerpFactor;
      perspectiveCamera.position.z += (targetZ - perspectiveCamera.position.z) * lerpFactor;
      lookAtVec.current.set(p.x, p.y, p.z);
      perspectiveCamera.lookAt(lookAtVec.current);
      return;
    }

    const parallaxScale = isHome ? 1 : 0.2;

    // Base pose from the tween.
    const px = currentPose.position[0];
    const py = currentPose.position[1];
    const pz = currentPose.position[2];
    const lx = currentPose.lookAt[0];
    const ly = currentPose.lookAt[1];
    const lz = currentPose.lookAt[2];

    // Idle drift at home; dampened at destinations.
    const driftX = Math.sin(t * 0.22) * 0.28 * parallaxScale;
    const driftY = Math.cos(t * 0.31) * 0.16 * parallaxScale;

    // Mouse parallax on the lookAt target.
    const mouse = mousePositionRef.current;
    const parallaxX = mouse.x * 0.6 * parallaxScale;
    const parallaxY = mouse.y * 0.3 * parallaxScale;

    perspectiveCamera.position.set(px + driftX, py + driftY, pz);
    lookAtVec.current.set(lx + parallaxX, ly + parallaxY, lz);
    perspectiveCamera.lookAt(lookAtVec.current);
  });

  return null;
}
