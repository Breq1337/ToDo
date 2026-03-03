import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  city: z.string().optional(),
  state: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  honeypot: z.string().max(0).optional(), // anti-spam: must be empty
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { honeypot, ...data } = parsed.data;
    if (honeypot) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    // TODO: integrate with email provider or CRM (e.g. Resend, SendGrid, HubSpot)
    console.log("[Contact form submission]", data);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 }
    );
  }
}
