import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "en" | "kn";
export type Theme = "light" | "dark";

interface PrefsState {
  lang: Lang;
  theme: Theme;
  sidebarCollapsed: boolean;
  setLang: (l: Lang) => void;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

export const usePrefs = create<PrefsState>()(
  persist(
    (set, get) => ({
      lang: "en",
      theme: "light",
      sidebarCollapsed: false,
      setLang: (lang) => set({ lang }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === "light" ? "dark" : "light" }),
      toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
    }),
    { name: "cia-prefs" },
  ),
);
