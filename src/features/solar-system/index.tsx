import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SolarSystemScene } from "./SolarSystemScene";
import type { CelestialObject } from "./objects/CelestialObject";
import Labels from "./ui/Labels";
import BackToStation from "./ui/BackToStation";
import LoadingScreen from "./ui/LoadingScreen";

const CONTENT_ROUTES = ["/experience", "/projects", "/gallery"];

interface SolarSystemProps {
  children?: React.ReactNode;
}

export default function SolarSystem({ children }: SolarSystemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SolarSystemScene | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [hoverDescription, setHoverDescription] = useState<string | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const isContentPage = CONTENT_ROUTES.includes(location.pathname);

  // Initialize scene
  useEffect(() => {
    if (!containerRef.current || sceneRef.current) return;

    const scene = new SolarSystemScene(containerRef.current);
    sceneRef.current = scene;

    scene.setOnReady(() => {
      setLoading(false);
    });

    scene.setOnHover((obj, screenPos) => {
      if (obj) {
        setHoverLabel(obj.navTarget.label);
        setHoverDescription(obj.navTarget.description);
        setHoverPos(screenPos);
      } else {
        setHoverLabel(null);
        setHoverDescription(null);
        setHoverPos(null);
      }
    });

    scene.setOnClick((obj: CelestialObject) => {
      setHoverLabel(null);
      setHoverPos(null);

      const route = obj.navTarget.route;

      scene.flyToObject(obj, () => {
        navigate(route);
      });
    });

    return () => {
      scene.dispose();
      sceneRef.current = null;
    };
  }, [navigate]);

  // Handle overlay visibility and throttling based on route
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (isContentPage) {
      setShowOverlay(true);
      scene.setThrottled(true);
    } else if (location.pathname === "/") {
      scene.setThrottled(false);
      setShowOverlay(false);
    }
  }, [location.pathname, isContentPage]);

  const handleBackToStation = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    setShowOverlay(false);
    scene.setThrottled(false);
    scene.returnToStation(() => {
      navigate("/");
    });
  }, [navigate]);

  return (
    <>
      {/* Three.js canvas container — always mounted */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-0"
        style={{ cursor: hoverLabel ? "pointer" : "default" }}
      />

      {/* Loading screen */}
      <LoadingScreen visible={loading} />

      {/* Hover labels */}
      <Labels label={hoverLabel} description={hoverDescription} position={hoverPos} />

      {/* Content overlay with page content */}
      {isContentPage && (
        <div
          className={`fixed inset-0 z-10 overflow-y-auto transition-opacity duration-500 ${
            showOverlay ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="min-h-screen bg-gray-950/95 relative">
            {/* Scan line overlay */}
            <div
              className="pointer-events-none absolute inset-0 z-0"
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,131,143,0.03) 2px, rgba(0,131,143,0.03) 4px)",
              }}
            />
            {/* Vignette */}
            <div
              className="pointer-events-none absolute inset-0 z-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
              }}
            />
            <BackToStation onClick={handleBackToStation} />
            <div className="pt-16 pb-12">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
