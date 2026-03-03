/**
 * POST /api/admin/seed-demo-accounts — ADMIN only.
 * Creates one demo account per role with @todogreen.demo (password 123456).
 * Sets allowlist and profiles so login grants the correct role.
 */

import { NextResponse } from "next/server";
import { getAuthUserWithRole } from "@/lib/supabase/auth-helpers";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { PortalRole } from "@/lib/supabase/auth-helpers";

const DEMO_PASSWORD = "123456";

const DEMO_ACCOUNTS: { email: string; role: PortalRole; hubId: string | null; displayName: string }[] = [
  { email: "admin@todogreen.demo", role: "ADMIN", hubId: null, displayName: "Admin Demo" },
  { email: "gestor@todogreen.demo", role: "MANAGER", hubId: null, displayName: "Gestor Demo" },
  { email: "rh@todogreen.demo", role: "MANAGER", hubId: null, displayName: "RH Demo" },
  { email: "colaborador@todogreen.demo", role: "EMPLOYEE", hubId: null, displayName: "Colaborador Demo" },
  { email: "motorista@todogreen.demo", role: "DRIVER", hubId: "hub-1", displayName: "Motorista Demo" },
  { email: "hubops@todogreen.demo", role: "HUB_OPS", hubId: null, displayName: "Hub Ops Demo" },
];

export async function POST(request: Request) {
  const auth = await getAuthUserWithRole();
  if (!auth || auth.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado. Apenas ADMIN." }, { status: 403 });
  }

  const db = createServiceRoleClient();
  if (!db) {
    return NextResponse.json({ error: "Serviço não configurado." }, { status: 503 });
  }

  const results: { email: string; role: PortalRole; status: "created" | "updated" | "error"; message?: string }[] = [];

  try {
    for (const { email, role, hubId, displayName } of DEMO_ACCOUNTS) {
      const emailLower = email.toLowerCase();
      try {
        const { data } = await db.from("profiles").select("id").eq("email", emailLower).single();
        const existingProfile = data as { id: string } | null;
        let uid: string;
        if (existingProfile?.id) {
          uid = existingProfile.id;
          await db.auth.admin.updateUserById(uid, { password: DEMO_PASSWORD, user_metadata: { full_name: displayName } });
          results.push({ email: emailLower, role, status: "updated" });
        } else {
          const { data: newUser, error: createErr } = await db.auth.admin.createUser({
            email: emailLower,
            password: DEMO_PASSWORD,
            email_confirm: true,
            user_metadata: { full_name: displayName },
          });
          if (createErr || !newUser.user) {
            results.push({ email: emailLower, role, status: "error", message: createErr?.message ?? "Create failed" });
            continue;
          }
          uid = newUser.user.id;
          results.push({ email: emailLower, role, status: "created" });
        }

        await db.from("allowlist").upsert(
          { email: emailLower, active: true, role_default: role, hub_id: hubId, updated_at: new Date().toISOString() } as any,
          { onConflict: "email" }
        );
        const profilesTable = db.from("profiles") as any;
        await profilesTable.upsert(
          {
            id: uid,
            email: emailLower,
            display_name: displayName,
            role,
            hub_id: hubId,
            status: "active",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        results.push({ email: emailLower, role, status: "error", message: msg });
      }
    }

    const createdCount = results.filter((r) => r.status === "created").length;
    const allUpdated = results.every((r) => r.status === "updated");
    const message =
      allUpdated && createdCount === 0
        ? "Demos já criadas. Use os e-mails @todogreen.demo com senha 123456 para entrar."
        : "Contas demo @todogreen.demo criadas/atualizadas. Senha: 123456";

    return NextResponse.json({
      ok: true,
      message,
      alreadyExists: allUpdated && createdCount === 0,
      accounts: results,
    });
  } catch (e) {
    console.error("[admin/seed-demo-accounts]", e);
    return NextResponse.json(
      { error: "Erro ao criar contas demo.", details: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
