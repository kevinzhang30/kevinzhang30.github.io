# Cinematic Scene Revamp — Design Spec

**Date:** 2026-04-12
**Status:** Approved design, pending implementation plan
**Branch:** `revamp`

## Context

The portfolio site currently has an in-progress space-themed revamp on the `revamp` branch. The home page renders a react-three-fiber scene (`src/features/home-scene/`) with Earth/Rocket/Satellite/Moon as clickable nav objects inside a cockpit frame. The sub-pages (Experience, Projects, Gallery, Map) are still plain light-Tailwind layouts — the space theme stops at the front door. A second, unused 3D attempt lives in `src/features/solar-system/` (vanilla three.js with a station interior and HUD).

The owner described the current state as "not going as envisioned." The vision he articulated: **something beautiful and cinematic, built around the Earth as a continuous world.** The three.js travel map he already built is the anchor — he wants the rest of the site to feel like it belongs to the same universe, not like a space-themed home page slapped onto conventional content pages.

## Goal

A single persistent 3D scene where navigation is a cinematic camera journey between destinations, each destination is rendered diegetically (in-world) in the form that best fits its content, and the existing Earth/travel map is the hero payoff — you start in far orbit, click Earth, and the camera flies in until the surface and travel pins fill the view.

**Non-goal:** Change any data, content, admin CMS behavior, or what information the site shows. This is a presentation and navigation revamp only.

## Design decisions

| Decision | Choice |
| --- | --- |
| Theme | Keep space/cockpit — vision is right, execution needs rework |
| Earth | Same Earth from home scene and from map — one continuous world, fly-in transition |
| Commitment level | Full — one persistent 3D scene, no page navigation, camera flies between destinations |
| Content presentation | Hybrid diegetic — each destination uses the most in-world treatment its content can sustain |
| Cockpit frame | Persistent but dims to ~15% at destinations (recedes on dive) |
| Back navigation | Button + Escape key + click-empty-space, all equivalent |
| URLs | Per-destination URLs retained (`/`, `/projects`, `/experience`, `/gallery`, `/map`) — URL drives camera state |
| Engine | react-three-fiber (build on `src/features/home-scene/`) |
| Parallel `solar-system/` code | Deleted; useful ideas cannibalized first |
| Mobile | Graceful fallback — small touchscreens never mount the canvas, get a clean minimal nav + existing `Space*` components |

## Architecture

### Persistent scene above the router outlet

```
<AppLayout>
  <SceneCanvas />          ← always mounted, full viewport, z-0
  <DestinationContent />   ← route-driven overlay, z-10
  <Chrome />               ← cockpit frame, back button, HUD edges, z-20
  <MobileFallback />       ← replaces all of the above on small touch devices
</AppLayout>
```

Navigating between routes does **not** unmount the 3D scene. Route changes trigger a camera fly-to animation; the scene stays live. Admin routes (`/admin/*`) bypass the scene entirely and keep their existing layout.

### Destination registry — single source of truth

```ts
type DestinationId = "home" | "earth" | "rocket" | "satellite" | "moon";

interface Destination {
  id: DestinationId;
  route: string;
  label: string;
  accent: string;
  cameraPosition: [number, number, number];  // where the camera sits when viewing this
  cameraLookAt: [number, number, number];
  objectPosition: [number, number, number];  // where the object lives in world space
}
```

Route-to-destination map:
- `/` → `home` (orbit overview)
- `/map` → `earth`
- `/projects` → `rocket`
- `/experience` → `satellite`
- `/gallery` → `moon`

### Route-driven camera

A `useDestinationFromRoute()` hook watches the router location and returns the active `DestinationId`. A scene-level effect subscribes to that value and triggers the camera animation. Clicking an object calls `navigate("/projects")` — it does **not** directly control the camera. This separation is what makes the scene URL-state-pure:

- Deep-linking works on first load: visiting `/projects` starts with the camera already at the rocket, no home fly-through.
- Browser back button works without extra code.
- The scene has no internal router-like state machine.

### Camera fly-to primitive

A single `useCameraFlyTo(target)` hook tweens camera position + lookAt over 1.2–1.6 seconds using ease-in-out cubic. Driven by r3f's `useFrame`, not CSS or framer-motion — the camera is a three.js object.

**Transition phases per navigation:**

1. **Announce** (0–100 ms). New destination arrives from route. Lock object interactions. Start dimming cockpit.
2. **Fly** (100–1400 ms). Camera tweens to target. Optional warp effect: chromatic aberration pulse + starfield smear along flight vector. Accent-color vignette fades in.
3. **Arrive** (1400–1600 ms). Camera settles. Cockpit stays at 15% intensity. Destination content fades in. Interactions unlock for destination sub-content.

**Return to home** uses the same primitive in reverse. Cockpit fades back to full intensity. Destination overlay fades out.

**Interruption:** Clicking another object mid-flight cancels the current tween and starts a new one from the current pose. No queuing.

**Deep-link behavior:** First load at `/projects` places the camera directly at the rocket's arrive pose — no disorienting "start at home and fly somewhere" on cold load.

**Cockpit dim system:** `CockpitGlass` and `CockpitShell` take an `intensity` prop (0–1). Home = 1.0, any destination = 0.15. Transitions tween it. No per-destination custom opacity logic.

**Parallax:** Mousemove parallax preserved from current `HomeScenePage` but scaled to ~0.2× when not at home — scene feels alive without the camera drifting off the focused object.

**`prefers-reduced-motion`:** When set, transitions drop to ~0.2s fades with no camera sweep. Warp effects disabled.

## Destination treatments

Each destination is its own mini-design. The hybrid approach: each one uses the most in-world presentation its content can actually sustain without becoming illegible.

### Earth → Map (Phase 2)

The distant Earth in the home scene becomes the close-up travel map on fly-in.

1. At arrive distance, swap the low-detail Earth material for the detailed one.
2. Fade in country fills, pins, and the visited-country counter.
3. The existing `/map` page goes away as a separate view — the Earth *is* the map.

**Deferred decision (Phase 2 planning):** Whether to rebuild the current Leaflet pins in three.js or embed Leaflet as a `drei/Html` overlay. Both are viable; decide based on the current map implementation.

### Moon → Gallery (Phase 3)

Fly-in lands the camera ~3 units from the moon.

- **Photo tiles orbit the moon** as flat planes with image textures, arranged on two concentric rings at different heights. ~15–25 photos loaded from existing gallery data.
- **Click a photo tile** → camera pushes in, tile scales up, caption fades in as diegetic text pinned to it.
- **Click empty space** → back to orbit-moon view.
- No panel UI. The photos are the UI.

### Rocket → Projects (Phase 4)

Fly-in docks the camera alongside the rocket, looking at the hull.

- **Each project is a labeled cargo crate** attached to the fuselage. ~10 crates for ~10 projects.
- **Click a crate** → camera focuses on it, and a small **cockpit console readout** slides in from the bottom-right cockpit edge. HTML overlay styled as an instrument panel (~320px wide, anchored to the cockpit, not a full-screen modal): project title, description, tags, links.
- **Click another crate** → console repopulates, camera slides to the new crate.

This is the only destination that intentionally uses a panel, because projects have unavoidable text and external links. The panel is small and cockpit-themed so it reads as part of the ship, not a conventional modal.

### Satellite → Experience (Phase 5)

Fly-in positions the camera looking at the satellite from the side.

- **Timeline entries are "comms transmissions"** rendered as a vertical HUD strip on the right side of the screen (cockpit-styled): monospaced date stamps + short role titles, each with a glowing LED indicator.
- **Click a transmission** → expands in place into a readable block with the full role description, styled as a decoded comms log (slight scanline effect, monospaced header, normal body text).
- Satellite rotates slowly in the background.
- One transmission open at a time; clicking another collapses the current.

### Home (always)

- Orbit overview. All four objects visible, cockpit at full intensity, parallax active.
- Hover an object → label + caption tooltip (keeps existing `ObjectTooltip.tsx`).
- Click an object → fly to that destination via route change.
- Number keys 1–4 select objects.

## Back navigation and controls

Three equivalent ways to return to home orbit:

1. **Back-to-station button** — uses existing `src/components/ui/BackToStation.tsx`, pinned top-left inside the cockpit frame. Visible at every destination, hidden at home. Click → `navigate("/")`.
2. **Escape key** — global keydown. Two-level: if a destination sub-selection is open (rocket crate focused, moon photo zoomed, transmission expanded), Escape collapses that first. Second Escape returns to home.
3. **Click empty space** — same two-level behavior as Escape.

Browser back button works for free via React Router.

**Keyboard shortcuts:**
- At home: `1`/`2`/`3`/`4` fly to Earth/Rocket/Satellite/Moon (existing pattern, kept).
- At a destination: `Esc` (two-level), arrow keys to cycle sub-selections on Rocket/Satellite (Phase 6 polish).

## Accessibility

- Every interactive 3D object has an invisible DOM focusable proxy (button positioned at the object's screen projection) so keyboard and screen-reader users can tab through.
- All text content (experience entries, project descriptions, captions) lives in the accessible DOM tree — `drei/Html` or plain overlays — not rendered as three.js text meshes.
- Mobile fallback is a fully conventional accessible site and is the a11y-first entry point regardless of device.
- `prefers-reduced-motion` honored throughout.

## Mobile fallback

- **Detection at mount:** `window.matchMedia('(pointer: coarse)').matches && window.innerWidth < 768`. If true, render `<MobileHome />` instead of the scene root. Canvas never mounts.
- **What mobile sees:**
  - Home (`/`): clean nav-card layout based on the current `src/pages/Home.tsx` (hero + four destination cards). Styled with a space-inspired aesthetic — dark background, subtle static starfield, destination accent colors — so it doesn't feel disconnected from the desktop experience.
  - Destinations: conventional pages using the existing `Space*` components (`SpacePageShell`, `SpaceCard`, `SpaceTag`, `SpaceSectionHeading`, `SpaceTimelineEntry`) already in `src/components/ui/`. These already exist and just need to be wired in.
  - `/map` on mobile renders the existing Leaflet map as a full-page view.
- **Resize handling:** Detection runs once at mount. Desktop users resizing a window below 768px do not get hot-swapped into the mobile view. Not worth the complexity.

## File layout after the revamp

```
src/
  features/
    scene/                           ← NEW, unified persistent scene
      SceneRoot.tsx                  (top-level r3f canvas + providers)
      config.ts                      (destination registry)
      hooks/
        useDestinationFromRoute.ts
        useCameraFlyTo.ts
      objects/                       (Earth, Rocket, Satellite, Moon)
      effects/                       (starfield, nebula, asteroids, shooting stars)
      cockpit/                       (CockpitShell, CockpitGlass, HUD edges, intensity prop)
      overlays/                      (BackToStation, tooltips, transition overlays)
      destinations/
        EarthDestination.tsx         (Phase 2)
        MoonDestination.tsx          (Phase 3)
        RocketDestination.tsx        (Phase 4)
        SatelliteDestination.tsx     (Phase 5)
    home-scene/                      ← DELETED at end of Phase 1
    solar-system/                    ← DELETED in Phase 1
  pages/
    mobile/
      MobileHome.tsx                 ← NEW
      (Experience, Projects, Gallery, Map reused for mobile via Space* components)
    admin/                           ← UNTOUCHED
  components/
    ui/                              ← Space* components kept for mobile reuse
```

The current `src/features/home-scene/` is not renamed in place — it's replaced by `src/features/scene/` with cleaner structure, and the old folder is deleted once the new one is feature-equivalent at the end of Phase 1.

## Phasing

Each phase is a shippable checkpoint. You can stop at any phase and still have something better than today.

- **Phase 1 — Foundation.** Scene moves to app root; URL↔camera sync; fly-to primitive; cockpit dim system; back-nav (button + Esc + click-outside); mobile detection + minimal fallback; delete `solar-system/`. Placeholder overlays at each destination (just the destination name). **Checkpoint:** site works, looks less impressive than today at destinations, but architecture is correct and the home orbit view is preserved.
- **Phase 2 — Earth → Map.** In-scene globe + travel data; `/map` becomes part of the home scene. **Checkpoint:** the hero moment works end-to-end, proving the whole concept.
- **Phase 3 — Moon → Gallery.** Orbiting photo tiles, click-to-zoom.
- **Phase 4 — Rocket → Projects.** Cargo crates + cockpit console readout.
- **Phase 5 — Satellite → Experience.** Comms-log HUD strip + expandable transmissions.
- **Phase 6 — Polish.** Warp transition effect, optional audio cues, perf tuning, `prefers-reduced-motion` verification, accessibility audit.

## Out of scope

- Admin CMS, auth, Supabase tables, admin UI — completely untouched.
- Data schemas in `src/data/` or `public/config/`.
- New content fields, new pages, or changes to what information is displayed.
- SEO/meta tags (handled separately if needed).
- Dark/light theme toggle — the site is committed to a dark space aesthetic.
- Desktop window resize → mobile fallback hot-swap.
- Adding or modifying any existing project, experience, gallery, or travel content.

## Open questions deferred to implementation planning

- **Phase 2:** Whether to rebuild Leaflet map pins in three.js or embed Leaflet as a `drei/Html` overlay. Depends on the current map implementation; resolve when writing the Phase 2 implementation plan.
- **Phase 4:** Exact anchoring and sizing of the cockpit console readout. Requires a prototype pass before locking dimensions.
- **Phase 6:** Whether the warp effect ships — optional polish that drops cleanly if it looks bad or hurts frame rate.
