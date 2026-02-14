export interface TravelVisit {
  id: string;
  city: string;
  dateRange: string;
  purpose: string;
  category: string;
  description: string;
  highlights: string[];
  imageUrl?: string;
}

export interface CountryTravelData {
  countryName: string;
  visits: TravelVisit[];
}

/** Record keyed by ISO alpha-3 country code */
export type TravelDataMap = Record<string, CountryTravelData>;
