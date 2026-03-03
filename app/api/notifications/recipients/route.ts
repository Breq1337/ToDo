/**
 * GET /api/notifications/recipients — list users (email, displayName) for message recipient dropdown.
 * Authenticated only. Excludes current user.
 */

import { NextResponse } from "next/server";
import { getAuthUserWithRole } from "@/lib/supabase/auth-helpers";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function GET() {
  const auth = await getAuthUserWithRole();
  if (!auth) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const db = createServiceRoleClient();
  if (!db) {
    return NextResponse.json({ error: "Serviço não configurado." }, { status: 503 });
  }

  try {
    const { data: rows } = await db.from("profiles").select("id, email, display_name").limit(150);
    const list: { email: string; displayName: string }[] = [];
    const safeRows = (rows ?? []) as { id: string; email?: string | null; display_name?: string | null }[];
    for (const row of safeRows) {
      if (row.id === auth.uid) continue;
      const email = (row.email ?? "").toLowerCase();
      if (!email) continue;
      const displayName = row.display_name ?? email.split("@")[0] ?? email;
      list.push({ email, displayName });
    }
    list.sort((a, b) => a.email.localeCompare(b.email));
    return NextResponse.json({ recipients: list });
  } catch (e) {
    console.error("[notifications/recipients GET]", e);
    return NextResponse.json({ error: "Erro ao listar destinatários." }, { status: 500 });
  }
}
