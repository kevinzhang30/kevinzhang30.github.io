import { useRef } from "react";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import CockpitShell from "../cockpit/CockpitShell";
import CockpitGlass from "../cockpit/CockpitGlass";
import NebulaBackdrop from "../effects/NebulaBackdrop";
import Starfield from "../effects/Starfield";
import AsteroidField from "../effects/AsteroidField";
import ShootingStars from "../effects/ShootingStars";
import EarthNode from "../objects/EarthNode";
import MoonNode from "../objects/MoonNode";
import RocketNode from "../objects/RocketNode";
import SatelliteNode from "../objects/SatelliteNode";
import {
  DEFAULT_CAMERA_LOOK_AT,
  DEFAULT_CAMERA_POSITION,
  SCENE_OBJECTS,
  type SceneObjectId,
} from "./config";

const defaultCameraPosition = new THREE.Vector3(...DEFAULT_CAMERA_POSITION);
const defaultCameraLookAt = new THREE.Vector3(...DEFAULT_CAMERA_LOOK_AT);

interface SceneRootProps {
  hoveredId: SceneObjectId | null;
  focusedId: SceneObjectId | null;
  isTransitioning: boolean;
  onHoverChange: (id: SceneObjectId | null) => void;
  onSelect: (id: SceneObjectId) => void;
  mousePosition?: { x: number; y: number };
}

function CameraDirector({
  focusedId,
  isTransitioning,
  mousePosition,
}: Pick<SceneRootProps, "focusedId" | "isTransitioning" | "mousePosition">) {
  const { camera, clock } = useThree();
  const perspectiveCamera = camera as THREE.PerspectiveCamera;
  const lookAtRef = useRef(defaultCameraLookAt.clone());
  const baseFov = 38;

  useFrame((_, delta) => {
    const activeTarget = SCENE_OBJECTS.find((item) => item.id === focusedId);
    const targetPosition = activeTarget
      ? new THREE.Vector3(...activeTarget.focusPosition)
      : defaultCameraPosition.clone();
    const targetLookAt = activeTarget
      ? new THREE.Vector3(...activeTarget.position)
      : defaultCameraLookAt.clone();

    if (!activeTarget) {
      targetPosition.x += Math.sin(clock.elapsedTime * 0.22) * 0.28;
      targetPosition.y += Math.cos(clock.elapsedTime * 0.31) * 0.16;

      // Mouse parallax offset when in default view
      if (mousePosition) {
        targetLookAt.x += mousePosition.x * 0.6;
        targetLookAt.y += mousePosition.y * 0.3;
      }
    }
    if (activeTarget && isTransitioning) {
      targetPosition.lerp(targetLookAt, 0.24);
      targetPosition.y += 0.35;
      targetLookAt.z += 0.4;
    }

    const damping = 1 - Math.exp(-delta * (activeTarget ? (isTransitioning ? 4.8 : 3.1) : 1.8));
    perspectiveCamera.position.lerp(targetPosition, damping);
    lookAtRef.current.lerp(targetLookAt, damping);
    const targetFov = activeTarget ? (isTransitioning ? 20 : 26) : baseFov;
    perspectiveCamera.fov = THREE.MathUtils.lerp(perspectiveCamera.fov, targetFov, damping);
    perspectiveCamera.updateProjectionMatrix();
    perspectiveCamera.lookAt(lookAtRef.current);
  });

  return null;
}

export default function SceneRoot({
  hoveredId,
  focusedId,
  isTransitioning,
  onHoverChange,
  onSelect,
  mousePosition,
}: SceneRootProps) {
  return (
    <>
      <color attach="background" args={["#020611"]} />
      <fogExp2 attach="fog" args={["#020611", 0.012]} />

      <ambientLight intensity={0.38} color="#a7c1ff" />
      <directionalLight
        position={[12, 10, 18]}
        intensity={3.6}
        color="#d9e9ff"
      />
      <directionalLight
        position={[-10, -3, 10]}
        intensity={1}
        color="#2757aa"
      />
      <spotLight
        position={[0, -3.1, 7.2]}
        angle={0.92}
        penumbra={0.9}
        intensity={9.5}
        distance={18}
        color="#23d7ff"
      />

      <CameraDirector
        focusedId={focusedId}
        isTransitioning={isTransitioning}
        mousePosition={mousePosition}
      />
      <NebulaBackdrop />
      <Starfield />
      <AsteroidField />
      <ShootingStars />
      <CockpitShell />
      <CockpitGlass />

      <EarthNode
        target={SCENE_OBJECTS[0]}
        active={hoveredId === "earth"}
        focused={focusedId === "earth"}
        transitioning={isTransitioning}
        onHoverChange={onHoverChange}
        onSelect={onSelect}
      />
      <RocketNode
        target={SCENE_OBJECTS[1]}
        active={hoveredId === "rocket"}
        focused={focusedId === "rocket"}
        transitioning={isTransitioning}
        onHoverChange={onHoverChange}
        onSelect={onSelect}
      />
      <SatelliteNode
        target={SCENE_OBJECTS[2]}
        active={hoveredId === "satellite"}
        focused={focusedId === "satellite"}
        transitioning={isTransitioning}
        onHoverChange={onHoverChange}
        onSelect={onSelect}
      />
      <MoonNode
        target={SCENE_OBJECTS[3]}
        active={hoveredId === "moon"}
        focused={focusedId === "moon"}
        transitioning={isTransitioning}
        onHoverChange={onHoverChange}
        onSelect={onSelect}
      />

      <EffectComposer multisampling={0}>
        <Bloom
          mipmapBlur
          intensity={isTransitioning ? 1.15 : hoveredId || focusedId ? 0.9 : 0.5}
          luminanceThreshold={0.35}
          luminanceSmoothing={0.22}
        />
        <Noise premultiply opacity={0.03} blendFunction={BlendFunction.SOFT_LIGHT} />
        <Vignette offset={0.18} darkness={0.68} />
      </EffectComposer>
    </>
  );
}
