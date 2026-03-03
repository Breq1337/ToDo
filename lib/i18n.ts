import type { Locale } from "@/content/i18n";

const STORAGE_KEY = "todogreen-locale";

export function getStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "pt-BR" || stored === "en") return stored;
  return null;
}

export function setStoredLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, locale);
}
