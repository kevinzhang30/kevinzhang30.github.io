import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { SceneObjectProps } from "./types";

interface PortalProps extends SceneObjectProps {
  zooming?: boolean;
}

const PORTAL_URL = "/models/portal.glb";
const MODEL_SCALE = 0.55;
const BASE_SCALE = 0.55;
const MODEL_Y_ROTATION = Math.PI / 2;
const LATERAL_SWAY = 0.12;
const HOVER_GLOW_SCALE = 1.2;
const IDLE_GLOW_SCALE = 0.92;

export default function Portal({
  destination,
  isActive,
  isHovered,
  onHoverChange,
  onSelect,
  zooming = false,
}: PortalProps) {
  const groupRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const { scene } = useGLTF(PORTAL_URL);

  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((mat) => {
        mat.depthWrite = false;
      });
    });
  }, [scene]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (modelRef.current) {
      modelRef.current.rotation.x = Math.sin(t * 0.55) * 0.08;
      modelRef.current.rotation.y = MODEL_Y_ROTATION + Math.sin(t * 0.75) * LATERAL_SWAY;
      modelRef.current.rotation.z = t * 0.3;
    }

    if (groupRef.current) {
      const hoverPulse = isHovered && !zooming ? Math.sin(t * 4) * 0.04 : 0;
      const baseScale = zooming
        ? 6
        : isActive
          ? 1.12
          : isHovered
            ? 1.08
            : 1;
      const target = (baseScale + hoverPulse) * BASE_SCALE;
      const lerpAmount = zooming ? 0.14 : 0.1;
      groupRef.current.scale.lerp(
        new THREE.Vector3(target, target, target),
        lerpAmount,
      );
      groupRef.current.rotation.x = Math.sin(t * 0.22 + 0.4) * 0.05;
    }

    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      const targetOpacity = zooming ? 0.22 : isHovered ? 0.14 : 0;
      const targetScale = zooming ? 1.35 : isHovered ? HOVER_GLOW_SCALE : IDLE_GLOW_SCALE;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.12);
      glowRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.12,
      );
    }
  });

  const accent = destination.accent;

  return (
    <group
      ref={groupRef}
      position={destination.objectPosition}
      onPointerOver={(event) => {
        if (zooming) return;
        event.stopPropagation();
        onHoverChange(destination.id);
      }}
      onPointerOut={() => {
        if (zooming) return;
        onHoverChange(null);
      }}
      onClick={(event) => {
        if (zooming) return;
        event.stopPropagation();
        onSelect(destination);
      }}
    >
      <group ref={modelRef}>
        <primitive object={scene} scale={MODEL_SCALE} />
      </group>

      <mesh ref={glowRef} scale={IDLE_GLOW_SCALE}>
        <sphereGeometry args={[1.25, 32, 32]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <pointLight color={accent} intensity={zooming ? 5 : isHovered ? 1.8 : 0} distance={8} />
    </group>
  );
}

useGLTF.preload(PORTAL_URL);
