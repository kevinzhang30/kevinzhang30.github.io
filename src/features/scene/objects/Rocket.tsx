import { Float } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneObjectProps } from "./types";

export default function Rocket({
  destination,
  isActive,
  isHovered,
  onHoverChange,
  onSelect,
}: SceneObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const engineLightRef = useRef<THREE.PointLight>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.8) * 0.08 - 0.25;
      groupRef.current.rotation.x = Math.sin(t * 0.5 + 1.5) * 0.05;
      groupRef.current.position.y = destination.objectPosition[1] + Math.sin(t * 1.2) * 0.32;

      // Rhythmic scale pulse when hovered
      const baseScale = isActive ? 1.14 : isHovered ? 1.05 : 1;
      const pulse = isHovered && !isActive ? Math.sin(t * 4) * 0.02 : 0;
      const targetScale = baseScale + pulse;
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1,
      );
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        destination.objectPosition[2],
        0.1,
      );
    }

    if (engineLightRef.current) {
      engineLightRef.current.intensity = isActive
        ? 12
        : isHovered
          ? 10
          : 7 + Math.sin(t * 18) * 1.2;
    }

    // Hover ring fade
    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      const targetOpacity = isHovered || isActive ? 0.5 : 0;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.1);
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.8) * 0.1;
      ringRef.current.rotation.z = t * 0.3;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
      <group
        ref={groupRef}
        position={destination.objectPosition}
        rotation={[0.12, 0.18, -0.22]}
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
        <mesh position={[0, 0.85, 0]} castShadow>
          <capsuleGeometry args={[0.78, 3.1, 8, 18]} />
          <meshStandardMaterial color="#e8edf5" roughness={0.32} metalness={0.68} />
        </mesh>

        <mesh position={[0, 2.95, 0]} castShadow>
          <coneGeometry args={[0.78, 1.85, 24]} />
          <meshStandardMaterial color="#f4f7fb" roughness={0.25} metalness={0.55} />
        </mesh>

        <mesh position={[0, 0.82, 0.8]}>
          <boxGeometry args={[0.92, 0.34, 0.12]} />
          <meshStandardMaterial
            color="#0f2033"
            emissive="#3a77ff"
            emissiveIntensity={0.6}
            roughness={0.18}
            metalness={0.8}
          />
        </mesh>

        <mesh position={[0, 1.3, 0]}>
          <torusGeometry args={[0.84, 0.08, 12, 48]} />
          <meshStandardMaterial color="#ff6b4a" emissive="#ff6b4a" emissiveIntensity={1.2} />
        </mesh>

        <mesh position={[0, 1.78, 0.62]} rotation={[0.18, 0, 0]}>
          <sphereGeometry args={[0.34, 18, 18]} />
          <meshStandardMaterial
            color="#091726"
            emissive="#75d1ff"
            emissiveIntensity={isHovered || isActive ? 0.8 : 0.4}
            roughness={0.08}
            metalness={0.55}
          />
        </mesh>

        {[-0.58, 0.58].map((x) => (
          <mesh key={x} position={[x, -1.25, 0]} castShadow>
            <capsuleGeometry args={[0.27, 1.9, 6, 16]} />
            <meshStandardMaterial color="#dbe0ea" roughness={0.38} metalness={0.62} />
          </mesh>
        ))}

        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * 0.9, -1.6, 0]}
            rotation={[0, 0, side * 0.24]}
            castShadow
          >
            <boxGeometry args={[0.16, 1.6, 1.1]} />
            <meshStandardMaterial color="#ef5a48" roughness={0.45} metalness={0.24} />
          </mesh>
        ))}

        {[-1, 1].map((side) => (
          <mesh
            key={`wing-${side}`}
            position={[side * 0.82, -0.15, -0.2]}
            rotation={[0.1, 0, side * 0.28]}
          >
            <boxGeometry args={[0.12, 1.75, 0.72]} />
            <meshStandardMaterial color="#d6dce8" roughness={0.26} metalness={0.72} />
          </mesh>
        ))}

        <mesh position={[0, -1.3, 0]} castShadow>
          <cylinderGeometry args={[0.58, 0.92, 1.2, 24]} />
          <meshStandardMaterial color="#2d3643" roughness={0.18} metalness={0.92} />
        </mesh>

        {[-0.32, 0.32].map((x) => (
          <mesh key={`nozzle-${x}`} position={[x, -1.95, 0]}>
            <cylinderGeometry args={[0.18, 0.28, 0.55, 18]} />
            <meshStandardMaterial color="#1b2230" roughness={0.14} metalness={0.95} />
          </mesh>
        ))}

        <mesh position={[0, -2.25, 0]} scale={[1, 1.8, 1]}>
          <coneGeometry args={[0.58, 1.6, 24]} />
          <meshBasicMaterial color="#58b7ff" transparent opacity={isActive ? 0.95 : 0.75} />
        </mesh>

        {/* Hover ring */}
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.5, 0]}>
          <torusGeometry args={[2.2, 0.04, 16, 48]} />
          <meshBasicMaterial
            color={destination.accent}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        <pointLight
          ref={engineLightRef}
          position={[0, -2.2, 0]}
          color="#58b7ff"
          intensity={8}
          distance={14}
        />
      </group>
    </Float>
  );
}
