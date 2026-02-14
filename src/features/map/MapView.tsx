import { useCallback, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMaplibre } from "./useMaplibre";
import { useCountryLayer } from "./useCountryLayer";
import { useCountryClick } from "./useCountryClick";
import { useTravel } from "../../hooks/useTravel";
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
      <div className="fixed top-4 right-4 z-20 rounded-full bg-white/80 px-4 py-2 shadow-lg backdrop-blur-sm">
        <span className="text-sm font-semibold text-gray-900">
          {visited}/{total} countries
        </span>
        <span className="ml-1.5 text-sm text-gray-500">({pct}%)</span>
      </div>
      <CountryDrawer
        selectedCode={selectedCountry}
        onClose={() => setSelectedCountry(null)}
        travelData={travelData}
      />
    </div>
  );
}
