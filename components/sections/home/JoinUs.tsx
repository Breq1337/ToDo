"use client";

import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getContent } from "@/content/i18n";
import { btnPrimary, container, h2, lead, sectionPad } from "./styles";

/** Link do Tudú publicado em todogreenlog.com (número de teste da Meta: confirmar antes de produção). */
const TUDU_WHATSAPP = "https://api.whatsapp.com/send?phone=15559541992";

export function JoinUs() {
  const { locale } = useLocale();
  const t = getContent(locale).home.join;

  return (
    <section id="trabalhe-conosco" className={`scroll-mt-16 bg-bg2 ${sectionPad}`}>
      <div className={`${container} grid gap-12`}>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-[72px]">
          <div className="grid min-w-0 gap-5">
            <span className="eyebrow">{t.eyebrow}</span>
            <h2 className={h2}>{t.title}</h2>
            <p className={lead}>{t.body}</p>
            <dl className="mt-1">
              {t.benefits.map((b) => (
                <div key={b.title} className="grid gap-1 border-t border-border py-3.5 last:border-b sm:grid-cols-[210px_1fr] sm:gap-5">
                  <dt className="font-bold text-foreground">{b.title}</dt>
                  <dd className="m-0 text-muted-foreground">{b.body}</dd>
                </div>
              ))}
            </dl>
          </div>
          <figure className="m-0 overflow-hidden rounded-lg">
            <Image
              src="/images/home/equipe-motos.jpg"
              alt={t.photoAlt}
              width={1400}
              height={1050}
              sizes="(min-width: 1024px) 540px, 100vw"
              className="h-auto w-full"
            />
          </figure>
        </div>

        <div className="grid items-center gap-6 rounded-lg border border-border bg-surface p-5 sm:p-8 md:grid-cols-[140px_1fr_auto] md:gap-8">
          <Image src="/images/home/tudu.png" alt={t.tudu.alt} width={273} height={280} className="h-auto w-[120px]" />
          <div className="grid min-w-0 gap-1.5">
            <span className="eyebrow">{t.tudu.eyebrow}</span>
            <h3 className="font-display text-xl font-bold tracking-[-0.01em] text-foreground">{t.tudu.title}</h3>
            <p className="max-w-[38em] text-muted-foreground">{t.tudu.body}</p>
          </div>
          <a href={TUDU_WHATSAPP} target="_blank" rel="noopener noreferrer" className={`${btnPrimary} justify-center`}>
            <MessageCircle className="h-[18px] w-[18px]" aria-hidden />
            {t.tudu.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
