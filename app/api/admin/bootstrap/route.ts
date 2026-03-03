/**
 * POST /api/admin/bootstrap — No auth. One-time bootstrap of first admin.
 * Body: { secret: string, email: string }.
 * Requires SUPABASE_BOOTSTRAP_SECRET (or SEED_SECRET). User must exist in Supabase Auth (e.g. created in dashboard or signed up).
 */

import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const db = createServiceRoleClient();
  if (!db) {
    return NextResponse.json({ error: "Supabase não configurado." }, { status: 503 });
  }

  const secret = process.env.SUPABASE_BOOTSTRAP_SECRET?.trim() || process.env.SEED_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: "Bootstrap não configurado. Defina SUPABASE_BOOTSTRAP_SECRET ou SEED_SECRET." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const providedSecret = typeof body.secret === "string" ? body.secret.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (providedSecret !== secret) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }
    if (!email) {
      return NextResponse.json({ error: "E-mail obrigatório." }, { status: 400 });
    }

    const { data } = await db.from("profiles").select("id").eq("email", email).single();
    const profile = data as { id: string } | null;
    if (!profile?.id) {
      return NextResponse.json(
        { error: "Usuário não encontrado. Crie o usuário no Supabase (Authentication) ou faça um sign-up primeiro." },
        { status: 404 }
      );
    }

    const uid = profile.id;
    await db.from("allowlist").upsert(
      { email, active: true, role_default: "ADMIN", hub_id: null, updated_at: new Date().toISOString() } as any,
      { onConflict: "email" }
    );
    const profilesTable = db.from("profiles") as any;
    await profilesTable
      .update({ role: "ADMIN", hub_id: null, status: "active", updated_at: new Date().toISOString() })
      .eq("id", uid);

    return NextResponse.json({
      ok: true,
      message: "Primeiro admin configurado. Faça login com " + email,
    });
  } catch (e) {
    console.error("[admin/bootstrap]", e);
    return NextResponse.json(
      { error: "Erro ao configurar admin.", details: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
