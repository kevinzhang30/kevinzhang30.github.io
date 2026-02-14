import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { supabase } from "../../lib/supabase";
import type { PhotoRow } from "../../types/database";

const emptyForm = {
  title: "",
  description: "",
  image_url: "",
  location: "",
  date: "",
  tags: "",
  category: "urban" as string,
  sort_order: 0,
};

export default function AdminGallery() {
  const [rows, setRows] = useState<PhotoRow[]>([]);
  const [editing, setEditing] = useState<PhotoRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!supabase) return;
    const { data } = await supabase
      .from("photos")
      .select("*")
      .order("sort_order");
    if (data) setRows(data as PhotoRow[]);
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditing(null);
    setForm({ ...emptyForm, sort_order: rows.length });
    setShowForm(true);
  }

  function openEdit(row: PhotoRow) {
    setEditing(row);
    setForm({
      title: row.title,
      description: row.description,
      image_url: row.image_url,
      location: row.location,
      date: row.date,
      tags: row.tags.join(", "),
      category: row.category,
      sort_order: row.sort_order,
    });
    setShowForm(true);
  }

  function closeForm() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(false);
  }

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("gallery")
      .upload(path, file);

    if (!error) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("gallery").getPublicUrl(path);
      setForm({ ...form, image_url: publicUrl });
    }
    setUploading(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);

    const payload = {
      title: form.title,
      description: form.description,
      image_url: form.image_url,
      location: form.location,
      date: form.date,
      tags: form.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      category: form.category,
      sort_order: form.sort_order,
    };

    if (editing) {
      await supabase.from("photos").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("photos").insert(payload);
    }

    setSaving(false);
    closeForm();
    load();
  }

  async function handleDelete(id: number) {
    if (!supabase || !confirm("Delete this photo?")) return;
    await supabase.from("photos").delete().eq("id", id);
    load();
  }

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Gallery</h1>
        <button
          onClick={openNew}
          className="rounded-lg bg-primary-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          + Add Photo
        </button>
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {rows.map((row) => (
          <div
            key={row.id}
            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white"
          >
            <div className="aspect-square">
              <img
                src={row.image_url}
                alt={row.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-gray-900 truncate">
                {row.title}
              </p>
              <p className="text-xs text-gray-400">{row.location}</p>
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => openEdit(row)}
                className="rounded bg-white/90 px-2 py-1 text-xs font-medium text-primary-600 shadow-sm hover:bg-white"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(row.id)}
                className="rounded bg-white/90 px-2 py-1 text-xs font-medium text-red-600 shadow-sm hover:bg-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 rounded-xl border border-gray-200 bg-white p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            {editing ? "Edit Photo" : "New Photo"}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                required
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className={inputClass}
              >
                <option value="urban">Urban</option>
                <option value="adventure">Adventure</option>
                <option value="experience">Experience</option>
                <option value="nature">Nature</option>
              </select>
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
              rows={2}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tags (comma-separated)
            </label>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="city, nighttime, travel"
              className={inputClass}
            />
          </div>

          {/* Image upload or URL */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Image
            </label>
            <div className="flex items-center gap-3">
              <input
                value={form.image_url}
                onChange={(e) =>
                  setForm({ ...form, image_url: e.target.value })
                }
                placeholder="URL or upload below"
                className={`flex-1 ${inputClass}`}
              />
              <label className="cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
                {uploading ? "Uploading..." : "Upload"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            {form.image_url && (
              <img
                src={form.image_url}
                alt="Preview"
                className="mt-2 h-24 w-24 rounded-lg object-cover"
              />
            )}
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
