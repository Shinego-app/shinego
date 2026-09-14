import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    const user = userData.user;

    if (userError || !user) {
      return NextResponse.json({ error: "Sessie ongeldig of verlopen." }, { status: 401 });
    }

    const { data: professional, error: professionalError } = await supabaseAdmin
      .from("professionals")
      .select("id, stripe_account_id")
      .eq("user_id", user.id)
      .single();

    if (professionalError || !professional) {
      return NextResponse.json({ error: "Professional niet gevonden." }, { status: 404 });
    }

    if (!professional.stripe_account_id) {
      return NextResponse.json(
        { error: "Stripe-account is nog niet aangemaakt." },
        { status: 409 }
      );
    }

    const accountSession = await stripe.accountSessions.create({
      account: professional.stripe_account_id,
      components: {
        account_onboarding: {
          enabled: true,
          features: {
            external_account_collection: true,
          },
        },
      },
    });

    const publishableKey =
      process.env.STRIPE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      return NextResponse.json(
        { error: "Stripe publishable key ontbreekt in Vercel." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      client_secret: accountSession.client_secret,
      publishable_key: publishableKey,
    });
  } catch (error) {
    console.error("Stripe embedded session fout:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Stripe onboarding kon niet worden geladen.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
