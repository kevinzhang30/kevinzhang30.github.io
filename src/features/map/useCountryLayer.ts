import { useEffect } from "react";
import type maplibregl from "maplibre-gl";
import {
  CARTO_POSITRON_LABELS,
  VISITED_FILL_COLOR,
  VISITED_FILL_OPACITY,
  VISITED_BORDER_COLOR,
  VISITED_BORDER_WIDTH,
} from "./constants";

export function useCountryLayer(
  map: maplibregl.Map | null,
  visitedCountryCodes: Set<string>,
) {
  useEffect(() => {
    if (!map) return;

    const codes = Array.from(visitedCountryCodes);

    fetch(import.meta.env.BASE_URL + "geo/countries.geojson")
      .then((r) => r.json())
      .then((geojson) => {
        // Bail if map was removed while fetching
        if (!map.getCanvas()) return;

        map.addSource("countries", {
          type: "geojson",
          data: geojson,
          promoteId: "ISO_A3",
        });

        // Visited country fill
        map.addLayer({
          id: "country-fill",
          type: "fill",
          source: "countries",
          paint: {
            "fill-color": VISITED_FILL_COLOR,
            "fill-opacity": [
              "case",
              ["in", ["get", "ISO_A3"], ["literal", codes]],
              VISITED_FILL_OPACITY,
              0,
            ],
          },
        });

        // Border for visited countries
        map.addLayer({
          id: "country-border",
          type: "line",
          source: "countries",
          paint: {
            "line-color": VISITED_BORDER_COLOR,
            "line-width": [
              "case",
              ["in", ["get", "ISO_A3"], ["literal", codes]],
              VISITED_BORDER_WIDTH,
              0,
            ],
          },
        });

        // Hover highlight layer (controlled via feature-state)
        map.addLayer({
          id: "country-fill-hover",
          type: "fill",
          source: "countries",
          paint: {
            "fill-color": VISITED_FILL_COLOR,
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              0.2,
              0,
            ],
          },
        });

        // Labels on top of everything
        map.addSource("carto-labels", {
          type: "raster",
          tiles: [CARTO_POSITRON_LABELS],
          tileSize: 256,
        });
        map.addLayer({
          id: "carto-labels-layer",
          type: "raster",
          source: "carto-labels",
          minzoom: 0,
          maxzoom: 20,
        });
      });
  }, [map, visitedCountryCodes]);
}
