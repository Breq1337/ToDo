/**
 * GET /api/profile — return current user profile (profiles table safe fields).
 * PATCH /api/profile — update profile (displayName, phone, address); merge, do not overwrite role/status.
 */

import { NextResponse } from "next/server";
import { getAuthUserWithRole } from "@/lib/supabase/auth-helpers";
import { createServiceRoleClient } from "@/lib/supabase/server";

const ALLOWED_WRITE = ["displayName", "phone", "address", "city", "state", "zipCode"] as const;
const columnMap: Record<string, string> = {
  displayName: "display_name",
  phone: "phone",
  address: "address",
  city: "city",
  state: "state",
  zipCode: "zip_code",
};

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
    const { data } = await db.from("profiles").select("*").eq("id", auth.uid).single();
    const row = data as Record<string, unknown> | null;
    if (!row) {
      return NextResponse.json({
        email: "",
        displayName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
      });
    }
    return NextResponse.json({
      email: (row.email as string) ?? "",
      displayName: (row.display_name as string) ?? "",
      phone: (row.phone as string) ?? "",
      address: (row.address as string) ?? "",
      city: (row.city as string) ?? "",
      state: (row.state as string) ?? "",
      zipCode: (row.zip_code as string) ?? "",
      updatedAt: row.updated_at ? new Date(row.updated_at as string).toISOString() : "",
    });
  } catch (e) {
    console.error("[profile GET]", e);
    return NextResponse.json({ error: "Erro ao carregar perfil." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const auth = await getAuthUserWithRole();
  if (!auth) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const db = createServiceRoleClient();
  if (!db) {
    return NextResponse.json({ error: "Serviço não configurado." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const updates: Record<string, string | null> = {};
    for (const key of ALLOWED_WRITE) {
      const col = columnMap[key] ?? key;
      if (key in body) {
        const v = body[key];
        updates[col] = typeof v === "string" ? v.trim() || null : null;
      }
    }
    updates.updated_at = new Date().toISOString();
    const profilesTable = db.from("profiles") as any;
    await profilesTable.update(updates).eq("id", auth.uid);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[profile PATCH]", e);
    return NextResponse.json({ error: "Erro ao salvar perfil." }, { status: 500 });
  }
}
