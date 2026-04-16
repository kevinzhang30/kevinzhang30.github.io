import { useCallback, useState } from "react";
import { useTravel } from "../../hooks/useTravel";
import { useGlobe } from "./useGlobe";
import GlobeScene from "./GlobeScene";
import CountryDrawer from "./CountryDrawer";
import BackToDashboard from "../../components/ui/BackToDashboard";

export default function MapView() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const { travelData, visitedCountryCodes } = useTravel();

  const onSelect = useCallback((code: string | null) => {
    setSelectedCountry(code);
  }, []);

  const {
    globeRef,
    polygonsData,
    polygonCapColor,
    polygonSideColor,
    polygonAltitude,
    onPolygonHover,
    onPolygonClick,
    resetView,
  } = useGlobe(visitedCountryCodes, onSelect);

  const total = 195;
  const visited = visitedCountryCodes.size;
  const pct = Math.round((visited / total) * 100);

  return (
    <>
      <GlobeScene
        globeRef={globeRef}
        polygonsData={polygonsData}
        polygonCapColor={polygonCapColor}
        polygonSideColor={polygonSideColor}
        polygonAltitude={polygonAltitude}
        onPolygonHover={onPolygonHover}
        onPolygonClick={onPolygonClick}
      />
      <BackToDashboard />
      <div className="fixed top-4 right-4 z-50 overflow-hidden rounded-full bg-gray-900 shadow-lg">
        <div
          className="absolute inset-0 bg-primary-500/30"
          style={{ width: `${pct}%` }}
        />
        <div className="relative px-4 py-2">
          <span className="text-sm font-semibold text-gray-100">
            {visited}/{total} countries
          </span>
          <span className="ml-1.5 text-sm text-gray-400">({pct}%)</span>
        </div>
      </div>
      <CountryDrawer
        selectedCode={selectedCountry}
        onClose={() => {
          setSelectedCountry(null);
          resetView();
        }}
        travelData={travelData}
      />
    </>
  );
}
