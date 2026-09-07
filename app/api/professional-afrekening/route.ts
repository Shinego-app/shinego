import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { maakFactuurnummer } from "@/lib/factuur";
import { maakProfessionalAfrekeningPdf } from "@/lib/professionalAfrekening";

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
        { error: "booking_id ontbreekt." },
        { status: 400 }
      );
    }

    const { data: professional, error: professionalError } = await supabaseAdmin
      .from("professionals")
      .select("id, user_id, bedrijfsnaam, kvk_nummer, btw_nummer")
      .eq("user_id", user.id)
      .single();

    if (professionalError || !professional) {
      return NextResponse.json(
        { error: "Professional niet gevonden." },
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
        { error: "Opdracht niet gevonden." },
        { status: 404 }
      );
    }

    if (booking.uitbetaald !== true || !booking.stripe_transfer_id) {
      return NextResponse.json(
        { error: "Deze opdracht is nog niet uitbetaald." },
        { status: 400 }
      );
    }

    if (!user.email) {
      return NextResponse.json(
        { error: "Geen e-mailadres gevonden voor professional." },
        { status: 400 }
      );
    }

    const factuurnummer =
      booking.factuurnummer ?? maakFactuurnummer(Number(booking.id));

    const klantbedrag = Number(booking.totaalprijs ?? 0);
    const professionalBedrag = Number(
      booking.uitbetaald_bedrag ?? booking.professional_bedrag ?? 0
    );
    const platformCommissie = Number(
      booking.platform_commissie ?? Math.max(0, klantbedrag - professionalBedrag)
    );

    const pdfBytes = await maakProfessionalAfrekeningPdf({
      factuurnummer,
      datum: new Date().toLocaleDateString("nl-NL"),
      professionalBedrijfsnaam: professional.bedrijfsnaam,
      professionalKvK: professional.kvk_nummer,
      professionalBtwNummer: professional.btw_nummer,
      bookingId: booking.id,
      klantbedrag,
      platformCommissie,
      professionalBedrag,
      stripeTransferId: booking.stripe_transfer_id,
    });

    const { error: emailError } = await resend.emails.send({
      from: "ShineGo <noreply@shinego.nl>",
      to: user.email,
      subject: `Uitbetalingsafrekening ${factuurnummer} - ShineGo`,
      html: `
        <p>Beste ${professional.bedrijfsnaam},</p>
        <p>De uitbetaling voor opdracht ${booking.id} is uitgevoerd.</p>
        <p>In de bijlage vind je de uitbetalingsafrekening.</p>
        <p>Met vriendelijke groet,<br />ShineGo</p>
      `,
      attachments: [
        {
          filename: `afrekening-${factuurnummer}.pdf`,
          content: Buffer.from(pdfBytes),
        },
      ],
    });

    if (emailError) {
      console.error("Professional afrekening e-mail fout:", emailError);
      return NextResponse.json(
        { error: "Afrekening kon niet worden verzonden." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Professional afrekening fout:", error);
    return NextResponse.json(
      { error: "Afrekening kon niet worden verzonden." },
      { status: 500 }
    );
  }
}
