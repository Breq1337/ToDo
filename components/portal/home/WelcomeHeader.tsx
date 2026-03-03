"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Bell, HelpCircle } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";
import type { PortalRole } from "@/lib/authClient";
import { fadeInUp } from "@/components/motion/variants";
import { cn } from "@/lib/utils";

interface WelcomeHeaderProps {
  displayName: string;
  role: PortalRole;
  reducedMotion?: boolean;
}

export function WelcomeHeader({ displayName, role, reducedMotion }: WelcomeHeaderProps) {
  const { locale } = useLocale();
  const t = getPortalContent(locale).dashboard;
  const roleLabels = getPortalContent(locale).roleLabels as Record<PortalRole, string>;
  const roleLabel = roleLabels[role] ?? role;
  const variant = reducedMotion ? "reduced" : "visible";

  return (
    <motion.section
      variants={fadeInUp}
      initial="hidden"
      animate={variant}
      transition={{ duration: 0.35 }}
      className="space-y-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
          {t.welcomeBack}, {displayName}
        </h1>
        <span
          className={cn(
            "inline-flex items-center rounded-md border border-border/80 bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground"
          )}
        >
          {roleLabel}
        </span>
      </div>
      <p className="max-w-xl text-muted-foreground text-sm sm:text-base">
        {t.welcomeSubtitle}
      </p>
      <div className="flex flex-wrap gap-2 pt-1">
        <Link
          href="/portal/academy"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <GraduationCap className="h-4 w-4" />
          {t.quickActionAcademy}
        </Link>
        <Link
          href="/portal/academy?filter=obrigatorios"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface2 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface2/80 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <BookOpen className="h-4 w-4" />
          {t.quickActionMandatory}
        </Link>
        <Link
          href="/portal/messages"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface2 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface2/80 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <Bell className="h-4 w-4" />
          {t.quickActionMessages}
        </Link>
        <a
          href="mailto:suporte@todogreen.com.br"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface2 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface2/80 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <HelpCircle className="h-4 w-4" />
          {t.quickActionSupport}
        </a>
      </div>
    </motion.section>
  );
}
