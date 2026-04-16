import * as THREE from "three";

interface CockpitGlassProps {
  intensity: number; // 0..1
}

export default function CockpitGlass({ intensity }: CockpitGlassProps) {
  return (
    <group>
      <mesh position={[0, 0.2, 0.92]} scale={[9, 6.2, 0.02]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial
          color="#7acfff"
          transparent
          opacity={0.04 * intensity}
          roughness={0.05}
          metalness={0}
          transmission={0.12}
          clearcoat={1}
          clearcoatRoughness={0.12}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[-2.4, 1.8, 0.96]} rotation={[0, 0, -0.32]} scale={[0.04, 3.6, 0.04]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#9fe9ff" transparent opacity={0.16 * intensity} />
      </mesh>

      <mesh position={[2.6, 1.4, 0.96]} rotation={[0, 0, 0.28]} scale={[0.04, 2.9, 0.04]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#9fe9ff" transparent opacity={0.12 * intensity} />
      </mesh>

      <mesh position={[0, 2.8, 0.98]} scale={[4.6, 0.03, 0.03]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#9fe9ff" transparent opacity={0.12 * intensity} />
      </mesh>
    </group>
  );
}
