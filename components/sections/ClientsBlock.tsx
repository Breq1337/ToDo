"use client";

import Image from "next/image";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getContent } from "@/content/i18n";

/** Logos recortadas; cada uma fica sobre um bloco branco, nos dois temas. */
const clientLogos = [
  { src: "/images/clients/amazon.png", alt: "Amazon", width: 100, height: 31 },
  { src: "/images/clients/natura.png", alt: "Natura", width: 102, height: 77 },
  { src: "/images/clients/raia-drogasil.png", alt: "RD Raia Drogasil", width: 101, height: 74 },
  { src: "/images/clients/shein.png", alt: "Shein", width: 102, height: 22 },
  { src: "/images/clients/mercado-diferente.png", alt: "Mercado Diferente", width: 102, height: 101 },
];

export function ClientsBlock() {
  const { locale } = useLocale();
  const t = getContent(locale).common;

  return (
    <section className="bg-bg2">
      <div className="mx-auto grid max-w-6xl justify-items-center gap-7 px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-8">
        <span className="eyebrow">{t.clientsEyebrow}</span>
        <h2 className="font-display text-[22px] font-bold tracking-[-0.01em] text-foreground">{t.clientsTitle}</h2>
        <ul className="flex flex-wrap justify-center gap-3">
          {clientLogos.map((logo) => (
            <li
              key={logo.src}
              className="grid h-[72px] w-[calc(33.333%-8px)] place-items-center rounded-lg border border-border bg-tile sm:h-[84px] sm:w-[148px]"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="h-auto max-h-9 w-auto max-w-[78%] object-contain sm:max-h-11 sm:max-w-[104px]"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
