import { useMemo, useRef } from "react";
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
}

function destinationToPose(id: DestinationId): CameraPose {
  const d = getDestinationById(id) ?? getDestinationById(HOME_DESTINATION_ID)!;
  return {
    position: d.cameraPosition,
    lookAt: d.cameraLookAt,
  };
}

export default function CameraRig({
  activeDestination,
  reducedMotion,
  mousePositionRef,
}: CameraRigProps) {
  const { camera } = useThree();
  const perspectiveCamera = camera as THREE.PerspectiveCamera;

  const targetPose = useMemo(
    () => destinationToPose(activeDestination),
    [activeDestination],
  );

  const { read } = useCameraFlyTo({ targetPose, reducedMotion });

  // Scratch vectors to avoid per-frame allocations.
  const lookAtVec = useRef(new THREE.Vector3());

  useFrame((state) => {
    const now = performance.now();
    const { currentPose } = read(now);

    const isHome = activeDestination === HOME_DESTINATION_ID;
    const parallaxScale = isHome ? 1 : 0.2;
    const t = state.clock.elapsedTime;

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
