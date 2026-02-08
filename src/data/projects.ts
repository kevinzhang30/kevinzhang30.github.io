export interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
  category: "web" | "mobile" | "systems" | "other";
}

export const projects: Project[] = [
  {
    title: "ClinicMS",
    description:
      "A full stack healthcare management web application using Spring Boot, JWT, Maven, React, JavaScript, and Axios. Features comprehensive patient management, appointment scheduling, and healthcare provider workflows.",
    technologies: ["Spring Boot", "JWT", "Maven", "React", "JavaScript", "Axios"],
    githubUrl: "https://github.com/kevinzhang30/clinicms",
    featured: true,
    category: "web",
  },
  {
    title: "TripWise",
    description:
      "An Android app that allows you to easily manage expenses on vacation using Kotlin, Gradle, Firebase, and Google Maps API. Features expense tracking, location-based spending insights, and travel budget management.",
    technologies: ["Kotlin", "Gradle", "Firebase", "Google Maps API", "Android"],
    githubUrl: "https://github.com/kevinzhang30/tripwise",
    featured: true,
    category: "mobile",
  },
  {
    title: "CC3K",
    description:
      "A command-line dungeon crawler game highlighting principles of object-oriented programming using C++. Features procedural generation, combat mechanics, and demonstrates advanced OOP concepts like inheritance and polymorphism.",
    technologies: ["C++", "OOP", "Command Line"],
    githubUrl: "https://github.com/kevinzhang30/cc3k",
    featured: true,
    category: "systems",
  },
];
