import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { maakFactuurnummer } from "@/lib/factuur";
import { maakProfessionalAfrekeningPdf } from "@/lib/professionalAfrekening";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization");
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

    const body = await request.json();
    const { booking_id } = body;

    if (!booking_id) {
      return NextResponse.json(
        { error: "booking_id ontbreekt." },
        { status: 400 }
      );
    }

    const { data: professional, error: professionalError } = await supabaseAdmin
      .from("professionals")
      .select(
        "id, stripe_account_id, uitbetalingen_actief, user_id, bedrijfsnaam, kvk_nummer, btw_nummer"
      )
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
        { error: "Boeking niet gevonden of niet aan jou toegewezen." },
        { status: 404 }
      );
    }

    if (booking.status !== "afgerond") {
      return NextResponse.json(
        { error: "Boeking is nog niet afgerond." },
        { status: 400 }
      );
    }

    if (booking.uitbetaald === true) {
      return NextResponse.json(
        { error: "Boeking is al uitbetaald." },
        { status: 400 }
      );
    }

    if (!professional.stripe_account_id) {
      return NextResponse.json(
        { error: "Professional heeft geen Stripe Connect-account." },
        { status: 400 }
      );
    }

    const accountStatusResponse = await fetch(
      `https://api.stripe.com/v2/core/accounts/${encodeURIComponent(
        professional.stripe_account_id
      )}?include[0]=configuration.recipient`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
          "Stripe-Version": "2026-07-29.preview",
        },
      }
    );

    const stripeAccount = await accountStatusResponse.json();

    if (!accountStatusResponse.ok) {
      console.error("Stripe accountstatus fout:", stripeAccount);
      return NextResponse.json(
        { error: "Stripe-accountstatus kon niet worden gecontroleerd." },
        { status: 400 }
      );
    }

    const transferStatus =
      stripeAccount.configuration?.recipient?.capabilities?.stripe_balance
        ?.stripe_transfers?.status;

    const payoutsActive = transferStatus === "active";

    const { error: statusUpdateError } = await supabaseAdmin
      .from("professionals")
      .update({ uitbetalingen_actief: payoutsActive })
      .eq("id", professional.id);

    if (statusUpdateError) {
      throw statusUpdateError;
    }

    if (!payoutsActive) {
      return NextResponse.json(
        {
          error: `Uitbetalingen zijn in Stripe niet actief (${transferStatus ?? "onbekend"}).`,
        },
        { status: 400 }
      );
    }

    const amount = Math.round(Number(booking.professional_bedrag) * 100);

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Ongeldig uitbetalingsbedrag." },
        { status: 400 }
      );
    }

    if (!booking.stripe_payment_id) {
      return NextResponse.json(
        { error: "Stripe betaling ontbreekt bij deze boeking." },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(
      booking.stripe_payment_id
    );

    const chargeId =
      typeof paymentIntent.latest_charge === "string"
        ? paymentIntent.latest_charge
        : paymentIntent.latest_charge?.id;

    if (!chargeId) {
      return NextResponse.json(
        { error: "Geen Stripe charge gevonden voor deze betaling." },
        { status: 400 }
      );
    }

    const transfer = await stripe.transfers.create(
      {
        amount,
        currency: "eur",
        destination: professional.stripe_account_id,
        source_transaction: chargeId,
        metadata: {
          booking_id: String(booking.id),
        },
      },
      {
        idempotencyKey: `shinego-payout-booking-${booking.id}`,
      }
    );

    const factuurnummer =
      booking.factuurnummer ?? maakFactuurnummer(Number(booking.id));

    const { error: updateError } = await supabaseAdmin
      .from("boekingen")
      .update({
        uitbetaald: true,
        uitbetaald_bedrag: Number(booking.professional_bedrag),
        stripe_transfer_id: transfer.id,
        factuurnummer,
      })
      .eq("id", booking.id)
      .eq("professional_id", professional.id)
      .eq("uitbetaald", false);

    if (updateError) {
      throw updateError;
    }

    let afrekeningVerzonden = false;

    try {
      const professionalEmail = user.email;

      if (professionalEmail) {
        const klantbedrag = Number(booking.totaalprijs ?? 0);
        const professionalBedrag = Number(booking.professional_bedrag ?? 0);
        const platformCommissie = Number(
          booking.platform_commissie ??
            Math.max(0, klantbedrag - professionalBedrag)
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
          stripeTransferId: transfer.id,
        });

        const { error: emailError } = await resend.emails.send({
          from: "ShineGo <noreply@shinego.nl>",
          to: professionalEmail,
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

        if (!emailError) {
          afrekeningVerzonden = true;
        } else {
          console.error("Afrekening e-mail fout:", emailError);
        }
      }
    } catch (emailError) {
      console.error("Afrekening na uitbetaling verzenden fout:", emailError);
    }

    return NextResponse.json({
      success: true,
      transfer_id: transfer.id,
      afrekening_verzonden: afrekeningVerzonden,
    });
  } catch (error) {
    console.error("Stripe payout fout:", error);

    return NextResponse.json(
      { error: "Uitbetaling kon niet worden uitgevoerd." },
      { status: 500 }
    );
  }
}
