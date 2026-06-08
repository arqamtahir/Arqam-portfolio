import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";
import { profile } from "@/lib/resume";

/**
 * Contact endpoint.
 * Email delivery is scaffolded via Resend and only runs when RESEND_API_KEY
 * is configured. Without a key, the submission is validated and logged so the
 * UX works end-to-end in any environment - no secrets required to develop.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { company_url, ...data } = parsed.data;

  // Honeypot tripped - pretend success, do nothing.
  if (company_url) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? profile.email;

  if (apiKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
        to,
        replyTo: data.email,
        subject: `New inquiry - ${data.intent} - ${data.name}`,
        text: [
          `Name: ${data.name}`,
          `Email: ${data.email}`,
          data.company ? `Company: ${data.company}` : null,
          `Intent: ${data.intent}`,
          "",
          data.message,
        ]
          .filter(Boolean)
          .join("\n"),
      });
    } catch (err) {
      console.error("[contact] Resend send failed:", err);
      return NextResponse.json(
        { ok: false, error: "Could not send right now. Please email me directly." },
        { status: 502 }
      );
    }
  } else {
    // Dev / unconfigured fallback.
    console.info("[contact] (no RESEND_API_KEY) inquiry received:", {
      ...data,
      to,
    });
  }

  return NextResponse.json({ ok: true });
}
