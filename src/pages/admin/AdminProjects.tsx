import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "../../lib/supabase";
import type { ProjectRow } from "../../types/database";

const emptyForm: Omit<ProjectRow, "id"> = {
  title: "",
  description: "",
  technologies: [],
  github_url: "",
  live_url: null,
  featured: false,
  category: "web",
  sort_order: 0,
};

const categories: ProjectRow["category"][] = ["web", "mobile", "systems", "other"];

export default function AdminProjects() {
  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [editing, setEditing] = useState<ProjectRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!supabase) return;
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order");
    if (data) setRows(data as ProjectRow[]);
  }

  useEffect(() => {
    load();
  }, []);

  function openEdit(row: ProjectRow) {
    setEditing(row);
    setForm({
      title: row.title,
      description: row.description,
      technologies: row.technologies,
      github_url: row.github_url,
      live_url: row.live_url,
      featured: row.featured,
      category: row.category,
      sort_order: row.sort_order,
    });
    setTechInput(row.technologies.join(", "));
    setShowForm(true);
  }

  function openNew() {
    setEditing(null);
    setForm({ ...emptyForm, sort_order: 0 });
    setTechInput("");
    setShowForm(true);
  }

  function closeForm() {
    setEditing(null);
    setForm(emptyForm);
    setTechInput("");
    setShowForm(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);

    const payload = {
      ...form,
      technologies: techInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (editing) {
      await supabase.from("projects").update(payload).eq("id", editing.id);
    } else {
      const { data: existing } = await supabase
        .from("projects")
        .select("id, sort_order")
        .gte("sort_order", payload.sort_order)
        .order("sort_order", { ascending: false });
      if (existing) {
        for (const row of existing) {
          await supabase
            .from("projects")
            .update({ sort_order: row.sort_order + 1 })
            .eq("id", row.id);
        }
      }
      await supabase.from("projects").insert(payload);
    }

    setSaving(false);
    closeForm();
    load();
  }

  async function handleDelete(id: string) {
    if (!supabase || !confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Projects</h1>
        <button
          onClick={openNew}
          className="rounded-lg bg-primary-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          + Add
        </button>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {row.title}
                {row.featured && (
                  <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[0.65rem] font-medium text-amber-700">
                    featured
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-500">
                {row.category} &middot; {row.technologies.slice(0, 3).join(", ")}
                {row.technologies.length > 3 ? "…" : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(row)}
                className="rounded px-2 py-1 text-xs text-primary-600 hover:bg-primary-50"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(row.id)}
                className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 rounded-xl border border-gray-200 bg-white p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            {editing ? "Edit Project" : "New Project"}
          </h2>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Technologies (comma-separated)
            </label>
            <input
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="React, TypeScript, Node.js"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                GitHub URL
              </label>
              <input
                required
                type="url"
                value={form.github_url}
                onChange={(e) =>
                  setForm({ ...form, github_url: e.target.value })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Live URL
              </label>
              <input
                type="url"
                placeholder="Optional"
                value={form.live_url ?? ""}
                onChange={(e) =>
                  setForm({ ...form, live_url: e.target.value || null })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category
            </label>
            <div className="flex flex-wrap gap-4">
              {categories.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={form.category === cat}
                    onChange={() => setForm({ ...form, category: cat })}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm({ ...form, featured: e.target.checked })
                }
              />
              Featured
            </label>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Sort Order
              </label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) =>
                  setForm({ ...form, sort_order: Number(e.target.value) })
                }
                className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50"
            >
              {saving ? "Saving..." : editing ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
