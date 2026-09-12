import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Geen Stripe signature" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_CONNECT_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Connect webhook secret ontbreekt" },
      { status: 500 }
    );
  }

  let event;

  try {
    event = stripe.parseEventNotification(body, signature, webhookSecret);
  } catch {
    return NextResponse.json(
      { error: "Webhook fout" },
      { status: 400 }
    );
  }

  const eventType = event.type;

  if (
    eventType ===
      "v2.core.account[configuration.recipient].capability_status_updated" ||
    eventType === "v2.core.account[configuration.recipient].updated"
  ) {
    const account = await event.fetchRelatedObject();
    const accountId = account.id;

    const recipientStatus =
      account.configuration?.recipient?.capabilities?.stripe_balance
        ?.stripe_transfers?.status;

    const payoutsActive = recipientStatus === "active";

    const { error } = await supabaseAdmin
      .from("professionals")
      .update({ uitbetalingen_actief: payoutsActive })
      .eq("stripe_account_id", accountId);

    if (error) {
      console.error("Connect webhook Supabase update fout:", error);

      return NextResponse.json(
        { error: "Professionalstatus kon niet worden bijgewerkt" },
        { status: 500 }
      );
    }

    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}
