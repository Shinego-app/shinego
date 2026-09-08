import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { naam, email, onderwerp, bericht, website } = await req.json();

    // Honeypot tegen eenvoudige spambots.
    if (website) {
      return NextResponse.json({ success: true });
    }

    if (
      typeof naam !== "string" ||
      typeof email !== "string" ||
      typeof onderwerp !== "string" ||
      typeof bericht !== "string" ||
      !naam.trim() ||
      !email.trim() ||
      !onderwerp.trim() ||
      !bericht.trim()
    ) {
      return NextResponse.json(
        { error: "Vul alle verplichte velden in." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Vul een geldig e-mailadres in." },
        { status: 400 }
      );
    }

    if (naam.length > 100 || onderwerp.length > 150 || bericht.length > 5000) {
      return NextResponse.json(
        { error: "Een of meer velden zijn te lang." },
        { status: 400 }
      );
    }

    const contactEmail = process.env.CONTACT_EMAIL;
    if (!contactEmail) {
      console.error("CONTACT_EMAIL ontbreekt");
      return NextResponse.json(
        { error: "Contactformulier is tijdelijk niet beschikbaar." },
        { status: 503 }
      );
    }

    const { error } = await resend.emails.send({
      from: "ShineGo <noreply@shinego.nl>",
      to: contactEmail,
      replyTo: email.trim(),
      subject: `Contact ShineGo: ${onderwerp.trim()}`,
      html: `
        <h2>Nieuw bericht via ShineGo</h2>
        <p><strong>Naam:</strong> ${escapeHtml(naam.trim())}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(email.trim())}</p>
        <p><strong>Onderwerp:</strong> ${escapeHtml(onderwerp.trim())}</p>
        <p><strong>Bericht:</strong></p>
        <p>${escapeHtml(bericht.trim()).replace(/\n/g, "<br>")}</p>
      `,
    });

    if (error) {
      console.error("Contactmail verzenden mislukt", error);
      return NextResponse.json(
        { error: "Verzenden is mislukt. Probeer het later opnieuw." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Onverwachte fout." },
      { status: 500 }
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
