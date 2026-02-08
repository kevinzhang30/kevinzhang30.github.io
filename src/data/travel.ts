export interface TravelVisit {
  id: string;
  dateRange: string;
  purpose: string;
  category: string;
  description: string;
  highlights: string[];
}

export interface TravelLocation {
  id: number;
  city: string;
  country: string;
  countryCode: string;
  coordinates: [number, number];
  visits: TravelVisit[];
}

export const locations: TravelLocation[] = [
  {
    id: 1,
    city: "Luxembourg City",
    country: "Luxembourg",
    countryCode: "LU",
    coordinates: [49.6117, 6.1319],
    visits: [
      {
        id: "luxembourg-2024",
        dateRange: "Jan 2024",
        purpose: "Swimming Competition",
        category: "sports",
        description:
          "Competed in the 2024 Euro Meet in Luxembourg City. Placed 3rd in the 200m butterfly.",
        highlights: ["Public Transportation", "Biking", "McDonalds", "Castles"],
      },
    ],
  },
  {
    id: 2,
    city: "Kingston",
    country: "Jamaica",
    countryCode: "JM",
    coordinates: [18.0, -76.8],
    visits: [
      {
        id: "jamaica-2024",
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
  {
    id: 3,
    city: "Santiago",
    country: "Chile",
    countryCode: "CL",
    coordinates: [-33.4569, -70.6483],
    visits: [
      {
        id: "santiago-2023",
        dateRange: "Nov 2023",
        purpose: "Swimming Competition",
        category: "sports",
        description:
          "Competed in the 2023 Pan American Games in Santiago, Chile. Placed 5th in the 200m butterfly.",
        highlights: ["Lulu Merch", "Brawl Stars", "Part I wasn't Sick"],
      },
    ],
  },
  {
    id: 4,
    city: "Netanya",
    country: "Israel",
    countryCode: "IL",
    coordinates: [32.0563, 34.8516],
    visits: [
      {
        id: "netanya-2023",
        dateRange: "Sept 2023",
        purpose: "Swimming Competition",
        category: "sports",
        description:
          "Competed in the 2023 World Junior Swimming Championships in Netanya, Israel. Placed 7th in the 200m butterfly.",
        highlights: ["Racing", "Chinese Team", "Hotel", "Shabbat"],
      },
    ],
  },
  {
    id: 5,
    city: "Barcelona",
    country: "Spain",
    countryCode: "ES",
    coordinates: [41.3851, 2.1734],
    visits: [
      {
        id: "barcelona-2023",
        dateRange: "Aug 2023",
        purpose: "Staging Camp",
        category: "sports",
        description: "World Junior Championship staging camp.",
        highlights: ["Exploring", "Training", "Geometry Dash", "Teammates"],
      },
    ],
  },
];

export const travelCategories = [
  { key: "all", label: "All Visits", color: "#00838f" },
  { key: "education", label: "Education", color: "#00838f" },
  { key: "leisure", label: "Leisure", color: "#00838f" },
  { key: "sports", label: "Sports", color: "#00838f" },
  { key: "business", label: "Business", color: "#00838f" },
] as const;
