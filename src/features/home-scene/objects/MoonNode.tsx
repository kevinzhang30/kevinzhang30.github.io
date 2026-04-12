import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { SceneNodeProps } from "./types";

export default function MoonNode({
  target,
  active,
  focused,
  transitioning,
  onHoverChange,
  onSelect,
}: SceneNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const moonRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [moonMap, moonBump] = useTexture([
    "https://threejs.org/examples/textures/planets/moon_1024.jpg",
    "https://threejs.org/examples/textures/planets/moon_1024.jpg",
  ]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 0.09;
    }

    // Hover ring fade
    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      const targetOpacity = active || focused ? 0.45 : 0;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.1);
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.8) * 0.1;
      ringRef.current.rotation.z = t * 0.3;
    }

    if (groupRef.current) {
      groupRef.current.position.y = target.position[1] + Math.sin(t * 0.65 + 1.4) * 0.26;
      groupRef.current.rotation.x = Math.sin(t * 0.18) * 0.06;
      groupRef.current.rotation.z = Math.sin(t * 0.24 + 0.5) * 0.08;

      // Rhythmic scale pulse when hovered
      const baseScale = focused ? (transitioning ? 1.25 : 1.12) : active ? 1.05 : 1;
      const pulse = active && !focused ? Math.sin(t * 4) * 0.02 : 0;
      const targetScale = baseScale + pulse;
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.08,
      );
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        target.position[2] + (focused && transitioning ? 1.8 : 0),
        0.08,
      );
    }
  });

  return (
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
      <mesh ref={moonRef} castShadow>
        <sphereGeometry args={[1.95, 72, 72]} />
        <meshStandardMaterial
          map={moonMap}
          bumpMap={moonBump}
          bumpScale={0.18}
          roughness={0.97}
          metalness={0.01}
          emissive="#49515e"
          emissiveIntensity={active || focused ? 0.18 : 0.08}
        />
      </mesh>

      <mesh scale={active || focused ? 1.18 : 1.12}>
        <sphereGeometry args={[2.18, 48, 48]} />
        <meshBasicMaterial
          color="#aab5ff"
          transparent
          opacity={focused ? 0.17 : active ? 0.12 : 0.08}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Hover ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.8, 0.04, 16, 48]} />
        <meshBasicMaterial
          color={target.accent}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
