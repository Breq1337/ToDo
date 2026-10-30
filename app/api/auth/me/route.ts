/**
 * GET /api/auth/me — return current user role and hubId from profile (Supabase).
 * Uses session from cookies. Used by client after login to get claims equivalent.
 */

import { NextResponse } from "next/server";
import { AuthUnavailableError, getAuthUserWithRole } from "@/lib/supabase/auth-helpers";

export async function GET() {
  try {
    const auth = await getAuthUserWithRole();
    if (!auth) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }
    return NextResponse.json({ role: auth.role, hubId: auth.hubId, email: auth.email });
  } catch (e) {
    if (!(e instanceof AuthUnavailableError)) throw e;
    console.error("[auth/me]", e);
    return NextResponse.json({ error: "Serviço indisponível." }, { status: 503 });
  }
}
