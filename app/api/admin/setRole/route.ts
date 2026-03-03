/**
 * POST /api/admin/setRole — ADMIN only. Set role/hubId for a user by email (allowlist + profiles).
 */

import { NextResponse } from "next/server";
import { getAuthUserWithRole } from "@/lib/supabase/auth-helpers";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { PortalRole } from "@/lib/supabase/auth-helpers";

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
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const role = (typeof body.role === "string" && ["ADMIN", "MANAGER", "EMPLOYEE", "DRIVER", "HUB_OPS"].includes(body.role))
      ? (body.role as PortalRole)
      : "EMPLOYEE";
    const hubId = typeof body.hubId === "string" && body.hubId.trim() ? body.hubId.trim() : null;

    if (!email) {
      return NextResponse.json({ error: "E-mail obrigatório." }, { status: 400 });
    }

    const { data } = await db.from("profiles").select("id").eq("email", email).single();
    const profile = data as { id: string } | null;
    if (!profile) {
      return NextResponse.json(
        { error: "Usuário não encontrado. O usuário precisa ter feito login pelo menos uma vez com esse e-mail." },
        { status: 404 }
      );
    }

    const uid = profile.id;
    await db.from("allowlist").upsert(
      { email, active: true, role_default: role, hub_id: hubId, updated_at: new Date().toISOString() } as any,
      { onConflict: "email" }
    );
    const profilesTable = db.from("profiles") as any;
    await profilesTable.update({
      role,
      hub_id: hubId,
      status: "active",
      updated_at: new Date().toISOString(),
    }).eq("id", uid);

    return NextResponse.json({ ok: true, uid, role, hubId });
  } catch (e) {
    console.error("[admin/setRole]", e);
    return NextResponse.json({ error: "Erro ao atualizar função." }, { status: 500 });
  }
}
