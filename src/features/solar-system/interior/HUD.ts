import * as THREE from "three";

export class HUD extends THREE.Group {
  private textMeshes: THREE.Mesh[] = [];

  constructor() {
    super();
    this.name = "HUD";

    // All HUD elements positioned at z=-8 (between camera at z=-20 and window at z=0)
    this.createTextPanel("Kevin Zhang", 0, 7, -8, 2.5, 0.8, true);
    this.createTextPanel(
      "CS @ University of Waterloo",
      0,
      5.2,
      -8,
      1.8,
      0.5,
      true,
    );
    this.createTextPanel(
      "Click an object to explore",
      0,
      -7,
      -8,
      1.2,
      0.4,
      false,
    );

    // Social links
    this.createTextPanel("github.com/kevinzhang30", -10, -8.5, -8, 0.8, 0.35, false);
    this.createTextPanel("k73zhang@uwaterloo.ca", 10, -8.5, -8, 0.8, 0.35, false);
  }

  private createTextPanel(
    text: string,
    x: number,
    y: number,
    z: number,
    scale: number,
    opacity: number,
    isLarge: boolean,
  ): void {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    canvas.width = isLarge ? 1024 : 512;
    canvas.height = 128;

    // Transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Scanline effect
    ctx.fillStyle = "rgba(0, 200, 220, 0.03)";
    for (let i = 0; i < canvas.height; i += 4) {
      ctx.fillRect(0, i, canvas.width, 1);
    }

    // Text
    const fontSize = isLarge ? 48 : 40;
    ctx.font = `bold ${fontSize}px monospace`;
    ctx.fillStyle = `rgba(0, 200, 220, ${opacity})`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    // Subtle glow by drawing text again slightly larger and more transparent
    ctx.globalAlpha = 0.15;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    ctx.globalAlpha = 1;

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const geometry = new THREE.PlaneGeometry(scale * 8, scale);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    // Rotate to face camera (camera is at negative z looking toward positive z)
    mesh.rotation.y = Math.PI;
    this.textMeshes.push(mesh);
    this.add(mesh);
  }

  update(time: number): void {
    // Subtle holographic flicker
    for (const mesh of this.textMeshes) {
      const mat = mesh.material as THREE.MeshBasicMaterial;
      const flicker =
        0.85 +
        Math.sin(time * 3 + mesh.position.x) * 0.1 +
        Math.sin(time * 7) * 0.05;
      mat.opacity = flicker;
    }
  }

  dispose(): void {
    for (const mesh of this.textMeshes) {
      mesh.geometry.dispose();
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.map?.dispose();
      mat.dispose();
    }
  }
}
