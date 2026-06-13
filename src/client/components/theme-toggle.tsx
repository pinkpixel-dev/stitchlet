import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { applyTheme, getInitialTheme, type Theme } from "../lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <button
      aria-label="Toggle color theme"
      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-(--border) bg-(--surface) text-(--muted) transition hover:border-(--accent-pink) hover:text-(--text)"
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
