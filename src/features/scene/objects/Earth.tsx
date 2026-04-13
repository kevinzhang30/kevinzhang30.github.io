import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { SceneObjectProps } from "./types";

const EARTH_COLOR = "#46d3ff";

export default function Earth({
  destination,
  isActive,
  isHovered,
  onHoverChange,
  onSelect,
}: SceneObjectProps) {
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
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.16;
    if (cloudRef.current) cloudRef.current.rotation.y += delta * 0.2;

    if (glowRef.current) {
      const targetScale = isHovered || isActive ? 1.13 : 1.08;
      const lerpSpeed = isHovered || isActive ? 0.12 : 0.08;
      glowRef.current.scale.x = THREE.MathUtils.lerp(glowRef.current.scale.x, targetScale, lerpSpeed);
      glowRef.current.scale.y = THREE.MathUtils.lerp(glowRef.current.scale.y, targetScale, lerpSpeed);
      glowRef.current.scale.z = THREE.MathUtils.lerp(glowRef.current.scale.z, targetScale, lerpSpeed);
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = THREE.MathUtils.lerp(
        material.opacity,
        isActive ? 0.28 : isHovered ? 0.2 : 0.14,
        lerpSpeed,
      );
    }

    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      const targetOpacity = isHovered || isActive ? 0.5 : 0;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.1);
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.8) * 0.1;
      ringRef.current.rotation.z = t * 0.3;
    }

    if (groupRef.current) {
      groupRef.current.position.y = destination.objectPosition[1] + Math.sin(t * 0.55) * 0.18;
      groupRef.current.rotation.z = Math.sin(t * 0.22) * 0.04;

      const baseScale = isActive ? 1.08 : isHovered ? 1.04 : 1;
      const pulse = isHovered && !isActive ? Math.sin(t * 4) * 0.02 : 0;
      const targetScale = baseScale + pulse;
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.08,
      );
    }
  });

  return (
    <group
      ref={groupRef}
      position={destination.objectPosition}
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

      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[6.2, 0.06, 16, 64]} />
        <meshBasicMaterial
          color={destination.accent}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <pointLight
        position={[0, 0, 0]}
        color={EARTH_COLOR}
        intensity={isActive ? 16 : isHovered ? 12 : 9}
        distance={32}
      />
    </group>
  );
}
