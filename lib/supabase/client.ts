/**
 * Supabase browser client — use in Client Components only.
 * Session is managed via cookies (@supabase/ssr).
 * When env is missing, returns a client with placeholder URL so the app doesn't crash;
 * auth calls will fail until you set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.
 */

import { createBrowserClient } from "@supabase/ssr";

const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_KEY = "placeholder-anon-key";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || PLACEHOLDER_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || PLACEHOLDER_KEY;

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

/** True when Supabase env is not set (useful to show "Configure .env" message). */
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  );
}
