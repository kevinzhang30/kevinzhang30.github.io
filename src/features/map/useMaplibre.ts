import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import {
  CARTO_POSITRON_NO_LABELS,
  INITIAL_CENTER,
  INITIAL_ZOOM,
} from "./constants";

export function useMaplibre(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const instance = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          "carto-nolabels": {
            type: "raster",
            tiles: [CARTO_POSITRON_NO_LABELS],
            tileSize: 256,
            attribution:
              '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
          },
        },
        layers: [
          {
            id: "carto-base",
            type: "raster",
            source: "carto-nolabels",
            minzoom: 0,
            maxzoom: 20,
          },
        ],
      },
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      dragRotate: false,
      touchPitch: false,
      pitchWithRotate: false,
    });

    instance.on("load", () => {
      mapRef.current = instance;
      setMap(instance);
    });

    return () => {
      instance.remove();
      mapRef.current = null;
    };
  }, [containerRef]);

  return map;
}
