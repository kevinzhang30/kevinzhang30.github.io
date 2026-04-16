import { useState } from "react";
import BackToDashboard from "../components/ui/BackToDashboard";
import SpacePageShell from "../components/ui/SpacePageShell";
import SpaceCard from "../components/ui/SpaceCard";
import SpaceTag from "../components/ui/SpaceTag";
import { useProjects } from "../hooks/useProjects";
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
  const { projects } = useProjects();

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
  <>
    <SpacePageShell>
      <h1 className="font-mono text-3xl font-bold tracking-tight text-white">
        Projects
      </h1>
      <p className="mt-1 text-gray-400">Things I&rsquo;ve built.</p>

      {/* Search + filters */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-teal-500/20 bg-gray-800/60 px-4 py-2 text-sm text-gray-200 placeholder:text-gray-500 outline-none transition-colors focus:border-teal-400/50 focus:shadow-[0_0_10px_rgba(0,131,143,0.15)] sm:max-w-xs"
        />
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                category === cat.key
                  ? "bg-teal-500/20 text-teal-400 shadow-[0_0_8px_rgba(0,131,143,0.3)]"
                  : "bg-gray-800/60 text-teal-500/70 hover:bg-gray-700/60",
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
          <SpaceCard key={project.title} className="relative">
            <h3 className="text-base font-semibold text-white">
              {project.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">
              {project.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <SpaceTag key={tech} label={tech} />
              ))}
            </div>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 transition-colors hover:text-teal-400"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Source
              </a>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 transition-colors hover:text-teal-400"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                  Live Demo
                </a>
              )}
            </div>
          </SpaceCard>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-sm text-gray-500">
          No projects match your search.
        </p>
      )}
    </SpacePageShell>
    <BackToDashboard />
  </>
  );
}
