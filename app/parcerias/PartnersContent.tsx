"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getContent } from "@/content/i18n";
import { sectionReveal } from "@/components/motion/variants";

const ESTACAO_SUSTENTAR_URL = "https://www.estacaosustentar.com.br/";

export function PartnersContent() {
  const { locale } = useLocale();
  const c = getContent(locale).partners;
  const contact = getContent(locale).contact;

  return (
    <div className="py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl sm:text-5xl font-bold text-foreground"
        >
          {c.pageTitle}
        </motion.h1>

        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 space-y-6 text-muted-foreground leading-relaxed"
        >
          <p>{c.estacaoSustentarIntro}</p>
          <p>{c.estacaoSustentarPurpose}</p>
          <p>{c.estacaoSustentarPillars}</p>
          <p>{c.estacaoSustentarGoal}</p>
          <p>{c.estacaoSustentar2022}</p>
          <p>{c.estacaoSustentar2025}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <p className="text-foreground font-medium mb-4">{c.ctaQuestion}</p>
          <a
            href={ESTACAO_SUSTENTAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover transition-colors"
          >
            {c.ctaLink}
            <ExternalLink className="h-4 w-4" />
          </a>
        </motion.div>

        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">
            {c.benefitsTitle}
          </h2>
          <ul className="space-y-4">
            {[c.benefit1, c.benefit2, c.benefit3].map((text, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-xl border border-border bg-surface2/50 p-5 text-muted-foreground"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold text-sm">
                  {i + 1}
                </span>
                {text}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 rounded-2xl bg-primary/5 border border-border p-8 text-center"
        >
          <h3 className="font-display text-xl font-bold text-foreground">
            {contact.ctaTitle}
          </h3>
          <Link
            href="/contato"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover transition-colors"
          >
            {contact.ctaButton}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
