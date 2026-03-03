"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";
import {
  loginWithGoogle,
  loginWithEmailPassword,
  getClaims,
  getAuthErrorMessage,
  type PortalRole,
} from "@/lib/authClient";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { AlertCircle, Loader2 } from "lucide-react";

function redirectByRole(role: PortalRole): string {
  if (role === "ADMIN") return "/portal/admin";
  if (role === "MANAGER") return "/portal/manager";
  return "/portal";
}

async function doSignInAndSync(
  t: { notAuthorized: string }
): Promise<{ ok: true; role: PortalRole } | { ok: false; message: string }> {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  const data = await res.json();
  if (!res.ok) return { ok: false, message: data.error || t.notAuthorized };
  const claims = await getClaims();
  const role = (data.role as PortalRole) ?? claims?.role ?? "EMPLOYEE";
  return { ok: true, role };
}

export function LoginCard() {
  const router = useRouter();
  const { locale } = useLocale();
  const t = getPortalContent(locale).login;
  const [status, setStatus] = useState<"idle" | "signing_in" | "syncing" | "error">("idle");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const configured = isSupabaseConfigured();

  const handleGoogleSignIn = async () => {
    if (!configured) return;
    setStatus("signing_in");
    setMessage("");
    try {
      await loginWithGoogle();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : t.notAuthorized);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configured) return;
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setMessage(locale === "pt-BR" ? "Preencha e-mail e senha." : "Enter email and password.");
      setStatus("error");
      return;
    }
    setStatus("signing_in");
    setMessage("");
    try {
      await loginWithEmailPassword(trimmedEmail, password);
      setStatus("syncing");
      const result = await doSignInAndSync(t);
      if (result.ok) {
        router.push(redirectByRole(result.role));
        router.refresh();
      } else {
        setStatus("error");
        setMessage(result.message);
      }
    } catch (err) {
      setStatus("error");
      setMessage(getAuthErrorMessage(err, locale));
    }
  };

  if (!configured) {
    return (
      <div
        role="alert"
        className="flex gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-foreground"
      >
        <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <p>
          {locale === "pt-BR"
            ? "Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local para ativar o login."
            : "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local to enable login."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">{t.accessRules}</p>
      {message && (
        <div className="space-y-1">
          <p className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400" role="alert">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {message}
          </p>
          {email.trim().toLowerCase().endsWith("@todogreen.com.br") && (
            <p className="text-sm text-muted-foreground">
              {t.maybeYouMeantDemo.replace(
                "{email}",
                email.trim().toLowerCase().replace("@todogreen.com.br", "@todogreen.demo")
              )}
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleEmailSignIn} className="flex flex-col gap-3">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-foreground mb-1">
            {t.email}
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ex: admin@todogreen.demo"
            autoComplete="email"
            disabled={status === "signing_in" || status === "syncing"}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70"
          />
        </div>
        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-foreground mb-1">
            {t.password}
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={status === "signing_in" || status === "syncing"}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70"
          />
        </div>
        <button
          type="submit"
          disabled={status === "signing_in" || status === "syncing"}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground shadow-sm hover:bg-surface2 disabled:opacity-70 transition-colors"
        >
          {status === "signing_in" || status === "syncing" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              {status === "syncing" ? t.syncing : locale === "pt-BR" ? "Entrando…" : "Signing in…"}
            </>
          ) : (
            t.signInWithEmail
          )}
        </button>
      </form>

      <div className="flex items-center gap-3">
        <span className="flex-1 h-px bg-border" aria-hidden />
        <span className="text-sm text-muted-foreground">{t.orDivider}</span>
        <span className="flex-1 h-px bg-border" aria-hidden />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={status === "signing_in" || status === "syncing"}
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground shadow-sm hover:bg-surface2 disabled:opacity-70 transition-colors"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {t.signInWithGoogle}
      </button>
    </div>
  );
}
