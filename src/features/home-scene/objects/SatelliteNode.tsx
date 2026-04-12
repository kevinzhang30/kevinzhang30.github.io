import { Float } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneNodeProps } from "./types";

export default function SatelliteNode({
  target,
  active,
  focused,
  transitioning,
  onHoverChange,
  onSelect,
}: SceneNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.18;
      groupRef.current.rotation.x = Math.sin(t * 0.45) * 0.08;
      groupRef.current.position.y = target.position[1] + Math.sin(t * 0.9 + 0.8) * 0.28;

      // Rhythmic scale pulse when hovered
      const baseScale = focused ? (transitioning ? 1.26 : 1.12) : active ? 1.05 : 1;
      const pulse = active && !focused ? Math.sin(t * 4) * 0.02 : 0;
      const targetScale = baseScale + pulse;
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.08,
      );
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        target.position[2] + (focused && transitioning ? 2 : 0),
        0.08,
      );
    }

    // Hover ring fade
    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      const targetOpacity = active || focused ? 0.5 : 0;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.1);
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.8) * 0.1;
      ringRef.current.rotation.z = t * 0.3;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.12} floatIntensity={0.2}>
      <group
        ref={groupRef}
        position={target.position}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHoverChange(target.id);
        }}
        onPointerOut={() => onHoverChange(null)}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(target.id);
        }}
      >
        <mesh castShadow>
          <boxGeometry args={[1.8, 1.2, 1.2]} />
          <meshStandardMaterial color="#c8d1df" roughness={0.28} metalness={0.88} />
        </mesh>

        <mesh position={[0, 0, 0.7]}>
          <boxGeometry args={[1.05, 0.8, 0.12]} />
          <meshStandardMaterial color="#0a1728" roughness={0.18} metalness={0.82} />
        </mesh>

        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[1.2, 0.26, 1.38]} />
          <meshStandardMaterial
            color="#121c30"
            emissive="#46e0b5"
            emissiveIntensity={active || focused ? 0.75 : 0.35}
            roughness={0.3}
            metalness={0.72}
          />
        </mesh>

        <mesh position={[0, 1.12, 0]} rotation={[-0.82, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.52, 1.2, 18, 1, true]} />
          <meshStandardMaterial color="#d5dbe8" roughness={0.25} metalness={0.85} side={THREE.DoubleSide} />
        </mesh>

        <mesh position={[0, 1.42, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#f4f6fb" emissive="#7df7d0" emissiveIntensity={1.2} />
        </mesh>

        {[-1, 1].map((side) => (
          <group key={side} position={[side * 2.65, 0, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.05, 0.05, 2.2, 12]} />
              <meshStandardMaterial color="#9da8ba" roughness={0.28} metalness={0.9} />
            </mesh>
            <mesh position={[side * 1.65, 0, 0]}>
              <boxGeometry args={[2.6, 1.5, 0.08]} />
              <meshStandardMaterial
                color="#0b2a4b"
                emissive="#46e0b5"
                emissiveIntensity={active || focused ? 0.55 : 0.2}
                roughness={0.38}
                metalness={0.62}
              />
            </mesh>
            <mesh position={[side * 1.65, 0, 0.05]}>
              <boxGeometry args={[2.18, 1.08, 0.04]} />
              <meshStandardMaterial
                color="#10263f"
                emissive="#58ffd2"
                emissiveIntensity={active || focused ? 0.28 : 0.1}
                roughness={0.24}
                metalness={0.55}
              />
            </mesh>
          </group>
        ))}

        <mesh position={[0, -0.95, 0.45]} rotation={[0.28, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.5, 10]} />
          <meshStandardMaterial color="#d1d8e5" roughness={0.18} metalness={0.94} />
        </mesh>

        {[-1, 1].map((side) => (
          <mesh key={`truss-${side}`} position={[side * 1.34, 0.42, 0]}>
            <boxGeometry args={[0.1, 0.55, 0.1]} />
            <meshStandardMaterial color="#b1bccd" roughness={0.22} metalness={0.88} />
          </mesh>
        ))}

        {/* Hover ring */}
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3, 0.04, 16, 48]} />
          <meshBasicMaterial
            color={target.accent}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        <pointLight
          position={[0, 0.8, 0.3]}
          intensity={focused ? 8 : active ? 6 : 4}
          distance={12}
          color="#46e0b5"
        />
      </group>
    </Float>
  );
}
