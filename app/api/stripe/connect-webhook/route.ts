import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export async function POST(request: Request) {
const body = await request.text();
const signature = request.headers.get("stripe-signature");
 if (!signature) {
  return NextResponse.json({ error: "Geen Stripe signature" }, { status: 400 });
}
const webhookSecret = process.env.STRIPE_CONNECT_WEBHOOK_SECRET;
if (!webhookSecret) {
  return NextResponse.json({ error: "Connect webhook secret ontbreekt" }, { status: 500 });
}
  let event;
  try {
   event = stripe.parseEventNotification(body, signature!, webhookSecret);
  } catch {
  return NextResponse.json({ error: "Webhook fout" }, { status: 400 });
}  
const eventType = event.type;
if (eventType === "v2.core.account[configuration.recipient].capability_status_updated") {
  const account = await event.fetchRelatedObject();
  const accountId = account.id;
  console.log("CONNECT ACCOUNT ID:", accountId);
  const payoutsActive = account.configuration?.recipient?.capabilities?.stripe_balance?.stripe_transfers?.status === "active"; 
  console.log("CONNECT RECIPIENT:", JSON.stringify(account.configuration?.recipient));
 const { error } = await supabaseAdmin
  .from("professionals")
  .update({ uitbetalingen_actief: payoutsActive })
  .eq("stripe_account_id", accountId);
  if (error) {
  console.error("CONNECT SUPABASE ERROR:", error);
  return NextResponse.json({ error: error.message }, { status: 500 });
}
 return NextResponse.json({
  received: true,
  accountId,
  payoutStatus: account.configuration?.recipient?.capabilities?.stripe_balance?.payouts?.status,
});
}

return NextResponse.json({ received: true });
} 

  