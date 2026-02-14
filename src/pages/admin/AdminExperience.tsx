import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "../../lib/supabase";
import type { ExperienceRow } from "../../types/database";

const emptyForm: Omit<ExperienceRow, "id"> = {
  company: "",
  role: "",
  start_date: "",
  end_date: null,
  description: "",
  technologies: [],
  type: "work",
  sort_order: 0,
};

export default function AdminExperience() {
  const [rows, setRows] = useState<ExperienceRow[]>([]);
  const [editing, setEditing] = useState<ExperienceRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!supabase) return;
    const { data } = await supabase
      .from("experiences")
      .select("*")
      .order("sort_order");
    if (data) setRows(data as ExperienceRow[]);
  }

  useEffect(() => {
    load();
  }, []);

  function openEdit(row: ExperienceRow) {
    setEditing(row);
    setForm({
      company: row.company,
      role: row.role,
      start_date: row.start_date,
      end_date: row.end_date,
      description: row.description,
      technologies: row.technologies,
      type: row.type,
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
      await supabase.from("experiences").update(payload).eq("id", editing.id);
    } else {
      // Shift existing entries down to make room
      const { data: existing } = await supabase
        .from("experiences")
        .select("id, sort_order")
        .gte("sort_order", payload.sort_order)
        .order("sort_order", { ascending: false });
      if (existing) {
        for (const row of existing) {
          await supabase
            .from("experiences")
            .update({ sort_order: row.sort_order + 1 })
            .eq("id", row.id);
        }
      }
      await supabase.from("experiences").insert(payload);
    }

    setSaving(false);
    closeForm();
    load();
  }

  async function handleDelete(id: string) {
    if (!supabase || !confirm("Delete this experience?")) return;
    await supabase.from("experiences").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Experiences</h1>
        <button
          onClick={openNew}
          className="rounded-lg bg-primary-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          + Add
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900">{row.role}</p>
              <p className="text-sm text-gray-500">
                {row.company} &middot; {row.start_date}
                {row.end_date ? ` – ${row.end_date}` : ""} &middot; {row.type}
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

      {/* Inline form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 rounded-xl border border-gray-200 bg-white p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            {editing ? "Edit Experience" : "New Experience"}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Company
              </label>
              <input
                required
                value={form.company}
                onChange={(e) =>
                  setForm({ ...form, company: e.target.value })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Role
              </label>
              <input
                required
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                required
                placeholder="Jan 2024"
                value={form.start_date}
                onChange={(e) =>
                  setForm({ ...form, start_date: e.target.value })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                placeholder="Present (leave blank)"
                value={form.end_date ?? ""}
                onChange={(e) =>
                  setForm({ ...form, end_date: e.target.value || null })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
              />
            </div>
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

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="type"
                value="work"
                checked={form.type === "work"}
                onChange={() => setForm({ ...form, type: "work" })}
              />
              Work
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="type"
                value="education"
                checked={form.type === "education"}
                onChange={() => setForm({ ...form, type: "education" })}
              />
              Education
            </label>
          </div>

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
