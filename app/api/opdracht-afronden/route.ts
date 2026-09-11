import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { maakFactuurPdf, maakFactuurnummer } from "@/lib/factuur";

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

    const { error: emailError } = await resend.emails.send({
      from: "ShineGo <noreply@shinego.nl>",
      to: booking.email,
      subject: `Factuur ${factuurnummer} - ShineGo`,
      html: `
        <p>Beste ${booking.voornaam},</p>
        <p>Je opdracht is afgerond. In de bijlage vind je jouw factuur.</p>
        <p>Bedankt voor het gebruik van ShineGo.</p>
      `,
      attachments: [
        {
          filename: `${factuurnummer}.pdf`,
          content: Buffer.from(pdfBytes),
        },
      ],
    });

    if (emailError) {
      return NextResponse.json(
        { error: "Opdracht is afgerond, maar factuurmail verzenden mislukt" },
        { status: 500 }
      );
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
