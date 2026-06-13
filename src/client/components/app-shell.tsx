import { FolderKanban, Home, Plus, Settings } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/projects/new", label: "New Project", icon: Plus },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppShell() {
  return (
    <div className="min-h-screen bg-(--bg) text-(--text)">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,var(--dot)_1px,transparent_0)] [bg-size:28px_28px]" />
      <div className="mx-auto flex min-h-screen w-full max-w-[1800px] flex-col px-4 py-4 lg:flex-row lg:gap-6 lg:px-6 xl:px-8">
        <aside className="mb-4 flex items-center justify-between rounded-lg border border-(--border) bg-(--shell) p-3 lg:sticky lg:top-6 lg:mb-0 lg:h-[calc(100vh-3rem)] lg:w-64 lg:flex-col lg:items-stretch lg:justify-start">
          <div className="flex items-center gap-3">
            <img alt="" className="h-11 w-11 rounded-md object-cover" src="/logo.png" />
            <div>
              <p className="text-base font-semibold leading-tight">Stitchlet</p>
              <p className="text-xs text-(--muted)">Self-hosted</p>
            </div>
          </div>

          <nav className="hidden gap-1 lg:mt-8 lg:flex lg:flex-col">
            {navItems.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-(--surface-strong) text-(--text)"
                      : "text-(--muted) hover:bg-(--surface) hover:text-(--text)"
                  }`
                }
                key={item.to}
                to={item.to}
              >
                <item.icon size={17} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 lg:mt-auto lg:flex-col lg:items-stretch">
            <div className="hidden rounded-md border border-(--border) bg-(--surface) p-3 lg:block">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FolderKanban size={16} className="text-(--accent-purple)" />
                Local archive
              </div>
              <p className="mt-2 text-xs leading-5 text-(--muted)">
                PDFs, photos, counters, and notes stay on your own server.
              </p>
            </div>
            <ThemeToggle />
          </div>
        </aside>

        <nav className="mb-4 grid grid-cols-3 gap-2 lg:hidden">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `flex h-11 items-center justify-center gap-2 rounded-md border text-sm transition ${
                  isActive
                    ? "border-(--accent-pink) bg-(--surface-strong) text-(--text)"
                    : "border-(--border) bg-(--shell) text-(--muted)"
                }`
              }
              key={item.to}
              to={item.to}
            >
              <item.icon size={16} />
              <span className="sr-only sm:not-sr-only">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
