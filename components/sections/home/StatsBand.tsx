"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { getContent } from "@/content/i18n";
import { container } from "./styles";

export function StatsBand() {
  const { locale } = useLocale();
  const t = getContent(locale).home.stats;

  return (
    <section aria-label={t.ariaLabel} className="bg-deep text-deep-foreground">
      <div className={`${container} py-10 sm:py-14 lg:py-16`}>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
          {t.items.map((s) => (
            <div key={s.label} className="grid gap-1.5 border-t border-deep-foreground/15 pt-4">
              <dt className="text-[15px] text-deep-muted">{s.label}</dt>
              <dd className="text-[clamp(2.25rem,4.4vw,3.375rem)] font-bold leading-none tracking-[-0.02em]">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
