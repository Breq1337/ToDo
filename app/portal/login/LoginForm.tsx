"use client";

import { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";
import { AlertCircle } from "lucide-react";

const ALLOWED_DOMAINS = (process.env.NEXT_PUBLIC_ALLOWED_DOMAINS || "todogreen.com.br")
  .split(",")
  .map((d) => d.trim().toLowerCase());

function isAllowedEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return !!domain && ALLOWED_DOMAINS.some((d) => domain === d || domain.endsWith("." + d));
}

export function LoginForm() {
  const { locale } = useLocale();
  const t = getPortalContent(locale).login;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const supabaseConfigured = isSupabaseConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;

    if (!isAllowedEmail(value)) {
      setStatus("error");
      setMessage(t.invalidDomain);
      return;
    }

    setStatus("sending");
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: value,
      options: { emailRedirectTo: `${window.location.origin}/portal/auth/callback` },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("success");
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-border bg-surface2/50 p-6 text-center">
        <p className="text-foreground font-medium">{t.checkEmail}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Clique no link enviado para {email} para acessar o portal.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!supabaseConfigured && (
        <div
          role="alert"
          className="flex gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-foreground"
        >
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p>
            {locale === "pt-BR"
              ? "Login desativado: configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no arquivo .env.local para ativar o portal."
              : "Login disabled: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local to enable the portal."}
          </p>
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
          {t.email}
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@todogreen.com.br"
          required
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        />
      </div>
      {message && (
        <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
      )}
      <button
        type="submit"
          disabled={status === "sending" || !supabaseConfigured}
        className="w-full rounded-xl bg-primary py-3 px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-70 transition-colors"
      >
        {status === "sending" ? t.sending : t.sendMagicLink}
      </button>
    </form>
  );
}
