"use client";

import { LoginCard } from "@/components/auth/LoginCard";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";

const DEMO_ACCOUNTS = [
  "admin@todogreen.demo",
  "gestor@todogreen.demo",
  "rh@todogreen.demo",
  "colaborador@todogreen.demo",
  "motorista@todogreen.demo",
  "hubops@todogreen.demo",
] as const;
const DEMO_PASSWORD = "123456";

/**
 * When Supabase is configured, shows LoginCard (e-mail/senha + Google) and test accounts block.
 * Otherwise shows a message to configure Supabase.
 */
export function LoginSection() {
  const { locale } = useLocale();
  const t = getPortalContent(locale).login;

  if (isSupabaseConfigured()) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-surface2/50 p-6">
          <LoginCard />
        </div>
        <div className="rounded-2xl border border-border bg-surface2/30 p-4">
          <h2 className="text-sm font-semibold text-foreground mb-2">{t.testAccountsTitle}</h2>
          <p className="text-xs text-muted-foreground mb-3">{t.testAccountsHint}</p>
          <ul className="space-y-1.5 text-sm">
            {DEMO_ACCOUNTS.map((email) => (
              <li key={email} className="flex flex-wrap items-center gap-x-2 gap-y-0">
                <code className="rounded bg-muted px-1.5 py-0.5 text-foreground font-mono text-xs">{email}</code>
                <span className="text-muted-foreground">—</span>
                <span className="text-muted-foreground">{t.testAccountsPassword}: {DEMO_PASSWORD}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-center text-sm text-foreground">
      {t.supabaseNotConfigured}
    </div>
  );
}
