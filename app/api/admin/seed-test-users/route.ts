/**
 * POST /api/admin/seed-test-users — protected by X-Seed-Secret = SEED_SECRET.
 * Creates test accounts for each role (password 123456). Uses Supabase Auth + allowlist + profiles.
 */

import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { PortalRole } from "@/lib/supabase/auth-helpers";

const TEST_PASSWORD = "123456";

const TEST_ACCOUNTS: { email: string; role: PortalRole; hubId: string | null }[] = [
  { email: "admin@todogreen.com.br", role: "ADMIN", hubId: null },
  { email: "manager@todogreen.com.br", role: "MANAGER", hubId: null },
  { email: "employee@todogreen.com.br", role: "EMPLOYEE", hubId: null },
  { email: "driver@todogreen.com.br", role: "DRIVER", hubId: "hub-1" },
  { email: "hubops@todogreen.com.br", role: "HUB_OPS", hubId: null },
];

function checkSeedSecret(request: Request): boolean {
  const secret = process.env.SEED_SECRET?.trim();
  if (!secret) return true;
  const header = request.headers.get("X-Seed-Secret")?.trim();
  return header === secret;
}

export async function POST(request: Request) {
  if (!checkSeedSecret(request)) {
    return NextResponse.json(
      { error: "Acesso negado. Envie o header X-Seed-Secret com o valor de SEED_SECRET." },
      { status: 403 }
    );
  }

  const db = createServiceRoleClient();
  if (!db) {
    return NextResponse.json({ error: "Serviço não configurado." }, { status: 503 });
  }

  const results: { email: string; role: PortalRole; status: "created" | "updated" | "error"; message?: string }[] = [];

  try {
    const hubsTable = db.from("hubs") as any;
    await hubsTable.upsert(
      { id: "hub-1", name: "Hub SP Centro" },
      { onConflict: "id" }
    );

    for (const { email, role, hubId } of TEST_ACCOUNTS) {
      const emailLower = email.toLowerCase();
      try {
        const { data } = await db.from("profiles").select("id").eq("email", emailLower).single();
        const existingProfile = data as { id: string } | null;
        if (existingProfile?.id) {
          await db.auth.admin.updateUserById(existingProfile.id, { password: TEST_PASSWORD });
          results.push({ email: emailLower, role, status: "updated" });
        } else {
          const { data: newUser, error: createErr } = await db.auth.admin.createUser({
            email: emailLower,
            password: TEST_PASSWORD,
            email_confirm: true,
          });
          if (createErr || !newUser.user) {
            results.push({ email: emailLower, role, status: "error", message: createErr?.message ?? "Create failed" });
            continue;
          }
          results.push({ email: emailLower, role, status: "created" });
        }

        await db.from("allowlist").upsert(
          { email: emailLower, active: true, role_default: role, hub_id: hubId, updated_at: new Date().toISOString() } as any,
          { onConflict: "email" }
        );
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        results.push({ email: emailLower, role, status: "error", message: msg });
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Contas de teste criadas/atualizadas. Senha: 123456.",
      accounts: results,
    });
  } catch (e) {
    console.error("[admin/seed-test-users]", e);
    return NextResponse.json(
      { error: "Erro ao criar contas de teste.", details: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
