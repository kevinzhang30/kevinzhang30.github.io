import type { Experience } from "../data/experience";
import type { Photo } from "../data/gallery";
import type { TravelVisit, CountryTravelData, TravelDataMap } from "../features/map/types";

// ── DB row types (snake_case, matching Supabase tables) ────────────

export interface ExperienceRow {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string;
  technologies: string[];
  type: "work" | "education";
  sort_order: number;
}

export interface CountryRow {
  code: string;
  country_name: string;
}

export interface VisitRow {
  id: string;
  country_code: string;
  city: string;
  date_range: string;
  purpose: string;
  category: string;
  description: string;
  highlights: string[];
  image_url: string | null;
  sort_order: number;
}

export interface PhotoRow {
  id: number;
  title: string;
  description: string;
  image_url: string;
  location: string;
  date: string;
  tags: string[];
  category: string;
  sort_order: number;
}

// ── Mapper functions (DB rows → app interfaces) ────────────

export function mapExperience(row: ExperienceRow): Experience {
  return {
    company: row.company,
    role: row.role,
    startDate: row.start_date,
    endDate: row.end_date ?? undefined,
    description: row.description,
    technologies: row.technologies,
    type: row.type,
  };
}

export function mapPhoto(row: PhotoRow): Photo {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    location: row.location,
    date: row.date,
    tags: row.tags,
    category: row.category,
  };
}

export function mapVisit(row: VisitRow): TravelVisit {
  return {
    id: row.id,
    city: row.city,
    dateRange: row.date_range,
    purpose: row.purpose,
    category: row.category,
    description: row.description,
    highlights: row.highlights,
    imageUrl: row.image_url ?? undefined,
  };
}

export function mapTravelData(
  countries: CountryRow[],
  visits: VisitRow[],
): { travelData: TravelDataMap; visitedCountryCodes: Set<string> } {
  const travelData: TravelDataMap = {};

  for (const country of countries) {
    const countryVisits = visits
      .filter((v) => v.country_code === country.code)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(mapVisit);

    const entry: CountryTravelData = {
      countryName: country.country_name,
      visits: countryVisits,
    };
    travelData[country.code] = entry;
  }

  return {
    travelData,
    visitedCountryCodes: new Set(countries.map((c) => c.code)),
  };
}
