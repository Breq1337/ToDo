import { NextResponse } from "next/server";
import { z } from "zod";
import {
  beginIdempotent,
  finishIdempotent,
  readIdempotencyKey,
  releaseIdempotent,
} from "@/lib/idempotency";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  city: z.string().optional(),
  state: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  honeypot: z.string().max(0).optional(), // anti-spam: must be empty
});

export async function POST(request: Request) {
  // A retry with the same key replays the first success instead of submitting twice.
  const idempotencyKey = readIdempotencyKey(request);
  if (idempotencyKey) {
    const previous = beginIdempotent(idempotencyKey);
    if (previous?.state === "pending") {
      return NextResponse.json(
        { success: false, message: "Request already in progress" },
        { status: 409 }
      );
    }
    if (previous?.state === "done") {
      return NextResponse.json(previous.body, { status: previous.status });
    }
  }

  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      if (idempotencyKey) releaseIdempotent(idempotencyKey);
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { honeypot, ...data } = parsed.data;
    if (honeypot) {
      if (idempotencyKey) releaseIdempotent(idempotencyKey);
      return NextResponse.json({ success: false }, { status: 400 });
    }

    // TODO: integrate with email provider or CRM (e.g. Resend, SendGrid, HubSpot)
    console.log("[Contact form submission]", data);

    const result = { success: true };
    if (idempotencyKey) finishIdempotent(idempotencyKey, 200, result);
    return NextResponse.json(result);
  } catch {
    if (idempotencyKey) releaseIdempotent(idempotencyKey);
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 }
    );
  }
}
