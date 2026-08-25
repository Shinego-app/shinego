import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Geen Stripe-signature ontvangen" },
      { status: 400 }
    );
  }

  try {
   const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
if (event.type === "checkout.session.completed") {
  const session = event.data.object as Stripe.Checkout.Session;
  const bookingId = session.metadata?.bookingId;

  if (bookingId && session.payment_intent) {
    const paymentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent.id;

    const platformCommissie = Math.round((session.amount_total ?? 0) * 0.15) / 100;
    const professionalBedrag = (session.amount_total ?? 0) / 100 - platformCommissie;
        await supabaseAdmin
      .from("boekingen")
      .update({
  stripe_payment_id: paymentId,
  betaald: true,
  platform_commissie: platformCommissie,
  professional_bedrag: professionalBedrag,
})
      .eq("id", bookingId);
  }
}
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook fout:", error);

    return NextResponse.json(
      { error: "Webhook verificatie mislukt" },
      { status: 400 }
    );
  }
}