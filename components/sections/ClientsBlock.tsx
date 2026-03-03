"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getContent } from "@/content/i18n";

const clientLogos = [
  { src: "/images/amazon_logo_icon_169612-150x150.jpg", alt: "Amazon" },
  { src: "/images/natura-108-150x150.jpg", alt: "Natura" },
  { src: "/images/raiadrogasil-e1588124943738-150x150.jpg", alt: "Raia Drogasil" },
  { src: "/images/shein-logo-0-150x150.jpg", alt: "Shein" },
  { src: "/images/logo_mercado-diferente_hQZ97N-150x150.jpg", alt: "Mercado Diferente" },
];

export function ClientsBlock() {
  const { locale } = useLocale();
  const title = getContent(locale).common.clientsTitle;

  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-2xl sm:text-3xl font-bold text-center text-foreground mb-12"
        >
          {title}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center items-center gap-10 sm:gap-14"
        >
          {clientLogos.map(({ src, alt }) => (
            <div
              key={src}
              className="h-14 w-28 flex items-center justify-center grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
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
        </motion.div>
      </div>
    </section>
  );
}
