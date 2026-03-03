/**
 * POST /api/admin/createUser — ADMIN only.
 * Creates a new user in Supabase Auth (email/password), then allowlist + profiles.
 */

import { NextResponse } from "next/server";
import { getAuthUserWithRole } from "@/lib/supabase/auth-helpers";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { PortalRole } from "@/lib/supabase/auth-helpers";

const ROLES: PortalRole[] = ["ADMIN", "MANAGER", "EMPLOYEE", "DRIVER", "HUB_OPS"];

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
    const password = typeof body.password === "string" ? body.password : "";
    const displayName = typeof body.displayName === "string" ? body.displayName.trim() || null : null;
    const role = (typeof body.role === "string" && ROLES.includes(body.role as PortalRole)) ? (body.role as PortalRole) : "EMPLOYEE";
    const hubId = typeof body.hubId === "string" && body.hubId.trim() ? body.hubId.trim() : null;

    if (!email) {
      return NextResponse.json({ error: "E-mail obrigatório." }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Senha obrigatória (mínimo 6 caracteres)." }, { status: 400 });
    }

    const { data: newUser, error: createError } = await db.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: displayName ? { full_name: displayName } : undefined,
    });
    if (createError) {
      if (createError.message?.includes("already") || createError.message?.includes("registered")) {
        return NextResponse.json({ error: "Já existe um usuário com este e-mail." }, { status: 409 });
      }
      return NextResponse.json(
        { error: "Erro ao criar usuário.", details: createError.message },
        { status: 500 }
      );
    }
    if (!newUser.user) {
      return NextResponse.json({ error: "Erro ao criar usuário." }, { status: 500 });
    }
    const uid = newUser.user.id;

    await db.from("allowlist").upsert(
      { email, active: true, role_default: role, hub_id: hubId, updated_at: new Date().toISOString() } as any,
      { onConflict: "email" }
    );
    const profilesTable = db.from("profiles") as any;
    await profilesTable
      .update({
        email,
        display_name: displayName,
        role,
        hub_id: hubId,
        status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("id", uid);

    return NextResponse.json({ ok: true, uid, email, role, hubId });
  } catch (e) {
    console.error("[admin/createUser]", e);
    return NextResponse.json(
      { error: "Erro ao criar usuário.", details: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
