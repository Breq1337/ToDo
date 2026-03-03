/**
 * GET /api/auth/me — return current user role and hubId from profile (Supabase).
 * Uses session from cookies. Used by client after login to get claims equivalent.
 */

import { NextResponse } from "next/server";
import { getAuthUserWithRole } from "@/lib/supabase/auth-helpers";

export async function GET() {
  const auth = await getAuthUserWithRole();
  if (!auth) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  return NextResponse.json({ role: auth.role, hubId: auth.hubId, email: auth.email });
}
