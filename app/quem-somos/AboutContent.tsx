"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getContent } from "@/content/i18n";
import { sectionReveal } from "@/components/motion/variants";

export function AboutContent() {
  const { locale } = useLocale();
  const c = getContent(locale).about;
  const contact = getContent(locale).contact;

  return (
    <div className="py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-display text-4xl sm:text-5xl font-bold text-foreground"
        >
          {c.title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-10 space-y-6 text-lg text-muted-foreground leading-relaxed"
        >
          <p>{c.paragraph1}</p>
          <p>{c.paragraph2}</p>
        </motion.div>

        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-14"
        >
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            {c.headline}
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">{c.paragraph3}</p>
          <p className="mt-4 text-muted-foreground leading-relaxed">{c.paragraph4}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 grid sm:grid-cols-2 gap-8"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/valores-1536x863.jpg"
              alt="Valores To Do Green"
width={1536}
                  height={863}
              className="w-full h-auto object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/polaroid1.jpg"
              alt="To Do Green"
              width={600}
              height={530}
              className="w-full h-auto object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
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
