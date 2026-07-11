import { useEffect } from "react";

export function ThemeInit() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  }, []);
  return null;
}
