/**
 * POST /api/auth/sync — ensure session is valid, resolve role from allowlist/corp domain, upsert profiles.
 * Called by client after login (optional; /api/auth/me also triggers profile resolution).
 */

import { NextResponse } from "next/server";
import { getAuthUserWithRole } from "@/lib/supabase/auth-helpers";

export async function POST() {
  const auth = await getAuthUserWithRole();
  if (!auth) {
    return NextResponse.json(
      { error: "Não autorizado. Use e-mail corporativo @todogreen.com.br ou solicite acesso ao RH." },
      { status: 403 }
    );
  }
  return NextResponse.json({
    ok: true,
    role: auth.role,
    hubId: auth.hubId,
  });
}
