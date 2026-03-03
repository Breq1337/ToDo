"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";
import { DEMO_NEXT_BEST_ACTIONS } from "@/content/demoHomeData";
import { sectionReveal, staggerContainer, fadeInUp, cardHover } from "@/components/motion/variants";

interface NextBestActionsProps {
  reducedMotion?: boolean;
}

export function NextBestActions({ reducedMotion }: NextBestActionsProps) {
  const { locale } = useLocale();
  const t = getPortalContent(locale).dashboard;
  const isEn = locale === "en";

  return (
    <motion.section
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="space-y-4"
    >
      <h2 className="font-display text-lg font-semibold text-foreground">
        {t.sectionWhatToDoNow}
      </h2>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-20px" }}
        className="grid gap-4 sm:grid-cols-3"
      >
        {DEMO_NEXT_BEST_ACTIONS.map((action) => (
          <motion.div key={action.id} variants={fadeInUp}>
            <Link
              href={action.href}
              className="group block rounded-2xl border border-border bg-surface2/50 p-5 transition-colors hover:border-primary/30 hover:bg-surface2 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <motion.div
                variants={cardHover}
                initial="rest"
                whileHover={reducedMotion ? "rest" : "hover"}
                className="flex h-full flex-col"
              >
                <h3 className="font-semibold text-foreground">
                  {isEn ? action.title_en : action.title_pt}
                </h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">
                  {isEn ? action.description_en : action.description_pt}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  {isEn ? action.cta_en : action.cta_pt}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
