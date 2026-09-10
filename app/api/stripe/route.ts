import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: "Boekingsnummer ontbreekt." },
        { status: 400 }
      );
    }

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("boekingen")
      .select("id, email, totaalprijs, betaald")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: "Boeking niet gevonden." },
        { status: 404 }
      );
    }

    if (booking.betaald === true) {
      return NextResponse.json(
        { error: "Deze boeking is al betaald." },
        { status: 400 }
      );
    }

    const totaalprijs = Number(booking.totaalprijs);

    if (!Number.isFinite(totaalprijs) || totaalprijs <= 0) {
      return NextResponse.json(
        { error: "Ongeldige boekingsprijs." },
        { status: 400 }
      );
    }

    if (!booking.email) {
      return NextResponse.json(
        { error: "E-mailadres ontbreekt bij de boeking." },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
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
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout fout:", error);

    return NextResponse.json(
      { error: "Betaling kon niet worden gestart." },
      { status: 500 }
    );
  }
}
