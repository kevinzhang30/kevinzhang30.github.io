import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { SceneObjectProps } from "./types";


const GAS_GIANT_URL = "/models/gas-giant.glb";
const MODEL_SCALE = 15;

export default function Moon({
  destination,
  isActive,
  isHovered,
  onHoverChange,
  onSelect,
}: SceneObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(GAS_GIANT_URL);

  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });
  }, [scene]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.06;
    }

    if (groupRef.current) {
      groupRef.current.position.y = destination.objectPosition[1] + Math.sin(t * 0.65 + 1.4) * 0.26;
      groupRef.current.rotation.x = Math.sin(t * 0.18) * 0.06;
      groupRef.current.rotation.z = Math.sin(t * 0.24 + 0.5) * 0.08;

      const baseScale = isActive ? 1.12 : isHovered ? 1.05 : 1;
      const pulse = isHovered && !isActive ? Math.sin(t * 4) * 0.02 : 0;
      const targetScale = baseScale + pulse;
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.08,
      );
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        destination.objectPosition[2],
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
      <group ref={planetRef}>
        <primitive object={scene} scale={MODEL_SCALE} />
      </group>

      <mesh scale={isHovered || isActive ? 1.18 : 1.12}>
        <sphereGeometry args={[9, 48, 48]} />
        <meshBasicMaterial
          color="#9a6cff"
          transparent
          opacity={isActive ? 0.32 : isHovered ? 0.26 : 0}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

    </group>
  );
}

useGLTF.preload(GAS_GIANT_URL);
