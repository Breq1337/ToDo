"use client";

import Image from "next/image";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getContent } from "@/content/i18n";
import { container, h2, sectionPad } from "./styles";

export function Differentials() {
  const { locale } = useLocale();
  const t = getContent(locale).home.differentials;

  return (
    <section className={sectionPad}>
      <div className={container}>
        <div className="mb-10 grid gap-3.5 lg:mb-14">
          <span className="eyebrow">{t.eyebrow}</span>
          <h2 className={h2}>{t.title}</h2>
        </div>

        <figure className="m-0 mb-10 aspect-[4/3] overflow-hidden rounded-lg sm:aspect-[16/7] lg:mb-16">
          <Image
            src="/images/home/base-frota.jpg"
            alt={t.photoAlt}
            width={1448}
            height={1086}
            sizes="(min-width: 1152px) 1088px, 100vw"
            className="h-full w-full object-cover object-[50%_60%]"
          />
        </figure>

        <div className="grid gap-x-14 md:grid-cols-2">
          {t.items.map((d) => (
            <article key={d.title} className="grid content-start gap-3.5 border-t border-border pb-8 pt-7">
              <span className="text-[clamp(2.5rem,4.4vw,3.25rem)] font-bold leading-none tracking-[-0.02em] text-primary-ink">
                {d.figure}
              </span>
              <h3 className="font-display text-xl font-bold tracking-[-0.01em] text-foreground">{d.title}</h3>
              <p className="max-w-[30em] text-muted-foreground">{d.body}</p>
              <ul className="checklist">
                {d.checks.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
