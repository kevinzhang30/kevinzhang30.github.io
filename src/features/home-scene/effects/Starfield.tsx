import { Sparkles, Stars } from "@react-three/drei";

export default function Starfield() {
  return (
    <>
      <Stars
        radius={220}
        depth={120}
        count={6000}
        factor={5}
        fade
        saturation={0}
        speed={0.35}
      />
      <Sparkles
        count={140}
        color="#7dd3fc"
        size={2.4}
        scale={[32, 18, 12]}
        position={[0, 0.5, 3]}
        speed={0.12}
        opacity={0.18}
      />
    </>
  );
}
