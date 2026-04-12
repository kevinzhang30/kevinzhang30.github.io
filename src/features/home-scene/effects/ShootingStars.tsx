import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const POOL_SIZE = 4;
const MIN_INTERVAL = 5;
const MAX_INTERVAL = 10;
const STREAK_SPEED = 35;
const TAIL_LENGTH = 3.5;

interface Star {
  active: boolean;
  position: THREE.Vector3;
  direction: THREE.Vector3;
  life: number;
  maxLife: number;
  nextSpawn: number;
}

export default function ShootingStars() {
  const groupRef = useRef<THREE.Group>(null);

  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: POOL_SIZE }, (_, i) => ({
      active: false,
      position: new THREE.Vector3(),
      direction: new THREE.Vector3(),
      life: 0,
      maxLife: 0,
      nextSpawn: 2 + i * 3,
    }));
  }, []);

  const lines = useMemo(() => {
    return Array.from({ length: POOL_SIZE }, () => {
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(6);
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const mat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const line = new THREE.Line(geo, mat);
      line.visible = false;
      line.frustumCulled = false;
      return line;
    });
  }, []);

  // Add lines to group once mounted
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Ensure lines are children of the group
    if (groupRef.current.children.length === 0) {
      for (const line of lines) {
        groupRef.current.add(line);
      }
    }

    const elapsed = state.clock.elapsedTime;

    for (let i = 0; i < POOL_SIZE; i++) {
      const star = stars[i];
      const line = lines[i];

      if (!star.active) {
        if (elapsed >= star.nextSpawn) {
          star.active = true;
          star.life = 0;
          star.maxLife = 1.2 + Math.random() * 0.8;

          star.position.set(
            (Math.random() - 0.5) * 60,
            10 + Math.random() * 20,
            -30 - Math.random() * 50,
          );

          star.direction
            .set(
              (Math.random() - 0.5) * 0.6,
              -0.3 - Math.random() * 0.5,
              (Math.random() - 0.5) * 0.3,
            )
            .normalize();
        } else {
          line.visible = false;
          continue;
        }
      }

      star.life += delta;
      if (star.life >= star.maxLife) {
        star.active = false;
        star.nextSpawn = elapsed + MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL);
        line.visible = false;
        continue;
      }

      star.position.addScaledVector(star.direction, STREAK_SPEED * delta);

      const positions = line.geometry.attributes.position as THREE.BufferAttribute;
      const head = star.position;
      positions.setXYZ(0, head.x, head.y, head.z);
      positions.setXYZ(
        1,
        head.x + star.direction.x * -TAIL_LENGTH,
        head.y + star.direction.y * -TAIL_LENGTH,
        head.z + star.direction.z * -TAIL_LENGTH,
      );
      positions.needsUpdate = true;

      const t = star.life / star.maxLife;
      const opacity = t < 0.1 ? t / 0.1 : t > 0.7 ? (1 - t) / 0.3 : 1;
      (line.material as THREE.LineBasicMaterial).opacity = opacity * 0.8;

      line.visible = true;
    }
  });

  return <group ref={groupRef} />;
}
