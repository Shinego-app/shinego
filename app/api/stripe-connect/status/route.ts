import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !userData.user) {
      return NextResponse.json({ error: "Ongeldige sessie." }, { status: 401 });
    }

    const { data: professional, error: professionalError } = await supabaseAdmin
      .from("professionals")
      .select("id, stripe_account_id")
      .eq("user_id", userData.user.id)
      .single();

    if (professionalError || !professional?.stripe_account_id) {
      return NextResponse.json({ error: "Stripe Connect-account niet gevonden." }, { status: 404 });
    }

    const account = await stripe.accounts.retrieve(professional.stripe_account_id);
    const transfersActive = account.capabilities?.transfers === "active";
    const payoutsActive = account.payouts_enabled === true;
    const uitbetalingenActief = transfersActive && payoutsActive;

    const { error: updateError } = await supabaseAdmin
      .from("professionals")
      .update({ uitbetalingen_actief: uitbetalingenActief })
      .eq("id", professional.id);

    if (updateError) throw updateError;

    return NextResponse.json({
      uitbetalingen_actief: uitbetalingenActief,
      status: transfersActive ? (payoutsActive ? "active" : "payouts_pending") : account.capabilities?.transfers ?? "onbekend",
    });
  } catch (error) {
    console.error("Stripe Connect status sync fout:", error);
    return NextResponse.json({ error: "Stripe-status synchroniseren mislukt." }, { status: 500 });
  }
}
