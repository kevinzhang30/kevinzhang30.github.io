import { Float, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneObjectProps } from "./types";

const ROCKET_URL = "/models/rocket4.glb";
const MODEL_SCALE = 1.8;
const BASE_SCALE = 0.82;

// Parked in the upper-right of the home view, angled toward the planet.
const BASE_POSITION: [number, number, number] = [7.2, 4.4, -9];
const BASE_ROTATION: [number, number, number] = [0.12, -0.6, -0.22];
const THRUST_AMPLITUDE = 0.18;

interface RocketProps extends SceneObjectProps {
  worldPositionRef?: RefObject<THREE.Vector3>;
}

export default function Rocket({
  destination,
  isActive,
  isHovered,
  onHoverChange,
  onSelect,
  worldPositionRef,
}: RocketProps) {
  const groupRef = useRef<THREE.Group>(null);
  const thrustRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const engineLightRef = useRef<THREE.PointLight>(null);
  const { scene } = useGLTF(ROCKET_URL);

  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });
  }, [scene]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (thrustRef.current) {
      // Subtle oscillation along the rocket's local +Z (forward toward planet)
      // to suggest thrust without any net displacement.
      thrustRef.current.position.z =
        -Math.sin(t * 2.4) * THRUST_AMPLITUDE - THRUST_AMPLITUDE;
    }

    if (groupRef.current) {
      const baseScale = isActive ? 1.14 : isHovered ? 1.05 : 1;
      const pulse = isHovered && !isActive ? Math.sin(t * 4) * 0.02 : 0;
      const targetScale = (baseScale + pulse) * BASE_SCALE;
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1,
      );

      if (worldPositionRef?.current) {
        groupRef.current.getWorldPosition(worldPositionRef.current);
      }
    }

    if (engineLightRef.current) {
      engineLightRef.current.intensity = isActive
        ? 14
        : isHovered
          ? 11
          : 8 + Math.sin(t * 20) * 1.6;
    }

    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      const targetOpacity = isHovered || isActive ? 0.5 : 0;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.1);
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.8) * 0.1;
      ringRef.current.rotation.z = t * 0.3;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.06} floatIntensity={0.12}>
      <group
        ref={groupRef}
        position={BASE_POSITION}
        rotation={BASE_ROTATION}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHoverChange(destination.id);
        }}
        onPointerOut={() => onHoverChange(null)}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(destination);
        }}
      >
        <group ref={thrustRef}>
          <primitive object={scene} scale={MODEL_SCALE} />

          <pointLight
            ref={engineLightRef}
            position={[0, -1.6, -1.2]}
            color="#58b7ff"
            intensity={8}
            distance={14}
          />
        </group>

        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.2, 0.05, 16, 48]} />
          <meshBasicMaterial
            color={destination.accent}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </Float>
  );
}
