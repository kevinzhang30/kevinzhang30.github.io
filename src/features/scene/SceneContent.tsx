import type { RefObject } from "react";
import type * as THREE from "three";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import type { Destination, DestinationId } from "./types";
import { DESTINATIONS, HOME_DESTINATION_ID } from "./config";
import CameraRig from "./CameraRig";
import Starfield from "./effects/Starfield";
import ShootingStars from "./effects/ShootingStars";
import Rocket from "./objects/Rocket";
import Satellite from "./objects/Satellite";
import Moon from "./objects/Moon";
import Portal from "./objects/Portal";
import AsteroidBelt from "./objects/AsteroidBelt";

interface SceneContentProps {
  activeDestination: DestinationId;
  hoveredId: DestinationId | null;
  suppressGlow?: boolean;
  portalZooming?: boolean;
  reducedMotion: boolean;
  mousePositionRef: RefObject<{ x: number; y: number }>;
  satelliteWorldRef: RefObject<THREE.Vector3>;
  rocketWorldRef: RefObject<THREE.Vector3>;
  onHoverChange: (id: DestinationId | null) => void;
  onSelect: (destination: Destination) => void;
}

const OBJECTS_BY_ID: Record<"rocket" | "satellite" | "moon" | "earth", Destination> = {
  rocket: DESTINATIONS.find((d) => d.id === "rocket")!,
  satellite: DESTINATIONS.find((d) => d.id === "satellite")!,
  moon: DESTINATIONS.find((d) => d.id === "moon")!,
  earth: DESTINATIONS.find((d) => d.id === "earth")!,
};

export default function SceneContent({
  activeDestination,
  hoveredId,
  suppressGlow = false,
  portalZooming = false,
  reducedMotion,
  mousePositionRef,
  satelliteWorldRef,
  rocketWorldRef,
  onHoverChange,
  onSelect,
}: SceneContentProps) {
  const isHome = activeDestination === HOME_DESTINATION_ID;
  const glowActiveId = suppressGlow ? null : activeDestination;

  const bloomIntensity = hoveredId && isHome ? 0.9 : isHome ? 0.5 : 0.7;

  return (
    <>
      <ambientLight intensity={0.38} color="#a7c1ff" />
      <directionalLight position={[12, 10, 18]} intensity={3.6} color="#d9e9ff" />
      <directionalLight position={[-10, -3, 10]} intensity={1} color="#2757aa" />

      <CameraRig
        activeDestination={activeDestination}
        reducedMotion={reducedMotion}
        mousePositionRef={mousePositionRef}
        satelliteWorldRef={satelliteWorldRef}
        rocketWorldRef={rocketWorldRef}
      />

      <Starfield />
      <ShootingStars />
      <AsteroidBelt />

      <Rocket
        destination={OBJECTS_BY_ID.rocket}
        isActive={glowActiveId === "rocket"}
        isHovered={hoveredId === "rocket"}
        onHoverChange={onHoverChange}
        onSelect={onSelect}
        worldPositionRef={rocketWorldRef}
      />
      <Satellite
        destination={OBJECTS_BY_ID.satellite}
        isActive={glowActiveId === "satellite"}
        isHovered={hoveredId === "satellite"}
        onHoverChange={onHoverChange}
        onSelect={onSelect}
        worldPositionRef={satelliteWorldRef}
      />
      <Moon
        destination={OBJECTS_BY_ID.moon}
        isActive={glowActiveId === "moon"}
        isHovered={hoveredId === "moon"}
        onHoverChange={onHoverChange}
        onSelect={onSelect}
      />
      <Portal
        destination={OBJECTS_BY_ID.earth}
        isActive={glowActiveId === "earth"}
        isHovered={hoveredId === "earth"}
        onHoverChange={onHoverChange}
        onSelect={onSelect}
        zooming={portalZooming}
      />

      <EffectComposer multisampling={0}>
        <Bloom
          mipmapBlur
          intensity={bloomIntensity}
          luminanceThreshold={0.65}
          luminanceSmoothing={0.2}
        />
        <Vignette offset={0.18} darkness={0.68} />
      </EffectComposer>
    </>
  );
}
