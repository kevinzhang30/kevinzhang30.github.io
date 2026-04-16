import type { RefObject } from "react";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import type { Destination, DestinationId } from "./types";
import { DESTINATIONS, HOME_DESTINATION_ID } from "./config";
import CameraRig from "./CameraRig";
import Starfield from "./effects/Starfield";
import NebulaBackdrop from "./effects/NebulaBackdrop";
import AsteroidField from "./effects/AsteroidField";
import ShootingStars from "./effects/ShootingStars";
import CockpitShell from "./cockpit/CockpitShell";
import CockpitGlass from "./cockpit/CockpitGlass";
import Earth from "./objects/Earth";
import Rocket from "./objects/Rocket";
import Satellite from "./objects/Satellite";
import Moon from "./objects/Moon";

const HOME_COCKPIT_INTENSITY = 1;
const DESTINATION_COCKPIT_INTENSITY = 0.15;

interface SceneContentProps {
  activeDestination: DestinationId;
  hoveredId: DestinationId | null;
  reducedMotion: boolean;
  mousePositionRef: RefObject<{ x: number; y: number }>;
  onHoverChange: (id: DestinationId | null) => void;
  onSelect: (destination: Destination) => void;
}

const OBJECTS_BY_ID: Record<"earth" | "rocket" | "satellite" | "moon", Destination> = {
  earth: DESTINATIONS.find((d) => d.id === "earth")!,
  rocket: DESTINATIONS.find((d) => d.id === "rocket")!,
  satellite: DESTINATIONS.find((d) => d.id === "satellite")!,
  moon: DESTINATIONS.find((d) => d.id === "moon")!,
};

export default function SceneContent({
  activeDestination,
  hoveredId,
  reducedMotion,
  mousePositionRef,
  onHoverChange,
  onSelect,
}: SceneContentProps) {
  const isHome = activeDestination === HOME_DESTINATION_ID;
  const cockpitIntensity = isHome ? HOME_COCKPIT_INTENSITY : DESTINATION_COCKPIT_INTENSITY;

  const bloomIntensity = hoveredId && isHome ? 0.9 : isHome ? 0.5 : 0.7;

  return (
    <>
      <color attach="background" args={["#020611"]} />
      <fogExp2 attach="fog" args={["#020611", 0.012]} />

      <ambientLight intensity={0.38} color="#a7c1ff" />
      <directionalLight position={[12, 10, 18]} intensity={3.6} color="#d9e9ff" />
      <directionalLight position={[-10, -3, 10]} intensity={1} color="#2757aa" />
      <spotLight
        position={[0, -3.1, 7.2]}
        angle={0.92}
        penumbra={0.9}
        intensity={9.5 * cockpitIntensity}
        distance={18}
        color="#23d7ff"
      />

      <CameraRig
        activeDestination={activeDestination}
        reducedMotion={reducedMotion}
        mousePositionRef={mousePositionRef}
      />

      <NebulaBackdrop />
      <Starfield />
      <AsteroidField />
      <ShootingStars />
      <CockpitShell intensity={cockpitIntensity} />
      <CockpitGlass intensity={cockpitIntensity} />

      <Earth
        destination={OBJECTS_BY_ID.earth}
        isActive={activeDestination === "earth"}
        isHovered={hoveredId === "earth"}
        onHoverChange={onHoverChange}
        onSelect={onSelect}
      />
      <Rocket
        destination={OBJECTS_BY_ID.rocket}
        isActive={activeDestination === "rocket"}
        isHovered={hoveredId === "rocket"}
        onHoverChange={onHoverChange}
        onSelect={onSelect}
      />
      <Satellite
        destination={OBJECTS_BY_ID.satellite}
        isActive={activeDestination === "satellite"}
        isHovered={hoveredId === "satellite"}
        onHoverChange={onHoverChange}
        onSelect={onSelect}
      />
      <Moon
        destination={OBJECTS_BY_ID.moon}
        isActive={activeDestination === "moon"}
        isHovered={hoveredId === "moon"}
        onHoverChange={onHoverChange}
        onSelect={onSelect}
      />

      <EffectComposer multisampling={0}>
        <Bloom
          mipmapBlur
          intensity={bloomIntensity}
          luminanceThreshold={0.35}
          luminanceSmoothing={0.22}
        />
        <Noise premultiply opacity={0.03} blendFunction={BlendFunction.SOFT_LIGHT} />
        <Vignette offset={0.18} darkness={0.68} />
      </EffectComposer>
    </>
  );
}
