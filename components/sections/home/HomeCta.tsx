"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getContent } from "@/content/i18n";
import { container } from "./styles";

export function HomeCta() {
  const { locale } = useLocale();
  const t = getContent(locale).home.cta;
  const email = getContent(locale).contact.emailValue;

  return (
    <section className="relative overflow-hidden bg-deep text-deep-foreground">
      <Image
        src="/images/home/caminhoes-base.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-[70%_60%]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(100deg,hsl(var(--deep)/0.96)_30%,hsl(var(--deep)/0.72)_62%,hsl(var(--deep)/0.35))]"
      />
      <div className={`${container} relative grid gap-5 py-[72px] sm:py-24 lg:py-32`}>
        <span className="eyebrow text-deep-muted">{t.eyebrow}</span>
        <h2 className="max-w-[12em] font-display text-[clamp(2rem,4.6vw,3.5rem)] font-bold leading-[1.04] tracking-[-0.03em] text-deep-foreground">
          {t.title}
        </h2>
        <p className="max-w-[32em] text-lg text-deep-muted">{t.body}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-7 gap-y-4">
          <Link
            href="/contato"
            className="inline-flex items-center gap-2.5 rounded-[10px] bg-deep-foreground px-[22px] py-3.5 text-[15px] font-semibold leading-none text-deep transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-deep"
          >
            {t.button}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <span className="select-all font-mono text-[13px] font-medium tracking-[0.04em]">{email}</span>
        </div>
      </div>
    </section>
  );
}
