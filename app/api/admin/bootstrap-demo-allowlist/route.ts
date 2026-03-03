/**
 * POST /api/admin/bootstrap-demo-allowlist — No auth. One-time fix for demo login.
 * Body: { secret: string }.
 * For each demo email (@todogreen.demo), if the user exists in Supabase (profiles), sets allowlist + profiles.
 * Requires SUPABASE_BOOTSTRAP_SECRET or SEED_SECRET.
 */

import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { PortalRole } from "@/lib/supabase/auth-helpers";

const DEMO_ACCOUNTS: { email: string; role: PortalRole; hubId: string | null; displayName: string }[] = [
  { email: "admin@todogreen.demo", role: "ADMIN", hubId: null, displayName: "Admin Demo" },
  { email: "gestor@todogreen.demo", role: "MANAGER", hubId: null, displayName: "Gestor Demo" },
  { email: "rh@todogreen.demo", role: "MANAGER", hubId: null, displayName: "RH Demo" },
  { email: "colaborador@todogreen.demo", role: "EMPLOYEE", hubId: null, displayName: "Colaborador Demo" },
  { email: "motorista@todogreen.demo", role: "DRIVER", hubId: "hub-1", displayName: "Motorista Demo" },
  { email: "hubops@todogreen.demo", role: "HUB_OPS", hubId: null, displayName: "Hub Ops Demo" },
];

export async function POST(request: Request) {
  const db = createServiceRoleClient();
  if (!db) {
    return NextResponse.json({ error: "Supabase não configurado." }, { status: 503 });
  }

  const secret = process.env.SUPABASE_BOOTSTRAP_SECRET?.trim() || process.env.SEED_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: "Bootstrap não configurado. Defina SUPABASE_BOOTSTRAP_SECRET ou SEED_SECRET no .env.local." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const providedSecret = typeof body.secret === "string" ? body.secret.trim() : "";
    if (providedSecret !== secret) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const results: { email: string; role: PortalRole; status: "ok" | "skipped"; message?: string }[] = [];

    for (const { email, role, hubId, displayName } of DEMO_ACCOUNTS) {
      const emailLower = email.toLowerCase();
      const { data } = await db.from("profiles").select("id").eq("email", emailLower).single();
      const profile = data as { id: string } | null;
      if (!profile?.id) {
        results.push({
          email: emailLower,
          role,
          status: "skipped",
          message: "Usuário não existe. Crie em Supabase Auth (Dashboard ou sign-up) primeiro.",
        });
        continue;
      }
      const allowlistRow = {
        email: emailLower,
        active: true,
        role_default: role,
        hub_id: hubId,
        updated_at: new Date().toISOString(),
      };
      await db.from("allowlist").upsert(allowlistRow as any, { onConflict: "email" });
      // Supabase client untyped; cast so .update() accepts our payload
      const profilesTable = db.from("profiles") as any;
      await profilesTable
        .update({ display_name: displayName, role, hub_id: hubId, status: "active", updated_at: new Date().toISOString() })
        .eq("id", profile.id);
      results.push({ email: emailLower, role, status: "ok" });
    }

    const okCount = results.filter((r) => r.status === "ok").length;
    return NextResponse.json({
      ok: true,
      message:
        okCount > 0
          ? `${okCount} conta(s) liberada(s) para login. Use o e-mail e senha configurados.`
          : "Nenhum usuário encontrado. Crie as contas em Supabase Auth e chame esta API novamente.",
      results,
    });
  } catch (e) {
    console.error("[admin/bootstrap-demo-allowlist]", e);
    return NextResponse.json(
      { error: "Erro ao configurar allowlist.", details: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
