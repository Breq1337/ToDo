"use client";

import Image from "next/image";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getContent } from "@/content/i18n";
import { container, lead, sectionPad } from "./styles";

export function Challenge() {
  const { locale } = useLocale();
  const t = getContent(locale).home.challenge;

  return (
    <section className={sectionPad}>
      <div className={`${container} grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20`}>
        <div className="grid min-w-0 gap-5">
          <span className="eyebrow">{t.eyebrow}</span>
          <h2 className="font-display text-[clamp(1.625rem,3vw,2.25rem)] font-bold leading-[1.18] tracking-[-0.02em] text-foreground">
            {t.title}
          </h2>
          <p className={lead}>{t.body}</p>
        </div>

        <div className="mx-auto grid w-full max-w-[460px] justify-items-start gap-7">
          <figure className="polaroid w-[min(300px,78%)] rotate-[2.4deg] pb-3">
            <Image
              src="/images/home/paula-simoes.jpg"
              alt={t.portraitAlt}
              width={700}
              height={956}
              sizes="300px"
              className="h-auto w-full rounded-[1px]"
            />
          </figure>
          <blockquote className="border-l-[3px] border-fern pl-5">
            <p className="font-display text-[clamp(1.19rem,1.9vw,1.44rem)] font-semibold leading-[1.42] tracking-[-0.01em] text-foreground">
              {t.quote}
            </p>
            <cite className="mt-3.5 block font-mono text-xs font-medium not-italic uppercase tracking-[0.08em] text-faint">
              {t.quoteAuthor}
            </cite>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
