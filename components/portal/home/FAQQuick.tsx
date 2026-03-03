"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";
import { DEMO_FAQ_ITEMS } from "@/content/demoHomeData";
import { sectionReveal } from "@/components/motion/variants";
import { cn } from "@/lib/utils";

interface FAQQuickProps {
  reducedMotion?: boolean;
}

export function FAQQuick({ reducedMotion }: FAQQuickProps) {
  const { locale } = useLocale();
  const t = getPortalContent(locale).dashboard;
  const isEn = locale === "en";
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <motion.section
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="space-y-4"
    >
      <h2 className="font-display text-lg font-semibold text-foreground">
        {t.sectionFAQ}
      </h2>
      <div className="space-y-2">
        {DEMO_FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="rounded-xl border border-border bg-surface2/50 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-surface2/80 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {isEn ? item.question_en : item.question_pt}
                <ChevronDown
                  className={cn("h-4 w-4 shrink-0 transition-transform", isOpen && "rotate-180")}
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={reducedMotion ? { height: "auto" } : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="border-t border-border bg-background/60 px-4 py-3 text-sm text-muted-foreground">
                      {isEn ? item.answer_en : item.answer_pt}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
