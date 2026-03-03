"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Locale } from "@/content/i18n";
import { getStoredLocale, setStoredLocale } from "@/lib/i18n";
import { defaultLocale } from "@/content/i18n";

type LocaleContextValue = { locale: Locale; setLocale: (l: Locale) => void };

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = getStoredLocale();
    if (stored) setLocaleState(stored);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    setStoredLocale(l);
  };

  return (
    <LocaleContext.Provider value={{ locale: mounted ? locale : defaultLocale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
