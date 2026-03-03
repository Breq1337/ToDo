"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";
import { getRoleExplainer } from "@/content/demoHomeData";
import type { PortalRole } from "@/lib/authClient";
import { sectionReveal } from "@/components/motion/variants";
import { cn } from "@/lib/utils";

interface RoleExplainerProps {
  role: PortalRole;
  reducedMotion?: boolean;
}

export function RoleExplainer({ role, reducedMotion }: RoleExplainerProps) {
  const { locale } = useLocale();
  const t = getPortalContent(locale).dashboard;
  const data = getRoleExplainer(role);
  const isEn = locale === "en";
  const [openSection, setOpenSection] = useState<"responsibilities" | "tips" | null>("responsibilities");

  return (
    <motion.section
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="rounded-2xl border border-border bg-surface2/50 p-6"
    >
      <h2 className="font-display text-lg font-semibold text-foreground">
        {t.sectionYourRole}
      </h2>
      <p className="mt-3 text-sm text-muted-foreground">
        {isEn ? data.summary_en : data.summary_pt}
      </p>
      <div className="mt-4 space-y-2">
        <button
          type="button"
          onClick={() => setOpenSection((s) => (s === "responsibilities" ? null : "responsibilities"))}
          className="flex w-full items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-surface2 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {t.roleResponsibilities}
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", openSection === "responsibilities" && "rotate-180")}
          />
        </button>
        <AnimatePresence>
          {openSection === "responsibilities" && (
            <motion.div
              initial={reducedMotion ? { height: "auto" } : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <ul className="list-inside list-disc space-y-1 border border-t-0 border-border bg-background/40 px-4 pb-3 pt-2 text-sm text-muted-foreground">
                {(isEn ? data.responsibilities_en : data.responsibilities_pt).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={() => setOpenSection((s) => (s === "tips" ? null : "tips"))}
          className="flex w-full items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-surface2 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {t.roleHowToExcel}
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", openSection === "tips" && "rotate-180")}
          />
        </button>
        <AnimatePresence>
          {openSection === "tips" && (
            <motion.div
              initial={reducedMotion ? { height: "auto" } : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <ul className="list-inside list-disc space-y-1 border border-t-0 border-border bg-background/40 px-4 pb-3 pt-2 text-sm text-muted-foreground">
                {(isEn ? data.tips_en : data.tips_pt).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
