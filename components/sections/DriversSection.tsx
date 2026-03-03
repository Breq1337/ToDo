"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function DriversSection() {
  return (
    <section className="py-20 lg:py-28 bg-surface2/40">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="relative w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl rounded-3xl overflow-hidden border border-border/80 bg-background/90 shadow-lg shadow-black/5 dark:shadow-xl dark:shadow-primary/5 dark:bg-surface2/30 dark:border-border/60 ring-1 ring-black/[0.02] dark:ring-primary/10">
            <div className="p-4 sm:p-6 lg:p-8">
              <Image
                src="/images/text.png"
                alt="A To Do Green sabe que o maior impulsionador do setor de logística são os entregadores. Benefícios e Green team."
                width={945}
                height={945}
                className="w-full h-auto object-contain"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, (max-width: 1280px) 80vw, 1024px"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
