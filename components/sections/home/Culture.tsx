"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { getContent } from "@/content/i18n";
import { container, h2, lead, sectionPad } from "./styles";

export function Culture() {
  const { locale } = useLocale();
  const t = getContent(locale).home.culture;

  return (
    <section className={sectionPad}>
      <div className={container}>
        <div className="mb-10 grid gap-3.5 lg:mb-14">
          <span className="eyebrow">{t.eyebrow}</span>
          <h2 className={h2}>{t.title}</h2>
          <p className={lead}>{t.intro}</p>
        </div>
        <ul className="grid gap-x-7 md:grid-cols-2 xl:grid-cols-5">
          {t.values.map((v) => (
            <li key={v.name} className="grid content-start gap-2.5 border-t-2 border-dashed border-fern pb-6 pt-5">
              <strong className="eyebrow">{v.name}</strong>
              <span className="font-display text-[19px] font-semibold leading-[1.35] tracking-[-0.01em] text-foreground">{v.motto}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
