"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getContent } from "@/content/i18n";
import { cn } from "@/lib/utils";

export function Hero() {
  const { locale } = useLocale();
  const c = getContent(locale).hero;

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Animated background layers */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, hsl(var(--primary)), transparent 50%),
                             radial-gradient(circle at 80% 20%, hsl(var(--accent)), transparent 50%)`,
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4"
            >
              {c.badge}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]"
            >
              {c.headline}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed"
            >
              {c.subheadline}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.24 }}
              className="mt-10"
            >
              <Link
                href="/contato"
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground",
                  "shadow-lg shadow-primary/25 hover:shadow-primary/30 hover:bg-primary-hover",
                  "transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                )}
              >
                {c.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2 relative flex items-center justify-center w-full"
          >
            <div className="relative w-full max-w-3xl min-[1024px]:max-w-[60rem] rounded-2xl overflow-hidden shadow-2xl shadow-primary/10">
              <Image
                src="/images/entregadornew.png"
                alt="To Do Green - entregas verdes com veículos elétricos"
                width={1920}
                height={1080}
                className="w-full h-auto object-contain"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 85vw, 960px"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
