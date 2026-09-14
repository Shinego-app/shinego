import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "info@shinego.nl";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest) {
  try {
    const { naam, email, boekingsnummer, verklaring, website } = await req.json();

    // Honeypot tegen eenvoudige spambots.
    if (website) {
      return NextResponse.json({ success: true });
    }

    if (
      typeof naam !== "string" ||
      typeof email !== "string" ||
      typeof boekingsnummer !== "string" ||
      typeof verklaring !== "boolean" ||
      !naam.trim() ||
      !email.trim() ||
      !boekingsnummer.trim() ||
      !verklaring
    ) {
      return NextResponse.json(
        { error: "Vul je naam, e-mailadres en boekingsnummer in en bevestig je herroeping." },
        { status: 400 }
      );
    }

    const schoonEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(schoonEmail)) {
      return NextResponse.json({ error: "Vul een geldig e-mailadres in." }, { status: 400 });
    }

    if (naam.length > 120 || boekingsnummer.length > 80) {
      return NextResponse.json({ error: "Een of meer velden zijn te lang." }, { status: 400 });
    }

    const ingediendOp = new Date();
    const datumTijd = new Intl.DateTimeFormat("nl-NL", {
      dateStyle: "full",
      timeStyle: "long",
      timeZone: "Europe/Amsterdam",
    }).format(ingediendOp);

    const veiligeNaam = escapeHtml(naam.trim());
    const veiligEmail = escapeHtml(schoonEmail);
    const veiligBoekingsnummer = escapeHtml(boekingsnummer.trim());

    const klantMail = await resend.emails.send({
      from: "ShineGo <noreply@shinego.nl>",
      to: schoonEmail,
      subject: `Ontvangstbevestiging herroeping – boeking ${boekingsnummer.trim()}`,
      html: `
        <h2>Herroeping ontvangen</h2>
        <p>Beste ${veiligeNaam},</p>
        <p>ShineGo bevestigt dat je online verklaring om de overeenkomst te herroepen is ontvangen.</p>
        <p><strong>Boekingsnummer:</strong> ${veiligBoekingsnummer}</p>
        <p><strong>E-mailadres:</strong> ${veiligEmail}</p>
        <p><strong>Datum en tijd van indiening:</strong> ${escapeHtml(datumTijd)}</p>
        <p><strong>Verklaring:</strong> Ik herroep hierbij de overeenkomst behorend bij bovenstaande boeking.</p>
        <p>Deze ontvangstbevestiging is geen beoordeling van eventuele financiële gevolgen. ShineGo verwerkt de herroeping en eventuele terugbetaling volgens de toepasselijke wet en de overeengekomen voorwaarden.</p>
      `,
    });

    if (klantMail.error) {
      console.error("Herroepingsbevestiging aan klant mislukt", klantMail.error);
      return NextResponse.json(
        { error: "De ontvangstbevestiging kon niet worden verzonden. Probeer het opnieuw of neem contact op met ShineGo via info@shinego.nl." },
        { status: 500 }
      );
    }

    const internMail = await resend.emails.send({
      from: "ShineGo <noreply@shinego.nl>",
      to: CONTACT_EMAIL,
      replyTo: schoonEmail,
      subject: `HERROEPING – boeking ${boekingsnummer.trim()}`,
      html: `
        <h2>Nieuwe online herroeping</h2>
        <p><strong>Naam:</strong> ${veiligeNaam}</p>
        <p><strong>E-mail:</strong> ${veiligEmail}</p>
        <p><strong>Boekingsnummer:</strong> ${veiligBoekingsnummer}</p>
        <p><strong>Datum en tijd:</strong> ${escapeHtml(datumTijd)}</p>
        <p><strong>Verklaring:</strong> De consument heeft bevestigd de overeenkomst behorend bij deze boeking te herroepen.</p>
      `,
    });

    if (internMail.error) {
      console.error("Interne herroepingsmelding mislukt", internMail.error);
    }

    return NextResponse.json({ success: true, submittedAt: ingediendOp.toISOString() });
  } catch (error) {
    console.error("Herroepingsfunctie fout", error);
    return NextResponse.json({ error: "Onverwachte fout." }, { status: 500 });
  }
}
