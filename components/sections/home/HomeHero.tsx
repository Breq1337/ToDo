"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getContent } from "@/content/i18n";
import { btnPrimary, container, lead, textLink } from "./styles";

export function HomeHero() {
  const { locale } = useLocale();
  const t = getContent(locale).home.hero;

  return (
    <section className="pb-16 pt-10 sm:pb-20 sm:pt-16 lg:pb-28 lg:pt-24">
      <div className={`${container} grid items-center gap-14 lg:grid-cols-2 lg:gap-16`}>
        <div className="grid min-w-0 gap-6">
          <span className="eyebrow">{t.eyebrow}</span>
          <h1 className="font-display text-[clamp(2.5rem,5.6vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.035em] text-foreground">
            {t.title} <span className="text-primary-ink">{t.titleAccent}</span>
          </h1>
          <p className={lead}>{t.lead}</p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-4 pt-2">
            <Link href="/contato" className={btnPrimary}>
              {t.ctaPrimary}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="#operacao" className={textLink}>
              {t.ctaSecondary}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[600px]">
          <figure className="polaroid -rotate-2">
            <Image
              src="/images/home/frota-por-do-sol.jpg"
              alt={t.photoAlt}
              width={1537}
              height={1023}
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="h-auto w-full rounded-[1px]"
            />
            <figcaption>{t.photoCaption}</figcaption>
          </figure>
          <p className="absolute -top-5 right-2 rotate-[3.5deg] rounded bg-deep px-3.5 py-2.5 font-mono text-[11px] font-medium uppercase leading-snug tracking-[0.06em] text-deep-foreground shadow-[var(--shadow-polaroid)]">
            <b className="block font-sans text-2xl font-bold normal-case tracking-tight">{t.stampValue}</b>
            {t.stampLabel}
          </p>
        </div>
      </div>
    </section>
  );
}
