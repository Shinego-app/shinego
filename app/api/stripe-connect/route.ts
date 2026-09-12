import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const STRIPE_API_VERSION = "2026-07-29.preview";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : null;

    if (!token) {
      return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    const user = userData?.user;

    if (userError || !user) {
      return NextResponse.json({ error: "Sessie ongeldig. Log opnieuw in." }, { status: 401 });
    }

    const { data: professional, error: professionalError } = await supabaseAdmin
      .from("professionals")
      .select("id, email, stripe_account_id, bedrijfsnaam, telefoon")
      .eq("user_id", user.id)
      .single();

    if (professionalError || !professional) {
      return NextResponse.json({ error: "Professional niet gevonden." }, { status: 404 });
    }

    const email = (professional.email || user.email || "").trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "E-mailadres ontbreekt." }, { status: 400 });
    }

    let accountId = professional.stripe_account_id as string | null;

    if (!accountId) {
      const accountResponse = await fetch("https://api.stripe.com/v2/core/accounts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
          "Content-Type": "application/json",
          "Stripe-Version": STRIPE_API_VERSION,
        },
        body: JSON.stringify({
          contact_email: email,
          display_name: professional.bedrijfsnaam,
          contact_phone: professional.telefoon,
          dashboard: "express",
          identity: { country: "nl" },
          defaults: {
            responsibilities: {
              fees_collector: "application",
              losses_collector: "application",
            },
          },
          configuration: {
            recipient: {
              capabilities: {
                stripe_balance: { stripe_transfers: { requested: true } },
              },
            },
          },
        }),
      });

      const account = await accountResponse.json();
      if (!accountResponse.ok) {
        throw new Error(account?.error?.message || "Stripe account kon niet worden gemaakt.");
      }

      accountId = account.id;

      const { error: updateError } = await supabaseAdmin
        .from("professionals")
        .update({ stripe_account_id: accountId })
        .eq("id", professional.id);

      if (updateError) throw updateError;
    }

    const accountStatusResponse = await fetch(
      `https://api.stripe.com/v2/core/accounts/${encodeURIComponent(
        accountId
      )}?include[0]=configuration.recipient&include[1]=configuration.merchant`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
          "Stripe-Version": STRIPE_API_VERSION,
        },
        cache: "no-store",
      }
    );

    const stripeAccount = await accountStatusResponse.json();
    if (!accountStatusResponse.ok) {
      throw new Error(
        stripeAccount?.error?.message || "Stripe accountconfiguratie kon niet worden opgehaald."
      );
    }

    const configurations: string[] = [];
    if (stripeAccount.configuration?.merchant) configurations.push("merchant");
    if (stripeAccount.configuration?.recipient) configurations.push("recipient");

    if (configurations.length === 0) {
      configurations.push("recipient");
    }

    const origin = new URL(request.url).origin;
    const accountLinkResponse = await fetch("https://api.stripe.com/v2/core/account_links", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/json",
        "Stripe-Version": STRIPE_API_VERSION,
      },
      body: JSON.stringify({
        account: accountId,
        use_case: {
          type: "account_onboarding",
          account_onboarding: {
            configurations,
            refresh_url: `${origin}/professional/dashboard`,
            return_url: `${origin}/professional/dashboard?stripe=return`,
          },
        },
      }),
    });

    const accountLink = await accountLinkResponse.json();
    if (!accountLinkResponse.ok || !accountLink?.url) {
      throw new Error(accountLink?.error?.message || "Stripe onboarding-link kon niet worden gemaakt.");
    }

    return NextResponse.json({ account_id: accountId, url: accountLink.url });
  } catch (error) {
    console.error("Stripe Connect fout:", error);
    const message = error instanceof Error ? error.message : "Stripe Connect kon niet worden gestart.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
