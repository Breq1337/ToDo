"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Theme } from "@/lib/theme";
import {
  getInitialTheme,
  applyTheme,
  setStoredTheme,
  getStoredTheme,
} from "@/lib/theme";

type ThemeContextValue = { theme: Theme; setTheme: (t: Theme) => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initial = getInitialTheme();
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    setStoredTheme(t);
    applyTheme(t);
  };

  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: "light", setTheme }}>
        <div className="bg-background text-foreground min-h-screen" suppressHydrationWarning>
          {children}
        </div>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
