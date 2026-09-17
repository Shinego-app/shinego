import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminRequest } from "@/lib/adminAuth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Geen toegang." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const bookingId = body?.booking_id;

    if (!bookingId) {
      return NextResponse.json({ error: "Boeking ontbreekt." }, { status: 400 });
    }

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("boekingen")
      .select("id, status, totaalprijs, annuleringskosten, betaald, uitbetaald, stripe_payment_id, stripe_refund_id, terugbetaald, terugbetaald_bedrag")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: "Boeking niet gevonden." }, { status: 404 });
    }

    if (booking.status !== "geannuleerd") {
      return NextResponse.json({ error: "Alleen een geannuleerde boeking kan worden terugbetaald." }, { status: 400 });
    }

    if (booking.betaald !== true) {
      return NextResponse.json({ error: "Deze boeking is niet betaald." }, { status: 400 });
    }

    if (booking.uitbetaald === true) {
      return NextResponse.json({ error: "Deze boeking is al aan de professional uitbetaald. Refund eerst handmatig beoordelen." }, { status: 409 });
    }

    if (!booking.stripe_payment_id) {
      return NextResponse.json({ error: "Stripe betaling ontbreekt bij deze boeking." }, { status: 400 });
    }

    if (booking.terugbetaald === true || booking.stripe_refund_id) {
      return NextResponse.json({ error: "Deze boeking is al terugbetaald." }, { status: 409 });
    }

    const totaal = Number(booking.totaalprijs || 0);
    const kosten = Math.max(0, Math.min(totaal, Number(booking.annuleringskosten || 0)));
    const terugTeBetalen = Math.max(0, totaal - kosten);
    const amount = Math.round(terugTeBetalen * 100);

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Er is geen bedrag om terug te betalen." }, { status: 400 });
    }

    const refund = await stripe.refunds.create(
      {
        payment_intent: booking.stripe_payment_id,
        amount,
        reason: "requested_by_customer",
        metadata: { booking_id: String(booking.id) },
      },
      { idempotencyKey: `shinego-refund-booking-${booking.id}-${amount}` }
    );

    const { error: updateError } = await supabaseAdmin
      .from("boekingen")
      .update({
        stripe_refund_id: refund.id,
        terugbetaald: true,
        terugbetaald_bedrag: terugTeBetalen,
      })
      .eq("id", booking.id)
      .eq("terugbetaald", false);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      refund_id: refund.id,
      terugbetaald_bedrag: terugTeBetalen,
    });
  } catch (error) {
    console.error("Admin refund fout:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Terugbetaling kon niet worden uitgevoerd." },
      { status: 500 }
    );
  }
}
