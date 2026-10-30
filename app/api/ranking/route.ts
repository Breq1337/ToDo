/**
 * GET /api/ranking — list ranking (all users with points, ordered by points desc). Requires a session.
 * Points are not writable from the client: they need a verified completion event first.
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
    const { data: rows, error } = await db
      .from("ranking")
      .select("user_id, display_name, points")
      .order("points", { ascending: false })
      .limit(100);
    if (error) throw error;
    const safeRows = (rows ?? []) as { user_id: string; display_name?: string | null; points?: number }[];
    const list = safeRows.map((r, index) => ({
      position: index + 1,
      uid: r.user_id,
      displayName: r.display_name ?? "",
      points: typeof r.points === "number" ? r.points : 0,
    }));
    return NextResponse.json({ ranking: list });
  } catch (e) {
    console.error("[ranking GET]", e);
    return NextResponse.json({ error: "Erro ao carregar ranking." }, { status: 500 });
  }
}
