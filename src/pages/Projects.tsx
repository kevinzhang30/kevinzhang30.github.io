import { useState } from "react";
import PageShell from "../components/layout/PageShell";
import ProjectCard from "../components/features/ProjectCard";
import { projects } from "../data/projects";
import { cn } from "../lib/cn";

const categories = [
  { key: "all", label: "All" },
  { key: "web", label: "Web" },
  { key: "mobile", label: "Mobile" },
  { key: "systems", label: "Systems" },
] as const;

export default function Projects() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = projects.filter((p) => {
    const matchesSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.technologies.some((t) =>
        t.toLowerCase().includes(search.toLowerCase()),
      );
    const matchesCategory = category === "all" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageShell>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Projects
      </h1>
      <p className="mt-1 text-gray-500">Things I&rsquo;ve built.</p>

      {/* Search + filters */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-primary-300 focus:ring-2 focus:ring-primary-100 sm:max-w-xs"
        />
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                category === cat.key
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Project grid */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-sm text-gray-400">
          No projects match your search.
        </p>
      )}
    </PageShell>
  );
}
