/**
 * Supabase server client — use in Server Components, Route Handlers, Server Actions.
 * When Supabase env is not set, returns a client with placeholder URL so the app does not throw
 * When Supabase env is not set, returns a client with placeholder URL so the app does not throw.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_KEY = "placeholder-anon-key";

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || PLACEHOLDER_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || PLACEHOLDER_KEY;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Ignore in Server Component context (e.g. during RSC render)
        }
      },
    },
  });
}

/**
 * Service role client — bypasses RLS. Use only in server routes for admin operations.
 * Never expose to the client. Returns null when Supabase env is not set.
 */
export function createServiceRoleClient(): ReturnType<typeof import("@supabase/supabase-js").createClient> | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !serviceRoleKey) return null;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient: createSupabaseClient } = require("@supabase/supabase-js") as typeof import("@supabase/supabase-js");
  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
