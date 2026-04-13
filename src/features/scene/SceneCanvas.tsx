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
  const [isFlying, setIsFlying] = useState(false);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const prevDestinationRef = useRef<DestinationId>(activeDestination);

  useEffect(() => {
    if (prevDestinationRef.current === activeDestination) return;
    prevDestinationRef.current = activeDestination;
    setIsFlying(true);
    const duration = reducedMotion ? 250 : 1600;
    const timer = window.setTimeout(() => setIsFlying(false), duration);
    return () => window.clearTimeout(timer);
  }, [activeDestination, reducedMotion]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const showPointer = hoveredId !== null && activeDestination === HOME_DESTINATION_ID;
    document.body.style.cursor = showPointer ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hoveredId, activeDestination]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePositionRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePositionRef.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
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
            mousePositionRef={mousePositionRef}
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
