import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { maakFactuurnummer } from "@/lib/factuur";
import { maakProfessionalAfrekeningPdf } from "@/lib/professionalAfrekening";
import { magOpdrachtStarten } from "@/lib/opdrachtTijd";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const bookingId = body?.booking_id;

    if (!bookingId) {
      return NextResponse.json({ error: "Boeking ontbreekt." }, { status: 400 });
    }

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("boekingen")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: "Boeking niet gevonden." }, { status: 404 });
    }

    if (!booking.professional_id) {
      return NextResponse.json({ error: "Geen professional aan deze boeking gekoppeld." }, { status: 400 });
    }

    const tijdControle = magOpdrachtStarten(booking.gewenste_datum, booking.gewenste_tijd);
    if (!tijdControle.toegestaan) {
      return NextResponse.json({ error: `Uitbetaling geblokkeerd. ${tijdControle.reden}` }, { status: 400 });
    }

    if (booking.status !== "afgerond") {
      return NextResponse.json({ error: "Boeking is nog niet afgerond." }, { status: 400 });
    }

    if (booking.uitbetaald === true) {
      return NextResponse.json({ error: "Boeking is al uitbetaald." }, { status: 409 });
    }

    const { data: professional, error: professionalError } = await supabaseAdmin
      .from("professionals")
      .select("id, email, stripe_account_id, uitbetalingen_actief, bedrijfsnaam, kvk_nummer, btw_nummer")
      .eq("id", booking.professional_id)
      .single();

    if (professionalError || !professional) {
      return NextResponse.json({ error: "Professional niet gevonden." }, { status: 404 });
    }

    if (!professional.stripe_account_id) {
      return NextResponse.json({ error: "Professional heeft geen Stripe Connect-account." }, { status: 400 });
    }

    const stripeAccount = await stripe.accounts.retrieve(professional.stripe_account_id);
    const transfersActive = stripeAccount.capabilities?.transfers === "active";
    const payoutsEnabled = stripeAccount.payouts_enabled === true;
    const uitbetalingenActief = transfersActive && payoutsEnabled;

    const { error: statusUpdateError } = await supabaseAdmin
      .from("professionals")
      .update({ uitbetalingen_actief: uitbetalingenActief })
      .eq("id", professional.id);

    if (statusUpdateError) throw statusUpdateError;

    if (!uitbetalingenActief) {
      const status = transfersActive ? "bankuitbetaling nog niet actief" : stripeAccount.capabilities?.transfers ?? "onbekend";
      return NextResponse.json({ error: `Uitbetalingen zijn in Stripe niet actief (${status}).` }, { status: 400 });
    }

    const amount = Math.round(Number(booking.professional_bedrag || 0) * 100);
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Ongeldig uitbetalingsbedrag." }, { status: 400 });
    }

    if (!booking.stripe_payment_id) {
      return NextResponse.json({ error: "Stripe betaling ontbreekt bij deze boeking." }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(booking.stripe_payment_id);
    const chargeId = typeof paymentIntent.latest_charge === "string" ? paymentIntent.latest_charge : paymentIntent.latest_charge?.id;

    if (!chargeId) {
      return NextResponse.json({ error: "Geen Stripe charge gevonden voor deze betaling." }, { status: 400 });
    }

    const transfer = await stripe.transfers.create(
      {
        amount,
        currency: "eur",
        destination: professional.stripe_account_id,
        source_transaction: chargeId,
        metadata: { booking_id: String(booking.id) },
      },
      { idempotencyKey: `shinego-payout-booking-${booking.id}` }
    );

    const factuurnummer = booking.factuurnummer ?? maakFactuurnummer(Number(booking.id));

    const { error: updateError } = await supabaseAdmin
      .from("boekingen")
      .update({
        uitbetaald: true,
        uitbetaald_bedrag: Number(booking.professional_bedrag),
        stripe_transfer_id: transfer.id,
        factuurnummer,
      })
      .eq("id", booking.id)
      .eq("uitbetaald", false);

    if (updateError) throw updateError;

    let afrekeningVerzonden = false;
    if (professional.email) {
      try {
        const klantbedrag = Number(booking.totaalprijs ?? 0);
        const professionalBedrag = Number(booking.professional_bedrag ?? 0);
        const platformCommissie = Number(booking.platform_commissie ?? Math.max(0, klantbedrag - professionalBedrag));

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
          stripeTransferId: transfer.id,
        });

        const { error: emailError } = await resend.emails.send({
          from: "ShineGo <noreply@shinego.nl>",
          to: professional.email,
          subject: `Uitbetalingsafrekening ${factuurnummer} - ShineGo`,
          html: `<p>Beste ${professional.bedrijfsnaam || "professional"},</p><p>De uitbetaling voor opdracht ${booking.id} is uitgevoerd.</p><p>In de bijlage vind je de uitbetalingsafrekening.</p><p>Met vriendelijke groet,<br />ShineGo</p>`,
          attachments: [{ filename: `afrekening-${factuurnummer}.pdf`, content: Buffer.from(pdfBytes) }],
        });

        afrekeningVerzonden = !emailError;
      } catch (emailError) {
        console.error("Afrekening na admin-uitbetaling verzenden fout:", emailError);
      }
    }

    return NextResponse.json({ success: true, transfer_id: transfer.id, afrekening_verzonden: afrekeningVerzonden });
  } catch (error) {
    console.error("Admin payout fout:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Uitbetaling kon niet worden uitgevoerd." }, { status: 500 });
  }
}
