import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ASTEROID_COUNT = 200;

interface AsteroidData {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  rotationSpeed: THREE.Vector3;
}

export default function AsteroidField() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const asteroids = useMemo<AsteroidData[]>(() => {
    return Array.from({ length: ASTEROID_COUNT }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 40,
        -20 - Math.random() * 90,
      ),
      rotation: new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      ),
      scale: 0.1 + Math.random() * 0.4,
      rotationSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.2,
      ),
    }));
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    for (let i = 0; i < ASTEROID_COUNT; i++) {
      const asteroid = asteroids[i];
      asteroid.rotation.x += asteroid.rotationSpeed.x * delta;
      asteroid.rotation.y += asteroid.rotationSpeed.y * delta;
      asteroid.rotation.z += asteroid.rotationSpeed.z * delta;

      dummy.position.copy(asteroid.position);
      dummy.rotation.copy(asteroid.rotation);
      dummy.scale.setScalar(asteroid.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, ASTEROID_COUNT]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#3a3530"
        roughness={0.92}
        metalness={0.08}
        flatShading
      />
    </instancedMesh>
  );
}
