# Cinematic Scene Revamp — Phase 1: Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the persistent-scene architecture underneath the current portfolio so the home 3D scene no longer unmounts when the URL changes. URL↔camera sync, fly-to primitive, cockpit dim system, back navigation, and mobile fallback all ship in this phase. No destination-specific content yet (Earth, Rocket, Satellite, Moon each get a placeholder overlay).

**Architecture:** A single `<SceneCanvas />` component mounts above the router outlet and stays live across route changes. A `useDestinationFromRoute()` hook maps the current URL to a destination ID; a `CameraRig` component inside the canvas watches that destination and tweens the three.js camera pose using a pure `easeInOutCubic` + `useCameraFlyTo` primitive. The cockpit `intensity` prop threads through `CockpitShell`/`CockpitGlass` so they dim when focused on a destination. Small touchscreens bypass the canvas entirely via `useMobileFallback` and render a conventional `<MobileLayout>`.

**Tech Stack:** React 19, TypeScript (strict), Vite, react-router-dom 7, @react-three/fiber 9, @react-three/drei 10, @react-three/postprocessing, three.js 0.183. Tests via vitest + @testing-library/react + jsdom (added in Task 1).

**Spec reference:** `docs/superpowers/specs/2026-04-12-cinematic-scene-revamp-design.md`

---

## File structure after Phase 1

```
src/
  features/
    scene/                              NEW
      types.ts                          (DestinationId, Destination, CameraPose)
      config.ts                         (destination registry w/ camera poses)
      easing.ts                         (pure ease-in-out-cubic)
      SceneCanvas.tsx                   (Canvas wrapper + r3f providers)
      SceneContent.tsx                  (lights, effects, cockpit, objects)
      CameraRig.tsx                     (camera tween driven by destination)
      hooks/
        useDestinationFromRoute.ts
        useCameraFlyTo.ts
        useReducedMotion.ts
        useMobileFallback.ts
        useBackToHome.ts
      objects/
        types.ts                        (SceneObjectProps)
        Earth.tsx                       (ported from EarthNode, new API)
        Rocket.tsx                      (ported from RocketNode, new API)
        Satellite.tsx                   (ported from SatelliteNode, new API)
        Moon.tsx                        (ported from MoonNode, new API)
      effects/
        Starfield.tsx                   (ported verbatim)
        NebulaBackdrop.tsx              (ported verbatim)
        AsteroidField.tsx               (ported verbatim)
        ShootingStars.tsx               (ported verbatim)
      cockpit/
        CockpitShell.tsx                (ported + intensity prop)
        CockpitGlass.tsx                (ported + intensity prop)
      overlays/
        LoadingOverlay.tsx              (ported verbatim)
        HomeHUD.tsx                     (simplified from HomeOverlay)
        DestinationPlaceholder.tsx      NEW
        TransitionOverlay.tsx           NEW (accent vignette)
    home-scene/                         DELETED at end of phase
    solar-system/                       DELETED in phase
  pages/
    mobile/
      MobileHome.tsx                    NEW
      MobileLayout.tsx                  NEW
  App.tsx                               MODIFIED (persistent scene + mobile switch)
vite.config.ts                          MODIFIED (vitest test config)
package.json                            MODIFIED (add vitest + testing-library)
```

**Tests added:**
```
src/features/scene/config.test.ts
src/features/scene/easing.test.ts
src/features/scene/hooks/useDestinationFromRoute.test.tsx
src/features/scene/hooks/useCameraFlyTo.test.ts
src/features/scene/hooks/useMobileFallback.test.ts
src/features/scene/hooks/useReducedMotion.test.ts
```

**Note on TDD scope:** Pure logic (easing, destination mapping, mobile detection, reduced motion, config integrity) is unit tested. Visual 3D behavior (object appearance, camera feel, cockpit dim, effects) relies on manual verification via `npm run dev` because unit tests don't meaningfully exercise three.js rendering without heavy fixtures. Task 18 is a manual verification checklist.

**Note on accessibility scope:** The spec mentions invisible DOM focusable proxies for every interactive 3D object so keyboard and screen-reader users can reach them. Phase 1 does **not** add per-object proxies because the Home HUD already contains a DOM `<button>` pill for each destination (see `HomeHUD.tsx` in Task 14), giving full keyboard parity for Phase 1's navigation model. Per-object proxies become necessary in Phase 3+ when destinations add in-world clickable content (photo tiles, cargo crates, transmissions) that has no DOM equivalent. Task 18 Step 2 verifies keyboard parity via the HUD pills.

---

## Task 1: Set up vitest test framework

**Files:**
- Modify: `package.json` (add devDependencies + test script)
- Modify: `vite.config.ts` (add vitest config)
- Create: `src/test/setup.ts` (jest-dom matchers, cleanup)
- Create: `src/test/smoke.test.ts` (verify the framework runs)

- [ ] **Step 1: Install test dependencies**

Run:
```bash
npm install -D vitest@^1.6.0 @testing-library/react@^16.0.0 @testing-library/jest-dom@^6.4.0 jsdom@^24.0.0 @vitest/ui@^1.6.0
```

Expected: devDependencies added, no errors.

- [ ] **Step 2: Update `package.json` scripts**

Open `package.json` and add to `"scripts"`:

```json
"test": "vitest",
"test:run": "vitest run"
```

Final `"scripts"` block:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "test": "vitest",
  "test:run": "vitest run"
}
```

- [ ] **Step 3: Update `vite.config.ts` to include vitest config**

Replace `vite.config.ts` with:

```ts
/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: false,
  },
});
```

- [ ] **Step 4: Create `src/test/setup.ts`**

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});
```

- [ ] **Step 5: Create `src/test/smoke.test.ts`**

Create `src/test/smoke.test.ts`:

```ts
import { describe, it, expect } from "vitest";

describe("test framework", () => {
  it("runs a trivial assertion", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 6: Run the smoke test**

Run: `npm run test:run`
Expected: 1 test file, 1 test passed. Exit code 0.

If the test fails, confirm jsdom is installed and `vitest` is available.

- [ ] **Step 7: Verify `tsc` still passes**

Run: `npx tsc --noEmit`
Expected: no type errors.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vite.config.ts src/test/
git commit -m "chore: set up vitest + testing-library for scene foundation"
```

---

## Task 2: Destination types + registry + tests

**Files:**
- Create: `src/features/scene/types.ts`
- Create: `src/features/scene/config.ts`
- Create: `src/features/scene/config.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/features/scene/config.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  DESTINATIONS,
  DESTINATION_IDS,
  getDestinationById,
  getDestinationByRoute,
  HOME_DESTINATION_ID,
} from "./config";

describe("destination registry", () => {
  it("has exactly five destinations: home plus four celestial bodies", () => {
    expect(DESTINATIONS).toHaveLength(5);
    expect(DESTINATION_IDS).toEqual([
      "home",
      "earth",
      "rocket",
      "satellite",
      "moon",
    ]);
  });

  it("every destination has a unique id", () => {
    const ids = DESTINATIONS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every destination has a unique route", () => {
    const routes = DESTINATIONS.map((d) => d.route);
    expect(new Set(routes).size).toBe(routes.length);
  });

  it("maps each expected route to the correct destination id", () => {
    expect(getDestinationByRoute("/")?.id).toBe("home");
    expect(getDestinationByRoute("/map")?.id).toBe("earth");
    expect(getDestinationByRoute("/projects")?.id).toBe("rocket");
    expect(getDestinationByRoute("/experience")?.id).toBe("satellite");
    expect(getDestinationByRoute("/gallery")?.id).toBe("moon");
  });

  it("returns undefined for unknown routes", () => {
    expect(getDestinationByRoute("/nope")).toBeUndefined();
    expect(getDestinationByRoute("/admin/experience")).toBeUndefined();
  });

  it("looks up destinations by id", () => {
    expect(getDestinationById("earth")?.route).toBe("/map");
    expect(getDestinationById("home")?.route).toBe("/");
  });

  it("exports HOME_DESTINATION_ID as 'home'", () => {
    expect(HOME_DESTINATION_ID).toBe("home");
  });

  it("every non-home destination has a cameraPosition distinct from home", () => {
    const home = getDestinationById("home");
    expect(home).toBeDefined();
    const homePos = home!.cameraPosition.join(",");
    for (const d of DESTINATIONS) {
      if (d.id === "home") continue;
      expect(d.cameraPosition.join(",")).not.toBe(homePos);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/features/scene/config.test.ts`
Expected: FAIL with "Cannot find module './config'".

- [ ] **Step 3: Create `src/features/scene/types.ts`**

```ts
export type DestinationId =
  | "home"
  | "earth"
  | "rocket"
  | "satellite"
  | "moon";

export type Vec3 = [number, number, number];

export interface CameraPose {
  position: Vec3;
  lookAt: Vec3;
}

export interface Destination {
  id: DestinationId;
  route: string;
  label: string;
  caption: string;
  description: string;
  accent: string;
  cameraPosition: Vec3;
  cameraLookAt: Vec3;
  objectPosition: Vec3;
}
```

- [ ] **Step 4: Create `src/features/scene/config.ts`**

```ts
import type { Destination, DestinationId } from "./types";

export const HOME_DESTINATION_ID: DestinationId = "home";

export const DESTINATIONS: Destination[] = [
  {
    id: "home",
    route: "/",
    label: "Command Deck",
    caption: "Orbit overview",
    description: "Select a target beyond the glass.",
    accent: "#7acfff",
    cameraPosition: [0, 0.9, 8.8],
    cameraLookAt: [0, 0.7, -9.2],
    objectPosition: [0, 0, 0],
  },
  {
    id: "earth",
    route: "/map",
    label: "Earth",
    caption: "Orbital atlas",
    description: "Travel map and places I've been.",
    accent: "#43d7ff",
    cameraPosition: [5.4, 3.4, -17.2],
    cameraLookAt: [1.4, 1.8, -26.5],
    objectPosition: [1.4, 1.8, -26.5],
  },
  {
    id: "rocket",
    route: "/projects",
    label: "Rocket",
    caption: "Launch bay",
    description: "Projects, builds, and technical experiments.",
    accent: "#ff8656",
    cameraPosition: [-4.3, 0.6, -12.8],
    cameraLookAt: [-6.4, -1.25, -18.5],
    objectPosition: [-6.4, -1.25, -18.5],
  },
  {
    id: "satellite",
    route: "/experience",
    label: "Satellite",
    caption: "Comms relay",
    description: "Experience, internships, and work history.",
    accent: "#73ffb8",
    cameraPosition: [4.8, 3.3, -13.1],
    cameraLookAt: [6.8, 3.35, -20.2],
    objectPosition: [6.8, 3.35, -20.2],
  },
  {
    id: "moon",
    route: "/gallery",
    label: "Moon",
    caption: "Observation deck",
    description: "Photos, personal moments, and side interests.",
    accent: "#d6d8ff",
    cameraPosition: [-1.6, 4.8, -14.6],
    cameraLookAt: [-2.2, 4.8, -21.8],
    objectPosition: [-2.2, 4.8, -21.8],
  },
];

export const DESTINATION_IDS: DestinationId[] = DESTINATIONS.map((d) => d.id);

const BY_ID = new Map<DestinationId, Destination>(
  DESTINATIONS.map((d) => [d.id, d]),
);

const BY_ROUTE = new Map<string, Destination>(
  DESTINATIONS.map((d) => [d.route, d]),
);

export function getDestinationById(id: DestinationId): Destination | undefined {
  return BY_ID.get(id);
}

export function getDestinationByRoute(route: string): Destination | undefined {
  return BY_ROUTE.get(route);
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm run test:run -- src/features/scene/config.test.ts`
Expected: all 8 tests pass.

- [ ] **Step 6: Run typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/features/scene/types.ts src/features/scene/config.ts src/features/scene/config.test.ts
git commit -m "feat(scene): add destination registry with route lookup"
```

---

## Task 3: Pure easing function + tests

**Files:**
- Create: `src/features/scene/easing.ts`
- Create: `src/features/scene/easing.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/features/scene/easing.test.ts`:

```ts
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
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run test:run -- src/features/scene/easing.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/features/scene/easing.ts`**

```ts
export function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

// Cubic ease-in-out. Standard formula: 4t^3 for t<0.5, 1 - (-2t+2)^3/2 otherwise.
export function easeInOutCubic(t: number): number {
  const x = clamp01(t);
  return x < 0.5
    ? 4 * x * x * x
    : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
```

- [ ] **Step 4: Run tests**

Run: `npm run test:run -- src/features/scene/easing.test.ts`
Expected: all 10 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/features/scene/easing.ts src/features/scene/easing.test.ts
git commit -m "feat(scene): add clamp01 and easeInOutCubic primitives"
```

---

## Task 4: `useCameraFlyTo` hook + tests

**Files:**
- Create: `src/features/scene/hooks/useCameraFlyTo.ts`
- Create: `src/features/scene/hooks/useCameraFlyTo.test.ts`

The hook exposes a pure `interpolatePose(from, to, progress)` helper (unit tested) and a stateful React hook that tracks progress over time. Only the pure interpolation is unit tested; the stateful part is exercised by manual verification in Task 18.

- [ ] **Step 1: Write the failing test**

Create `src/features/scene/hooks/useCameraFlyTo.test.ts`:

```ts
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
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run test:run -- src/features/scene/hooks/useCameraFlyTo.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/features/scene/hooks/useCameraFlyTo.ts`**

```ts
import { useEffect, useRef } from "react";
import type { CameraPose, Vec3 } from "../types";
import { easeInOutCubic } from "../easing";

const DEFAULT_DURATION_MS = 1400;
const REDUCED_MOTION_DURATION_MS = 200;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpVec3(a: Vec3, b: Vec3, t: number): Vec3 {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

// Pure pose interpolation. Applies ease-in-out-cubic to the progress value.
// Unit tested; safe to use in render code.
export function interpolatePose(
  from: CameraPose,
  to: CameraPose,
  progress: number,
): CameraPose {
  const eased = easeInOutCubic(progress);
  return {
    position: lerpVec3(from.position, to.position, eased),
    lookAt: lerpVec3(from.lookAt, to.lookAt, eased),
  };
}

export interface FlyToState {
  currentPose: CameraPose;
  isFlying: boolean;
}

interface UseCameraFlyToOptions {
  targetPose: CameraPose;
  reducedMotion?: boolean;
  onArrive?: () => void;
}

/**
 * Tracks a camera pose that animates toward `targetPose` over DEFAULT_DURATION_MS
 * (or REDUCED_MOTION_DURATION_MS when `reducedMotion` is true). Calling with a new
 * `targetPose` while a flight is in progress cancels the current tween and starts a
 * new one from the current interpolated pose.
 *
 * The hook returns a ref-like accessor that callers poll inside useFrame.
 * It does NOT directly touch the three.js camera — that's the CameraRig's job.
 */
export function useCameraFlyTo({
  targetPose,
  reducedMotion = false,
  onArrive,
}: UseCameraFlyToOptions) {
  const stateRef = useRef<{
    fromPose: CameraPose;
    toPose: CameraPose;
    startTime: number | null;
    duration: number;
    arrived: boolean;
  }>({
    fromPose: targetPose,
    toPose: targetPose,
    startTime: null,
    duration: DEFAULT_DURATION_MS,
    arrived: true,
  });

  useEffect(() => {
    const state = stateRef.current;
    // Capture the current pose as the new from-pose by evaluating progress now.
    const now = performance.now();
    const currentPose =
      state.startTime === null
        ? state.toPose
        : interpolatePose(
            state.fromPose,
            state.toPose,
            (now - state.startTime) / state.duration,
          );
    state.fromPose = currentPose;
    state.toPose = targetPose;
    state.startTime = now;
    state.duration = reducedMotion
      ? REDUCED_MOTION_DURATION_MS
      : DEFAULT_DURATION_MS;
    state.arrived = false;
  }, [targetPose, reducedMotion]);

  // Consumers call this each frame to read the current pose.
  function read(now: number): FlyToState {
    const state = stateRef.current;
    if (state.startTime === null) {
      return { currentPose: state.toPose, isFlying: false };
    }
    const rawProgress = (now - state.startTime) / state.duration;
    if (rawProgress >= 1) {
      if (!state.arrived) {
        state.arrived = true;
        onArrive?.();
      }
      return { currentPose: state.toPose, isFlying: false };
    }
    return {
      currentPose: interpolatePose(state.fromPose, state.toPose, rawProgress),
      isFlying: true,
    };
  }

  return { read };
}
```

- [ ] **Step 4: Run tests**

Run: `npm run test:run -- src/features/scene/hooks/useCameraFlyTo.test.ts`
Expected: all 6 tests pass. (The stateful hook itself is manually verified in Task 18.)

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/features/scene/hooks/useCameraFlyTo.ts src/features/scene/hooks/useCameraFlyTo.test.ts
git commit -m "feat(scene): add useCameraFlyTo hook with pure pose interpolation"
```

---

## Task 5: `useDestinationFromRoute` hook + tests

**Files:**
- Create: `src/features/scene/hooks/useDestinationFromRoute.ts`
- Create: `src/features/scene/hooks/useDestinationFromRoute.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/features/scene/hooks/useDestinationFromRoute.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run test:run -- src/features/scene/hooks/useDestinationFromRoute.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/features/scene/hooks/useDestinationFromRoute.ts`**

```ts
import { useLocation } from "react-router-dom";
import type { DestinationId } from "../types";
import { getDestinationByRoute, HOME_DESTINATION_ID } from "../config";

/**
 * Maps the current react-router location to a DestinationId.
 * Unknown routes fall back to `home` so the scene has a safe default pose.
 */
export function useDestinationFromRoute(): DestinationId {
  const { pathname } = useLocation();
  const destination = getDestinationByRoute(pathname);
  return destination?.id ?? HOME_DESTINATION_ID;
}
```

- [ ] **Step 4: Run tests**

Run: `npm run test:run -- src/features/scene/hooks/useDestinationFromRoute.test.tsx`
Expected: all 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/features/scene/hooks/useDestinationFromRoute.ts src/features/scene/hooks/useDestinationFromRoute.test.tsx
git commit -m "feat(scene): add useDestinationFromRoute hook"
```

---

## Task 6: `useMobileFallback` hook + tests

**Files:**
- Create: `src/features/scene/hooks/useMobileFallback.ts`
- Create: `src/features/scene/hooks/useMobileFallback.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/features/scene/hooks/useMobileFallback.test.ts`:

```ts
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
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run test:run -- src/features/scene/hooks/useMobileFallback.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/features/scene/hooks/useMobileFallback.ts`**

```ts
import { useState, useEffect } from "react";

const MOBILE_MAX_WIDTH = 768;

export function shouldUseMobileFallback(
  pointerIsCoarse: boolean,
  innerWidth: number,
): boolean {
  return pointerIsCoarse && innerWidth < MOBILE_MAX_WIDTH;
}

function detectMobile(): boolean {
  if (typeof window === "undefined") return false;
  const pointerIsCoarse =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches;
  return shouldUseMobileFallback(pointerIsCoarse, window.innerWidth);
}

/**
 * Detects once at mount whether the current device should get the mobile
 * fallback (small touchscreens). Does NOT react to window resizes — this is
 * intentional per the spec: desktop users resizing a window below 768px do
 * not get hot-swapped into the mobile view.
 */
export function useMobileFallback(): boolean {
  const [isMobile] = useState<boolean>(detectMobile);
  // Effect kept for future instrumentation; currently a no-op because we
  // only want a mount-time decision.
  useEffect(() => {}, []);
  return isMobile;
}
```

- [ ] **Step 4: Run tests**

Run: `npm run test:run -- src/features/scene/hooks/useMobileFallback.test.ts`
Expected: all 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/features/scene/hooks/useMobileFallback.ts src/features/scene/hooks/useMobileFallback.test.ts
git commit -m "feat(scene): add useMobileFallback hook with mount-time detection"
```

---

## Task 7: `useReducedMotion` hook + tests

**Files:**
- Create: `src/features/scene/hooks/useReducedMotion.ts`
- Create: `src/features/scene/hooks/useReducedMotion.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/features/scene/hooks/useReducedMotion.test.ts`:

```ts
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
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
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run test:run -- src/features/scene/hooks/useReducedMotion.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/features/scene/hooks/useReducedMotion.ts`**

```ts
import { useEffect, useState } from "react";

function detect(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Returns whether the user has requested reduced motion.
 * Listens for changes so long-lived sessions react to a setting flip.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(detect);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (event: MediaQueryListEvent) => setReduced(event.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return reduced;
}
```

- [ ] **Step 4: Run tests**

Run: `npm run test:run -- src/features/scene/hooks/useReducedMotion.test.ts`
Expected: both tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/features/scene/hooks/useReducedMotion.ts src/features/scene/hooks/useReducedMotion.test.ts
git commit -m "feat(scene): add useReducedMotion hook"
```

---

## Task 8: `useBackToHome` hook

**Files:**
- Create: `src/features/scene/hooks/useBackToHome.ts`

No unit test — it's a small side-effectful hook wiring Escape + a canvas-click callback to `navigate("/")`. Manually verified in Task 18.

- [ ] **Step 1: Create the hook**

Create `src/features/scene/hooks/useBackToHome.ts`:

```ts
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { DestinationId } from "../types";
import { HOME_DESTINATION_ID } from "../config";

interface UseBackToHomeOptions {
  activeDestination: DestinationId;
  onBack?: () => void; // allows callers to collapse a sub-selection first
}

/**
 * Wires Escape key to return the user to the home destination when they are
 * not already there. Exposes an imperative `goBack` callback for UI consumers
 * (back-to-station button, click-empty-space handler).
 *
 * Two-level behavior: if the caller provides `onBack`, it is invoked first
 * and allowed to handle the event (e.g. collapse an open sub-selection).
 * A second press of Escape would then be called with `onBack` doing nothing,
 * which falls through to the navigate call.
 */
export function useBackToHome({ activeDestination, onBack }: UseBackToHomeOptions) {
  const navigate = useNavigate();

  const goBack = useCallback(() => {
    if (onBack) {
      onBack();
    }
    if (activeDestination !== HOME_DESTINATION_ID) {
      navigate("/");
    }
  }, [navigate, activeDestination, onBack]);

  useEffect(() => {
    function handler(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (activeDestination === HOME_DESTINATION_ID) return;
      goBack();
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeDestination, goBack]);

  return { goBack };
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/scene/hooks/useBackToHome.ts
git commit -m "feat(scene): add useBackToHome hook for Escape + goBack"
```

---

## Task 9: Port effects into `src/features/scene/effects/`

The four effect components (Starfield, NebulaBackdrop, AsteroidField, ShootingStars) have no dependencies on `../scene/config` or `../objects/types` — they're self-contained. They can be moved verbatim. Their originals under `src/features/home-scene/effects/` are deleted in Task 17.

**Files:**
- Create: `src/features/scene/effects/Starfield.tsx` (copy of `src/features/home-scene/effects/Starfield.tsx`)
- Create: `src/features/scene/effects/NebulaBackdrop.tsx` (copy)
- Create: `src/features/scene/effects/AsteroidField.tsx` (copy)
- Create: `src/features/scene/effects/ShootingStars.tsx` (copy)

- [ ] **Step 1: Copy each effect file to the new location**

Run:
```bash
cp src/features/home-scene/effects/Starfield.tsx src/features/scene/effects/Starfield.tsx
cp src/features/home-scene/effects/NebulaBackdrop.tsx src/features/scene/effects/NebulaBackdrop.tsx
cp src/features/home-scene/effects/AsteroidField.tsx src/features/scene/effects/AsteroidField.tsx
cp src/features/home-scene/effects/ShootingStars.tsx src/features/scene/effects/ShootingStars.tsx
```

- [ ] **Step 2: Verify no imports need rewriting**

Run: `grep -n "from \"\\.\\./" src/features/scene/effects/*.tsx || true`
Expected: if any relative imports reach into `../objects` or `../scene`, those need updating. Most effect files are self-contained; if not, fix imports so they resolve inside `src/features/scene/` or point to shared utilities. Do NOT import from `src/features/home-scene/`.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors. (The old files still exist and still compile; the new files must also compile.)

- [ ] **Step 4: Commit**

```bash
git add src/features/scene/effects/
git commit -m "chore(scene): port effects to new scene feature folder"
```

---

## Task 10: Port cockpit with `intensity` prop

The cockpit's visual elements (light strips, screens, button arrays, glass) need to dim to ~15% when the user is focused on a destination, and smoothly interpolate back to 100% when returning home.

**Files:**
- Create: `src/features/scene/cockpit/CockpitShell.tsx`
- Create: `src/features/scene/cockpit/CockpitGlass.tsx`

Both take a new `intensity: number` prop (0..1). Emissive intensities, light strip intensities, point light intensities, and the glass opacity multiply by `intensity`. The shell meshes themselves are always visible (they're the physical ship); only the lights fade.

- [ ] **Step 1: Copy `CockpitShell.tsx` then modify**

```bash
cp src/features/home-scene/cockpit/CockpitShell.tsx src/features/scene/cockpit/CockpitShell.tsx
```

Then replace its contents with:

```tsx
import { Float } from "@react-three/drei";

interface CockpitShellProps {
  intensity: number; // 0..1
}

function LightStrip({
  position,
  scale,
  color = "#53dcff",
  baseIntensity = 1.8,
  intensity,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  color?: string;
  baseIntensity?: number;
  intensity: number;
}) {
  return (
    <mesh position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={baseIntensity * intensity}
        roughness={0.2}
        metalness={0.6}
      />
    </mesh>
  );
}

function Screen({
  position,
  rotation,
  scale,
  color = "#58d7ff",
  intensity,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color?: string;
  intensity: number;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh scale={scale}>
        <boxGeometry args={[1, 1, 0.08]} />
        <meshStandardMaterial color="#08111d" roughness={0.55} metalness={0.75} />
      </mesh>
      <mesh position={[0, 0, 0.05]} scale={[scale[0] * 0.82, scale[1] * 0.72, 0.01]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#081321"
          emissive={color}
          emissiveIntensity={0.45 * intensity}
          roughness={0.15}
          metalness={0.5}
        />
      </mesh>
    </group>
  );
}

function ButtonArray({
  origin,
  rows,
  cols,
  spacing,
  color,
  intensity,
}: {
  origin: [number, number, number];
  rows: number;
  cols: number;
  spacing: number;
  color: string;
  intensity: number;
}) {
  return (
    <group position={origin}>
      {Array.from({ length: rows * cols }, (_, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;

        return (
          <mesh
            key={index}
            position={[
              (col - (cols - 1) / 2) * spacing,
              -(row - (rows - 1) / 2) * spacing,
              0,
            ]}
          >
            <cylinderGeometry args={[0.08, 0.08, 0.06, 10]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.9 * intensity}
              roughness={0.28}
              metalness={0.72}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function CockpitShell({ intensity }: CockpitShellProps) {
  return (
    <group>
      <Float speed={0.45} rotationIntensity={0.01} floatIntensity={0.05}>
        <group>
          {/* Structural hull meshes (unaffected by intensity) */}
          <mesh position={[0, -4.2, 5.2]} rotation={[-0.62, 0, 0]} scale={[16.5, 3.6, 2.4]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#060e17" roughness={0.88} metalness={0.42} />
          </mesh>
          <mesh position={[0, -5.65, 3.7]} rotation={[-0.12, 0, 0]} scale={[18.5, 1.2, 3.4]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#07101a" roughness={0.94} metalness={0.32} />
          </mesh>
          <mesh position={[-7.4, -3.6, 5.55]} rotation={[-0.74, 0.24, 0.26]} scale={[4.4, 2.35, 0.55]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#08111d" roughness={0.62} metalness={0.68} />
          </mesh>
          <mesh position={[7.4, -3.6, 5.55]} rotation={[-0.74, -0.24, -0.26]} scale={[4.4, 2.35, 0.55]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#08111d" roughness={0.62} metalness={0.68} />
          </mesh>
          <mesh position={[0, 7.1, 3.25]} rotation={[0.28, 0, 0]} scale={[15.2, 1.5, 2.6]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#091321" roughness={0.82} metalness={0.54} />
          </mesh>
          <mesh position={[-8.45, 1.45, 2.85]} rotation={[0, 0.42, 0.03]} scale={[2.8, 11.8, 2.8]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#09111c" roughness={0.76} metalness={0.56} />
          </mesh>
          <mesh position={[8.45, 1.45, 2.85]} rotation={[0, -0.42, -0.03]} scale={[2.8, 11.8, 2.8]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#09111c" roughness={0.76} metalness={0.56} />
          </mesh>
          <mesh position={[0, 3.55, 1.05]} scale={[9.5, 0.22, 0.16]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#132435" roughness={0.42} metalness={0.78} />
          </mesh>
          <mesh position={[0, -2.65, 1.1]} scale={[8.6, 0.24, 0.18]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#102132" roughness={0.42} metalness={0.78} />
          </mesh>
          <mesh position={[-4.6, 0.45, 1.0]} rotation={[0, 0, -0.31]} scale={[0.22, 6.65, 0.14]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#112232" roughness={0.42} metalness={0.78} />
          </mesh>
          <mesh position={[4.6, 0.45, 1.0]} rotation={[0, 0, 0.31]} scale={[0.22, 6.65, 0.14]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#112232" roughness={0.42} metalness={0.78} />
          </mesh>
          <mesh position={[-5.95, -0.55, 0.8]} rotation={[0.02, 0.13, -0.22]} scale={[0.18, 8.2, 0.12]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#0f1b29" roughness={0.48} metalness={0.72} />
          </mesh>
          <mesh position={[5.95, -0.55, 0.8]} rotation={[0.02, -0.13, 0.22]} scale={[0.18, 8.2, 0.12]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#0f1b29" roughness={0.48} metalness={0.72} />
          </mesh>

          {/* Light strips dim with intensity */}
          <LightStrip position={[0, -3.05, 5.98]} scale={[8.2, 0.05, 0.05]} intensity={intensity} />
          <LightStrip position={[-7.2, -3.3, 5.95]} scale={[1.9, 0.05, 0.05]} baseIntensity={1.4} intensity={intensity} />
          <LightStrip position={[7.2, -3.3, 5.95]} scale={[1.9, 0.05, 0.05]} baseIntensity={1.4} intensity={intensity} />
          <LightStrip position={[-4.6, 0.45, 1.08]} scale={[0.05, 5.4, 0.05]} baseIntensity={1.4} intensity={intensity} />
          <LightStrip position={[4.6, 0.45, 1.08]} scale={[0.05, 5.4, 0.05]} baseIntensity={1.4} intensity={intensity} />

          <Screen position={[0, -3.15, 5.92]} rotation={[-0.73, 0, 0]} scale={[3.1, 0.85, 1]} intensity={intensity} />
          <Screen position={[-5.4, -3.25, 6.05]} rotation={[-0.85, 0.2, 0.18]} scale={[1.8, 0.72, 1]} color="#77ffd8" intensity={intensity} />
          <Screen position={[5.4, -3.25, 6.05]} rotation={[-0.85, -0.2, -0.18]} scale={[1.8, 0.72, 1]} color="#ff8d5f" intensity={intensity} />

          <ButtonArray origin={[-5.45, -3.95, 6.12]} rows={2} cols={4} spacing={0.34} color="#77ffd8" intensity={intensity} />
          <ButtonArray origin={[5.45, -3.95, 6.12]} rows={2} cols={4} spacing={0.34} color="#ff8d5f" intensity={intensity} />
          <ButtonArray origin={[0, -3.9, 6.05]} rows={2} cols={6} spacing={0.28} color="#58d7ff" intensity={intensity} />

          {/* Yoke (structural) */}
          <mesh position={[0, -5.3, 6.35]} scale={[2.8, 0.35, 0.6]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#06111c" roughness={0.54} metalness={0.82} />
          </mesh>
          <mesh position={[-0.85, -4.86, 6.48]} rotation={[0.34, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.16, 0.42, 16]} />
            <meshStandardMaterial color="#d8e4f2" roughness={0.14} metalness={0.92} />
          </mesh>
          <mesh position={[0.85, -4.86, 6.48]} rotation={[0.34, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.16, 0.42, 16]} />
            <meshStandardMaterial color="#d8e4f2" roughness={0.14} metalness={0.92} />
          </mesh>

          {/* Point lights dim with intensity */}
          <pointLight position={[0, -3.4, 5.8]} intensity={7.5 * intensity} distance={18} color="#24d7ff" />
          <pointLight position={[-5.25, -3.25, 5.9]} intensity={3.4 * intensity} distance={8} color="#77ffd8" />
          <pointLight position={[5.25, -3.25, 5.9]} intensity={3.4 * intensity} distance={8} color="#ff8d5f" />
        </group>
      </Float>
    </group>
  );
}
```

- [ ] **Step 2: Create `CockpitGlass.tsx`**

Create `src/features/scene/cockpit/CockpitGlass.tsx`:

```tsx
import * as THREE from "three";

interface CockpitGlassProps {
  intensity: number; // 0..1
}

export default function CockpitGlass({ intensity }: CockpitGlassProps) {
  return (
    <group>
      <mesh position={[0, 0.2, 0.92]} scale={[9, 6.2, 0.02]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial
          color="#7acfff"
          transparent
          opacity={0.04 * intensity}
          roughness={0.05}
          metalness={0}
          transmission={0.12}
          clearcoat={1}
          clearcoatRoughness={0.12}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[-2.4, 1.8, 0.96]} rotation={[0, 0, -0.32]} scale={[0.04, 3.6, 0.04]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#9fe9ff" transparent opacity={0.16 * intensity} />
      </mesh>

      <mesh position={[2.6, 1.4, 0.96]} rotation={[0, 0, 0.28]} scale={[0.04, 2.9, 0.04]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#9fe9ff" transparent opacity={0.12 * intensity} />
      </mesh>

      <mesh position={[0, 2.8, 0.98]} scale={[4.6, 0.03, 0.03]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#9fe9ff" transparent opacity={0.12 * intensity} />
      </mesh>
    </group>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/scene/cockpit/
git commit -m "feat(scene): port cockpit with intensity prop for dim-on-dive"
```

---

## Task 11: Port objects with new prop API

The four scene objects (Earth, Rocket, Satellite, Moon) currently take `target`, `active`, `focused`, `transitioning`, `onHoverChange`, `onSelect`. In the new architecture, clicking an object calls `navigate(destination.route)` — the object no longer needs to know whether it's focused because the camera rig handles that. We simplify the prop API to:

```ts
interface SceneObjectProps {
  destination: Destination;
  isActive: boolean;    // current route points at this destination
  isHovered: boolean;
  onHoverChange: (id: DestinationId | null) => void;
  onSelect: (destination: Destination) => void;
}
```

**Files:**
- Create: `src/features/scene/objects/types.ts`
- Create: `src/features/scene/objects/Earth.tsx`
- Create: `src/features/scene/objects/Rocket.tsx`
- Create: `src/features/scene/objects/Satellite.tsx`
- Create: `src/features/scene/objects/Moon.tsx`

- [ ] **Step 1: Create `src/features/scene/objects/types.ts`**

```ts
import type { Destination, DestinationId } from "../types";

export interface SceneObjectProps {
  destination: Destination;
  isActive: boolean;
  isHovered: boolean;
  onHoverChange: (id: DestinationId | null) => void;
  onSelect: (destination: Destination) => void;
}
```

- [ ] **Step 2: Port `Earth.tsx`**

Create `src/features/scene/objects/Earth.tsx` — the original `EarthNode.tsx` adapted for the new prop API. The visual code is preserved; only the prop destructure, click/hover wiring, and the target-position access are updated.

```tsx
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { SceneObjectProps } from "./types";

const EARTH_COLOR = "#46d3ff";

export default function Earth({
  destination,
  isActive,
  isHovered,
  onHoverChange,
  onSelect,
}: SceneObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [colorMap, normalMap, specularMap, cloudMap] = useTexture([
    "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
    "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg",
    "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg",
    "https://threejs.org/examples/textures/planets/earth_clouds_1024.png",
  ]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.16;
    if (cloudRef.current) cloudRef.current.rotation.y += delta * 0.2;

    if (glowRef.current) {
      const targetScale = isHovered || isActive ? 1.13 : 1.08;
      const lerpSpeed = isHovered || isActive ? 0.12 : 0.08;
      glowRef.current.scale.x = THREE.MathUtils.lerp(glowRef.current.scale.x, targetScale, lerpSpeed);
      glowRef.current.scale.y = THREE.MathUtils.lerp(glowRef.current.scale.y, targetScale, lerpSpeed);
      glowRef.current.scale.z = THREE.MathUtils.lerp(glowRef.current.scale.z, targetScale, lerpSpeed);
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = THREE.MathUtils.lerp(
        material.opacity,
        isActive ? 0.28 : isHovered ? 0.2 : 0.14,
        lerpSpeed,
      );
    }

    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      const targetOpacity = isHovered || isActive ? 0.5 : 0;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.1);
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.8) * 0.1;
      ringRef.current.rotation.z = t * 0.3;
    }

    if (groupRef.current) {
      groupRef.current.position.y = destination.objectPosition[1] + Math.sin(t * 0.55) * 0.18;
      groupRef.current.rotation.z = Math.sin(t * 0.22) * 0.04;

      const baseScale = isActive ? 1.08 : isHovered ? 1.04 : 1;
      const pulse = isHovered && !isActive ? Math.sin(t * 4) * 0.02 : 0;
      const targetScale = baseScale + pulse;
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.08,
      );
    }
  });

  return (
    <group
      ref={groupRef}
      position={destination.objectPosition}
      onPointerOver={(event) => {
        event.stopPropagation();
        onHoverChange(destination.id);
      }}
      onPointerOut={() => onHoverChange(null)}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(destination);
      }}
    >
      <mesh ref={earthRef} castShadow>
        <sphereGeometry args={[4.7, 96, 96]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.7, 0.7)}
          roughnessMap={specularMap}
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      <mesh ref={cloudRef}>
        <sphereGeometry args={[4.82, 72, 72]} />
        <meshStandardMaterial
          map={cloudMap}
          transparent
          opacity={0.22}
          depthWrite={false}
          roughness={1}
        />
      </mesh>

      <mesh ref={glowRef}>
        <sphereGeometry args={[5.2, 64, 64]} />
        <meshBasicMaterial
          color={EARTH_COLOR}
          transparent
          opacity={0.14}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[6.2, 0.06, 16, 64]} />
        <meshBasicMaterial
          color={destination.accent}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <pointLight
        position={[0, 0, 0]}
        color={EARTH_COLOR}
        intensity={isActive ? 16 : isHovered ? 12 : 9}
        distance={32}
      />
    </group>
  );
}
```

- [ ] **Step 3: Port `Rocket.tsx`, `Satellite.tsx`, `Moon.tsx`**

Earth.tsx above is the template. Do the following for each of the three remaining objects. The visual/animation internals are otherwise unchanged.

**Substep 3a: Copy each file**

```bash
cp src/features/home-scene/objects/RocketNode.tsx src/features/scene/objects/Rocket.tsx
cp src/features/home-scene/objects/SatelliteNode.tsx src/features/scene/objects/Satellite.tsx
cp src/features/home-scene/objects/MoonNode.tsx src/features/scene/objects/Moon.tsx
```

**Substep 3b: Apply these exact substitutions to each copied file**

Edit each of `src/features/scene/objects/Rocket.tsx`, `Satellite.tsx`, `Moon.tsx` and apply every substitution below. Do not skip any — each one is required for typecheck to pass.

1. Change the import: `import type { SceneNodeProps } from "./types";` → `import type { SceneObjectProps } from "./types";`
2. Rename the default export function to match the filename:
   - `export default function RocketNode(...)` → `export default function Rocket(...)`
   - `export default function SatelliteNode(...)` → `export default function Satellite(...)`
   - `export default function MoonNode(...)` → `export default function Moon(...)`
3. Replace the prop destructure `{ target, active, focused, transitioning, onHoverChange, onSelect }: SceneNodeProps` with `{ destination, isActive, isHovered, onHoverChange, onSelect }: SceneObjectProps`.
4. In the component body (both `useFrame` and JSX), replace every occurrence with exactly the following:
   - `target.position` → `destination.objectPosition`
   - `target.accent` → `destination.accent`
   - `target.id` → `destination.id`
   - `target.focusPosition` → `destination.cameraPosition`
   - `active` (when used as a boolean, not as a property access) → `isHovered`
   - `focused` (when used as a boolean) → `isActive`
5. Every read of `transitioning` must be removed. The simplest substitution: replace any expression of the form `transitioning ? A : B` with `B`, and any expression of the form `A && transitioning` with `false`. Delete any dead code branches that only ran when `transitioning` was true.
6. In the pointer handlers, replace `onSelect(target.id)` with `onSelect(destination)`.
7. Verify each file's top-level `<group>` uses `position={destination.objectPosition}` in its JSX (matching Earth.tsx).

**Substep 3c: Verify each file compiles in isolation**

```bash
npx tsc --noEmit
```

Expected: no errors. If any error mentions `target`, `active`, `focused`, or `transitioning`, you missed a substitution. Fix and re-run.

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors in the new files. The old `home-scene/objects/*Node.tsx` files still exist and still compile.

- [ ] **Step 5: Commit**

```bash
git add src/features/scene/objects/
git commit -m "feat(scene): port objects with simplified SceneObjectProps"
```

---

## Task 12: `CameraRig` component

The `CameraRig` is the bridge between `useCameraFlyTo` and the three.js camera inside the canvas. It reads the current pose each frame and applies it to `camera.position` and `camera.lookAt`. It also handles the home-pose idle parallax (scaled down when not at home).

**Files:**
- Create: `src/features/scene/CameraRig.tsx`

- [ ] **Step 1: Create `CameraRig.tsx`**

```tsx
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { CameraPose, DestinationId } from "./types";
import { getDestinationById, HOME_DESTINATION_ID } from "./config";
import { useCameraFlyTo } from "./hooks/useCameraFlyTo";

interface CameraRigProps {
  activeDestination: DestinationId;
  reducedMotion: boolean;
  mousePosition: { x: number; y: number };
}

function destinationToPose(id: DestinationId): CameraPose {
  const d = getDestinationById(id) ?? getDestinationById(HOME_DESTINATION_ID)!;
  return {
    position: d.cameraPosition,
    lookAt: d.cameraLookAt,
  };
}

export default function CameraRig({
  activeDestination,
  reducedMotion,
  mousePosition,
}: CameraRigProps) {
  const { camera } = useThree();
  const perspectiveCamera = camera as THREE.PerspectiveCamera;

  const targetPose = useMemo(
    () => destinationToPose(activeDestination),
    [activeDestination],
  );

  const { read } = useCameraFlyTo({ targetPose, reducedMotion });

  // Scratch vectors to avoid per-frame allocations.
  const lookAtVec = useRef(new THREE.Vector3());

  useFrame((state) => {
    const now = performance.now();
    const { currentPose } = read(now);

    const isHome = activeDestination === HOME_DESTINATION_ID;
    const parallaxScale = isHome ? 1 : 0.2;
    const t = state.clock.elapsedTime;

    // Base pose from the tween.
    const px = currentPose.position[0];
    const py = currentPose.position[1];
    const pz = currentPose.position[2];
    const lx = currentPose.lookAt[0];
    const ly = currentPose.lookAt[1];
    const lz = currentPose.lookAt[2];

    // Idle drift at home; dampened at destinations.
    const driftX = Math.sin(t * 0.22) * 0.28 * parallaxScale;
    const driftY = Math.cos(t * 0.31) * 0.16 * parallaxScale;

    // Mouse parallax on the lookAt target.
    const parallaxX = mousePosition.x * 0.6 * parallaxScale;
    const parallaxY = mousePosition.y * 0.3 * parallaxScale;

    perspectiveCamera.position.set(px + driftX, py + driftY, pz);
    lookAtVec.current.set(lx + parallaxX, ly + parallaxY, lz);
    perspectiveCamera.lookAt(lookAtVec.current);
    perspectiveCamera.updateProjectionMatrix();
  });

  return null;
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/scene/CameraRig.tsx
git commit -m "feat(scene): add CameraRig driving camera from active destination"
```

---

## Task 13: `SceneContent` component

`SceneContent` is what renders inside the Canvas: lights, effects, cockpit (with intensity from active destination), CameraRig, the four scene objects, and the post-processing stack. It owns no state — everything comes from props.

**Files:**
- Create: `src/features/scene/SceneContent.tsx`

- [ ] **Step 1: Create `SceneContent.tsx`**

```tsx
import { useMemo } from "react";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import type { Destination, DestinationId } from "./types";
import { DESTINATIONS, HOME_DESTINATION_ID } from "./config";
import CameraRig from "./CameraRig";
import Starfield from "./effects/Starfield";
import NebulaBackdrop from "./effects/NebulaBackdrop";
import AsteroidField from "./effects/AsteroidField";
import ShootingStars from "./effects/ShootingStars";
import CockpitShell from "./cockpit/CockpitShell";
import CockpitGlass from "./cockpit/CockpitGlass";
import Earth from "./objects/Earth";
import Rocket from "./objects/Rocket";
import Satellite from "./objects/Satellite";
import Moon from "./objects/Moon";

const HOME_COCKPIT_INTENSITY = 1;
const DESTINATION_COCKPIT_INTENSITY = 0.15;

interface SceneContentProps {
  activeDestination: DestinationId;
  hoveredId: DestinationId | null;
  reducedMotion: boolean;
  mousePosition: { x: number; y: number };
  onHoverChange: (id: DestinationId | null) => void;
  onSelect: (destination: Destination) => void;
}

const OBJECTS_BY_ID: Record<"earth" | "rocket" | "satellite" | "moon", Destination> = {
  earth: DESTINATIONS.find((d) => d.id === "earth")!,
  rocket: DESTINATIONS.find((d) => d.id === "rocket")!,
  satellite: DESTINATIONS.find((d) => d.id === "satellite")!,
  moon: DESTINATIONS.find((d) => d.id === "moon")!,
};

export default function SceneContent({
  activeDestination,
  hoveredId,
  reducedMotion,
  mousePosition,
  onHoverChange,
  onSelect,
}: SceneContentProps) {
  const isHome = activeDestination === HOME_DESTINATION_ID;
  const cockpitIntensity = isHome ? HOME_COCKPIT_INTENSITY : DESTINATION_COCKPIT_INTENSITY;

  const bloomIntensity = useMemo(() => {
    if (hoveredId && isHome) return 0.9;
    return isHome ? 0.5 : 0.7;
  }, [hoveredId, isHome]);

  return (
    <>
      <color attach="background" args={["#020611"]} />
      <fogExp2 attach="fog" args={["#020611", 0.012]} />

      <ambientLight intensity={0.38} color="#a7c1ff" />
      <directionalLight position={[12, 10, 18]} intensity={3.6} color="#d9e9ff" />
      <directionalLight position={[-10, -3, 10]} intensity={1} color="#2757aa" />
      <spotLight
        position={[0, -3.1, 7.2]}
        angle={0.92}
        penumbra={0.9}
        intensity={9.5 * cockpitIntensity}
        distance={18}
        color="#23d7ff"
      />

      <CameraRig
        activeDestination={activeDestination}
        reducedMotion={reducedMotion}
        mousePosition={mousePosition}
      />

      <NebulaBackdrop />
      <Starfield />
      <AsteroidField />
      <ShootingStars />
      <CockpitShell intensity={cockpitIntensity} />
      <CockpitGlass intensity={cockpitIntensity} />

      <Earth
        destination={OBJECTS_BY_ID.earth}
        isActive={activeDestination === "earth"}
        isHovered={hoveredId === "earth"}
        onHoverChange={onHoverChange}
        onSelect={onSelect}
      />
      <Rocket
        destination={OBJECTS_BY_ID.rocket}
        isActive={activeDestination === "rocket"}
        isHovered={hoveredId === "rocket"}
        onHoverChange={onHoverChange}
        onSelect={onSelect}
      />
      <Satellite
        destination={OBJECTS_BY_ID.satellite}
        isActive={activeDestination === "satellite"}
        isHovered={hoveredId === "satellite"}
        onHoverChange={onHoverChange}
        onSelect={onSelect}
      />
      <Moon
        destination={OBJECTS_BY_ID.moon}
        isActive={activeDestination === "moon"}
        isHovered={hoveredId === "moon"}
        onHoverChange={onHoverChange}
        onSelect={onSelect}
      />

      <EffectComposer multisampling={0}>
        <Bloom
          mipmapBlur
          intensity={bloomIntensity}
          luminanceThreshold={0.35}
          luminanceSmoothing={0.22}
        />
        <Noise premultiply opacity={0.03} blendFunction={BlendFunction.SOFT_LIGHT} />
        <Vignette offset={0.18} darkness={0.68} />
      </EffectComposer>
    </>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/scene/SceneContent.tsx
git commit -m "feat(scene): add SceneContent composing effects, objects, cockpit"
```

---

## Task 14: `SceneCanvas` + overlays

`SceneCanvas` is the top-level component that mounts the r3f `<Canvas>` and the screen-space overlays. It owns the hover state, mouse position, and handles `navigate()` when a scene object is clicked. The destination-content overlay and back-nav chrome are rendered here.

**Files:**
- Create: `src/features/scene/overlays/LoadingOverlay.tsx` (ported)
- Create: `src/features/scene/overlays/HomeHUD.tsx`
- Create: `src/features/scene/overlays/DestinationPlaceholder.tsx`
- Create: `src/features/scene/overlays/TransitionOverlay.tsx`
- Create: `src/features/scene/SceneCanvas.tsx`

- [ ] **Step 1: Port `LoadingOverlay.tsx`**

```bash
cp src/features/home-scene/overlays/LoadingOverlay.tsx src/features/scene/overlays/LoadingOverlay.tsx
```

Verify it compiles as-is (no internal imports reaching into `home-scene`). It doesn't — it only imports from `@react-three/drei` and React.

- [ ] **Step 2: Create `HomeHUD.tsx`**

This is a simplified version of the old `HomeOverlay.tsx` — it only renders when the active destination is `home`. It shows the Command Deck title, name, tagline, description, and four destination pills. The "transition lines" and exit flash logic is removed (handled by `TransitionOverlay` instead).

Create `src/features/scene/overlays/HomeHUD.tsx`:

```tsx
import { personal } from "../../../data/personal";
import { DESTINATIONS } from "../config";
import type { Destination, DestinationId } from "../types";

interface HomeHUDProps {
  hoveredId: DestinationId | null;
  isVisible: boolean;
  onSelect: (destination: Destination) => void;
}

export default function HomeHUD({ hoveredId, isVisible, onSelect }: HomeHUDProps) {
  const activeId = hoveredId ?? "earth";
  const visibleDestinations = DESTINATIONS.filter((d) => d.id !== "home");

  return (
    <div
      className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(80,150,255,0.18),_transparent_32%),linear-gradient(180deg,rgba(3,7,18,0.2),rgba(3,7,18,0.92))]" />
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.03)_1px,transparent_1px,transparent_3px)] opacity-20" />

      <div className="absolute inset-0 flex flex-col justify-between px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
        <header className="flex items-start justify-between gap-6">
          <div className="max-w-lg">
            <p className="text-xs uppercase tracking-[0.35em] text-sky-200/80">
              Command Deck
            </p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[5.25rem]">
              {personal.name}
            </h1>
            <p className="mt-3 max-w-xl text-sm uppercase tracking-[0.22em] text-sky-100/75 sm:text-base">
              {personal.tagline}
            </p>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-300 sm:text-base">
              Seated at the bridge. Select a target beyond the glass to move through the portfolio.
            </p>
          </div>
        </header>

        <div className="pointer-events-auto flex flex-wrap items-center gap-3">
          {visibleDestinations.map((destination) => {
            const active = destination.id === activeId;
            return (
              <button
                key={destination.id}
                type="button"
                onClick={() => onSelect(destination)}
                className={`rounded-full border px-4 py-2 text-left backdrop-blur-md transition-all duration-300 ${
                  active
                    ? "border-white/25 bg-white/12 shadow-[0_18px_50px_rgba(14,165,233,0.16)]"
                    : "border-white/10 bg-slate-950/45 hover:border-white/20 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: destination.accent,
                      boxShadow: `0 0 14px ${destination.accent}`,
                    }}
                  />
                  <span className="text-xs font-medium uppercase tracking-[0.28em] text-white/90">
                    {destination.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `DestinationPlaceholder.tsx`**

This is the Phase 1 stub. Each destination (except home) shows a small card with its label and a note that content lands in a later phase.

Create `src/features/scene/overlays/DestinationPlaceholder.tsx`:

```tsx
import type { Destination } from "../types";

interface DestinationPlaceholderProps {
  destination: Destination;
}

export default function DestinationPlaceholder({ destination }: DestinationPlaceholderProps) {
  return (
    <div className="pointer-events-none absolute bottom-8 left-1/2 w-[min(90vw,28rem)] -translate-x-1/2">
      <div className="pointer-events-auto rounded-2xl border border-white/15 bg-slate-950/70 px-6 py-5 backdrop-blur-xl">
        <p
          className="text-[11px] uppercase tracking-[0.35em]"
          style={{ color: destination.accent }}
        >
          {destination.caption}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          {destination.label}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          {destination.description}
        </p>
        <p className="mt-3 text-[11px] uppercase tracking-[0.28em] text-slate-500">
          Content arriving in a later phase.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `TransitionOverlay.tsx`**

A lightweight accent vignette that fades in for the first ~400ms of a transition and out when the camera arrives. Phase 1 uses a simple CSS fade driven by a `phase` prop.

Create `src/features/scene/overlays/TransitionOverlay.tsx`:

```tsx
import type { Destination } from "../types";

interface TransitionOverlayProps {
  destination: Destination | null;
  isFlying: boolean;
}

export default function TransitionOverlay({
  destination,
  isFlying,
}: TransitionOverlayProps) {
  const accent = destination?.accent ?? "#7acfff";
  const opacity = isFlying ? 1 : 0;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-40 transition-opacity duration-500"
      style={{
        opacity,
        background: `radial-gradient(circle at center, ${accent}22 0%, rgba(2,6,17,0) 60%)`,
      }}
    />
  );
}
```

- [ ] **Step 5: Create `SceneCanvas.tsx`**

```tsx
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useNavigate } from "react-router-dom";
import SceneContent from "./SceneContent";
import HomeHUD from "./overlays/HomeHUD";
import LoadingOverlay from "./overlays/LoadingOverlay";
import DestinationPlaceholder from "./overlays/DestinationPlaceholder";
import TransitionOverlay from "./overlays/TransitionOverlay";
import BackToStation from "../../components/ui/BackToStation";
import { useDestinationFromRoute } from "./hooks/useDestinationFromRoute";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { useBackToHome } from "./hooks/useBackToHome";
import type { Destination, DestinationId } from "./types";
import { getDestinationById, HOME_DESTINATION_ID } from "./config";

export default function SceneCanvas() {
  const navigate = useNavigate();
  const activeDestination = useDestinationFromRoute();
  const reducedMotion = useReducedMotion();

  const [hoveredId, setHoveredId] = useState<DestinationId | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isFlying, setIsFlying] = useState(false);
  const prevDestinationRef = useRef<DestinationId>(activeDestination);

  // Trigger a short "flying" flag whenever the active destination changes.
  // The CameraRig does the actual tween; this flag drives the overlay fade.
  useEffect(() => {
    if (prevDestinationRef.current === activeDestination) return;
    prevDestinationRef.current = activeDestination;
    setIsFlying(true);
    const duration = reducedMotion ? 250 : 1600;
    const timer = window.setTimeout(() => setIsFlying(false), duration);
    return () => window.clearTimeout(timer);
  }, [activeDestination, reducedMotion]);

  // Lock pointer cursor when hovering a scene object at home.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const showPointer = hoveredId !== null && activeDestination === HOME_DESTINATION_ID;
    document.body.style.cursor = showPointer ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hoveredId, activeDestination]);

  // Mouse parallax tracking.
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -((event.clientY / window.innerHeight) * 2 - 1),
      });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useBackToHome({ activeDestination });

  const handleSelect = useCallback(
    (destination: Destination) => {
      setHoveredId(null);
      navigate(destination.route);
    },
    [navigate],
  );

  const handleHoverChange = useCallback((id: DestinationId | null) => {
    setHoveredId(id);
  }, []);

  const handleCanvasPointerMissed = useCallback(() => {
    if (activeDestination !== HOME_DESTINATION_ID) {
      navigate("/");
    }
  }, [activeDestination, navigate]);

  const activeDestinationObj = getDestinationById(activeDestination);
  const isHome = activeDestination === HOME_DESTINATION_ID;

  return (
    <div className="fixed inset-0 bg-[#020611] text-white">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.9, 8.8], fov: 38, near: 0.1, far: 250 }}
        onPointerMissed={handleCanvasPointerMissed}
      >
        <Suspense fallback={null}>
          <SceneContent
            activeDestination={activeDestination}
            hoveredId={hoveredId}
            reducedMotion={reducedMotion}
            mousePosition={mousePosition}
            onHoverChange={handleHoverChange}
            onSelect={handleSelect}
          />
        </Suspense>
      </Canvas>

      <LoadingOverlay />
      <HomeHUD hoveredId={hoveredId} isVisible={isHome} onSelect={handleSelect} />
      {!isHome && activeDestinationObj && (
        <DestinationPlaceholder destination={activeDestinationObj} />
      )}
      {!isHome && <BackToStation />}
      <TransitionOverlay destination={activeDestinationObj ?? null} isFlying={isFlying} />
    </div>
  );
}
```

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors. `BackToStation` already exists at `src/components/ui/BackToStation.tsx` (navigates to `/`), so it's reused as-is.

- [ ] **Step 7: Commit**

```bash
git add src/features/scene/SceneCanvas.tsx src/features/scene/overlays/
git commit -m "feat(scene): add SceneCanvas with overlays and URL-driven state"
```

---

## Task 15: Mobile shell (`MobileHome`, `MobileLayout`)

On small touch devices, skip the 3D canvas entirely. Render a conventional layout with a hero + four nav cards for home, and wrap the existing content pages with a mobile nav.

**Files:**
- Create: `src/pages/mobile/MobileHome.tsx`
- Create: `src/pages/mobile/MobileLayout.tsx`

- [ ] **Step 1: Create `MobileLayout.tsx`**

```tsx
import { Link, Outlet } from "react-router-dom";
import { DESTINATIONS } from "../../features/scene/config";

const navDestinations = DESTINATIONS.filter((d) => d.id !== "home");

export default function MobileLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#020611] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-screen-sm items-center justify-between px-4 py-3">
          <Link to="/" className="text-xs uppercase tracking-[0.3em] text-sky-200">
            Command Deck
          </Link>
          <div className="flex gap-3 text-[10px] uppercase tracking-[0.28em] text-slate-300">
            {navDestinations.map((d) => (
              <Link key={d.id} to={d.route} className="hover:text-white">
                {d.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-screen-sm flex-1 px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Create `MobileHome.tsx`**

```tsx
import { Link } from "react-router-dom";
import { personal } from "../../data/personal";
import { DESTINATIONS } from "../../features/scene/config";

const navDestinations = DESTINATIONS.filter((d) => d.id !== "home");

export default function MobileHome() {
  return (
    <div className="flex flex-col gap-8">
      <section className="pt-6">
        <p className="text-xs uppercase tracking-[0.32em] text-sky-200/80">
          Command Deck
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
          {personal.name}
        </h1>
        <p className="mt-3 text-sm uppercase tracking-[0.22em] text-sky-100/70">
          {personal.tagline}
        </p>
        <p className="mt-5 text-sm leading-7 text-slate-300">{personal.about}</p>
        <p className="mt-3 text-sm leading-7 text-slate-300">{personal.athletics}</p>
      </section>

      <section className="grid gap-3">
        {navDestinations.map((d) => (
          <Link
            key={d.id}
            to={d.route}
            className="group rounded-xl border border-white/10 bg-slate-950/60 p-5 transition-colors hover:border-white/25 hover:bg-slate-900/70"
          >
            <div className="flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: d.accent,
                  boxShadow: `0 0 14px ${d.accent}`,
                }}
              />
              <span className="text-xs uppercase tracking-[0.3em] text-white/90">
                {d.label}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-400">{d.description}</p>
            <span className="mt-4 inline-block text-xs text-slate-500 group-hover:text-slate-200">
              &rarr;
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/mobile/
git commit -m "feat(mobile): add MobileHome and MobileLayout for small touch devices"
```

---

## Task 16: Refactor `App.tsx` to persistent scene + mobile switch

`App.tsx` becomes the branching point: admin routes, mobile fallback, or the persistent `SceneCanvas` + destination routes. The desktop route tree mounts `SceneCanvas` once at the layout level and defines the routes for URL-driven behavior — but the route components themselves render `null` because the scene renders their content via the overlays in `SceneCanvas`. On mobile, the scene never mounts and routes render conventional pages.

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Replace `src/App.tsx`**

```tsx
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import SceneCanvas from "./features/scene/SceneCanvas";
import { useMobileFallback } from "./features/scene/hooks/useMobileFallback";
import MobileLayout from "./pages/mobile/MobileLayout";
import MobileHome from "./pages/mobile/MobileHome";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import Gallery from "./pages/Gallery";

const Map = lazy(() => import("./pages/Map"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminExperience = lazy(() => import("./pages/admin/AdminExperience"));
const AdminTravel = lazy(() => import("./pages/admin/AdminTravel"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery"));

function AdminRoutes() {
  return (
    <AuthProvider>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/experience" element={<AdminExperience />} />
            <Route path="/admin/trips" element={<AdminTravel />} />
            <Route path="/admin/gallery" element={<AdminGallery />} />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

function MobileRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<MobileLayout />}>
          <Route path="/" element={<MobileHome />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/map" element={<Map />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

/**
 * Desktop scene shell. SceneCanvas is mounted once and reads the route itself
 * via useDestinationFromRoute. The <Routes> block exists so route changes
 * register with react-router (the back button works, useLocation fires), but
 * each Route renders `null` because SceneCanvas owns the rendering.
 */
function SceneRoutes() {
  return (
    <>
      <SceneCanvas />
      <Routes>
        <Route path="/" element={null} />
        <Route path="/experience" element={null} />
        <Route path="/projects" element={null} />
        <Route path="/gallery" element={null} />
        <Route path="/map" element={null} />
      </Routes>
    </>
  );
}

function AppLayout() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  const isMobile = useMobileFallback();

  if (isAdmin) {
    return <AdminRoutes />;
  }

  if (isMobile) {
    return <MobileRoutes />;
  }

  return <SceneRoutes />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Start dev server and confirm it mounts**

Run: `npm run dev`
Open `http://localhost:5173/` in a desktop browser.
Expected:
- The 3D scene renders with Earth, Rocket, Satellite, Moon visible.
- The Home HUD overlay shows "Command Deck" and your name.
- Hovering an object highlights it.
- Clicking an object changes the URL (e.g. `/projects`) without a page reload, the cockpit dims, and the `DestinationPlaceholder` overlay appears.
- The back-to-station button and Escape key both return you to `/`.

Stop the dev server once confirmed.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: mount persistent SceneCanvas with mobile/admin branching"
```

---

## Task 17: Delete old folders

The old `home-scene/` feature folder and the parallel `solar-system/` folder are no longer referenced.

**Files:**
- Delete: `src/features/home-scene/` (entire tree)
- Delete: `src/features/solar-system/` (entire tree)

- [ ] **Step 1: Verify nothing imports from the old folders**

Run:
```bash
grep -rn "features/home-scene" src/ || echo "no references"
grep -rn "features/solar-system" src/ || echo "no references"
```
Expected: `no references` for both. If anything still imports from those paths, update the import to the new `features/scene` equivalent before deleting.

- [ ] **Step 2: Delete the folders**

```bash
rm -rf src/features/home-scene
rm -rf src/features/solar-system
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Run tests**

Run: `npm run test:run`
Expected: all previously passing tests still pass.

- [ ] **Step 5: Build to confirm production bundling**

Run: `npm run build`
Expected: a successful build (the Vite build pipeline tree-shakes any stragglers and fails on missing imports).

- [ ] **Step 6: Commit**

```bash
git add -A src/features/home-scene src/features/solar-system
git commit -m "chore: remove legacy home-scene and solar-system folders"
```

---

## Task 18: Manual verification checklist

Phase 1 foundation doesn't ship new destination content, but the architecture it sets up has visible behaviors that can only be verified in a real browser. Work through this checklist end-to-end. Any item that fails blocks the phase from shipping.

**Files:**
- None (verification only)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Open: `http://localhost:5173/`

- [ ] **Step 2: Home orbit view**

Confirm at `/`:
- 3D scene loads without errors in the browser console.
- Starfield, nebula, asteroids, and shooting stars are all visible.
- Cockpit shell (hull, buttons, screens, light strips) is visible at full intensity.
- All four celestial objects are visible (Earth, Rocket, Satellite, Moon).
- Mouse movement produces a gentle parallax on the camera look-at.
- Home HUD shows "Command Deck", your name, tagline, and four destination pills.
- Hovering a pill or an object highlights the object in the scene (ring, glow).
- Number keys 1–4 do NOT navigate in Phase 1 (removed; keyboard nav was part of the old code — re-adding is a Phase 6 polish).
- **Keyboard parity:** press Tab to focus the first destination pill, Tab through all four, press Enter on one, and confirm navigation fires. This is how keyboard users reach destinations in Phase 1 (per the accessibility scope note above).

- [ ] **Step 3: Navigate to each destination**

For each of `/map`, `/projects`, `/experience`, `/gallery`:
- Click the corresponding object or pill.
- Confirm the URL updates in the address bar.
- Confirm the camera tweens to a new pose (about 1.4 seconds).
- Confirm the cockpit emissive lighting visibly dims (~15%).
- Confirm a `DestinationPlaceholder` card appears at the bottom with the destination label, caption, description, and "Content arriving in a later phase."
- Confirm the back-to-station button appears (bottom-right).
- Confirm the accent-colored transition overlay fades in briefly during the fly-in.

- [ ] **Step 4: Return to home — all three mechanisms**

From a destination, verify each of these returns you to `/`:
1. **Back-to-station button** — click it. Camera flies back, cockpit brightens.
2. **Escape key** — press Esc. Same behavior.
3. **Click empty space** — click on the canvas background, away from any object. Same behavior.

Also confirm **browser back button** returns you to the previous route.

- [ ] **Step 5: Deep-link behavior**

- Open a new browser tab directly at `http://localhost:5173/projects`.
- Expected: the scene loads with the camera already near the rocket (no initial home fly-through).
- Refresh the page while at `/experience` and confirm it still loads directly at the satellite pose.

- [ ] **Step 6: Mid-flight interruption**

- At `/`, click Earth (start the fly-in to `/map`).
- Before the camera arrives, click Rocket.
- Expected: the camera smoothly redirects to the rocket target. No visible jump or queueing.

- [ ] **Step 7: Reduced motion**

- In OS settings (macOS: System Settings → Accessibility → Display → Reduce Motion), enable Reduce Motion.
- Reload the page.
- Navigate between destinations.
- Expected: transitions are much shorter (~200ms, essentially instantaneous).
- Turn Reduce Motion back off.

- [ ] **Step 8: Mobile fallback**

- Open the dev server URL in a mobile browser emulator (Chrome DevTools → Toggle device toolbar → iPhone 14).
- Expected: NO 3D canvas. A conventional layout with the Command Deck hero and four nav cards.
- Tap a nav card (e.g. Projects).
- Expected: the conventional Projects page renders inside the MobileLayout.
- Tap "Command Deck" in the nav to return home.

- [ ] **Step 9: Admin unchanged**

- Navigate to `http://localhost:5173/admin`.
- Expected: the admin login page renders exactly as before, with no 3D scene in the background. Log in flow and admin pages work unchanged.

- [ ] **Step 10: Production build**

- Stop the dev server. Run `npm run build`.
- Run `npm run preview` and re-verify steps 2–4 quickly in preview mode. This catches production-only issues (Suspense boundaries, lazy imports, asset paths).

- [ ] **Step 11: Run all unit tests once more**

Run: `npm run test:run`
Expected: all tests pass.

- [ ] **Step 12: Commit the verification checklist as completed**

```bash
git commit --allow-empty -m "test: phase 1 manual verification checklist complete"
```

---

## Phase 1 done

At this point:
- The persistent scene architecture is in place.
- URL↔camera sync works.
- Cockpit dim-on-dive works.
- Back navigation works three ways.
- Mobile fallback works.
- The old `home-scene/` and `solar-system/` code is gone.
- Unit tests cover the pure/logic parts of the foundation.

Phase 2 (Earth → Map, the hero payoff) gets its own brainstorm and plan on top of this foundation.
