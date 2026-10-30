/**
 * Seed and demo routes stay off unless ENABLE_DEMO_TOOLS=true (local or staging only).
 */

import { NextResponse } from "next/server";

export function demoToolsDisabledResponse(): NextResponse | null {
  if (process.env.ENABLE_DEMO_TOOLS?.trim() === "true") return null;
  return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
}
