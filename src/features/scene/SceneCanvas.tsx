import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";
import SceneContent from "./SceneContent";
import Dashboard from "./overlays/Dashboard";
import LoadingOverlay from "./overlays/LoadingOverlay";
import TransitionOverlay from "./overlays/TransitionOverlay";
import { useDestinationFromRoute } from "./hooks/useDestinationFromRoute";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { useBackToHome } from "./hooks/useBackToHome";
import { usePanelVisibility } from "./panelVisibility";
import type { Destination, DestinationId } from "./types";
import { getDestinationById, HOME_DESTINATION_ID } from "./config";

export default function SceneCanvas() {
  const navigate = useNavigate();
  const activeDestination = useDestinationFromRoute();
  const reducedMotion = useReducedMotion();
  const { hidden: panelHidden } = usePanelVisibility();

  const [hoveredId, setHoveredId] = useState<DestinationId | null>(null);
  const [isFlying, setIsFlying] = useState(false);
  const [portalZooming, setPortalZooming] = useState(false);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const satelliteWorldRef = useRef(new THREE.Vector3());
  const rocketWorldRef = useRef(new THREE.Vector3());
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
      if (destination.id === "earth") {
        setPortalZooming(true);
        setIsFlying(true);
        window.setTimeout(() => navigate(destination.route), 900);
        return;
      }
      navigate(destination.route);
    },
    [navigate],
  );

  const handleHoverChange = useCallback((id: DestinationId | null) => {
    setHoveredId(id);
  }, []);

  const activeDestinationObj = getDestinationById(activeDestination);
  const isHome = activeDestination === HOME_DESTINATION_ID;

  return (
    <div
      className="fixed inset-0 text-white"
      style={{
        backgroundColor: "#020611",
        backgroundImage: "url(backgrounds/background3.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.9, 8.8], fov: 38, near: 0.1, far: 250 }}
      >
        <Suspense fallback={null}>
          <SceneContent
            activeDestination={activeDestination}
            hoveredId={hoveredId}
            suppressGlow={panelHidden}
            portalZooming={portalZooming}
            reducedMotion={reducedMotion}
            mousePositionRef={mousePositionRef}
            satelliteWorldRef={satelliteWorldRef}
            rocketWorldRef={rocketWorldRef}
            onHoverChange={handleHoverChange}
            onSelect={handleSelect}
          />
        </Suspense>
      </Canvas>

      <LoadingOverlay />
      <Dashboard
        hoveredId={hoveredId}
        isVisible={isHome}
        onHoverChange={handleHoverChange}
        onSelect={handleSelect}
      />
      <TransitionOverlay destination={activeDestinationObj ?? null} isFlying={isFlying} />
    </div>
  );
}
