"use client";

import { LoginCard } from "@/components/auth/LoginCard";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";

/**
 * When Supabase is configured, shows LoginCard (e-mail/senha + Google).
 * Otherwise shows a message to configure Supabase.
 */
export function LoginSection() {
  const { locale } = useLocale();
  const t = getPortalContent(locale).login;

  if (isSupabaseConfigured()) {
    return (
      <div className="rounded-2xl border border-border bg-surface2/50 p-6">
        <LoginCard />
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-center text-sm text-foreground">
      {t.supabaseNotConfigured}
    </div>
  );
}
