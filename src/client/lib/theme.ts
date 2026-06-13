export type Theme = "dark" | "light";

const storageKey = "stitchlet-theme";

export function getInitialTheme(): Theme {
  const storedTheme = window.localStorage.getItem(storageKey);

  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return "dark";
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(storageKey, theme);
}
