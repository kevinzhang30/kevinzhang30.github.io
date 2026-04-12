import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { SceneNodeProps } from "./types";

const EARTH_COLOR = "#46d3ff";

export default function EarthNode({
  target,
  active,
  focused,
  transitioning,
  onHoverChange,
  onSelect,
}: SceneNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [colorMap, normalMap, specularMap, cloudMap] = useTexture([
    "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
    "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg",
    "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg",
    "https://threejs.org/examples/textures/planets/earth_clouds_1024.png",
  ]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.16;
    }

    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * 0.2;
    }

    if (glowRef.current) {
      const targetScale = active || focused ? 1.13 : 1.08;
      const lerpSpeed = active || focused ? 0.12 : 0.08;
      glowRef.current.scale.x = THREE.MathUtils.lerp(glowRef.current.scale.x, targetScale, lerpSpeed);
      glowRef.current.scale.y = THREE.MathUtils.lerp(glowRef.current.scale.y, targetScale, lerpSpeed);
      glowRef.current.scale.z = THREE.MathUtils.lerp(glowRef.current.scale.z, targetScale, lerpSpeed);
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = THREE.MathUtils.lerp(
        material.opacity,
        focused ? 0.28 : active ? 0.2 : 0.14,
        lerpSpeed,
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

    if (groupRef.current) {
      groupRef.current.position.y = target.position[1] + Math.sin(t * 0.55) * 0.18;
      groupRef.current.rotation.z = Math.sin(t * 0.22) * 0.04;

      // Rhythmic scale pulse when hovered
      const baseScale = focused ? (transitioning ? 1.18 : 1.08) : active ? 1.04 : 1;
      const pulse = active && !focused ? Math.sin(t * 4) * 0.02 : 0;
      const targetScale = baseScale + pulse;
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.08,
      );
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        target.position[2] + (focused && transitioning ? 1.6 : 0),
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
      <mesh ref={earthRef} castShadow>
        <sphereGeometry args={[4.7, 96, 96]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.7, 0.7)}
          roughnessMap={specularMap}
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      <mesh ref={cloudRef}>
        <sphereGeometry args={[4.82, 72, 72]} />
        <meshStandardMaterial
          map={cloudMap}
          transparent
          opacity={0.22}
          depthWrite={false}
          roughness={1}
        />
      </mesh>

      <mesh ref={glowRef}>
        <sphereGeometry args={[5.2, 64, 64]} />
        <meshBasicMaterial
          color={EARTH_COLOR}
          transparent
          opacity={0.14}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Hover ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[6.2, 0.06, 16, 64]} />
        <meshBasicMaterial
          color={target.accent}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <pointLight
        position={[0, 0, 0]}
        color={EARTH_COLOR}
        intensity={focused ? 16 : active ? 12 : 9}
        distance={32}
      />
    </group>
  );
}
