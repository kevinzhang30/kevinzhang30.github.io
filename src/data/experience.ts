export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies: string[];
  type: "work" | "education";
}

export const experiences: Experience[] = [
  {
    company: "University of Waterloo",
    role: "Instructional Support Assistant",
    startDate: "Jan 2025",
    endDate: "Apr 2025",
    description:
      "Technical guidance for 120+ students in Bash, C, and coding principles.",
    technologies: ["Bash", "C", "Linux"],
    type: "work",
  },
  {
    company: "University of Waterloo & Wilfrid Laurier University",
    role: "BCS Computer Science & BBA Business Administration",
    startDate: "Sep 2023",
    endDate: "Apr 2028",
    description:
      "Double degree program in Computer Science and Business Administration.",
    technologies: [],
    type: "education",
  },
];
