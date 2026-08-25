import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { booking_id } = body;

    if (!booking_id) {
      return NextResponse.json(
        { error: "booking_id ontbreekt." },
        { status: 400 }
      );
    }

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("boekingen")
      .select("*")
      .eq("id", booking_id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: "Boeking niet gevonden." },
        { status: 404 }
      );
    }

    if (!booking.professional_id) {
      return NextResponse.json(
        { error: "Geen professional gekoppeld." },
        { status: 400 }
      );
    }

    if (booking.uitbetaald === true) {
      return NextResponse.json(
        { error: "Boeking is al uitbetaald." },
        { status: 400 }
      );
    }

    const { data: professional, error: professionalError } =
      await supabaseAdmin
        .from("professionals")
        .select("stripe_account_id, uitbetalingen_actief")
        .eq("id", booking.professional_id)
        .single();

    if (professionalError || !professional) {
      return NextResponse.json(
        { error: "Professional niet gevonden." },
        { status: 404 }
      );
    }

    if (!professional.stripe_account_id) {
      return NextResponse.json(
        { error: "Professional heeft geen Stripe Connect-account." },
        { status: 400 }
      );
    }

    if (professional.uitbetalingen_actief !== true) {
      return NextResponse.json(
        { error: "Uitbetalingen voor deze professional zijn niet actief." },
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

const transfer = await stripe.transfers.create({
  amount,
  currency: "eur",
  destination: professional.stripe_account_id,
  source_transaction: chargeId,
  metadata: {
    booking_id: String(booking.id),
  },
});

    const { error: updateError } = await supabaseAdmin
      .from("boekingen")
      .update({
        uitbetaald: true,
        uitbetaald_bedrag: Number(booking.professional_bedrag),
      })
      .eq("id", booking.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      transfer_id: transfer.id,
    });
  } catch (error) {
    console.error("Stripe payout fout:", error);

    return NextResponse.json(
      { error: "Uitbetaling kon niet worden uitgevoerd." },
      { status: 500 }
    );
  }
}