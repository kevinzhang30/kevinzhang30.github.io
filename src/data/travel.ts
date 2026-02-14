import type { TravelDataMap } from "../features/map/types";

export const travelData: TravelDataMap = {
  LUX: {
    countryName: "Luxembourg",
    visits: [
      {
        id: "luxembourg-2024",
        city: "Luxembourg City",
        dateRange: "Jan 2024",
        purpose: "Swimming Competition",
        category: "sports",
        description:
          "Competed in the 2024 Euro Meet in Luxembourg City. Placed 3rd in the 200m butterfly.",
        highlights: ["Public Transportation", "Biking", "McDonalds", "Castles"],
      },
    ],
  },
  JAM: {
    countryName: "Jamaica",
    visits: [
      {
        id: "jamaica-2024",
        city: "Kingston",
        dateRange: "Dec 2023 - Jan 2024",
        purpose: "University Training Camp",
        category: "education",
        description: "Varsity Swim Team Training Camp",
        highlights: [
          "Jamaican Patties",
          "Soccer on the Beach",
          "Brawl Stars on the Bus",
        ],
      },
    ],
  },
  CHL: {
    countryName: "Chile",
    visits: [
      {
        id: "santiago-2023",
        city: "Santiago",
        dateRange: "Nov 2023",
        purpose: "Swimming Competition",
        category: "sports",
        description:
          "Competed in the 2023 Pan American Games in Santiago, Chile. Placed 5th in the 200m butterfly.",
        highlights: ["Lulu Merch", "Brawl Stars", "Part I wasn't Sick"],
      },
    ],
  },
  ISR: {
    countryName: "Israel",
    visits: [
      {
        id: "netanya-2023",
        city: "Netanya",
        dateRange: "Sept 2023",
        purpose: "Swimming Competition",
        category: "sports",
        description:
          "Competed in the 2023 World Junior Swimming Championships in Netanya, Israel. Placed 7th in the 200m butterfly.",
        highlights: ["Racing", "Chinese Team", "Hotel", "Shabbat"],
      },
    ],
  },
  ESP: {
    countryName: "Spain",
    visits: [
      {
        id: "barcelona-2023",
        city: "Barcelona",
        dateRange: "Aug 2023",
        purpose: "Staging Camp",
        category: "sports",
        description: "World Junior Championship staging camp.",
        highlights: ["Exploring", "Training", "Geometry Dash", "Teammates"],
      },
    ],
  },
};

export const visitedCountryCodes = new Set(Object.keys(travelData));
