/**
 * GET /api/notifications — list notifications for current user (to === uid or to === "all").
 * POST /api/notifications — create notification. ADMIN: any recipient. MANAGER: only to "all" (announcements).
 */

import { NextResponse } from "next/server";
import { getAuthUserWithRole } from "@/lib/supabase/auth-helpers";
import { createServiceRoleClient } from "@/lib/supabase/server";

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
    const [resUid, resAll] = await Promise.all([
      db.from("notifications").select("*").eq("to", auth.uid).order("created_at", { ascending: false }).limit(25),
      db.from("notifications").select("*").eq("to", "all").order("created_at", { ascending: false }).limit(25),
    ]);
    type NotifRow = { id: string; from: string; to: string; title: string; body: string; read: boolean; priority?: string; created_at: string };
    const combined = [...(resUid.data ?? []), ...(resAll.data ?? [])] as NotifRow[];
    combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const list = combined.slice(0, 50).map((d) => ({
      id: d.id,
      from: d.from,
      to: d.to,
      title: d.title,
      body: d.body,
      read: d.read,
      priority: d.priority ?? "NORMAL",
      createdAt: d.created_at ? new Date(d.created_at).toISOString() : null,
    }));
    return NextResponse.json({ notifications: list });
  } catch (e) {
    console.error("[notifications GET]", e);
    return NextResponse.json({ error: "Erro ao listar notificações." }, { status: 500 });
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
    const body = await request.json();
    let toRaw = typeof body.to === "string" ? body.to.trim().toLowerCase() : "";
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const bodyText = typeof body.body === "string" ? body.body.trim() : "";
    const priorityRaw = typeof body.priority === "string" ? body.priority.trim().toUpperCase() : "NORMAL";
    const allowedPriorities = ["URGENTE", "NORMAL", "ATUALIZAÇÃO", "ATUALIZACAO", "BAIXA", "INFORMATIVO"] as const;
    const priority = allowedPriorities.includes(priorityRaw as (typeof allowedPriorities)[number])
      ? (priorityRaw === "ATUALIZACAO" ? "ATUALIZAÇÃO" : priorityRaw)
      : "NORMAL";

    if (!toRaw || !title) {
      return NextResponse.json({ error: "Destinatário (to) e título (title) obrigatórios." }, { status: 400 });
    }

    let to: string;
    if (toRaw === "all" || toRaw === "todos") {
      to = "all";
    } else {
      const { data } = await db.from("profiles").select("id").eq("email", toRaw).single();
      const profile = data as { id: string } | null;
      if (!profile?.id) {
        return NextResponse.json({ error: "E-mail não encontrado." }, { status: 404 });
      }
      to = profile.id;
    }

    if (to === "all" && auth.role !== "ADMIN" && auth.role !== "MANAGER") {
      return NextResponse.json(
        { error: "Acesso negado. Apenas Admin ou Gestão podem enviar aviso geral." },
        { status: 403 }
      );
    }

    const { data: inserted } = await (db.from("notifications") as any)
      .insert({
        from: auth.uid,
        to,
        title,
        body: bodyText,
        priority,
        read: false,
      })
      .select("id")
      .single();

    return NextResponse.json({ ok: true, id: (inserted as { id?: string } | null)?.id });
  } catch (e) {
    console.error("[notifications POST]", e);
    return NextResponse.json({ error: "Erro ao criar notificação." }, { status: 500 });
  }
}
