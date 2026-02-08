export interface SkillCategory {
  label: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    label: "Languages",
    skills: ["C/C++", "Python", "Java", "Kotlin", "JavaScript", "TypeScript", "Ruby"],
  },
  {
    label: "Web",
    skills: ["HTML", "CSS", "React", "Spring Boot", "Rails"],
  },
  {
    label: "Data & Cloud",
    skills: ["SQL", "MySQL", "Firebase", "AWS"],
  },
  {
    label: "Tools",
    skills: ["Git", "GitLab", "Linux", "Bash", "Figma"],
  },
];
