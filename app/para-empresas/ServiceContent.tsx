"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getContent } from "@/content/i18n";
import { ClientsBlock } from "@/components/sections/ClientsBlock";
import { sectionReveal } from "@/components/motion/variants";

export function ServiceContent() {
  const { locale } = useLocale();
  const c = getContent(locale).forCompanies;
  const bullets = [c.bullet1, c.bullet2, c.bullet3, c.bullet4, c.bullet5, c.bullet6, c.bullet7];

  return (
    <div className="py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground">
            {c.ctaTitle}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            {c.stat1}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="font-display text-xl font-bold text-foreground">{c.statsIntro}</h2>
            <p className="text-muted-foreground">{c.stat2}</p>
            <p className="text-muted-foreground">{c.stat3}</p>
            <ul className="space-y-2">
              {bullets.map((text, i) => (
                <li key={i} className="flex gap-2 text-muted-foreground">
                  <span className="text-primary">•</span>
                  {text}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden shadow-xl"
          >
            <Image
              src="/images/WhatsApp-Image-2024-09-19-at-19.34.16-1024x575.jpg"
              alt="To Do Green operação"
width={1024}
                height={575}
              className="w-full h-auto object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 mb-20">
          {[
            { title: c.processTitle, body: c.processBody },
            { title: c.qualificationTitle, body: c.qualificationBody },
            { title: c.reportsTitle, body: c.reportsBody },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={sectionReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-2xl border border-border bg-surface2/50 p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <h3 className="font-display text-lg font-bold text-foreground">{item.title}</h3>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">{item.body}</p>
            </motion.div>
          ))}
        </div>

        <ClientsBlock />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground hover:bg-primary-hover transition-colors"
          >
            {c.ctaButton}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
