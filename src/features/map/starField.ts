import * as THREE from "three";

export function addStarField(scene: THREE.Scene): void {
  const count = 8000;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    // Random point in a spherical shell at radius 900–1000
    const radius = 900 + Math.random() * 100;
    const theta = Math.acos(2 * Math.random() - 1);
    const phi = Math.random() * 2 * Math.PI;

    positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
    positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
    positions[i * 3 + 2] = radius * Math.cos(theta);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.7,
    sizeAttenuation: true,
  });

  scene.add(new THREE.Points(geometry, material));
}
