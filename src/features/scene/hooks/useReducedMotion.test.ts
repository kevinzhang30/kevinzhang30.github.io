import { describe, it, expect, afterEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";

describe("useReducedMotion", () => {
  const originalMatchMedia = window.matchMedia;

  function stubMatchMedia(matches: boolean) {
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({
        matches,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );
  }

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.unstubAllGlobals();
  });

  it("returns false when the user has not set reduce-motion", async () => {
    stubMatchMedia(false);
    const { useReducedMotion } = await import("./useReducedMotion");
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it("returns true when the user has set reduce-motion", async () => {
    stubMatchMedia(true);
    const { useReducedMotion } = await import("./useReducedMotion");
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });
});
