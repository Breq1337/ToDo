/**
 * POST /api/admin/seed — ADMIN only. Seed allowlist and sample hubs.
 */

import { NextResponse } from "next/server";
import { getAuthUserWithRole } from "@/lib/supabase/auth-helpers";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const auth = await getAuthUserWithRole();
  if (!auth || auth.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado. Apenas ADMIN." }, { status: 403 });
  }

  const db = createServiceRoleClient();
  if (!db) {
    return NextResponse.json({ error: "Serviço não configurado." }, { status: 503 });
  }

  try {
    await db.from("allowlist").upsert(
      [
        { email: "driver@example.com", active: true, role_default: "DRIVER", hub_id: "hub-1", updated_at: new Date().toISOString() },
        { email: "manager@example.com", active: true, role_default: "MANAGER", hub_id: null, updated_at: new Date().toISOString() },
      ] as any,
      { onConflict: "email" }
    );
    await db.from("hubs").upsert(
      [
        { id: "hub-1", name: "Hub SP Centro" },
        { id: "hub-2", name: "Hub RJ" },
      ] as any,
      { onConflict: "id" }
    );

    return NextResponse.json({ ok: true, message: "Allowlist e hubs de exemplo criados." });
  } catch (e) {
    console.error("[admin/seed]", e);
    return NextResponse.json({ error: "Erro ao gerar dados iniciais." }, { status: 500 });
  }
}
