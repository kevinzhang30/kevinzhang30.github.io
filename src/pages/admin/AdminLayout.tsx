import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "../../lib/cn";

const links = [
  { to: "/admin/experience", label: "Experience" },
  { to: "/admin/trips", label: "Travel" },
  { to: "/admin/gallery", label: "Gallery" },
];

export default function AdminLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <span className="text-sm font-bold text-gray-900">Admin</span>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "text-sm transition-colors",
                    isActive
                      ? "font-medium text-primary-600"
                      : "text-gray-500 hover:text-gray-900",
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-lg px-3 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            Sign out
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
