"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Languages, UserCircle } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getContent } from "@/content/i18n";

const STORAGE_KEY = "todogreen-tutorial-done";

export function FirstVisitTutorial() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isPortal = pathname?.startsWith("/portal");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isPortal) return;
    try {
      const done = localStorage.getItem(STORAGE_KEY);
      if (!done) setVisible(true);
    } catch {
      setVisible(false);
    }
  }, [mounted, isPortal]);

  const handleClose = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  const t = getContent(locale).tutorial;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-title"
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
          aria-hidden
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md rounded-2xl border border-border bg-background shadow-2xl p-6"
        >
          <h2 id="tutorial-title" className="font-display text-xl font-bold text-foreground mb-2">
            {t.title}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">{t.intro}</p>

          <ul className="space-y-4 mb-6">
            <li className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sun className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {locale === "pt-BR" ? "Tema claro/escuro" : "Light/dark theme"}
                </p>
                <p className="text-sm text-muted-foreground">{t.themeStep}</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Languages className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {locale === "pt-BR" ? "Idioma" : "Language"}
                </p>
                <p className="text-sm text-muted-foreground">{t.languageStep}</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UserCircle className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {locale === "pt-BR" ? "Área do colaborador" : "Collaborator area"}
                </p>
                <p className="text-sm text-muted-foreground">{t.portalStep}</p>
              </div>
            </li>
          </ul>

          <button
            type="button"
            onClick={handleClose}
            className="w-full rounded-xl bg-primary py-3 px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-hover transition-colors"
          >
            {t.buttonDone}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
