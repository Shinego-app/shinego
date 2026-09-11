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
      .select(
        "id, email, stripe_account_id, uitbetalingen_actief, bedrijfsnaam, voornaam, achternaam, telefoon, postcode, woonplaats, straat, huisnummer, toevoeging, kvk_nummer, btw_nummer"
      )
      .eq("user_id", user.id)
      .single();

    if (professionalError || !professional) {
      return NextResponse.json({ error: "Professional niet gevonden." }, { status: 404 });
    }

    const email = (professional.email || user.email || "").trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "E-mailadres ontbreekt." }, { status: 400 });
    }

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
      contact_email: email,
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

    let accountId = professional.stripe_account_id as string | null;

    if (accountId) {
      if (!professional.uitbetalingen_actief) {
        const updateResponse = await fetch(
          `https://api.stripe.com/v2/core/accounts/${accountId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
              "Content-Type": "application/json",
              "Stripe-Version": STRIPE_API_VERSION,
            },
            body: JSON.stringify(accountPrefill),
          }
        );

        const updatedAccount = await updateResponse.json();
        if (!updateResponse.ok) {
          throw new Error(
            updatedAccount?.error?.message ||
              "Bestaande Stripe-account kon niet worden bijgewerkt."
          );
        }
      }
    } else {
      const accountResponse = await fetch("https://api.stripe.com/v2/core/accounts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
          "Content-Type": "application/json",
          "Stripe-Version": STRIPE_API_VERSION,
        },
        body: JSON.stringify({
          ...accountPrefill,
          dashboard: "none",
          identity: {
            country: "nl",
            entity_type: "company",
            ...accountPrefill.identity,
          },
          defaults: {
            ...accountPrefill.defaults,
            locales: ["nl-NL"],
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
        throw new Error(
          account?.error?.message || "Stripe account kon niet worden gemaakt."
        );
      }

      accountId = account.id;

      const { error: updateError } = await supabaseAdmin
        .from("professionals")
        .update({ stripe_account_id: accountId })
        .eq("id", professional.id);

      if (updateError) throw updateError;
    }

    return NextResponse.json({ account_id: accountId });
  } catch (error) {
    console.error("Stripe Connect fout:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Stripe Connect kon niet worden gestart.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
