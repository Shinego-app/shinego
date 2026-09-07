import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, professional_id: requestedProfessionalId } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is verplicht." }, { status: 400 });
    }

    let professionalQuery = supabaseAdmin
      .from("professionals")
      .select("id, stripe_account_id, uitbetalingen_actief, bedrijfsnaam, voornaam, achternaam, telefoon, postcode, woonplaats, straat, huisnummer, toevoeging, kvk_nummer, btw_nummer");

    if (requestedProfessionalId) {
      professionalQuery = professionalQuery.eq("id", requestedProfessionalId);
    } else {
      professionalQuery = professionalQuery.eq("email", email.trim().toLowerCase());
    }

    const { data: professional, error: professionalError } = await professionalQuery.single();

    if (professionalError || !professional) {
      return NextResponse.json({ error: "Professional niet gevonden." }, { status: 404 });
    }

    const professional_id = professional.id;
    const adresRegel = [
      professional.straat,
      professional.huisnummer,
      professional.toevoeging,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    const kvkNummer = professional.kvk_nummer?.replace(/\D/g, "");
    const btwNummer = professional.btw_nummer
      ?.replace(/[\s.\-]/g, "")
      .toUpperCase();

    const idNumbers = [
      ...(kvkNummer ? [{ type: "nl_kvk", value: kvkNummer }] : []),
      ...(btwNummer ? [{ type: "nl_vat", value: btwNummer }] : []),
    ];

    const accountPrefill = {
      contact_email: email.trim().toLowerCase(),
      display_name: professional.bedrijfsnaam,
      contact_phone: professional.telefoon,
      identity: {
        business_details: {
          registered_name: professional.bedrijfsnaam,
          phone: professional.telefoon,
          ...(idNumbers.length > 0 ? { id_numbers: idNumbers } : {}),
          address: {
            country: "nl",
            line1: adresRegel,
            postal_code: professional.postcode?.trim().toUpperCase(),
            city: professional.woonplaats?.trim(),
          },
        },
      },
      defaults: {
        profile: {
          doing_business_as: professional.bedrijfsnaam,
          product_description: "Glazenwasservice via ShineGo",
        },
      },
    };

    let account: any;

    if (professional.stripe_account_id) {
      account = { id: professional.stripe_account_id };

      // Vul een nog niet afgeronde onboarding opnieuw vanuit ShineGo aan.
      // Actieve accounts slaan we over, omdat geverifieerde identiteit daarna
      // door de professional via Stripe beheerd moet worden.
      if (!professional.uitbetalingen_actief) {
        const updateResponse = await fetch(
          `https://api.stripe.com/v2/core/accounts/${professional.stripe_account_id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
              "Content-Type": "application/json",
              "Stripe-Version": "2026-07-29.preview",
            },
            body: JSON.stringify(accountPrefill),
          }
        );

        const updatedAccount = await updateResponse.json();
        if (!updateResponse.ok) {
          throw new Error(
            updatedAccount?.error?.message ||
              "Bestaande Stripe-account kon niet worden aangevuld."
          );
        }
      }
    } else {
      const accountResponse = await fetch("https://api.stripe.com/v2/core/accounts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
          "Content-Type": "application/json",
          "Stripe-Version": "2026-07-29.preview",
        },
        body: JSON.stringify({
          ...accountPrefill,
          dashboard: "express",
          identity: {
            country: "nl",
            entity_type: "company",
            ...accountPrefill.identity,
          },
          defaults: {
            ...accountPrefill.defaults,
            responsibilities: {
              fees_collector: "application",
              losses_collector: "application",
            },
          },
          configuration: {
            merchant: {
              capabilities: { card_payments: { requested: true } },
            },
            recipient: {
              capabilities: {
                stripe_balance: { stripe_transfers: { requested: true } },
              },
            },
          },
        }),
      });

      account = await accountResponse.json();

      if (!accountResponse.ok) {
        throw new Error(account?.error?.message || "Stripe account kon niet worden gemaakt.");
      }

      const { error: updateError } = await supabaseAdmin
        .from("professionals")
        .update({ stripe_account_id: account.id })
        .eq("id", professional_id);

      if (updateError) throw updateError;
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
            configurations: ["merchant", "recipient"],
            refresh_url: `${origin}/professional/dashboard`,
            return_url: `${origin}/professional/dashboard?stripe=return`,
          },
        },
      }),
    });

    const accountLink = await accountLinkResponse.json();
    if (!accountLinkResponse.ok) {
      throw new Error(accountLink?.error?.message || "Stripe onboarding-link kon niet worden gemaakt.");
    }

    return NextResponse.json({ account_id: account.id, url: accountLink.url });
  } catch (error) {
    console.error("Stripe Connect fout:", error);
    const message = error instanceof Error ? error.message : "Stripe Connect kon niet worden gestart.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
