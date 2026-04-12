import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import {
  BLOOM_STRENGTH,
  BLOOM_RADIUS,
  BLOOM_THRESHOLD,
} from "../constants";
import type { QualitySettings } from "../types";

export class PostProcessingPipeline {
  readonly composer: EffectComposer;
  private fxaaPass: ShaderPass;
  private bloomPass: UnrealBloomPass;

  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera,
    quality: QualitySettings,
  ) {
    this.composer = new EffectComposer(renderer);

    // 1. Render pass
    const renderPass = new RenderPass(scene, camera);
    this.composer.addPass(renderPass);

    // 2. Bloom
    const resolution = new THREE.Vector2(
      window.innerWidth * quality.bloomResolution,
      window.innerHeight * quality.bloomResolution,
    );
    this.bloomPass = new UnrealBloomPass(
      resolution,
      BLOOM_STRENGTH,
      BLOOM_RADIUS,
      BLOOM_THRESHOLD,
    );
    this.composer.addPass(this.bloomPass);

    // 3. FXAA
    this.fxaaPass = new ShaderPass(FXAAShader);
    this.updateFXAAResolution();
    this.composer.addPass(this.fxaaPass);

    // 4. Output
    const outputPass = new OutputPass();
    this.composer.addPass(outputPass);
  }

  updateFXAAResolution(): void {
    const pixelRatio = window.devicePixelRatio || 1;
    this.fxaaPass.material.uniforms["resolution"].value.set(
      1 / (window.innerWidth * pixelRatio),
      1 / (window.innerHeight * pixelRatio),
    );
  }

  setSize(width: number, height: number): void {
    this.composer.setSize(width, height);
    this.updateFXAAResolution();
  }

  render(): void {
    this.composer.render();
  }

  dispose(): void {
    this.composer.dispose();
  }
}
