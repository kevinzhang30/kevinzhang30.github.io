import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function createNebulaTexture(colors: [string, string, string]) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const context = canvas.getContext("2d");

  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  const gradient = context.createRadialGradient(512, 512, 120, 512, 512, 512);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(0.45, colors[1]);
  gradient.addColorStop(1, colors[2]);

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 220; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = 10 + Math.random() * 90;
    const alpha = 0.012 + Math.random() * 0.05;
    const cloud = context.createRadialGradient(x, y, 0, x, y, radius);
    cloud.addColorStop(0, `rgba(255,255,255,${alpha})`);
    cloud.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = cloud;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function NebulaBackdrop() {
  const leftRef = useRef<THREE.Mesh>(null);
  const rightRef = useRef<THREE.Mesh>(null);
  const topRef = useRef<THREE.Mesh>(null);
  const warmRef = useRef<THREE.Mesh>(null);
  const deepRef = useRef<THREE.Mesh>(null);

  const leftTexture = useMemo(
    () => createNebulaTexture(["rgba(78,177,255,0.55)", "rgba(9,47,121,0.18)", "rgba(0,0,0,0)"]),
    [],
  );
  const rightTexture = useMemo(
    () => createNebulaTexture(["rgba(38,255,214,0.35)", "rgba(7,76,92,0.18)", "rgba(0,0,0,0)"]),
    [],
  );
  const topTexture = useMemo(
    () => createNebulaTexture(["rgba(255,184,89,0.22)", "rgba(86,33,9,0.08)", "rgba(0,0,0,0)"]),
    [],
  );
  const warmTexture = useMemo(
    () => createNebulaTexture(["rgba(200,100,255,0.3)", "rgba(80,20,120,0.12)", "rgba(0,0,0,0)"]),
    [],
  );
  const deepTexture = useMemo(
    () => createNebulaTexture(["rgba(255,80,180,0.2)", "rgba(120,10,60,0.08)", "rgba(0,0,0,0)"]),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = (ref: React.RefObject<THREE.Mesh | null>, base: number, phase: number) => {
      if (ref.current) {
        const mat = ref.current.material as THREE.MeshBasicMaterial;
        mat.opacity = base + Math.sin(t * 0.3 + phase) * 0.06;
      }
    };

    pulse(leftRef, 0.55, 0);
    pulse(rightRef, 0.45, 1.8);
    pulse(topRef, 0.26, 3.6);
    pulse(warmRef, 0.3, 2.4);
    pulse(deepRef, 0.22, 4.8);
  });

  return (
    <group position={[0, 0, -120]}>
      <mesh ref={leftRef} position={[-36, 12, -5]} rotation={[0.08, 0.42, 0.02]}>
        <planeGeometry args={[68, 44]} />
        <meshBasicMaterial
          map={leftTexture}
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={rightRef} position={[38, 6, -10]} rotation={[-0.12, -0.48, 0.05]}>
        <planeGeometry args={[72, 48]} />
        <meshBasicMaterial
          map={rightTexture}
          transparent
          opacity={0.45}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={topRef} position={[0, 26, -25]} rotation={[-0.26, 0, 0]}>
        <planeGeometry args={[110, 56]} />
        <meshBasicMaterial
          map={topTexture}
          transparent
          opacity={0.26}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Warm purple nebula */}
      <mesh ref={warmRef} position={[-20, -8, -15]} rotation={[0.15, 0.3, -0.1]}>
        <planeGeometry args={[55, 38]} />
        <meshBasicMaterial
          map={warmTexture}
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Deep magenta nebula */}
      <mesh ref={deepRef} position={[25, 18, -20]} rotation={[-0.18, -0.25, 0.08]}>
        <planeGeometry args={[60, 42]} />
        <meshBasicMaterial
          map={deepTexture}
          transparent
          opacity={0.22}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
