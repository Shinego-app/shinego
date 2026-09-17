import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { maakFactuurPdf, maakFactuurnummer } from "@/lib/factuur";
import { magOpdrachtStarten } from "@/lib/opdrachtTijd";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get("authorization");
    const token = authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : null;

    if (!token) {
      return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
    }

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Ongeldige sessie." }, { status: 401 });
    }

    const { booking_id } = await req.json();

    if (!booking_id) {
      return NextResponse.json(
        { error: "booking_id ontbreekt" },
        { status: 400 }
      );
    }

    const { data: professional, error: professionalLookupError } = await supabaseAdmin
      .from("professionals")
      .select("id, bedrijfsnaam, kvk_nummer, btw_nummer")
      .eq("user_id", user.id)
      .single();

    if (professionalLookupError || !professional) {
      return NextResponse.json(
        { error: "Professional niet gevonden" },
        { status: 404 }
      );
    }

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("boekingen")
      .select("*")
      .eq("id", booking_id)
      .eq("professional_id", professional.id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: "Boeking niet gevonden of niet aan jou toegewezen" },
        { status: 404 }
      );
    }

    if (booking.betaald !== true) {
      return NextResponse.json(
        { error: "Boeking is niet betaald" },
        { status: 400 }
      );
    }

    const tijdControle = magOpdrachtStarten(booking.gewenste_datum, booking.gewenste_tijd);
    if (!tijdControle.toegestaan) {
      return NextResponse.json(
        { error: tijdControle.reden },
        { status: 400 }
      );
    }

    if (booking.status === "afgerond") {
      return NextResponse.json(
        { error: "Opdracht is al afgerond" },
        { status: 400 }
      );
    }

    if (booking.status !== "onderweg") {
      return NextResponse.json(
        { error: "Alleen een gestarte opdracht kan worden afgerond" },
        { status: 400 }
      );
    }

    const factuurnummer =
      booking.factuurnummer ?? maakFactuurnummer(Number(booking.id));

    const { error: updateError } = await supabaseAdmin
      .from("boekingen")
      .update({
        status: "afgerond",
        factuurnummer,
      })
      .eq("id", booking.id)
      .eq("professional_id", professional.id)
      .eq("status", "onderweg");

    if (updateError) {
      return NextResponse.json(
        { error: "Opdracht afronden mislukt" },
        { status: 500 }
      );
    }

    const pdfBytes = await maakFactuurPdf({
      factuurnummer,
      datum: new Date().toLocaleDateString("nl-NL"),
      klantNaam: `${booking.voornaam} ${booking.achternaam}`,
      klantEmail: booking.email,
      klantStraat: booking.straat,
      klantHuisnummer: booking.huisnummer,
      klantToevoeging: booking.toevoeging,
      klantPostcode: booking.postcode,
      klantPlaats: booking.plaats,
      professionalBedrijfsnaam: professional.bedrijfsnaam,
      professionalKvK: professional.kvk_nummer,
      professionalBtwNummer: professional.btw_nummer,
      omschrijving: "Glazenwassen via ShineGo",
      bedrag: Number(booking.totaalprijs),
    });

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://shinego.nl").replace(/\/$/, "");
    const reviewUrl = `${siteUrl}/review/${booking.review_token}`;

    const { error: klantEmailError } = await resend.emails.send({
      from: "ShineGo <noreply@shinego.nl>",
      to: booking.email,
      subject: `Factuur ${factuurnummer} - ShineGo`,
      html: `
        <p>Beste ${booking.voornaam},</p>
        <p>Je opdracht is afgerond. In de bijlage vind je jouw factuur.</p>
        <p>Hoe was je ervaring met ${professional.bedrijfsnaam}? Je helpt andere klanten en de professional met een korte beoordeling.</p>
        <p><a href="${reviewUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:600;">Geef een beoordeling</a></p>
        <p>Bedankt voor het gebruik van ShineGo.</p>
      `,
      attachments: [
        {
          filename: `${factuurnummer}.pdf`,
          content: Buffer.from(pdfBytes),
        },
      ],
    });

    if (klantEmailError) {
      return NextResponse.json(
        { error: "Opdracht is afgerond, maar factuurmail naar klant verzenden mislukt" },
        { status: 500 }
      );
    }

    if (user.email) {
      const professionalBedrag = Number(booking.professional_bedrag || 0);
      const uitbetalingTekst = professionalBedrag > 0
        ? `<p>Jouw bedrag voor deze opdracht is <strong>€${professionalBedrag.toFixed(2).replace(".", ",")}</strong>.</p>`
        : "";

      const { error: professionalEmailError } = await resend.emails.send({
        from: "ShineGo <noreply@shinego.nl>",
        to: user.email,
        subject: `Factuurkopie ${factuurnummer} - ShineGo`,
        html: `
          <p>Beste ${professional.bedrijfsnaam},</p>
          <p>De opdracht is succesvol afgerond.</p>
          ${uitbetalingTekst}
          <p>In de bijlage vind je een factuurkopie voor je administratie.</p>
          <p>Met vriendelijke groet,<br />ShineGo</p>
        `,
        attachments: [
          {
            filename: `${factuurnummer}.pdf`,
            content: Buffer.from(pdfBytes),
          },
        ],
      });

      if (professionalEmailError) {
        console.error("Factuurmail professional fout:", professionalEmailError);
        return NextResponse.json(
          { error: "Opdracht is afgerond en klantmail is verzonden, maar factuurmail naar professional is mislukt" },
          { status: 500 }
        );
      }
    } else {
      console.warn("Geen e-mailadres gevonden voor professional:", professional.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Opdracht afronden fout:", error);

    return NextResponse.json(
      { error: "Onverwachte fout" },
      { status: 500 }
    );
  }
}
