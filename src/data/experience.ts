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
    company: "StackAdapt",
    role: "Software Engineering Intern - Developer Ecosystem (APIs) Team",
    startDate: "Jan 2026",
    endDate: "Aug 2026",
    description:
      "",
    technologies: ["Ruby on Rails", "GraphQL", "React"],
    type: "work",
  },
  {
    company: "University of Waterloo",
    role: "Instructional Support Assistant - CS 136(L)",
    startDate: "Jan 2025",
    endDate: "Apr 2025",
    description:
      "",
    technologies: ["Bash", "C", "Linux"],
    type: "work",
  },{
    company: "WonSign Technologies Inc.",
    role: "Technical Marketing Specialist",
    startDate: "May 2024",
    endDate: "Aug 2024",
    description:
      "",
    technologies: ["Typescript", "Figma", "React"],
    type: "work",
  },
  {
    company: "University of Waterloo",
    role: "Computer Science",
    startDate: "Sep 2023",
    endDate: "Apr 2028",
    description:
      "Bachelor of Computer Science + Co-op",
    technologies: ["Algorithms", "Data Structures", "Operating Systems"],
    type: "education",
  },
];
