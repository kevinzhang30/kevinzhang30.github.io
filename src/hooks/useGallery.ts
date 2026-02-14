import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { photos as fallback, type Photo } from "../data/gallery";
import { mapPhoto, type PhotoRow } from "../types/database";

export function useGallery() {
  const [data, setData] = useState<Photo[]>(fallback);
  const [loading, setLoading] = useState(!!supabase);

  useEffect(() => {
    if (!supabase) return;

    supabase
      .from("photos")
      .select("*")
      .order("sort_order")
      .then(({ data: rows, error }) => {
        if (!error && rows && rows.length > 0) {
          setData((rows as PhotoRow[]).map(mapPhoto));
        }
        setLoading(false);
      });
  }, []);

  return { photos: data, loading };
}
