"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getContent } from "@/content/i18n";
import { sectionReveal } from "@/components/motion/variants";

/** Base estimate (kg CO₂) — animates up on mount, then increments in real time. */
const CO2_BASE_ESTIMATE = 128_470;
const CO2_INCREMENT_PER_SECOND = 2.4;

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export function SolutionMission() {
  const locale = useLocale().locale;
  const content = getContent(locale);
  const solution = content.solution;
  const mission = content.mission;
  const co2 = content.co2Counter;
  const reducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);
  const [baseAnimationDone, setBaseAnimationDone] = useState(false);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayValue(CO2_BASE_ESTIMATE);
      setBaseAnimationDone(true);
      return;
    }
    const duration = 2500;
    startTime.current = performance.now();
    const tick = (now: number) => {
      const elapsed = now - (startTime.current ?? now);
      if (elapsed < duration) {
        const t = elapsed / duration;
        const easeOut = 1 - (1 - t) ** 2;
        setDisplayValue(Math.round(CO2_BASE_ESTIMATE * easeOut));
        requestAnimationFrame(tick);
        return;
      }
      setDisplayValue(CO2_BASE_ESTIMATE);
      setBaseAnimationDone(true);
    };
    requestAnimationFrame(tick);
  }, [reducedMotion]);

  useEffect(() => {
    if (!baseAnimationDone || reducedMotion) return;
    const interval = setInterval(() => {
      setDisplayValue((v) => v + CO2_INCREMENT_PER_SECOND);
    }, 1000);
    return () => clearInterval(interval);
  }, [baseAnimationDone, reducedMotion]);

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="space-y-8"
          >
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                {solution.title}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {solution.body}
              </p>
            </div>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                {mission.title}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {mission.body}
              </p>
            </div>
          </motion.div>
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-surface2/50 to-primary/5 border border-border shadow-xl p-8 sm:p-10"
          >
            <div className="flex flex-col items-center justify-center text-center min-h-[280px]">
              <div className="rounded-full bg-primary/15 p-6 mb-6">
                <svg className="w-14 h-14 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0h.5a2.5 2.5 0 0010.5-2.5v-1.607M8 3.935a2.5 2.5 0 00-2.5 2.5v1.607" />
                </svg>
              </div>
              <p className="text-2xl sm:text-3xl font-bold tabular-nums text-foreground">
                {new Intl.NumberFormat(locale === "pt-BR" ? "pt-BR" : "en").format(Math.round(displayValue))}{" "}
                <span className="text-lg font-normal text-muted-foreground">kg CO₂</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{co2.label}</p>
              <p className="mt-1 text-xs text-muted-foreground/80">{co2.since}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
