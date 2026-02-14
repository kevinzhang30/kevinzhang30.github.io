import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  travelData as fallbackData,
  visitedCountryCodes as fallbackCodes,
} from "../data/travel";
import { mapTravelData, type CountryRow, type VisitRow } from "../types/database";
import type { TravelDataMap } from "../features/map/types";

export function useTravel() {
  const [travelData, setTravelData] = useState<TravelDataMap>(fallbackData);
  const [visitedCountryCodes, setVisitedCountryCodes] =
    useState<Set<string>>(fallbackCodes);
  const [loading, setLoading] = useState(!!supabase);

  useEffect(() => {
    if (!supabase) return;

    Promise.all([
      supabase.from("countries").select("*"),
      supabase.from("visits").select("*").order("sort_order"),
    ]).then(([countriesRes, visitsRes]) => {
      if (
        !countriesRes.error &&
        !visitsRes.error &&
        countriesRes.data &&
        countriesRes.data.length > 0
      ) {
        const result = mapTravelData(
          countriesRes.data as CountryRow[],
          (visitsRes.data ?? []) as VisitRow[],
        );
        setTravelData(result.travelData);
        setVisitedCountryCodes(result.visitedCountryCodes);
      }
      setLoading(false);
    });
  }, []);

  return { travelData, visitedCountryCodes, loading };
}
