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

  return (
    <div className="fixed inset-0">
      <div ref={containerRef} className="h-full w-full" />
      <MapBackButton />
      <CountryDrawer
        selectedCode={selectedCountry}
        onClose={() => setSelectedCountry(null)}
        travelData={travelData}
      />
    </div>
  );
}
