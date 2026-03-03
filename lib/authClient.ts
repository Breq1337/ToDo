/**
 * Supabase Auth client helpers: login (email/password + Google), logout, get session/profile.
 * Use in Client Components only.
 */

import { createClient } from "@/lib/supabase/client";

export type PortalRole = "ADMIN" | "MANAGER" | "EMPLOYEE" | "DRIVER" | "HUB_OPS";

export interface UserClaims {
  role: PortalRole;
  hubId: string | null;
}

export async function loginWithGoogle(): Promise<{ user: { id: string; email?: string; user_metadata?: { full_name?: string } } }> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/portal/auth/callback` },
  });
  if (error) throw error;
  if (data.url) {
    window.location.href = data.url;
    return new Promise(() => {});
  }
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user;
  if (!user) throw new Error("Login não concluído.");
  return {
    user: {
      id: user.id,
      email: user.email ?? undefined,
      user_metadata: user.user_metadata,
    },
  };
}

export async function loginWithEmailPassword(
  email: string,
  password: string
): Promise<{ user: { id: string; email?: string; user_metadata?: { full_name?: string } } }> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw error;
  const user = data.user;
  if (!user) throw new Error("Login não concluído.");
  return {
    user: {
      id: user.id,
      email: user.email ?? undefined,
      user_metadata: user.user_metadata,
    },
  };
}

export async function logout(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}

/**
 * Get current session (client-side).
 */
export async function getSession() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Get current access token for API calls (Bearer). Replaces Firebase getIdToken.
 * forceRefresh is ignored; Supabase refreshes the session automatically.
 */
export async function getIdToken(_forceRefresh?: boolean): Promise<string | null> {
  const session = await getSession();
  return session?.access_token ?? null;
}

/**
 * Get role/hubId from API (profile). Call after login to get claims equivalent.
 */
export async function getClaims(): Promise<UserClaims | null> {
  const session = await getSession();
  if (!session?.access_token) return null;
  const res = await fetch("/api/auth/me", {
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.role) return { role: data.role as PortalRole, hubId: data.hubId ?? null };
  return null;
}

export function getCurrentUser(): { id: string; email?: string; user_metadata?: { full_name?: string } } | null {
  return null;
}

/**
 * Friendly message for Supabase Auth errors.
 */
export function getAuthErrorMessage(err: unknown, locale: "pt-BR" | "en"): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("Invalid login credentials") || msg.includes("invalid_credentials")) {
    return locale === "pt-BR"
      ? "E-mail ou senha incorretos. Use as contas de teste (ex.: admin@todogreen.demo / 123456) ou crie-as no Painel Admin (Criar contas demo)."
      : "Invalid email or password. Use test accounts (e.g. admin@todogreen.demo / 123456) or create them in Admin Panel (Create demo accounts).";
  }
  if (msg.includes("Email not confirmed")) {
    return locale === "pt-BR" ? "Confirme seu e-mail antes de entrar." : "Confirm your email before signing in.";
  }
  return msg;
}
