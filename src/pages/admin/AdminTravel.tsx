import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "../../lib/supabase";
import type { CountryRow, VisitRow } from "../../types/database";

export default function AdminTravel() {
  const [countries, setCountries] = useState<CountryRow[]>([]);
  const [visitsByCountry, setVisitsByCountry] = useState<
    Record<string, VisitRow[]>
  >({});
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  // Country form
  const [showCountryForm, setShowCountryForm] = useState(false);
  const [editingCountry, setEditingCountry] = useState<CountryRow | null>(null);
  const [countryForm, setCountryForm] = useState({
    code: "",
    country_name: "",
  });

  // Visit form
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [visitFormCountry, setVisitFormCountry] = useState<string | null>(null);
  const [editingVisit, setEditingVisit] = useState<VisitRow | null>(null);
  const [visitForm, setVisitForm] = useState({
    city: "",
    date_range: "",
    purpose: "",
    category: "",
    description: "",
    highlights: "",
    image_url: "",
    sort_order: 0,
  });

  const [saving, setSaving] = useState(false);

  async function loadAll() {
    if (!supabase) return;
    const [{ data: c }, { data: v }] = await Promise.all([
      supabase.from("countries").select("*").order("country_name"),
      supabase.from("visits").select("*").order("sort_order"),
    ]);
    if (c) setCountries(c as CountryRow[]);
    if (v) {
      const grouped: Record<string, VisitRow[]> = {};
      for (const visit of v as VisitRow[]) {
        if (!grouped[visit.country_code]) grouped[visit.country_code] = [];
        grouped[visit.country_code].push(visit);
      }
      setVisitsByCountry(grouped);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  // ── Country CRUD ──

  function openNewCountry() {
    setEditingCountry(null);
    setCountryForm({ code: "", country_name: "" });
    setShowCountryForm(true);
  }

  function openEditCountry(c: CountryRow) {
    setEditingCountry(c);
    setCountryForm({ code: c.code, country_name: c.country_name });
    setShowCountryForm(true);
  }

  async function handleCountrySubmit(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);

    if (editingCountry) {
      await supabase
        .from("countries")
        .update({ country_name: countryForm.country_name })
        .eq("code", editingCountry.code);
    } else {
      await supabase.from("countries").insert(countryForm);
    }

    setSaving(false);
    setShowCountryForm(false);
    loadAll();
  }

  async function deleteCountry(code: string) {
    if (!supabase || !confirm("Delete this country and all its trips?")) return;
    await supabase.from("countries").delete().eq("code", code);
    if (expandedCode === code) setExpandedCode(null);
    loadAll();
  }

  // ── Visit CRUD ──

  function openNewVisit(countryCode: string) {
    setEditingVisit(null);
    setVisitFormCountry(countryCode);
    setVisitForm({
      city: "",
      date_range: "",
      purpose: "",
      category: "",
      description: "",
      highlights: "",
      image_url: "",
      sort_order: (visitsByCountry[countryCode] ?? []).length,
    });
    setShowVisitForm(true);
  }

  function openEditVisit(v: VisitRow) {
    setEditingVisit(v);
    setVisitFormCountry(v.country_code);
    setVisitForm({
      city: v.city,
      date_range: v.date_range,
      purpose: v.purpose,
      category: v.category,
      description: v.description,
      highlights: v.highlights.join(", "),
      image_url: v.image_url ?? "",
      sort_order: v.sort_order,
    });
    setShowVisitForm(true);
  }

  function closeVisitForm() {
    setShowVisitForm(false);
    setVisitFormCountry(null);
    setEditingVisit(null);
  }

  async function handleVisitSubmit(e: FormEvent) {
    e.preventDefault();
    if (!supabase || !visitFormCountry) return;
    setSaving(true);

    const payload = {
      country_code: visitFormCountry,
      city: visitForm.city,
      date_range: visitForm.date_range,
      purpose: visitForm.purpose,
      category: visitForm.category,
      description: visitForm.description,
      highlights: visitForm.highlights
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      image_url: visitForm.image_url || null,
      sort_order: visitForm.sort_order,
    };

    if (editingVisit) {
      await supabase.from("visits").update(payload).eq("id", editingVisit.id);
    } else {
      await supabase.from("visits").insert(payload);
    }

    setSaving(false);
    closeVisitForm();
    loadAll();
  }

  async function deleteVisit(id: string) {
    if (!supabase || !confirm("Delete this trip?")) return;
    await supabase.from("visits").delete().eq("id", id);
    loadAll();
  }

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Travel</h1>
        <button
          onClick={openNewCountry}
          className="rounded-lg bg-primary-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          + Add Country
        </button>
      </div>

      {/* Country form */}
      {showCountryForm && (
        <form
          onSubmit={handleCountrySubmit}
          className="mb-6 space-y-4 rounded-xl border border-gray-200 bg-white p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            {editingCountry ? "Edit Country" : "New Country"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                ISO Alpha-3 Code
              </label>
              <input
                required
                maxLength={3}
                disabled={!!editingCountry}
                value={countryForm.code}
                onChange={(e) =>
                  setCountryForm({
                    ...countryForm,
                    code: e.target.value.toUpperCase(),
                  })
                }
                className={`${inputClass} ${editingCountry ? "bg-gray-100" : ""}`}
                placeholder="USA"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Country Name
              </label>
              <input
                required
                value={countryForm.country_name}
                onChange={(e) =>
                  setCountryForm({
                    ...countryForm,
                    country_name: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50"
            >
              {saving ? "Saving..." : editingCountry ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => setShowCountryForm(false)}
              className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Country accordion list */}
      <div className="space-y-3">
        {countries.map((c) => {
          const isExpanded = expandedCode === c.code;
          const countryVisits = visitsByCountry[c.code] ?? [];

          return (
            <div
              key={c.code}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white"
            >
              {/* Country header */}
              <div
                className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-50"
                onClick={() =>
                  setExpandedCode(isExpanded ? null : c.code)
                }
              >
                <div className="flex items-center gap-3">
                  <svg
                    className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9 5 7 7-7 7"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {c.country_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {c.code} &middot; {countryVisits.length} trip
                      {countryVisits.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div
                  className="flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => openEditCountry(c)}
                    className="rounded px-2 py-1 text-xs text-primary-600 hover:bg-primary-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCountry(c.code)}
                    className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Expanded trips */}
              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
                  {countryVisits.length === 0 && (
                    <p className="text-sm text-gray-400">No trips yet.</p>
                  )}

                  <div className="space-y-2">
                    {countryVisits.map((v) => (
                      <div
                        key={v.id}
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {v.city}
                          </p>
                          <p className="text-sm text-gray-500">
                            {v.purpose} &middot; {v.date_range}
                          </p>
                          {v.description && (
                            <p className="mt-1 text-xs text-gray-400">
                              {v.description}
                            </p>
                          )}
                          {v.highlights.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {v.highlights.map((h) => (
                                <span
                                  key={h}
                                  className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500"
                                >
                                  {h}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-shrink-0 gap-2">
                          <button
                            onClick={() => openEditVisit(v)}
                            className="rounded px-2 py-1 text-xs text-primary-600 hover:bg-primary-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteVisit(v.id)}
                            className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => openNewVisit(c.code)}
                    className="mt-3 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-500 transition-colors hover:border-primary-300 hover:text-primary-600"
                  >
                    + Add Trip
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Visit form modal */}
      {showVisitForm && visitFormCountry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <form
            onSubmit={handleVisitSubmit}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-xl"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              {editingVisit ? "Edit Trip" : "New Trip"} &mdash;{" "}
              {countries.find((c) => c.code === visitFormCountry)?.country_name}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  required
                  value={visitForm.city}
                  onChange={(e) =>
                    setVisitForm({ ...visitForm, city: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Date Range
                </label>
                <input
                  required
                  placeholder="Jan 2024"
                  value={visitForm.date_range}
                  onChange={(e) =>
                    setVisitForm({ ...visitForm, date_range: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Purpose
                </label>
                <input
                  required
                  value={visitForm.purpose}
                  onChange={(e) =>
                    setVisitForm({ ...visitForm, purpose: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  required
                  value={visitForm.category}
                  onChange={(e) =>
                    setVisitForm({ ...visitForm, category: e.target.value })
                  }
                  className={inputClass}
                  placeholder="sports, education, ..."
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={visitForm.description}
                onChange={(e) =>
                  setVisitForm({ ...visitForm, description: e.target.value })
                }
                rows={3}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Highlights (comma-separated)
              </label>
              <input
                value={visitForm.highlights}
                onChange={(e) =>
                  setVisitForm({ ...visitForm, highlights: e.target.value })
                }
                className={inputClass}
                placeholder="Sightseeing, Food, Culture"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Image URL (optional)
              </label>
              <input
                value={visitForm.image_url}
                onChange={(e) =>
                  setVisitForm({ ...visitForm, image_url: e.target.value })
                }
                className={inputClass}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50"
              >
                {saving ? "Saving..." : editingVisit ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={closeVisitForm}
                className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
