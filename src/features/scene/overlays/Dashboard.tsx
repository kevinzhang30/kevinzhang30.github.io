import { personal } from "../../../data/personal";
import { DESTINATIONS } from "../config";
import type { Destination, DestinationId } from "../types";

interface DashboardProps {
  hoveredId: DestinationId | null;
  isVisible: boolean;
  onHoverChange: (id: DestinationId | null) => void;
  onSelect: (destination: Destination) => void;
}

const navDestinations = DESTINATIONS.filter((d) => d.id !== "home");

export default function Dashboard({
  hoveredId,
  isVisible,
  onHoverChange,
  onSelect,
}: DashboardProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(80,150,255,0.18),_transparent_35%)]" />

      <header className="absolute left-1/2 top-8 -translate-x-1/2 text-center sm:top-10">
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-sky-200/80 sm:text-xs">
          Command Deck
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {personal.name}
        </h1>
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-sky-100/70 sm:text-sm">
          {personal.tagline}
        </p>
      </header>

      <div className="pointer-events-auto absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-6xl px-4 pb-6 sm:px-6 sm:pb-8">
          <div className="grid grid-cols-1 gap-3 rounded-t-2xl border border-white/10 bg-slate-950/65 p-4 backdrop-blur-xl shadow-[0_-20px_60px_-20px_rgba(14,165,233,0.35)] md:grid-cols-[1.3fr_1.7fr_1fr] md:gap-5 md:p-5">
            <AboutPanel />
            <NavPanel
              destinations={navDestinations}
              hoveredId={hoveredId}
              onHoverChange={onHoverChange}
              onSelect={onSelect}
            />
            <SocialsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

function PanelShell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-cyan-400/15 bg-gradient-to-b from-slate-900/80 to-slate-950/85 p-4">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
      <p className="text-[0.6rem] font-medium uppercase tracking-[0.35em] text-cyan-200/70">
        {label}
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function AboutPanel() {
  return (
    <PanelShell label="// profile">
      <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">{personal.about}</p>
      <p className="mt-3 text-[0.65rem] uppercase tracking-[0.28em] text-slate-500">
        {personal.contact.location}
      </p>
    </PanelShell>
  );
}

function NavPanel({
  destinations,
  hoveredId,
  onHoverChange,
  onSelect,
}: {
  destinations: Destination[];
  hoveredId: DestinationId | null;
  onHoverChange: (id: DestinationId | null) => void;
  onSelect: (destination: Destination) => void;
}) {
  return (
    <PanelShell label="// navigation">
      <div className="grid grid-cols-2 gap-2">
        {destinations.map((destination) => {
          const isHovered = hoveredId === destination.id;
          return (
            <button
              key={destination.id}
              type="button"
              onMouseEnter={() => onHoverChange(destination.id)}
              onMouseLeave={() => onHoverChange(null)}
              onFocus={() => onHoverChange(destination.id)}
              onBlur={() => onHoverChange(null)}
              onClick={() => onSelect(destination)}
              className={`group relative overflow-hidden rounded-lg border px-3 py-3 text-left transition-all duration-200 ${
                isHovered
                  ? "border-white/30 bg-white/10"
                  : "border-white/10 bg-slate-950/50 hover:border-white/25 hover:bg-white/8"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: destination.accent,
                    boxShadow: `0 0 10px ${destination.accent}`,
                  }}
                />
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white">
                  {destination.label}
                </span>
              </div>
              <p className="mt-1.5 text-[0.65rem] uppercase tracking-[0.15em] text-slate-400">
                {destination.caption}
              </p>
            </button>
          );
        })}
      </div>
    </PanelShell>
  );
}

function SocialsPanel() {
  const items = [
    { label: "GitHub", href: personal.links.github },
    { label: "LinkedIn", href: personal.links.linkedin },
    { label: "Email", href: `mailto:${personal.contact.email}` },
  ];
  return (
    <PanelShell label="// comms">
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              className="group flex items-center justify-between rounded-md border border-white/5 bg-slate-950/40 px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-300 transition-colors hover:border-cyan-300/40 hover:text-cyan-100"
            >
              <span>{item.label}</span>
              <span className="text-cyan-300/60 transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </PanelShell>
  );
}
