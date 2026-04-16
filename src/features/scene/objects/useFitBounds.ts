import { useMemo } from "react";
import * as THREE from "three";

interface FitResult {
  scale: number;
  offset: [number, number, number];
}

// Compute a uniform scale + centering offset that fits an arbitrary GLB
// into a cube of `targetSize` world units along its largest axis. Lets us
// drop in models from different sources without hand-tuning each scale.
export function useFitBounds(scene: THREE.Object3D, targetSize: number): FitResult {
  return useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const max = Math.max(size.x, size.y, size.z);
    if (max === 0) return { scale: 1, offset: [0, 0, 0] };
    const scale = targetSize / max;
    const center = box.getCenter(new THREE.Vector3());
    return {
      scale,
      offset: [-center.x * scale, -center.y * scale, -center.z * scale],
    };
  }, [scene, targetSize]);
}
