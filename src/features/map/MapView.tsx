import { useCallback, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMaplibre } from "./useMaplibre";
import { useCountryLayer } from "./useCountryLayer";
import { useCountryClick } from "./useCountryClick";
import { useTravel } from "../../hooks/useTravel";
import { INITIAL_CENTER, INITIAL_ZOOM } from "./constants";
import CountryDrawer from "./CountryDrawer";
import MapBackButton from "./MapBackButton";

export default function MapView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const { travelData, visitedCountryCodes } = useTravel();

  const map = useMaplibre(containerRef);
  useCountryLayer(map, visitedCountryCodes);

  const onSelect = useCallback((code: string | null) => {
    setSelectedCountry(code);
  }, []);

  useCountryClick(map, onSelect, visitedCountryCodes);

  const total = 195;
  const visited = visitedCountryCodes.size;
  const pct = Math.round((visited / total) * 100);

  return (
    <div className="fixed inset-0">
      <div ref={containerRef} className="h-full w-full" />
      <MapBackButton />
      <div className="fixed top-4 right-4 z-50 overflow-hidden rounded-full bg-white shadow-lg">
        <div
          className="absolute inset-0 bg-primary-500/20"
          style={{ width: `${pct}%` }}
        />
        <div className="relative px-4 py-2">
          <span className="text-sm font-semibold text-gray-900">
            {visited}/{total} countries
          </span>
          <span className="ml-1.5 text-sm text-gray-500">({pct}%)</span>
        </div>
      </div>
      <CountryDrawer
        selectedCode={selectedCountry}
        onClose={() => {
          setSelectedCountry(null);
          map?.flyTo({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM, duration: 1000 });
        }}
        travelData={travelData}
      />
    </div>
  );
}
