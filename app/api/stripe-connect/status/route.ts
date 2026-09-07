import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

    const accountResponse = await fetch(
      `https://api.stripe.com/v2/core/accounts/${encodeURIComponent(professional.stripe_account_id)}?include[0]=configuration.recipient`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
          "Stripe-Version": "2026-07-29.preview",
        },
      }
    );

    const account = await accountResponse.json();
    if (!accountResponse.ok) {
      return NextResponse.json({ error: "Stripe-status kon niet worden gecontroleerd." }, { status: 400 });
    }

    const transferStatus = account.configuration?.recipient?.capabilities?.stripe_balance?.stripe_transfers?.status;
    const payoutsActive = transferStatus === "active";

    const { error: updateError } = await supabaseAdmin
      .from("professionals")
      .update({ uitbetalingen_actief: payoutsActive })
      .eq("id", professional.id);

    if (updateError) throw updateError;

    return NextResponse.json({ uitbetalingen_actief: payoutsActive, status: transferStatus ?? "onbekend" });
  } catch (error) {
    console.error("Stripe Connect status sync fout:", error);
    return NextResponse.json({ error: "Stripe-status synchroniseren mislukt." }, { status: 500 });
  }
}
