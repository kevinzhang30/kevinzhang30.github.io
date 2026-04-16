import type { Experience } from "../../data/experience";
import SpaceTag from "./SpaceTag";

export default function SpaceTimelineEntry({ entry }: { entry: Experience }) {
  const isWork = entry.type === "work";

  return (
    <div className="relative pl-8 pb-10 last:pb-0">
      {/* vertical line — teal */}
      <span className="absolute top-0 left-[7px] bottom-0 w-px bg-teal-500/30 last:hidden" />

      {/* dot — glowing teal */}
      <span
        className={`absolute top-1 left-0 h-3.5 w-3.5 rounded-full border-2 border-gray-900 shadow-[0_0_6px_rgba(0,131,143,0.6)] ${
          isWork ? "bg-teal-500" : "bg-gray-500"
        }`}
      />

      {/* type label */}
      <span className="mb-1 inline-block text-[11px] font-medium uppercase tracking-wider text-gray-500">
        {isWork ? "Work" : "Education"}
      </span>

      {/* role + company */}
      <h3 className="text-base font-semibold text-white">{entry.role}</h3>
      <p className="text-sm text-gray-300">{entry.company}</p>

      {/* dates */}
      <p className="mt-1 text-xs text-gray-500">
        {entry.startDate} &mdash; {entry.endDate ?? "Present"}
      </p>

      {/* description */}
      <p className="mt-3 text-sm leading-relaxed text-gray-400">
        {entry.description}
      </p>

      {/* tech tags */}
      {entry.technologies.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {entry.technologies.map((tech) => (
            <SpaceTag key={tech} label={tech} />
          ))}
        </div>
      )}
    </div>
  );
}
