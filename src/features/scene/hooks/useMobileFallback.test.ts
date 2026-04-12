import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { shouldUseMobileFallback } from "./useMobileFallback";

describe("shouldUseMobileFallback (pure)", () => {
  it("returns true when pointer is coarse AND width below 768", () => {
    expect(shouldUseMobileFallback(true, 500)).toBe(true);
    expect(shouldUseMobileFallback(true, 767)).toBe(true);
  });

  it("returns false when pointer is fine even on small widths", () => {
    expect(shouldUseMobileFallback(false, 500)).toBe(false);
  });

  it("returns false when width is >= 768 even with coarse pointer", () => {
    expect(shouldUseMobileFallback(true, 768)).toBe(false);
    expect(shouldUseMobileFallback(true, 1024)).toBe(false);
  });

  it("returns false in the default desktop case", () => {
    expect(shouldUseMobileFallback(false, 1440)).toBe(false);
  });
});

describe("useMobileFallback (hook)", () => {
  const originalMatchMedia = window.matchMedia;
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({
        matches: query.includes("coarse"),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 500,
    });
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: originalInnerWidth,
    });
    vi.unstubAllGlobals();
  });

  it("returns true for coarse pointer + small width", async () => {
    const { useMobileFallback } = await import("./useMobileFallback");
    const { result } = renderHook(() => useMobileFallback());
    expect(result.current).toBe(true);
  });
});
