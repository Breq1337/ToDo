"use client";

/**
 * Partners logo marquee — continuous infinite scroll.
 * Does NOT reset on hover: uses CSS keyframes + duplicated content.
 * Pauses on hover/focus and via a visible button (WCAG 2.2.2: touch and
 * keyboard users have no hover). Duplicated strips are hidden from assistive tech.
 */

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getContent } from "@/content/i18n";
import { cn } from "@/lib/utils";

const partnerLogos = [
  { src: "/images/amazon_logo_icon_169612-150x150.jpg", alt: "Amazon" },
  { src: "/images/natura-108-150x150.jpg", alt: "Natura" },
  { src: "/images/raiadrogasil-e1588124943738-150x150.jpg", alt: "Raia Drogasil" },
  { src: "/images/shein-logo-0-150x150.jpg", alt: "Shein" },
  { src: "/images/logo_mercado-diferente_hQZ97N-150x150.jpg", alt: "Mercado Diferente" },
];

function LogoStrip({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className="flex items-center gap-12 shrink-0 px-6" aria-hidden={duplicate || undefined}>
      {partnerLogos.map(({ src, alt }) => (
        <div
          key={src}
          className="flex h-14 w-28 shrink-0 items-center justify-center grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
        >
          <Image
            src={src}
            alt={duplicate ? "" : alt}
            width={112}
            height={56}
            className="h-10 w-auto object-contain"
          />
        </div>
      ))}
    </div>
  );
}

export function PartnersMarquee() {
  const { locale } = useLocale();
  const common = getContent(locale).common;
  const [paused, setPaused] = useState(false);

  return (
    <section className="py-16 lg:py-20 border-y border-border bg-surface2/30 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-2xl sm:text-3xl font-bold text-center text-foreground"
        >
          {common.partnersBlockTitle}
        </motion.h2>
      </div>
      <div className="relative w-full overflow-hidden">
        <div
          className={cn("partners-marquee-track flex w-max", paused && "is-paused")}
          style={{ willChange: "transform" }}
        >
          <LogoStrip />
          <LogoStrip duplicate />
          <LogoStrip duplicate />
          <LogoStrip duplicate />
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {paused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
          {paused ? common.partnersResume : common.partnersPause}
        </button>
      </div>
    </section>
  );
}
