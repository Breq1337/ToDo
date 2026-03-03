import { NextResponse } from "next/server";
import { getTutorReply } from "@/lib/gemini/tutor";
import { getAuthUserWithRole } from "@/lib/supabase/auth-helpers";

/**
 * Green Tutor chat — server-only. Uses Gemini Flash.
 * Validates via Supabase session (cookies).
 */
export async function POST(request: Request) {
  try {
    const auth = await getAuthUserWithRole();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const history = Array.isArray(body.history) ? body.history : [];

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY?.trim()) {
      return NextResponse.json(
        {
          reply: null,
          error: "AI_UNAVAILABLE",
          message: "O Tutor Green está indisponível. A chave de API não está configurada.",
        },
        { status: 503 }
      );
    }

    const reply = await getTutorReply({ message, history, locale: "pt-BR" });

    if (reply.includes("indisponível") && reply.includes("GEMINI_API_KEY")) {
      return NextResponse.json(
        { reply, error: "AI_UNAVAILABLE" },
        { status: 503 }
      );
    }

    return NextResponse.json({ reply });
  } catch (e) {
    console.error("[Tutor API]", e);
    return NextResponse.json(
      { error: "Internal error", reply: "Desculpe, ocorreu um erro. Tente novamente." },
      { status: 500 }
    );
  }
}
