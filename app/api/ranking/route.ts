/**
 * GET /api/ranking — list ranking (all users with points, ordered by points desc).
 * POST /api/ranking — add points for current user (e.g. on "Registrar conclusão"). Body: { add?: number }.
 */

import { NextResponse } from "next/server";
import { getAuthUserWithRole } from "@/lib/supabase/auth-helpers";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function GET() {
  const db = createServiceRoleClient();
  if (!db) {
    return NextResponse.json({ error: "Serviço não configurado." }, { status: 503 });
  }

  try {
    const { data: rows } = await db
      .from("ranking")
      .select("user_id, display_name, email, points")
      .order("points", { ascending: false })
      .limit(100);
    const safeRows = (rows ?? []) as { user_id: string; display_name?: string | null; email?: string | null; points?: number }[];
    const list = safeRows.map((r, index) => ({
      position: index + 1,
      uid: r.user_id,
      displayName: r.display_name ?? "",
      email: r.email ?? "",
      points: typeof r.points === "number" ? r.points : 0,
    }));
    return NextResponse.json({ ranking: list });
  } catch (e) {
    console.error("[ranking GET]", e);
    return NextResponse.json({ error: "Erro ao carregar ranking." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await getAuthUserWithRole();
  if (!auth) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const db = createServiceRoleClient();
  if (!db) {
    return NextResponse.json({ error: "Serviço não configurado." }, { status: 503 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const add = typeof body.add === "number" && body.add >= 0 ? Math.floor(body.add) : 1;

    const { data: profileData } = await db.from("profiles").select("display_name, email").eq("id", auth.uid).single();
    const profile = profileData as { display_name?: string; email?: string } | null;
    const displayName = profile?.display_name ?? "";
    const email = profile?.email ?? auth.email ?? "";

    const { data: rankData } = await db.from("ranking").select("points").eq("user_id", auth.uid).single();
    const rankRow = rankData as { points?: number } | null;
    const currentPoints = rankRow?.points ?? 0;
    const newPoints = currentPoints + add;

    await (db.from("ranking") as any).upsert(
      {
        user_id: auth.uid,
        points: newPoints,
        display_name: displayName || email.split("@")[0] || auth.uid,
        email,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    return NextResponse.json({ ok: true, points: newPoints });
  } catch (e) {
    console.error("[ranking POST]", e);
    return NextResponse.json({ error: "Erro ao atualizar pontos." }, { status: 500 });
  }
}
