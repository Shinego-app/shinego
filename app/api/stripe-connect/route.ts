import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {

  try {
    const body = await request.json();
  const { email, professional_id: requestedProfessionalId } = body;
    

if (!email) {
  return NextResponse.json(
    { error: "Email is verplicht." },
    { status: 400 }
  );
}

let professionalQuery = supabaseAdmin
  .from("professionals")
  .select("id, stripe_account_id");

if (requestedProfessionalId) {
  professionalQuery = professionalQuery.eq("id", requestedProfessionalId);
} else {
  professionalQuery = professionalQuery.eq(
    "email",
    email.trim().toLowerCase()
  );
}

const { data: professional, error: professionalError } =
  await professionalQuery.single();

if (professionalError || !professional) {
  return NextResponse.json(
    { error: "Professional niet gevonden." },
    { status: 404 }
  );
}

const professional_id = professional.id;

let account: any;

if (professional.stripe_account_id) {
  account = {
    id: professional.stripe_account_id,
  };
} else {
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

  account = await accountResponse.json();

  if (!accountResponse.ok) {
    throw new Error(
      account?.error?.message || "Stripe account kon niet worden gemaakt."
    );
  }

  const { error: updateError } = await supabaseAdmin
    .from("professionals")
    .update({ stripe_account_id: account.id })
    .eq("id", professional_id);

  if (updateError) {
    throw updateError;
  }
}
    const origin = new URL(request.url).origin;

    const accountLinkResponse = await fetch("https://api.stripe.com/v2/core/account_links", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
    "Content-Type": "application/json",
    "Stripe-Version": "2026-07-29.preview",
  },
  body: JSON.stringify({
    account: account.id,
    use_case: {
      type: "account_onboarding",
      account_onboarding: {
        configurations: ["recipient"],
        refresh_url: `${origin}/professional`,
        return_url: `${origin}/professional`,
      },
    },
  }),
});

const accountLink = await accountLinkResponse.json();

if (!accountLinkResponse.ok) {
  throw new Error(accountLink?.error?.message || "Stripe onboarding-link kon niet worden gemaakt.");
}

    return NextResponse.json({
      account_id: account.id,
      url: accountLink.url,
    });
} catch (error) {
  console.error("Stripe Connect fout:", error);

  const message =
    error instanceof Error
      ? error.message
      : "Stripe Connect kon niet worden gestart.";

  return NextResponse.json(
    { error: message },
    { status: 500 }
  );
}
}