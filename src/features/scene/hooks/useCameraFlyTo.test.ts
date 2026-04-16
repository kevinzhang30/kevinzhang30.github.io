import { describe, it, expect } from "vitest";
import { interpolatePose } from "./useCameraFlyTo";
import type { CameraPose } from "../types";

const A: CameraPose = {
  position: [0, 0, 0],
  lookAt: [0, 0, -1],
};

const B: CameraPose = {
  position: [10, 20, 30],
  lookAt: [10, 20, 29],
};

describe("interpolatePose", () => {
  it("returns from-pose at progress 0", () => {
    const p = interpolatePose(A, B, 0);
    expect(p.position).toEqual([0, 0, 0]);
    expect(p.lookAt).toEqual([0, 0, -1]);
  });

  it("returns to-pose at progress 1", () => {
    const p = interpolatePose(A, B, 1);
    expect(p.position).toEqual([10, 20, 30]);
    expect(p.lookAt).toEqual([10, 20, 29]);
  });

  it("returns midpoint (eased) at progress 0.5", () => {
    const p = interpolatePose(A, B, 0.5);
    // easeInOutCubic(0.5) === 0.5, so midpoint
    expect(p.position[0]).toBeCloseTo(5, 10);
    expect(p.position[1]).toBeCloseTo(10, 10);
    expect(p.position[2]).toBeCloseTo(15, 10);
  });

  it("clamps progress below 0", () => {
    const p = interpolatePose(A, B, -0.5);
    expect(p.position).toEqual([0, 0, 0]);
  });

  it("clamps progress above 1", () => {
    const p = interpolatePose(A, B, 5);
    expect(p.position).toEqual([10, 20, 30]);
  });

  it("interpolates lookAt independently from position", () => {
    const p = interpolatePose(A, B, 0.5);
    expect(p.lookAt[0]).toBeCloseTo(5, 10);
    expect(p.lookAt[1]).toBeCloseTo(10, 10);
    expect(p.lookAt[2]).toBeCloseTo(14, 10);
  });
});
