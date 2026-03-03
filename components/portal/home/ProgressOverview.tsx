"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";
import { DEMO_PROGRESS } from "@/content/demoHomeData";
import { sectionReveal } from "@/components/motion/variants";

interface ProgressOverviewProps {
  reducedMotion?: boolean;
}

function AnimatedNumber({
  value,
  duration = 1200,
  reducedMotion,
}: {
  value: number;
  duration?: number;
  reducedMotion?: boolean;
}) {
  const [display, setDisplay] = useState(reducedMotion ? value : 0);
  useEffect(() => {
    if (reducedMotion) {
      setDisplay(value);
      return;
    }
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const easeOut = 1 - (1 - t) ** 2;
      setDisplay(Math.round(value * easeOut));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, duration, reducedMotion]);
  return <span>{display}</span>;
}

export function ProgressOverview({ reducedMotion }: ProgressOverviewProps) {
  const { locale } = useLocale();
  const t = getPortalContent(locale).dashboard;
  const p = DEMO_PROGRESS;
  const minutesLabel = locale === "pt-BR" ? "min" : "min";
  const daysLabel = locale === "pt-BR" ? "dias" : "days";

  return (
    <motion.section
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="rounded-2xl border border-border bg-surface2/50 p-6"
    >
      <h2 className="font-display text-lg font-semibold text-foreground">
        {t.sectionProgress}
      </h2>
      <div className="mt-6 flex flex-wrap items-start gap-8">
        <div className="flex flex-col items-center">
          <div className="relative h-24 w-24">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                className="text-muted/30"
              />
              <motion.circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                className="text-primary"
                strokeDasharray={`${p.percent} 100`}
                initial={reducedMotion ? { pathLength: p.percent / 100 } : { pathLength: 0 }}
                whileInView={reducedMotion ? {} : { pathLength: p.percent / 100 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
          </div>
          <span className="mt-2 text-2xl font-bold text-foreground">
            <AnimatedNumber value={p.percent} reducedMotion={reducedMotion} />
            %
          </span>
          <span className="text-xs text-muted-foreground">geral</span>
        </div>
        <div className="flex-1 min-w-[180px] space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t.progressTracksCompleted}</span>
            <span className="font-medium text-foreground">
              <AnimatedNumber value={p.tracksCompleted} reducedMotion={reducedMotion} />
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t.progressTracksInProgress}</span>
            <span className="font-medium text-foreground">
              <AnimatedNumber value={p.tracksInProgress} reducedMotion={reducedMotion} />
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t.progressEstimatedTime}</span>
            <span className="font-medium text-foreground">
              <AnimatedNumber value={p.estimatedMinutesRemaining} reducedMotion={reducedMotion} />{" "}
              {minutesLabel}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t.progressStreak}</span>
            <span className="font-medium text-foreground">
              <AnimatedNumber value={p.streakDays} reducedMotion={reducedMotion} /> {daysLabel}
            </span>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">{t.demoDisclaimer}</p>
    </motion.section>
  );
}
