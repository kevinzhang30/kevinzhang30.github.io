import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ASSET_URL = "/models/asteroids.glb";

const BELT_CENTER: [number, number, number] = [0, -2, -55];
const BELT_TILT = 0.26;
const BELT_LENGTH = 100;
const STRAND_BOW = 14;
const COUNT_PER_STRAND = 9;
const ROTATION_SPEED = 0.1;

interface BeltInstance {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

function buildInstances(): BeltInstance[] {
  // Deterministic pseudo-random so the layout is stable across renders.
  let seed = 1337;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  // Two strands meeting at both ends, bowing out in the middle
  // (one in +Z, one in -Z) — forms a long flat lens shape.
  const half = BELT_LENGTH / 2;
  const instances: BeltInstance[] = [];
  for (const direction of [1, -1]) {
    for (let i = 0; i < COUNT_PER_STRAND; i++) {
      const t = i / (COUNT_PER_STRAND - 1);
      const x = -half + t * BELT_LENGTH;
      // sin(t*π) → 0 at the endpoints, 1 in the middle, so strands meet at the ends.
      const z = Math.sin(t * Math.PI) * STRAND_BOW * direction;
      const xJitter = (rand() - 0.5) * 3;
      const yJitter = (rand() - 0.5) * 3;
      const zJitter = (rand() - 0.5) * 2;
      instances.push({
        position: [x + xJitter, yJitter, z + zJitter],
        rotation: [rand() * Math.PI, rand() * Math.PI * 2, rand() * Math.PI],
        scale: 0.8 + rand() * 0.5,
      });
    }
  }

  return instances;
}

export default function AsteroidBelt() {
  const beltRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(ASSET_URL);

  const instances = useMemo(() => buildInstances(), []);

  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.raycast = () => null;
    });
  }, [scene]);

  useFrame((_, delta) => {
    if (beltRef.current) {
      beltRef.current.rotation.y += delta * ROTATION_SPEED;
    }
  });

  return (
    <group position={BELT_CENTER} rotation={[BELT_TILT, 0, 0]}>
      <group ref={beltRef}>
        {instances.map((inst, i) => (
          <primitive
            key={i}
            object={scene.clone()}
            position={inst.position}
            rotation={inst.rotation}
            scale={inst.scale}
          />
        ))}
      </group>
    </group>
  );
}
