import * as THREE from "three";
import {
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  STATION_DEPTH,
  WALL_THICKNESS,
} from "../constants";

export class StationInterior extends THREE.Group {
  constructor() {
    super();
    this.name = "StationInterior";

    const halfW = WINDOW_WIDTH / 2;
    const halfH = WINDOW_HEIGHT / 2;

    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a12,
      roughness: 0.9,
      metalness: 0.3,
    });

    const edgeMat = new THREE.MeshStandardMaterial({
      color: 0x00838f,
      emissive: new THREE.Color(0x00838f),
      emissiveIntensity: 0.3,
      roughness: 0.5,
      metalness: 0.7,
    });

    // --- Floor ---
    const floorGeo = new THREE.PlaneGeometry(
      WINDOW_WIDTH + WALL_THICKNESS * 2,
      STATION_DEPTH,
    );
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x080810,
      roughness: 0.85,
      metalness: 0.4,
      map: this.createGridTexture(),
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -halfH, -STATION_DEPTH / 2);
    this.add(floor);

    // --- Ceiling ---
    const ceilingGeo = new THREE.PlaneGeometry(
      WINDOW_WIDTH + WALL_THICKNESS * 2,
      STATION_DEPTH,
    );
    const ceiling = new THREE.Mesh(ceilingGeo, wallMat.clone());
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, halfH, -STATION_DEPTH / 2);
    this.add(ceiling);

    // --- Left wall ---
    const sideGeo = new THREE.PlaneGeometry(STATION_DEPTH, WINDOW_HEIGHT);
    const leftWall = new THREE.Mesh(sideGeo, wallMat.clone());
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-halfW - WALL_THICKNESS, 0, -STATION_DEPTH / 2);
    this.add(leftWall);

    // --- Right wall ---
    const rightWall = new THREE.Mesh(sideGeo, wallMat.clone());
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(halfW + WALL_THICKNESS, 0, -STATION_DEPTH / 2);
    this.add(rightWall);

    // --- Back wall ---
    const backGeo = new THREE.PlaneGeometry(
      WINDOW_WIDTH + WALL_THICKNESS * 2,
      WINDOW_HEIGHT + WALL_THICKNESS * 2,
    );
    const backWall = new THREE.Mesh(backGeo, wallMat.clone());
    backWall.position.set(0, 0, -STATION_DEPTH);
    this.add(backWall);

    // --- Window frame (thick border at z=0) ---
    const frameThickness = WALL_THICKNESS;

    // Top frame
    const topFrameGeo = new THREE.BoxGeometry(
      WINDOW_WIDTH + frameThickness * 2,
      frameThickness,
      2,
    );
    const topFrame = new THREE.Mesh(topFrameGeo, wallMat.clone());
    topFrame.position.set(0, halfH + frameThickness / 2, 0);
    this.add(topFrame);

    // Bottom frame
    const bottomFrame = new THREE.Mesh(topFrameGeo, wallMat.clone());
    bottomFrame.position.set(0, -halfH - frameThickness / 2, 0);
    this.add(bottomFrame);

    // Left frame
    const sideFrameGeo = new THREE.BoxGeometry(
      frameThickness,
      WINDOW_HEIGHT + frameThickness * 2,
      2,
    );
    const leftFrame = new THREE.Mesh(sideFrameGeo, wallMat.clone());
    leftFrame.position.set(-halfW - frameThickness / 2, 0, 0);
    this.add(leftFrame);

    // Right frame
    const rightFrame = new THREE.Mesh(sideFrameGeo, wallMat.clone());
    rightFrame.position.set(halfW + frameThickness / 2, 0, 0);
    this.add(rightFrame);

    // --- Emissive edge strips along window inner border ---
    const edgeThickness = 0.3;

    const topEdge = new THREE.Mesh(
      new THREE.BoxGeometry(WINDOW_WIDTH, edgeThickness, edgeThickness),
      edgeMat,
    );
    topEdge.position.set(0, halfH, 0);
    this.add(topEdge);

    const bottomEdge = new THREE.Mesh(
      new THREE.BoxGeometry(WINDOW_WIDTH, edgeThickness, edgeThickness),
      edgeMat.clone(),
    );
    bottomEdge.position.set(0, -halfH, 0);
    this.add(bottomEdge);

    const leftEdge = new THREE.Mesh(
      new THREE.BoxGeometry(edgeThickness, WINDOW_HEIGHT, edgeThickness),
      edgeMat.clone(),
    );
    leftEdge.position.set(-halfW, 0, 0);
    this.add(leftEdge);

    const rightEdge = new THREE.Mesh(
      new THREE.BoxGeometry(edgeThickness, WINDOW_HEIGHT, edgeThickness),
      edgeMat.clone(),
    );
    rightEdge.position.set(halfW, 0, 0);
    this.add(rightEdge);

    // --- Dashboard below window ---
    this.buildDashboard(halfW, halfH, edgeMat);

    // --- Side holographic screens ---
    this.buildSideScreens(halfW, halfH);

    // --- Ceiling strip lights ---
    this.buildCeilingLights(halfW, halfH);

    // --- Floor accent lighting ---
    this.buildFloorAccents(halfW, halfH);

    // --- Interior lighting ---
    // Window frame edge lights
    const edgeLightPositions = [
      [0, halfH - 1, -1],
      [0, -halfH + 1, -1],
      [-halfW + 1, 0, -1],
      [halfW - 1, 0, -1],
    ];
    for (const [x, y, z] of edgeLightPositions) {
      const light = new THREE.PointLight(0x00838f, 1.0, 40);
      light.position.set(x, y, z);
      this.add(light);
    }

    // Interior fill lights (dim warm white)
    const fill1 = new THREE.PointLight(0x222233, 0.5, 30);
    fill1.position.set(-5, 3, -12);
    this.add(fill1);

    const fill2 = new THREE.PointLight(0x222233, 0.5, 30);
    fill2.position.set(5, 3, -12);
    this.add(fill2);
  }

  private createGridTexture(): THREE.CanvasTexture {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "#080810";
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = "rgba(0, 131, 143, 0.08)";
    ctx.lineWidth = 1;
    const gridSize = 32;
    for (let i = 0; i <= size; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(size, i);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 3);
    return texture;
  }

  private buildDashboard(
    _halfW: number,
    halfH: number,
    edgeMat: THREE.MeshStandardMaterial,
  ): void {
    // Slanted panel below window
    const dashWidth = WINDOW_WIDTH * 0.9;
    const dashGeo = new THREE.PlaneGeometry(dashWidth, 4);
    const dashMat = new THREE.MeshStandardMaterial({
      color: 0x0c0c18,
      roughness: 0.7,
      metalness: 0.5,
    });
    const dashboard = new THREE.Mesh(dashGeo, dashMat);
    dashboard.position.set(0, -halfH - 0.5, -1);
    dashboard.rotation.x = -Math.PI * 0.35; // ~63° angle
    this.add(dashboard);

    // Small emissive screens on dashboard
    const screenMat = new THREE.MeshBasicMaterial({
      color: 0x00838f,
      transparent: true,
      opacity: 0.4,
    });
    const screenPositions = [-6, 0, 6];
    for (const sx of screenPositions) {
      const screenGeo = new THREE.PlaneGeometry(3, 1.5);
      const screen = new THREE.Mesh(screenGeo, screenMat.clone());
      screen.position.set(sx, -halfH - 0.3, -1.2);
      screen.rotation.x = -Math.PI * 0.35;
      this.add(screen);
    }

    // Row of small cylinder buttons
    const btnMat = new THREE.MeshStandardMaterial({
      color: 0x00838f,
      emissive: new THREE.Color(0x00838f),
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.8,
    });
    for (let i = -5; i <= 5; i += 2) {
      const btnGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 8);
      const btn = new THREE.Mesh(btnGeo, btnMat);
      btn.position.set(i, -halfH - 1.8, -0.3);
      btn.rotation.x = -Math.PI * 0.35;
      this.add(btn);
    }

    // Dashboard teal edge strip
    const dashEdge = new THREE.Mesh(
      new THREE.BoxGeometry(dashWidth, 0.15, 0.15),
      edgeMat.clone(),
    );
    dashEdge.position.set(0, -halfH + 0.1, -0.2);
    this.add(dashEdge);
  }

  private buildSideScreens(halfW: number, _halfH: number): void {
    const screenMat = new THREE.MeshBasicMaterial({
      color: 0x00838f,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
    });
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x00838f,
      emissive: new THREE.Color(0x00838f),
      emissiveIntensity: 0.5,
      roughness: 0.4,
      metalness: 0.7,
    });

    // Left screen
    const leftScreenGeo = new THREE.PlaneGeometry(5, 7);
    const leftScreen = new THREE.Mesh(leftScreenGeo, screenMat);
    leftScreen.position.set(-halfW - WALL_THICKNESS + 1.5, 0, -8);
    leftScreen.rotation.y = Math.PI * 0.15; // angled inward
    this.add(leftScreen);

    // Left screen frame
    const lFrame = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 7.2, 0.1),
      frameMat,
    );
    lFrame.position.copy(leftScreen.position);
    lFrame.position.z -= 0.05;
    lFrame.rotation.y = leftScreen.rotation.y;
    this.add(lFrame);

    // Right screen
    const rightScreen = new THREE.Mesh(leftScreenGeo, screenMat.clone());
    rightScreen.position.set(halfW + WALL_THICKNESS - 1.5, 0, -8);
    rightScreen.rotation.y = -Math.PI * 0.15;
    this.add(rightScreen);

    // Right screen frame
    const rFrame = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 7.2, 0.1),
      frameMat.clone(),
    );
    rFrame.position.copy(rightScreen.position);
    rFrame.position.z -= 0.05;
    rFrame.rotation.y = rightScreen.rotation.y;
    this.add(rFrame);
  }

  private buildCeilingLights(halfW: number, halfH: number): void {
    const stripMat = new THREE.MeshBasicMaterial({
      color: 0x00838f,
      transparent: true,
      opacity: 0.3,
    });

    // Two parallel strips running front-to-back
    for (const xOffset of [-halfW * 0.4, halfW * 0.4]) {
      const stripGeo = new THREE.BoxGeometry(0.3, 0.1, STATION_DEPTH - 2);
      const strip = new THREE.Mesh(stripGeo, stripMat);
      strip.position.set(xOffset, halfH - 0.1, -STATION_DEPTH / 2);
      this.add(strip);
    }
  }

  private buildFloorAccents(halfW: number, halfH: number): void {
    const accentMat = new THREE.MeshBasicMaterial({
      color: 0x00838f,
      transparent: true,
      opacity: 0.2,
    });

    // Strips at wall-floor junctions
    const leftAccent = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.15, STATION_DEPTH - 2),
      accentMat,
    );
    leftAccent.position.set(
      -halfW - WALL_THICKNESS + 0.1,
      -halfH + 0.1,
      -STATION_DEPTH / 2,
    );
    this.add(leftAccent);

    const rightAccent = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.15, STATION_DEPTH - 2),
      accentMat.clone(),
    );
    rightAccent.position.set(
      halfW + WALL_THICKNESS - 0.1,
      -halfH + 0.1,
      -STATION_DEPTH / 2,
    );
    this.add(rightAccent);

    // Front accent along window bottom
    const frontAccent = new THREE.Mesh(
      new THREE.BoxGeometry(WINDOW_WIDTH, 0.15, 0.15),
      accentMat.clone(),
    );
    frontAccent.position.set(0, -halfH + 0.1, -0.1);
    this.add(frontAccent);
  }

  dispose(): void {
    this.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (obj.material instanceof THREE.Material) obj.material.dispose();
      }
    });
  }
}
