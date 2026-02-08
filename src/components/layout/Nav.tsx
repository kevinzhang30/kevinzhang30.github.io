import { NavLink } from "react-router-dom";
import { cn } from "../../lib/cn";

const links = [
  { to: "/", label: "Home" },
  { to: "/experience", label: "Experience" },
  { to: "/projects", label: "Projects" },
  { to: "/gallery", label: "Gallery" },
  { to: "/map", label: "Map" },
];

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        cn(
          "relative text-sm transition-colors",
          isActive
            ? "text-primary-500 font-medium"
            : "text-gray-500 hover:text-gray-900",
        )
      }
    >
      {({ isActive }) => (
        <>
          {label}
          {isActive && (
            <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary-500" />
          )}
        </>
      )}
    </NavLink>
  );
}

export default function Nav() {
  return (
    <>
      {/* Desktop: top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 hidden border-b border-gray-200/60 bg-white/80 backdrop-blur-sm md:block">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <NavLink
            to="/"
            className="text-sm font-semibold tracking-tight text-gray-900"
          >
            Kevin Zhang
          </NavLink>
          <div className="flex items-center gap-8">
            {links.map((link) => (
              <NavItem key={link.to} {...link} />
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile: bottom bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200/60 bg-white/90 backdrop-blur-sm md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-500"
                    : "text-gray-400 hover:text-gray-900",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
