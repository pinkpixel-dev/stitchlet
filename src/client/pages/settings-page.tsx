import { Database, HardDrive, Shield, SunMoon } from "lucide-react";
import { ThemeToggle } from "../components/theme-toggle";

const settings = [
  {
    icon: HardDrive,
    label: "Storage",
    value: "Local uploads folder",
  },
  {
    icon: Database,
    label: "Database",
    value: "SQLite at ./data/stitchlet.db",
  },
  {
    icon: Shield,
    label: "Access",
    value: "Single-user scaffold",
  },
];

export function SettingsPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-lg border border-(--border) bg-(--shell) p-5">
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-(--muted)">
          Keep the first version boring in the best way: local storage, clear settings, and no surprise cloud anything.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <section className="rounded-lg border border-(--border) bg-(--shell) p-5">
          <h2 className="text-base font-semibold">App preferences</h2>
          <div className="mt-5 flex items-center justify-between gap-4 rounded-md border border-(--border) bg-(--surface) p-4">
            <div className="flex items-center gap-3">
              <SunMoon className="text-(--accent-purple)" size={20} />
              <div>
                <p className="font-medium">Theme</p>
                <p className="mt-1 text-sm text-(--muted)">Default dark mode with a light cream option.</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </section>

        <aside className="rounded-lg border border-(--border) bg-(--shell) p-5">
          <h2 className="text-base font-semibold">Self-hosted status</h2>
          <div className="mt-4 space-y-3">
            {settings.map((item) => (
              <div className="flex gap-3 rounded-md border border-(--border) bg-(--surface) p-3" key={item.label}>
                <item.icon className="mt-0.5 text-(--accent-pink)" size={18} />
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="mt-1 text-xs leading-5 text-(--muted)">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
