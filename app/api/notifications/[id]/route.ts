/**
 * PATCH /api/notifications/[id] — mark notification as read (user can only update their own).
 * DELETE /api/notifications/[id] — delete notification. Allowed: ADMIN; or MANAGER/ADMIN when to==="all"; or author (from === uid).
 */

import { NextResponse } from "next/server";
import { getAuthUserWithRole } from "@/lib/supabase/auth-helpers";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthUserWithRole();
  if (!auth) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "ID obrigatório." }, { status: 400 });
  }

  const db = createServiceRoleClient();
  if (!db) {
    return NextResponse.json({ error: "Serviço não configurado." }, { status: 503 });
  }

  try {
    const { data } = await db.from("notifications").select("to").eq("id", id).single();
    const row = data as { to: string } | null;
    if (!row) {
      return NextResponse.json({ error: "Notificação não encontrada." }, { status: 404 });
    }
    if (row.to !== auth.uid && row.to !== "all") {
      return NextResponse.json({ error: "Sem permissão para esta notificação." }, { status: 403 });
    }
    const notifTable = db.from("notifications") as any;
    await notifTable.update({ read: true }).eq("id", id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[notifications PATCH]", e);
    return NextResponse.json({ error: "Erro ao atualizar." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthUserWithRole();
  if (!auth) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "ID obrigatório." }, { status: 400 });
  }

  const db = createServiceRoleClient();
  if (!db) {
    return NextResponse.json({ error: "Serviço não configurado." }, { status: 503 });
  }

  try {
    const { data } = await db.from("notifications").select("to, from").eq("id", id).single();
    const row = data as { to: string; from: string } | null;
    if (!row) {
      return NextResponse.json({ error: "Notificação não encontrada." }, { status: 404 });
    }
    const canDelete =
      auth.role === "ADMIN" ||
      (auth.role === "MANAGER" && row.to === "all") ||
      row.from === auth.uid;

    if (!canDelete) {
      return NextResponse.json({ error: "Sem permissão para excluir este aviso." }, { status: 403 });
    }

    await db.from("notifications").delete().eq("id", id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[notifications DELETE]", e);
    return NextResponse.json({ error: "Erro ao excluir." }, { status: 500 });
  }
}
