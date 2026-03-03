"use client";

/**
 * Partners logo marquee — continuous infinite scroll.
 * Does NOT reset on hover: uses CSS keyframes + duplicated content.
 * Optional pause on hover via animation-play-state.
 */

import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getContent } from "@/content/i18n";

const partnerLogos = [
  { src: "/images/amazon_logo_icon_169612-150x150.jpg", alt: "Amazon" },
  { src: "/images/natura-108-150x150.jpg", alt: "Natura" },
  { src: "/images/raiadrogasil-e1588124943738-150x150.jpg", alt: "Raia Drogasil" },
  { src: "/images/shein-logo-0-150x150.jpg", alt: "Shein" },
  { src: "/images/logo_mercado-diferente_hQZ97N-150x150.jpg", alt: "Mercado Diferente" },
];

function LogoStrip() {
  return (
    <div className="flex items-center gap-12 shrink-0 px-6">
      {partnerLogos.map(({ src, alt }) => (
        <div
          key={src}
          className="flex h-14 w-28 shrink-0 items-center justify-center grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
        >
          <Image
            src={src}
            alt={alt}
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
  const title = getContent(locale).common.partnersBlockTitle;

  return (
    <section className="py-16 lg:py-20 border-y border-border bg-surface2/30 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-2xl sm:text-3xl font-bold text-center text-foreground"
        >
          {title}
        </motion.h2>
      </div>
      <div className="relative w-full overflow-hidden">
        <div
          className="partners-marquee-track flex w-max"
          style={{ willChange: "transform" }}
        >
          <LogoStrip />
          <LogoStrip />
          <LogoStrip />
          <LogoStrip />
        </div>
      </div>
    </section>
  );
}
