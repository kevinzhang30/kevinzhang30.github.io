import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import {
  FIT_BOUNDS_PADDING_DESKTOP,
  FIT_BOUNDS_PADDING_MOBILE,
} from "./constants";

function getBoundsFromGeometry(
  geometry: maplibregl.GeoJSONFeature["geometry"],
): maplibregl.LngLatBoundsLike {
  const coords: number[][] = [];

  function collect(c: unknown) {
    if (typeof (c as number[])[0] === "number") {
      coords.push(c as number[]);
    } else {
      (c as unknown[]).forEach(collect);
    }
  }

  if ("coordinates" in geometry) {
    collect(geometry.coordinates);
  }

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

  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
}

export function useCountryClick(
  map: maplibregl.Map | null,
  onSelect: (code: string | null) => void,
  visitedCountryCodes: Set<string>,
) {
  const hoveredRef = useRef<string | null>(null);

  useEffect(() => {
    if (!map) return;

    function isMobile() {
      return window.innerWidth < 768;
    }

    function onMouseMove(e: maplibregl.MapMouseEvent) {
      if (!map) return;
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["country-fill"],
      });

      const code = features[0]?.properties?.ISO_A3 as string | undefined;
      const isVisited = code ? visitedCountryCodes.has(code) : false;

      // Update cursor
      map.getCanvas().style.cursor = isVisited ? "pointer" : "";

      // Update hover state
      if (hoveredRef.current && hoveredRef.current !== code) {
        map.setFeatureState(
          { source: "countries", id: hoveredRef.current },
          { hover: false },
        );
        hoveredRef.current = null;
      }

      if (isVisited && code && code !== hoveredRef.current) {
        map.setFeatureState(
          { source: "countries", id: code },
          { hover: true },
        );
        hoveredRef.current = code;
      }
    }

    function onMouseLeave() {
      if (!map) return;
      if (hoveredRef.current) {
        map.setFeatureState(
          { source: "countries", id: hoveredRef.current },
          { hover: false },
        );
        hoveredRef.current = null;
      }
      map.getCanvas().style.cursor = "";
    }

    function onClick(e: maplibregl.MapMouseEvent) {
      if (!map) return;
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["country-fill"],
      });

      const feature = features[0];
      const code = feature?.properties?.ISO_A3 as string | undefined;

      if (code && visitedCountryCodes.has(code) && feature.geometry) {
        onSelect(code);
        const bounds = getBoundsFromGeometry(feature.geometry);
        const padding = isMobile()
          ? FIT_BOUNDS_PADDING_MOBILE
          : FIT_BOUNDS_PADDING_DESKTOP;
        map.fitBounds(bounds, { padding, maxZoom: 7, duration: 1000 });
      } else {
        onSelect(null);
      }
    }

    map.on("mousemove", "country-fill", onMouseMove);
    map.on("mouseleave", "country-fill", onMouseLeave);
    map.on("click", onClick);

    return () => {
      map.off("mousemove", "country-fill", onMouseMove);
      map.off("mouseleave", "country-fill", onMouseLeave);
      map.off("click", onClick);
    };
  }, [map, onSelect, visitedCountryCodes]);
}
