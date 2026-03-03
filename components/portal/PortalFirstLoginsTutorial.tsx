"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, GraduationCap, Bell, Sparkles } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";

const STORAGE_KEY = "portal-tutorial-login-count";
const MAX_SHOWS = 3;

export function PortalFirstLoginsTutorial() {
  const { locale } = useLocale();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const count = parseInt(raw ?? "0", 10) || 0;
      if (count < MAX_SHOWS) setVisible(true);
    } catch {
      setVisible(false);
    }
  }, [mounted]);

  const handleClose = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const count = parseInt(raw ?? "0", 10) || 0;
      localStorage.setItem(STORAGE_KEY, String(count + 1));
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  const t = getPortalContent(locale).portalTutorial;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="portal-tutorial-title"
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
          <h2 id="portal-tutorial-title" className="font-display text-xl font-bold text-foreground mb-2">
            {t.title}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">{t.intro}</p>

          <ul className="space-y-4 mb-6">
            <li className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <LayoutDashboard className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{getPortalContent(locale).nav.dashboard}</p>
                <p className="text-sm text-muted-foreground">{t.stepDashboard}</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <GraduationCap className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{getPortalContent(locale).nav.academy}</p>
                <p className="text-sm text-muted-foreground">{t.stepAcademy}</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Bell className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{getPortalContent(locale).nav.messages}</p>
                <p className="text-sm text-muted-foreground">{t.stepMessages}</p>
              </div>
            </li>
            <li className="flex gap-3 rounded-xl border-2 border-amber-400/50 bg-gradient-to-br from-amber-500/10 to-violet-500/10 p-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.stepTutor}</p>
                <p className="text-sm text-muted-foreground">{t.stepTutorHighlight}</p>
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
