import { Link, Outlet } from "react-router-dom";
import { DESTINATIONS } from "../../features/scene/config";

const navDestinations = DESTINATIONS.filter((d) => d.id !== "home");

export default function MobileLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#020611] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-screen-sm items-center justify-between px-4 py-3">
          <Link to="/" className="text-xs uppercase tracking-[0.3em] text-sky-200">
            Command Deck
          </Link>
          <div className="flex gap-3 text-[10px] uppercase tracking-[0.28em] text-slate-300">
            {navDestinations.map((d) => (
              <Link key={d.id} to={d.route} className="hover:text-white">
                {d.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-screen-sm flex-1 px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
