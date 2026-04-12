import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";
import { useDestinationFromRoute } from "./useDestinationFromRoute";

function wrapperFor(initialPath: string) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>;
  };
}

describe("useDestinationFromRoute", () => {
  it("returns 'home' for '/'", () => {
    const { result } = renderHook(() => useDestinationFromRoute(), {
      wrapper: wrapperFor("/"),
    });
    expect(result.current).toBe("home");
  });

  it("returns 'earth' for '/map'", () => {
    const { result } = renderHook(() => useDestinationFromRoute(), {
      wrapper: wrapperFor("/map"),
    });
    expect(result.current).toBe("earth");
  });

  it("returns 'rocket' for '/projects'", () => {
    const { result } = renderHook(() => useDestinationFromRoute(), {
      wrapper: wrapperFor("/projects"),
    });
    expect(result.current).toBe("rocket");
  });

  it("returns 'satellite' for '/experience'", () => {
    const { result } = renderHook(() => useDestinationFromRoute(), {
      wrapper: wrapperFor("/experience"),
    });
    expect(result.current).toBe("satellite");
  });

  it("returns 'moon' for '/gallery'", () => {
    const { result } = renderHook(() => useDestinationFromRoute(), {
      wrapper: wrapperFor("/gallery"),
    });
    expect(result.current).toBe("moon");
  });

  it("returns 'home' for unknown routes as a safe default", () => {
    const { result } = renderHook(() => useDestinationFromRoute(), {
      wrapper: wrapperFor("/nope"),
    });
    expect(result.current).toBe("home");
  });
});
