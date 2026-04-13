import { Float } from "@react-three/drei";

interface CockpitShellProps {
  intensity: number; // 0..1
}

function LightStrip({
  position,
  scale,
  color = "#53dcff",
  baseIntensity = 1.8,
  intensity,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  color?: string;
  baseIntensity?: number;
  intensity: number;
}) {
  return (
    <mesh position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={baseIntensity * intensity}
        roughness={0.2}
        metalness={0.6}
      />
    </mesh>
  );
}

function Screen({
  position,
  rotation,
  scale,
  color = "#58d7ff",
  intensity,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color?: string;
  intensity: number;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh scale={scale}>
        <boxGeometry args={[1, 1, 0.08]} />
        <meshStandardMaterial color="#08111d" roughness={0.55} metalness={0.75} />
      </mesh>
      <mesh position={[0, 0, 0.05]} scale={[scale[0] * 0.82, scale[1] * 0.72, 0.01]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#081321"
          emissive={color}
          emissiveIntensity={0.45 * intensity}
          roughness={0.15}
          metalness={0.5}
        />
      </mesh>
    </group>
  );
}

function ButtonArray({
  origin,
  rows,
  cols,
  spacing,
  color,
  intensity,
}: {
  origin: [number, number, number];
  rows: number;
  cols: number;
  spacing: number;
  color: string;
  intensity: number;
}) {
  return (
    <group position={origin}>
      {Array.from({ length: rows * cols }, (_, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;

        return (
          <mesh
            key={index}
            position={[
              (col - (cols - 1) / 2) * spacing,
              -(row - (rows - 1) / 2) * spacing,
              0,
            ]}
          >
            <cylinderGeometry args={[0.08, 0.08, 0.06, 10]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.9 * intensity}
              roughness={0.28}
              metalness={0.72}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function CockpitShell({ intensity }: CockpitShellProps) {
  return (
    <group>
      <Float speed={0.45} rotationIntensity={0.01} floatIntensity={0.05}>
        <group>
          {/* Structural hull meshes (unaffected by intensity) */}
          <mesh position={[0, -4.2, 5.2]} rotation={[-0.62, 0, 0]} scale={[16.5, 3.6, 2.4]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#060e17" roughness={0.88} metalness={0.42} />
          </mesh>
          <mesh position={[0, -5.65, 3.7]} rotation={[-0.12, 0, 0]} scale={[18.5, 1.2, 3.4]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#07101a" roughness={0.94} metalness={0.32} />
          </mesh>
          <mesh position={[-7.4, -3.6, 5.55]} rotation={[-0.74, 0.24, 0.26]} scale={[4.4, 2.35, 0.55]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#08111d" roughness={0.62} metalness={0.68} />
          </mesh>
          <mesh position={[7.4, -3.6, 5.55]} rotation={[-0.74, -0.24, -0.26]} scale={[4.4, 2.35, 0.55]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#08111d" roughness={0.62} metalness={0.68} />
          </mesh>
          <mesh position={[0, 7.1, 3.25]} rotation={[0.28, 0, 0]} scale={[15.2, 1.5, 2.6]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#091321" roughness={0.82} metalness={0.54} />
          </mesh>
          <mesh position={[-8.45, 1.45, 2.85]} rotation={[0, 0.42, 0.03]} scale={[2.8, 11.8, 2.8]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#09111c" roughness={0.76} metalness={0.56} />
          </mesh>
          <mesh position={[8.45, 1.45, 2.85]} rotation={[0, -0.42, -0.03]} scale={[2.8, 11.8, 2.8]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#09111c" roughness={0.76} metalness={0.56} />
          </mesh>
          <mesh position={[0, 3.55, 1.05]} scale={[9.5, 0.22, 0.16]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#132435" roughness={0.42} metalness={0.78} />
          </mesh>
          <mesh position={[0, -2.65, 1.1]} scale={[8.6, 0.24, 0.18]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#102132" roughness={0.42} metalness={0.78} />
          </mesh>
          <mesh position={[-4.6, 0.45, 1.0]} rotation={[0, 0, -0.31]} scale={[0.22, 6.65, 0.14]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#112232" roughness={0.42} metalness={0.78} />
          </mesh>
          <mesh position={[4.6, 0.45, 1.0]} rotation={[0, 0, 0.31]} scale={[0.22, 6.65, 0.14]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#112232" roughness={0.42} metalness={0.78} />
          </mesh>
          <mesh position={[-5.95, -0.55, 0.8]} rotation={[0.02, 0.13, -0.22]} scale={[0.18, 8.2, 0.12]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#0f1b29" roughness={0.48} metalness={0.72} />
          </mesh>
          <mesh position={[5.95, -0.55, 0.8]} rotation={[0.02, -0.13, 0.22]} scale={[0.18, 8.2, 0.12]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#0f1b29" roughness={0.48} metalness={0.72} />
          </mesh>

          {/* Light strips dim with intensity */}
          <LightStrip position={[0, -3.05, 5.98]} scale={[8.2, 0.05, 0.05]} intensity={intensity} />
          <LightStrip position={[-7.2, -3.3, 5.95]} scale={[1.9, 0.05, 0.05]} baseIntensity={1.4} intensity={intensity} />
          <LightStrip position={[7.2, -3.3, 5.95]} scale={[1.9, 0.05, 0.05]} baseIntensity={1.4} intensity={intensity} />
          <LightStrip position={[-4.6, 0.45, 1.08]} scale={[0.05, 5.4, 0.05]} baseIntensity={1.4} intensity={intensity} />
          <LightStrip position={[4.6, 0.45, 1.08]} scale={[0.05, 5.4, 0.05]} baseIntensity={1.4} intensity={intensity} />

          <Screen position={[0, -3.15, 5.92]} rotation={[-0.73, 0, 0]} scale={[3.1, 0.85, 1]} intensity={intensity} />
          <Screen position={[-5.4, -3.25, 6.05]} rotation={[-0.85, 0.2, 0.18]} scale={[1.8, 0.72, 1]} color="#77ffd8" intensity={intensity} />
          <Screen position={[5.4, -3.25, 6.05]} rotation={[-0.85, -0.2, -0.18]} scale={[1.8, 0.72, 1]} color="#ff8d5f" intensity={intensity} />

          <ButtonArray origin={[-5.45, -3.95, 6.12]} rows={2} cols={4} spacing={0.34} color="#77ffd8" intensity={intensity} />
          <ButtonArray origin={[5.45, -3.95, 6.12]} rows={2} cols={4} spacing={0.34} color="#ff8d5f" intensity={intensity} />
          <ButtonArray origin={[0, -3.9, 6.05]} rows={2} cols={6} spacing={0.28} color="#58d7ff" intensity={intensity} />

          {/* Yoke (structural) */}
          <mesh position={[0, -5.3, 6.35]} scale={[2.8, 0.35, 0.6]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#06111c" roughness={0.54} metalness={0.82} />
          </mesh>
          <mesh position={[-0.85, -4.86, 6.48]} rotation={[0.34, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.16, 0.42, 16]} />
            <meshStandardMaterial color="#d8e4f2" roughness={0.14} metalness={0.92} />
          </mesh>
          <mesh position={[0.85, -4.86, 6.48]} rotation={[0.34, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.16, 0.42, 16]} />
            <meshStandardMaterial color="#d8e4f2" roughness={0.14} metalness={0.92} />
          </mesh>

          {/* Point lights dim with intensity */}
          <pointLight position={[0, -3.4, 5.8]} intensity={7.5 * intensity} distance={18} color="#24d7ff" />
          <pointLight position={[-5.25, -3.25, 5.9]} intensity={3.4 * intensity} distance={8} color="#77ffd8" />
          <pointLight position={[5.25, -3.25, 5.9]} intensity={3.4 * intensity} distance={8} color="#ff8d5f" />
        </group>
      </Float>
    </group>
  );
}
