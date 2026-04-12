import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useNavigate } from "react-router-dom";
import SceneRoot from "./scene/SceneRoot";
import {
  DEFAULT_CAMERA_POSITION,
  SCENE_OBJECTS,
  type SceneObjectId,
} from "./scene/config";
import HomeOverlay from "./overlays/HomeOverlay";
import LoadingOverlay from "./overlays/LoadingOverlay";

const TRANSITION_DURATION_MS = 1450;

const KEY_MAP: Record<string, SceneObjectId> = {
  "1": "earth",
  "2": "rocket",
  "3": "satellite",
  "4": "moon",
};

export default function HomeScenePage() {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<SceneObjectId | null>(null);
  const [focusedId, setFocusedId] = useState<SceneObjectId | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);
  const [exitAccent, setExitAccent] = useState<string | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    document.body.style.backgroundColor = "#020611";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.cursor = hoveredId && !isTransitioning ? "pointer" : "default";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hoveredId, isTransitioning]);

  // Detect touch device
  useEffect(() => {
    const onTouch = () => {
      setIsTouch(true);
      window.removeEventListener("touchstart", onTouch);
    };
    window.addEventListener("touchstart", onTouch, { passive: true });
    return () => window.removeEventListener("touchstart", onTouch);
  }, []);

  // Mouse parallax tracking
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isTouch) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isTouch]);

  const handleSelect = useCallback(
    (id: SceneObjectId) => {
      if (isTransitioning) return;

      const target = SCENE_OBJECTS.find((item) => item.id === id);
      if (!target) return;

      setHoveredId(null);
      setFocusedId(id);
      setIsTransitioning(true);

      // Start exit accent overlay after a delay
      setTimeout(() => {
        setExitAccent(target.accent);
      }, TRANSITION_DURATION_MS - 400);

      window.setTimeout(() => {
        navigate(target.route);
      }, TRANSITION_DURATION_MS);
    },
    [isTransitioning, navigate],
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;

      const objectId = KEY_MAP[e.key];
      if (objectId) {
        handleSelect(objectId);
        return;
      }

      if (e.key === "Escape" && focusedId) {
        setFocusedId(null);
        setHoveredId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTransitioning, focusedId, handleSelect]);

  return (
    <main ref={containerRef} className="relative min-h-screen overflow-hidden bg-[#020611] text-white">
      <div className="absolute inset-0">
        <Canvas
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          camera={{ position: DEFAULT_CAMERA_POSITION, fov: 38, near: 0.1, far: 250 }}
        >
          <Suspense fallback={null}>
            <SceneRoot
              hoveredId={hoveredId}
              focusedId={focusedId}
              isTransitioning={isTransitioning}
              onHoverChange={(id) => {
                if (!isTransitioning) {
                  setHoveredId(id);
                }
              }}
              onSelect={handleSelect}
              mousePosition={mousePosition}
            />
          </Suspense>
        </Canvas>
      </div>

      <LoadingOverlay />

      <HomeOverlay
        hoveredId={hoveredId}
        focusedId={focusedId}
        isTransitioning={isTransitioning}
        onSelect={handleSelect}
        isTouch={isTouch}
      />

      {/* Exit transition overlay */}
      <div
        className={`pointer-events-none absolute inset-0 z-40 transition-opacity duration-400 ${
          exitAccent ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: exitAccent
            ? `radial-gradient(circle at center, ${exitAccent}33 0%, #020611 70%)`
            : undefined,
        }}
      />
    </main>
  );
}
