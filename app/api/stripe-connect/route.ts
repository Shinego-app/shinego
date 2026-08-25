import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

if (!email) {
  return NextResponse.json(
    { error: "Email is verplicht." },
    { status: 400 }
  );
}

const { data: professional, error: professionalError } = await supabaseAdmin
  .from("professionals")
  .select("id")
  .eq("email", email.trim().toLowerCase())
  .single();

if (professionalError || !professional) {
  return NextResponse.json(
    { error: "Professional niet gevonden." },
    { status: 404 }
  );
}

const professional_id = professional.id;

 const accountResponse = await fetch("https://api.stripe.com/v2/core/accounts", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
    "Content-Type": "application/json",
    "Stripe-Version": "2026-07-29.preview",
  },
  body: JSON.stringify({
    contact_email: email,
    dashboard: "express",
    identity: {
      country: "nl",
    },
    defaults: {
      responsibilities: {
        fees_collector: "application",
        losses_collector: "application",
      },
    },
    configuration: {
      recipient: {
        capabilities: {
          stripe_balance: {
            stripe_transfers: {
              requested: true,
            },
          },
        },
      },
    },
  }),
});

const account = await accountResponse.json();

if (!accountResponse.ok) {
  throw new Error(account?.error?.message || "Stripe account kon niet worden aangemaakt.");
}   
    const { error: updateError } = await supabaseAdmin
  .from("professionals")
  .update({ stripe_account_id: account.id })
  .eq("id", professional_id);

if (updateError) {
  throw updateError;
}

    const origin = new URL(request.url).origin;

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${origin}/professional`,
      return_url: `${origin}/professional`,
      type: "account_onboarding",
    });

    return NextResponse.json({
      account_id: account.id,
      url: accountLink.url,
    });
  } catch (error) {
    console.error("Stripe Connect fout:", error);

    return NextResponse.json(
      { error: "Stripe Connect kon niet worden gestart." },
      { status: 500 }
    );
  }
}