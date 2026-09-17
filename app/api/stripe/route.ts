import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { controleerCheckoutToken } from "@/lib/checkoutToken";

export async function POST(request: Request) {
  try {
    const { bookingId, checkoutToken } = await request.json();

    if (!bookingId || typeof checkoutToken !== "string") {
      return NextResponse.json(
        { error: "Boekingsnummer of betaalautorisatie ontbreekt.", stage: "request" },
        { status: 400 }
      );
    }

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("boekingen")
      .select("id, email, totaalprijs, betaald")
      .eq("id", bookingId)
      .single();

    if (bookingError) {
      console.error("Stripe Checkout - Supabase boeking ophalen fout:", bookingError);
      return NextResponse.json(
        {
          error: "De boeking kon niet via de server uit Supabase worden geladen.",
          stage: "supabase",
          code: bookingError.code || null,
        },
        { status: 500 }
      );
    }

    if (!booking) {
      return NextResponse.json(
        { error: "Boeking niet gevonden.", stage: "supabase" },
        { status: 404 }
      );
    }

    if (booking.betaald === true) {
      return NextResponse.json(
        { error: "Deze boeking is al betaald.", stage: "booking" },
        { status: 400 }
      );
    }

    const totaalprijs = Number(booking.totaalprijs);

    if (!Number.isFinite(totaalprijs) || totaalprijs <= 0) {
      return NextResponse.json(
        { error: "Ongeldige boekingsprijs.", stage: "booking" },
        { status: 400 }
      );
    }

    if (!controleerCheckoutToken(checkoutToken, booking.id, totaalprijs)) {
      return NextResponse.json(
        { error: "Ongeldige of verlopen betaalautorisatie.", stage: "authorization" },
        { status: 401 }
      );
    }

    if (!booking.email) {
      return NextResponse.json(
        { error: "E-mailadres ontbreekt bij de boeking.", stage: "booking" },
        { status: 400 }
      );
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.error("Stripe Checkout - STRIPE_SECRET_KEY ontbreekt in runtime.");
      return NextResponse.json(
        { error: "Stripe Production-key ontbreekt in Vercel.", stage: "stripe_config" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);

    try {
      const session = await stripe.checkout.sessions.create(
        {
          mode: "payment",
          customer_email: booking.email,
          line_items: [
            {
              price_data: {
                currency: "eur",
                product_data: {
                  name: "ShineGo glazenwassen",
                },
                unit_amount: Math.round(totaalprijs * 100),
              },
              quantity: 1,
            },
          ],
          metadata: {
            bookingId: String(booking.id),
          },
          success_url: "https://www.shinego.nl/boeken/glazenwassen/succes?betaling=succes",
          cancel_url: "https://www.shinego.nl/boeken/glazenwassen/bevestigen?betaling=geannuleerd",
        },
        {
          idempotencyKey: `shinego-checkout-booking-${booking.id}`,
        }
      );

      if (!session.url) {
        console.error("Stripe Checkout - sessie zonder URL:", session.id);
        return NextResponse.json(
          { error: "Stripe heeft geen betaalpagina teruggegeven.", stage: "stripe" },
          { status: 500 }
        );
      }

      return NextResponse.json({ url: session.url });
    } catch (stripeError) {
      console.error("Stripe Checkout - Stripe API fout:", stripeError);

      if (stripeError instanceof Stripe.errors.StripeAuthenticationError) {
        return NextResponse.json(
          { error: "Stripe weigert de Production API-sleutel.", stage: "stripe_auth" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: "Stripe Checkout kon niet worden aangemaakt.", stage: "stripe" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Stripe Checkout onverwachte fout:", error);

    return NextResponse.json(
      { error: "Onverwachte fout bij het starten van de betaling.", stage: "unexpected" },
      { status: 500 }
    );
  }
}
