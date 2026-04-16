import { useCallback, useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import type { GlobeMethods } from "react-globe.gl";
import * as THREE from "three";
import {
  GLOBE_INITIAL_POV,
  GLOBE_IMAGE_URL,
  ATMOSPHERE_ALTITUDE,
  GLOBE_AUTO_ROTATE_SPEED,
} from "./constants";
import { addStarField } from "./starField";

const ATMOSPHERE_TINT = "#0b5a66";
const ATMOSPHERE_HEIGHT = ATMOSPHERE_ALTITUDE * 0.72;
const HALO_TINT = "#17889a";
const HALO_INTENSITY = 0.28;

interface GeoFeature {
  type: string;
  properties: { ISO_A3: string; NAME: string };
  geometry: { type: string; coordinates: unknown };
}

interface Props {
  globeRef: React.MutableRefObject<GlobeMethods | undefined>;
  polygonsData: GeoFeature[];
  polygonCapColor: (d: object) => string;
  polygonSideColor: (d: object) => string;
  polygonAltitude: (d: object) => number;
  onPolygonHover: (polygon: object | null, prev: object | null) => void;
  onPolygonClick: (polygon: object, event: MouseEvent) => void;
}

export default function GlobeScene({
  globeRef,
  polygonsData,
  polygonCapColor,
  polygonSideColor,
  polygonAltitude,
  onPolygonHover,
  onPolygonClick,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const starsAddedRef = useRef(false);

  // Resize observer to keep globe dimensions in sync
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const obs = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setDimensions({ width, height });
    });
    obs.observe(el);

    // Set initial dimensions
    setDimensions({ width: el.clientWidth, height: el.clientHeight });

    return () => obs.disconnect();
  }, []);

  const onGlobeReady = useCallback(() => {
    const globe = globeRef.current;
    if (!globe) return;

    // Set initial point of view
    globe.pointOfView(GLOBE_INITIAL_POV, 0);

    // Configure orbit controls
    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = GLOBE_AUTO_ROTATE_SPEED;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.minDistance = 150;
    controls.maxDistance = 500;

    // Add star field
    if (!starsAddedRef.current) {
      addStarField(globe.scene());

      // Fresnel glow halo — bright at limb, invisible at center
      const glowGeo = new THREE.SphereGeometry(107, 64, 64);
      const glowMat = new THREE.ShaderMaterial({
        uniforms: {
          glowColor: { value: new THREE.Color(HALO_TINT) },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vWorldPos;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 glowColor;
          varying vec3 vNormal;
          varying vec3 vWorldPos;
          void main() {
            float fresnel = 1.0 - abs(dot(normalize(cameraPosition - vWorldPos), vNormal));
            float intensity = pow(fresnel, 1.35) * ${HALO_INTENSITY.toFixed(2)};
            gl_FragColor = vec4(glowColor, intensity);
          }
        `,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      });
      globe.scene().add(new THREE.Mesh(glowGeo, glowMat));

      starsAddedRef.current = true;
    }
  }, [globeRef]);

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black">
      {dimensions.width > 0 && (
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl={GLOBE_IMAGE_URL}
          showAtmosphere={true}
          atmosphereColor={ATMOSPHERE_TINT}
          atmosphereAltitude={ATMOSPHERE_HEIGHT}
          polygonsData={polygonsData}
          polygonGeoJsonGeometry="geometry"
          polygonCapColor={polygonCapColor}
          polygonSideColor={polygonSideColor}
          polygonAltitude={polygonAltitude}
          polygonStrokeColor={() => ATMOSPHERE_TINT}
          polygonsTransitionDuration={300}
          onPolygonHover={onPolygonHover}
          onPolygonClick={onPolygonClick}
          onGlobeReady={onGlobeReady}
        />
      )}
    </div>
  );
}
