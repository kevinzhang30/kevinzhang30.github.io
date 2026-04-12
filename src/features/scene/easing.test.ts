import { describe, it, expect } from "vitest";
import { easeInOutCubic, clamp01 } from "./easing";

describe("clamp01", () => {
  it("returns 0 for negative input", () => {
    expect(clamp01(-0.5)).toBe(0);
  });
  it("returns 1 for input greater than 1", () => {
    expect(clamp01(2)).toBe(1);
  });
  it("passes through values between 0 and 1", () => {
    expect(clamp01(0.3)).toBe(0.3);
    expect(clamp01(0)).toBe(0);
    expect(clamp01(1)).toBe(1);
  });
});

describe("easeInOutCubic", () => {
  it("returns 0 at t=0", () => {
    expect(easeInOutCubic(0)).toBe(0);
  });

  it("returns 1 at t=1", () => {
    expect(easeInOutCubic(1)).toBe(1);
  });

  it("returns 0.5 at t=0.5 (symmetric midpoint)", () => {
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5, 10);
  });

  it("is monotonically increasing", () => {
    let prev = -Infinity;
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const v = easeInOutCubic(t);
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });

  it("clamps inputs outside [0,1]", () => {
    expect(easeInOutCubic(-1)).toBe(0);
    expect(easeInOutCubic(2)).toBe(1);
  });

  it("starts slow (eased-in shape near t=0)", () => {
    // Cubic ease-in-out accelerates from 0, so f(0.1) < 0.1
    expect(easeInOutCubic(0.1)).toBeLessThan(0.1);
  });

  it("ends slow (eased-out shape near t=1)", () => {
    // f(0.9) > 0.9
    expect(easeInOutCubic(0.9)).toBeGreaterThan(0.9);
  });
});
