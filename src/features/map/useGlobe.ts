import { useCallback, useEffect, useRef, useState } from "react";
import type { GlobeMethods } from "react-globe.gl";
import {
  GLOBE_INITIAL_POV,
  VISITED_POLYGON_COLOR,
  HOVER_POLYGON_COLOR,
  GLOBE_CLICK_ALTITUDE,
} from "./constants";

interface GeoFeature {
  type: string;
  properties: { ISO_A3: string; NAME: string };
  geometry: { type: string; coordinates: unknown };
}

function getCentroid(geometry: { type: string; coordinates: unknown }): {
  lat: number;
  lng: number;
} {
  const coords: number[][] = [];

  function collect(c: unknown) {
    if (
      Array.isArray(c) &&
      c.length >= 2 &&
      typeof c[0] === "number" &&
      typeof c[1] === "number"
    ) {
      coords.push(c as number[]);
    } else if (Array.isArray(c)) {
      c.forEach(collect);
    }
  }

  if ("coordinates" in geometry) {
    collect(geometry.coordinates);
  }

  if (coords.length === 0) return { lat: 0, lng: 0 };

  let minLng = Infinity,
    minLat = Infinity,
    maxLng = -Infinity,
    maxLat = -Infinity;
  for (const [lng, lat] of coords) {
    if (lng < minLng) minLng = lng;
    if (lat < minLat) minLat = lat;
    if (lng > maxLng) maxLng = lng;
    if (lat > maxLat) maxLat = lat;
  }

  return { lat: (minLat + maxLat) / 2, lng: (minLng + maxLng) / 2 };
}

export function useGlobe(
  visitedCountryCodes: Set<string>,
  onSelect: (code: string | null) => void,
) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const hoveredRef = useRef<GeoFeature | null>(null);
  const [polygonsData, setPolygonsData] = useState<GeoFeature[]>([]);

  // Fetch GeoJSON features, filtered to visited only
  useEffect(() => {
    fetch(import.meta.env.BASE_URL + "geo/countries.geojson")
      .then((r) => r.json())
      .then((geojson: { features: GeoFeature[] }) => {
        const visited = geojson.features.filter((f) =>
          visitedCountryCodes.has(f.properties.ISO_A3),
        );
        setPolygonsData(visited);
      });
  }, [visitedCountryCodes]);

  const polygonCapColor = useCallback(
    (d: object) => {
      const feat = d as GeoFeature;
      return feat === hoveredRef.current
        ? HOVER_POLYGON_COLOR + "cc"
        : VISITED_POLYGON_COLOR + "bf"; // bf ≈ 0.75 opacity
    },
    [],
  );

  const polygonSideColor = useCallback(() => VISITED_POLYGON_COLOR + "40", []);

  const polygonAltitude = useCallback(
    (d: object) => (d === hoveredRef.current ? 0.015 : 0.01),
    [],
  );

  const onPolygonHover = useCallback(
    (polygon: object | null) => {
      hoveredRef.current = polygon as GeoFeature | null;

      const el = globeRef.current
        ?.renderer()
        ?.domElement;
      if (el) {
        el.style.cursor = polygon ? "pointer" : "";
      }

      // Pause auto-rotate on hover, resume when un-hovered
      const controls = globeRef.current?.controls();
      if (controls) {
        controls.autoRotate = !polygon;
      }
    },
    [],
  );

  const onPolygonClick = useCallback(
    (polygon: object) => {
      const feat = polygon as GeoFeature;
      const code = feat.properties.ISO_A3;
      const { lat, lng } = getCentroid(feat.geometry);

      // Desktop offset: shift lng so country sits left-of-center behind drawer
      const isDesktop = window.innerWidth >= 768;
      const adjustedLng = isDesktop ? lng - 15 : lng;

      globeRef.current?.pointOfView(
        { lat, lng: adjustedLng, altitude: GLOBE_CLICK_ALTITUDE },
        800,
      );

      // Pause auto-rotate during focus
      const controls = globeRef.current?.controls();
      if (controls) controls.autoRotate = false;

      setTimeout(() => onSelect(code), 400);
    },
    [onSelect],
  );

  const resetView = useCallback(() => {
    globeRef.current?.pointOfView(GLOBE_INITIAL_POV, 800);

    // Resume auto-rotate after the animation completes
    setTimeout(() => {
      const controls = globeRef.current?.controls();
      if (controls) controls.autoRotate = true;
    }, 800);
  }, []);

  return {
    globeRef,
    polygonsData,
    polygonCapColor,
    polygonSideColor,
    polygonAltitude,
    onPolygonHover,
    onPolygonClick,
    resetView,
  };
}
