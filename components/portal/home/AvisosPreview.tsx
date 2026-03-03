"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";
import { DEMO_MESSAGES_PREVIEW, DEMO_UNREAD_COUNT } from "@/content/demoHomeData";
import { sectionReveal, staggerContainer, fadeInUp } from "@/components/motion/variants";

interface AvisosPreviewProps {
  reducedMotion?: boolean;
}

export function AvisosPreview({ reducedMotion }: AvisosPreviewProps) {
  const { locale } = useLocale();
  const t = getPortalContent(locale).dashboard;
  const tNotif = getPortalContent(locale).notifications;
  const isEn = locale === "en";

  return (
    <motion.section
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-foreground">
          {t.sectionNotices}
        </h2>
        <Link
          href="/portal/messages"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <Bell className="h-4 w-4" />
          {DEMO_UNREAD_COUNT > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
              {DEMO_UNREAD_COUNT}
            </span>
          )}
          {t.messagesViewAll}
        </Link>
      </div>
      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-2"
      >
        {DEMO_MESSAGES_PREVIEW.slice(0, 4).map((msg) => (
          <motion.li key={msg.id} variants={fadeInUp}>
            <Link
              href="/portal/messages"
              className={`block rounded-xl border px-4 py-3 text-sm transition-colors hover:bg-surface2 focus:outline-none focus:ring-2 focus:ring-ring ${
                msg.read
                  ? "border-border bg-background"
                  : "border-primary/30 bg-primary/5"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">
                    {isEn ? msg.title_en : msg.title_pt}
                  </p>
                  <p className="mt-0.5 truncate text-muted-foreground">
                    {isEn ? msg.excerpt_en : msg.excerpt_pt}
                  </p>
                </div>
                {!msg.read && (
                  <span className="shrink-0 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                    {t.messageUnread}
                  </span>
                )}
              </div>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </motion.section>
  );
}
