import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const STRIPE_API_VERSION = "2026-08-26.preview";

async function zorgVoorVertegenwoordiger(accountId: string, professional: any, email: string) {
  const listResponse = await fetch(
    `https://api.stripe.com/v1/accounts/${encodeURIComponent(accountId)}/persons?limit=100`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      },
      cache: "no-store",
    }
  );

  const listData = await listResponse.json();
  if (!listResponse.ok) {
    throw new Error(
      listData?.error?.message || "Stripe-vertegenwoordiger kon niet worden opgehaald."
    );
  }

  const bestaandeVertegenwoordiger = Array.isArray(listData?.data)
    ? listData.data.find((person: any) => person?.relationship?.representative === true)
    : null;

  const params = new URLSearchParams();
  params.set("first_name", professional.voornaam || "");
  params.set("last_name", professional.achternaam || "");
  params.set("email", email);
  if (professional.telefoon) params.set("phone", professional.telefoon);
  params.set("relationship[representative]", "true");

  const personUrl = bestaandeVertegenwoordiger?.id
    ? `https://api.stripe.com/v1/accounts/${encodeURIComponent(accountId)}/persons/${encodeURIComponent(bestaandeVertegenwoordiger.id)}`
    : `https://api.stripe.com/v1/accounts/${encodeURIComponent(accountId)}/persons`;

  const personResponse = await fetch(personUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const personData = await personResponse.json();
  if (!personResponse.ok) {
    throw new Error(
      personData?.error?.message || "Stripe-vertegenwoordiger kon niet worden bijgewerkt."
    );
  }
}

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
          dashboard: "express",
          identity: {
            country: "nl",
            entity_type: "company",
            ...accountPrefill.identity,
          },
          defaults: {
            ...accountPrefill.defaults,
            locales: ["nl-NL"],
            responsibilities: {
              fees_collector: "application",
              losses_collector: "application",
            },
          },
          configuration: {
            recipient: {
              capabilities: {
                stripe_balance: {
                  stripe_transfers: { requested: true },
                },
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

    if (!accountId) {
      throw new Error("Stripe-account ontbreekt.");
    }

    await zorgVoorVertegenwoordiger(accountId, professional, email);

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
