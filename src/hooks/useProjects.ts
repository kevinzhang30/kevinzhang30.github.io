import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { projects as fallback, type Project } from "../data/projects";
import { mapProject, type ProjectRow } from "../types/database";

export function useProjects() {
  const [data, setData] = useState<Project[]>(fallback);
  const [loading, setLoading] = useState(!!supabase);

  useEffect(() => {
    if (!supabase) return;

    supabase
      .from("projects")
      .select("*")
      .order("sort_order")
      .then(({ data: rows, error }) => {
        if (!error && rows && rows.length > 0) {
          setData((rows as ProjectRow[]).map(mapProject));
        }
        setLoading(false);
      });
  }, []);

  return { projects: data, loading };
}
