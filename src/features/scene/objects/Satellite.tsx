import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneObjectProps } from "./types";

interface SatelliteProps extends SceneObjectProps {
  worldPositionRef?: RefObject<THREE.Vector3>;
}

const STATION_URL = "/models/station3.glb";
const MODEL_SCALE = 3;
const ORBIT_RADIUS = 21;
const ORBIT_SPEED = 0.22;
const ORBIT_TILT = 0.25;

export default function Satellite({
  destination,
  isActive,
  isHovered,
  onHoverChange,
  onSelect,
  worldPositionRef,
}: SatelliteProps) {
  const orbitRef = useRef<THREE.Group>(null);
  const stationRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const { scene } = useGLTF(STATION_URL);

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
    const angle = t * ORBIT_SPEED;

    if (orbitRef.current) {
      orbitRef.current.position.x = Math.cos(angle) * ORBIT_RADIUS;
      orbitRef.current.position.z = Math.sin(angle) * ORBIT_RADIUS;
      orbitRef.current.position.y = Math.sin(angle) * ORBIT_RADIUS * ORBIT_TILT;
    }

    if (stationRef.current) {
      stationRef.current.rotation.y = t * 0.5;
      stationRef.current.rotation.x = Math.sin(t * 0.35) * 0.1;

      const baseScale = isActive ? 1.25 : isHovered ? 1.12 : 1;
      const pulse = isHovered && !isActive ? Math.sin(t * 4) * 0.03 : 0;
      const targetScale = baseScale + pulse;
      stationRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1,
      );

      if (worldPositionRef?.current) {
        stationRef.current.getWorldPosition(worldPositionRef.current);
      }
    }

    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      const targetOpacity = isHovered || isActive ? 0.55 : 0;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.1);
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.8) * 0.1;
      ringRef.current.rotation.z = t * 0.3;
    }
  });

  return (
    <group position={destination.objectPosition}>
      <group ref={orbitRef}>
        <group
          ref={stationRef}
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
          <primitive object={scene} scale={MODEL_SCALE} />

          <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[3.6, 0.05, 16, 48]} />
            <meshBasicMaterial
              color={destination.accent}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          <pointLight
            position={[0, 0.8, 0.3]}
            intensity={isActive ? 8 : isHovered ? 6 : 4}
            distance={14}
            color="#46e0b5"
          />
        </group>
      </group>
    </group>
  );
}
