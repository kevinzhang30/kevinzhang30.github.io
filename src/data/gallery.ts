export interface Photo {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  date: string;
  tags: string[];
  category: string;
}

export const photos: Photo[] = [
  {
    id: 1,
    title: "Spider-Verse 67",
    description: "I just came to my senses.",
    imageUrl: "/images/spiderverse67.jpeg",
    location: "New York City, NY",
    date: "2025-08-22",
    tags: ["city", "nighttime"],
    category: "urban",
  },
  {
    id: 2,
    title: "Banquet Speaker",
    description: "LSC 2024 Awards Banquet.",
    imageUrl: "/images/banquetspeaker.jpg",
    location: "Toronto, ON",
    date: "2024-10-14",
    tags: ["nighttime", "community"],
    category: "experience",
  },
  {
    id: 3,
    title: "Beach Soccer",
    description: "Soccer, mon.",
    imageUrl: "/images/soccer.jpg",
    location: "Fort Clarence Beach, Jamaica",
    date: "2024-01-04",
    tags: ["soccer", "nature", "beach"],
    category: "adventure",
  },
  {
    id: 4,
    title: "Me and the Chad",
    description: "On the podium with Chad Le Clos.",
    imageUrl: "/images/meandthechad.jpg",
    location: "Luxembourg City, Luxembourg",
    date: "2024-01-26",
    tags: ["swimming", "racing", "experience"],
    category: "experience",
  },
  {
    id: 5,
    title: "Biking + Don's",
    description: "Luxembourg is fire.",
    imageUrl: "/images/bikinghaul.jpg",
    location: "Luxembourg City, Luxembourg",
    date: "2024-01-28",
    tags: ["nature", "urban", "biking", "food"],
    category: "adventure",
  },
  {
    id: 6,
    title: "Behind the Blocks",
    description: "WJ 200 fly prelim.",
    imageUrl: "/images/worldjrbhb.jpg",
    location: "Netanya, Israel",
    date: "2023-09-09",
    tags: ["swimming", "racing", "national team"],
    category: "experience",
  },
  {
    id: 7,
    title: "Cheers",
    description: "Free champagne.",
    imageUrl: "/images/gatsby.jpg",
    location: "Celebrity Silhouette",
    date: "2024-12-24",
    tags: ["cruise", "travel", "show"],
    category: "adventure",
  },
  {
    id: 8,
    title: "Scenic Route",
    description: "Walking back from practice in Spain.",
    imageUrl: "/images/sabadell.jpg",
    location: "Sabadell, Spain",
    date: "2023-08-31",
    tags: ["nature", "swimming", "national team"],
    category: "experience",
  },
  {
    id: 9,
    title: "Breathe",
    description: "OUA Champs race.",
    imageUrl: "/images/breathe2.jpg",
    location: "Markham, ON",
    date: "2023-02-07",
    tags: ["swimming", "racing", "school"],
    category: "experience",
  },
  {
    id: 10,
    title: "The Spins",
    description: "I just graduated high school.",
    imageUrl: "/images/Graduation.jpg",
    location: "Mississauga, ON",
    date: "2023-06-29",
    tags: ["school", "milestone"],
    category: "experience",
  },
];

export const galleryCategories = [
  { key: "all", label: "All Photos" },
  { key: "nature", label: "Nature" },
  { key: "adventure", label: "Adventure" },
  { key: "urban", label: "Urban" },
  { key: "experience", label: "Experience" },
] as const;
