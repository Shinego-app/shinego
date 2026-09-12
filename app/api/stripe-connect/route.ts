import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const STRIPE_API_VERSION = "2026-08-26.preview";

function normaliseerTelefoon(telefoon?: string | null) {
  if (!telefoon) return undefined;

  const opgeschoond = telefoon.replace(/[^\d+]/g, "");

  if (opgeschoond.startsWith("+")) return opgeschoond;
  if (opgeschoond.startsWith("0031")) return `+31${opgeschoond.slice(4)}`;
  if (opgeschoond.startsWith("0")) return `+31${opgeschoond.slice(1)}`;

  return `+31${opgeschoond}`;
}

function parseGeboortedatum(value?: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return { year, month, day };
}

async function zorgVoorVertegenwoordiger(
  accountId: string,
  professional: any,
  email: string,
  userMetadata: Record<string, any>
) {
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

  const telefoon = normaliseerTelefoon(professional.telefoon);
  if (telefoon) params.set("phone", telefoon);

  params.set("relationship[representative]", "true");

  if (userMetadata?.stripe_eigenaar_bevestigd === true) {
    params.set("relationship[owner]", "true");
    params.set("relationship[executive]", "true");
    params.set("relationship[title]", "Eigenaar / vennoot");
  }

  const geboortedatum = parseGeboortedatum(userMetadata?.stripe_geboortedatum);
  if (geboortedatum) {
    params.set("dob[day]", String(geboortedatum.day));
    params.set("dob[month]", String(geboortedatum.month));
    params.set("dob[year]", String(geboortedatum.year));
  }

  const priveAdresZelfde = userMetadata?.stripe_priveadres_zelfde === true;
  if (priveAdresZelfde) {
    const adresRegel = [
      professional.straat,
      professional.huisnummer,
      professional.toevoeging,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    if (adresRegel) params.set("address[line1]", adresRegel);
    if (professional.woonplaats) params.set("address[city]", professional.woonplaats.trim());
    if (professional.postcode) params.set("address[postal_code]", professional.postcode.trim().toUpperCase());
    params.set("address[country]", "NL");
  } else {
    const priveStraat = userMetadata?.stripe_prive_straat;
    const priveHuisnummer = userMetadata?.stripe_prive_huisnummer;
    const priveToevoeging = userMetadata?.stripe_prive_toevoeging;
    const privePostcode = userMetadata?.stripe_prive_postcode;
    const priveWoonplaats = userMetadata?.stripe_prive_woonplaats;

    const priveAdresRegel = [priveStraat, priveHuisnummer, priveToevoeging]
      .filter(Boolean)
      .join(" ")
      .trim();

    if (priveAdresRegel) params.set("address[line1]", priveAdresRegel);
    if (priveWoonplaats) params.set("address[city]", String(priveWoonplaats).trim());
    if (privePostcode) params.set("address[postal_code]", String(privePostcode).trim().toUpperCase());
    if (priveAdresRegel || priveWoonplaats || privePostcode) {
      params.set("address[country]", "NL");
    }
  }

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

    const telefoon = normaliseerTelefoon(professional.telefoon);

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
      ...(telefoon ? { contact_phone: telefoon } : {}),
      identity: {
        business_details: {
          registered_name: professional.bedrijfsnaam,
          ...(telefoon ? { phone: telefoon } : {}),
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

    await zorgVoorVertegenwoordiger(
      accountId,
      professional,
      email,
      (user.user_metadata || {}) as Record<string, any>
    );

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
