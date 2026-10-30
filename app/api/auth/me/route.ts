/**
 * GET /api/auth/me — return current user role and hubId from profile (Supabase).
 * Uses session from cookies. Used by client after login to get claims equivalent.
 * 401: no valid session. 403: account not allowed. 503: could not be determined.
 */

import { NextResponse } from "next/server";
import { AuthUnavailableError, getProfileWithRole, getVerifiedUser } from "@/lib/supabase/auth-helpers";

export async function GET() {
  try {
    const user = await getVerifiedUser();
    if (!user?.id || !user.email) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }
    const profile = await getProfileWithRole(user.id, user.email);
    if (!profile) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }
    return NextResponse.json({ role: profile.role, hubId: profile.hubId, email: profile.email });
  } catch (e) {
    if (!(e instanceof AuthUnavailableError)) throw e;
    console.error("[auth/me]", e);
    return NextResponse.json({ error: "Serviço indisponível." }, { status: 503 });
  }
}
