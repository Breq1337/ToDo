"use client";

import Image from "next/image";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getContent } from "@/content/i18n";
import { container, h2, sectionPad } from "./styles";

function RoutePin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden className={className}>
      <path d="M14 25s8-7.2 8-13.5a8 8 0 1 0-16 0C6 17.8 14 25 14 25Z" fill="hsl(var(--bg2))" />
      <circle cx="14" cy="11.5" r="3" />
    </svg>
  );
}

const twoDigits = (n: number) => String(n).padStart(2, "0");

export function Operation() {
  const { locale } = useLocale();
  const home = getContent(locale).home;
  const t = home.operation;
  const e2e = home.endToEnd;

  return (
    <section id="operacao" className={`scroll-mt-16 bg-bg2 ${sectionPad}`}>
      <div className={container}>
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-[72px]">
          <div className="min-w-0">
            <div className="mb-10 grid gap-3.5 lg:mb-14">
              <span className="eyebrow">{t.eyebrow}</span>
              <h2 className={h2}>{t.title}</h2>
            </div>
            {/* Trajeto tracejado com pins, como nas peças da marca */}
            <ol className="grid">
              {t.steps.map((s, i) => (
                <li key={s.title} className="relative grid gap-1.5 pb-8 pl-12 last:pb-0">
                  {i < t.steps.length - 1 && (
                    <span aria-hidden className="absolute bottom-0.5 left-[13px] top-8 border-l-2 border-dashed border-fern" />
                  )}
                  <RoutePin className="absolute left-0 top-0 h-7 w-7 text-primary" />
                  <span className="eyebrow">{s.tag}</span>
                  <h3 className="font-display text-[22px] font-bold tracking-[-0.01em] text-foreground">{s.title}</h3>
                  <p className="max-w-[30em] text-muted-foreground">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>

          <figure className="m-0 grid gap-4 rounded-lg border border-border bg-deep p-5 sm:p-8">
            <Image
              src="/images/home/mapa-sp.png"
              alt={t.mapAlt}
              width={1000}
              height={657}
              sizes="(min-width: 1024px) 520px, 100vw"
              className="h-auto w-full"
            />
            <figcaption className="flex items-center gap-2.5 font-mono text-xs font-medium uppercase tracking-[0.08em] text-deep-muted">
              <span aria-hidden className="h-2 w-2 flex-none rounded-full bg-fern" />
              {t.mapCaption}
            </figcaption>
          </figure>
        </div>

        <div className="mt-14 grid gap-8 border-t border-border pt-10 lg:mt-[88px] lg:pt-14">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
            <div className="grid gap-3.5">
              <span className="eyebrow">{e2e.eyebrow}</span>
              <h3 className="font-display text-[clamp(1.375rem,2.4vw,1.75rem)] font-bold tracking-[-0.02em] text-foreground">
                {e2e.title}
              </h3>
            </div>
            <p className="max-w-[26em] text-faint">{e2e.intro}</p>
          </div>
          <ol className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {e2e.steps.map((s, i) => (
              <li key={s.title} className="grid gap-1.5 border-t border-border py-5">
                <span className="font-mono text-xs font-medium tracking-[0.1em] text-primary-ink">{twoDigits(i + 1)}</span>
                <strong className="text-[17px] font-bold leading-snug text-foreground">{s.title}</strong>
                <span className="text-[15px] text-muted-foreground">{s.body}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
