import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { experiences as fallback, type Experience } from "../data/experience";
import { mapExperience, type ExperienceRow } from "../types/database";

export function useExperiences() {
  const [data, setData] = useState<Experience[]>(fallback);
  const [loading, setLoading] = useState(!!supabase);

  useEffect(() => {
    if (!supabase) return;

    supabase
      .from("experiences")
      .select("*")
      .order("sort_order")
      .then(({ data: rows, error }) => {
        if (!error && rows && rows.length > 0) {
          setData((rows as ExperienceRow[]).map(mapExperience));
        }
        setLoading(false);
      });
  }, []);

  return { experiences: data, loading };
}
