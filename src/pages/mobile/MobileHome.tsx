import { Link } from "react-router-dom";
import { personal } from "../../data/personal";
import { DESTINATIONS } from "../../features/scene/config";

const navDestinations = DESTINATIONS.filter((d) => d.id !== "home");

export default function MobileHome() {
  return (
    <div className="flex flex-col gap-8">
      <section className="pt-6">
        <p className="text-xs uppercase tracking-[0.32em] text-sky-200/80">
          Command Deck
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
          {personal.name}
        </h1>
        <p className="mt-3 text-sm uppercase tracking-[0.22em] text-sky-100/70">
          {personal.tagline}
        </p>
        <p className="mt-5 text-sm leading-7 text-slate-300">{personal.about}</p>
        <p className="mt-3 text-sm leading-7 text-slate-300">{personal.athletics}</p>
      </section>

      <section className="grid gap-3">
        {navDestinations.map((d) => (
          <Link
            key={d.id}
            to={d.route}
            className="group rounded-xl border border-white/10 bg-slate-950/60 p-5 transition-colors hover:border-white/25 hover:bg-slate-900/70"
          >
            <div className="flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: d.accent,
                  boxShadow: `0 0 14px ${d.accent}`,
                }}
              />
              <span className="text-xs uppercase tracking-[0.3em] text-white/90">
                {d.label}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-400">{d.description}</p>
            <span className="mt-4 inline-block text-xs text-slate-500 group-hover:text-slate-200">
              &rarr;
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
