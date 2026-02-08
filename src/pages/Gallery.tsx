import { useState, useEffect } from "react";
import PageShell from "../components/layout/PageShell";
import PhotoLightbox from "../components/features/PhotoLightbox";
import { photos, galleryCategories, type Photo } from "../data/gallery";
import { cn } from "../lib/cn";

export default function Gallery() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<Photo | null>(null);

  // Close lightbox on Escape
  useEffect(() => {
    if (!selected) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [selected]);

  const filtered = photos.filter((p) => {
    const matchesSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory =
      category === "all" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageShell>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Gallery
      </h1>
      <p className="mt-1 text-gray-500">Photos &amp; moments.</p>

      {/* Search + filters */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search photos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-primary-300 focus:ring-2 focus:ring-primary-100 sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {galleryCategories.map((cat) => (
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

      {/* Photo grid */}
      <div className="mt-8 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((photo) => (
          <button
            key={photo.id}
            onClick={() => setSelected(photo)}
            className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
          >
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/50 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-sm font-medium text-white">
                {photo.title}
              </span>
              <span className="text-xs text-white/70">{photo.location}</span>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-sm text-gray-400">
          No photos match your search.
        </p>
      )}

      {/* Lightbox */}
      {selected && (
        <PhotoLightbox photo={selected} onClose={() => setSelected(null)} />
      )}
    </PageShell>
  );
}
