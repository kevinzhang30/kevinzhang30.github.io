# Scene Polish: Asteroid Upgrade + Shuttle Booster

## Goal

The cinematic home scene is "growing on us" but two details clash with the polished GLB models:

1. The asteroid field reads as muddy grey-brown and low-poly, undercutting the sci-fi tone.
2. The shuttle has a point light at the nozzle but no visible plume — it looks inert for a vehicle supposedly in flight.

This spec covers targeted polish on both. No scene composition, camera, or interaction changes.

## Scope

- `src/features/scene/effects/AsteroidField.tsx` — material and geometry upgrade
- `src/features/scene/objects/Rocket.tsx` — add a booster plume

Out of scope: nebula, starfield, shooting stars, lighting rig, any other object.

## Asteroid Field Upgrade

Current: 200 instanced `icosahedronGeometry(1, 0)` (20 faces) with `flatShading`, color `#3a3530`, roughness 0.92, metalness 0.08.

Changes:
- Geometry detail `0` → `2` (smooth-looking silhouette at the camera distances used, still cheap).
- Remove `flatShading`.
- Palette shift to cool slate-blue: base color `#3a4558`, bump metalness to `~0.35`, keep roughness high (`~0.78`) so they don't look chromed.
- Add a subtle emissive `#1a2438` at low intensity so the darker ones aren't pitch black against the nebula.

Instance count stays at 200. Positions, scales, rotation animation all unchanged — this is purely a material/geometry swap.

## Shuttle Booster Plume

Add a plume mesh child to the rocket group, positioned at the nozzle (same area as the existing `pointLight` at `[0, -1.6, -1.2]`).

Structure:
- A `coneGeometry` oriented point-down-the-exhaust, additive-blended, transparent, `depthWrite: false`.
- Material uses a soft radial gradient texture generated in code (same pattern as `NebulaBackdrop`'s `createNebulaTexture`) — bright core fading to transparent edge. Core color matches the existing engine light (`#58b7ff`).
- Per-frame animation in the existing `useFrame`: pulse scale on Y (length) and opacity with a high-frequency sine so it flickers like a live exhaust. Slight x/z scale jitter for liveliness.
- On hover/active, plume length and opacity scale up in lockstep with the existing `baseScale` logic — same feedback channel as the ring and engine light.
- Boost the existing `pointLight` intensity baseline slightly so the plume actually reads as emitting light onto nearby geometry.

Optional small glow sprite at the nozzle base (additive billboard) if the cone alone looks thin — decide visually at implementation time, not a required deliverable.

## Non-Goals

- No particle system (overkill for a constantly-visible idle shuttle; cone + pulse reads fine at this scale).
- No change to rocket GLB or its positioning.
- No new post-processing passes. The existing Bloom will pick up the additive plume for free.

## Verification

Manual: run `npm run dev`, open `/`, confirm:
- Asteroids look like smooth rocks in a cool palette, not brown low-poly chunks.
- Shuttle has a visible, flickering blue plume at the nozzle.
- Plume grows when hovering the shuttle and when shuttle is the active destination.
- No FPS regression (200 instances unchanged, one extra mesh on the rocket).
- No console errors.
