import { useEffect } from "react";
import Tag from "../../components/ui/Tag";
import { cn } from "../../lib/cn";
import type { TravelDataMap } from "./types";

interface Props {
  selectedCode: string | null;
  onClose: () => void;
  travelData: TravelDataMap;
}

export default function CountryDrawer({ selectedCode, onClose, travelData }: Props) {
  const data = selectedCode ? travelData[selectedCode] : null;
  const open = !!data;

  // Escape key closes drawer
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Transparent backdrop for click-outside dismissal */}
      {open && (
        <div className="fixed inset-0 z-10" onClick={onClose} />
      )}

      {/* Drawer panel */}
      <div
        className={cn(
          "fixed z-20 bg-white/95 backdrop-blur-sm shadow-2xl transition-transform duration-300 ease-out overflow-hidden",
          // Mobile: bottom sheet
          "inset-x-0 bottom-0 max-h-[60vh] rounded-t-2xl",
          // Desktop: right side panel
          "md:inset-y-0 md:right-0 md:left-auto md:bottom-auto md:w-[400px] md:max-h-none md:rounded-t-none md:rounded-l-2xl",
          // Transition states
          open
            ? "translate-y-0 md:translate-y-0 md:translate-x-0"
            : "translate-y-full md:translate-y-0 md:translate-x-full",
        )}
      >
        {data && (
          <div className="flex h-full flex-col">
            {/* Mobile drag handle */}
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="h-1 w-10 rounded-full bg-gray-300" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-4 pb-2 md:pt-6">
              <h2 className="text-xl font-bold text-gray-900">
                {data.countryName}
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Scrollable visit list */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="space-y-5 pt-2">
                {data.visits.map((visit) => (
                  <div
                    key={visit.id}
                    className="border-l-2 border-primary-200 pl-4"
                  >
                    <p className="text-sm font-semibold text-gray-900">
                      {visit.city}
                    </p>
                    <p className="text-sm font-medium text-primary-600">
                      {visit.purpose}
                    </p>
                    <p className="text-xs text-gray-400">{visit.dateRange}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                      {visit.description}
                    </p>
                    {visit.highlights.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {visit.highlights.map((h) => (
                          <Tag key={h} label={h} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
