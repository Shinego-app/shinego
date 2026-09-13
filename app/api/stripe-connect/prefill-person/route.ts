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

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

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
      .select("stripe_account_id, email, voornaam, achternaam, telefoon, straat, huisnummer, toevoeging, postcode, woonplaats")
      .eq("user_id", user.id)
      .single();

    if (professionalError || !professional?.stripe_account_id) {
      return NextResponse.json({ error: "Stripe-account niet gevonden." }, { status: 404 });
    }

    const metadata = (user.user_metadata || {}) as Record<string, any>;
    const email = (professional.email || user.email || "").trim().toLowerCase();
    const geboortedatum = parseGeboortedatum(metadata.stripe_geboortedatum);
    const telefoon = normaliseerTelefoon(professional.telefoon);

    const adresZelfde = metadata.stripe_priveadres_zelfde !== false;
    const straat = adresZelfde ? professional.straat : metadata.stripe_prive_straat;
    const huisnummer = adresZelfde ? professional.huisnummer : metadata.stripe_prive_huisnummer;
    const toevoeging = adresZelfde ? professional.toevoeging : metadata.stripe_prive_toevoeging;
    const postcode = adresZelfde ? professional.postcode : metadata.stripe_prive_postcode;
    const woonplaats = adresZelfde ? professional.woonplaats : metadata.stripe_prive_woonplaats;
    const adresRegel = [straat, huisnummer, toevoeging].filter(Boolean).join(" ").trim();

    const listResponse = await fetch(
      `https://api.stripe.com/v2/core/accounts/${encodeURIComponent(professional.stripe_account_id)}/persons`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
          "Stripe-Version": STRIPE_API_VERSION,
        },
        cache: "no-store",
      }
    );

    const listData = await listResponse.json();
    if (!listResponse.ok) {
      return NextResponse.json(
        { error: listData?.error?.message || "Stripe-persoon kon niet worden opgehaald." },
        { status: 400 }
      );
    }

    const personen = Array.isArray(listData?.data) ? listData.data : [];
    const bestaandePersoon =
      personen.find((persoon: any) => persoon?.relationship?.representative === true) ||
      personen.find((persoon: any) => String(persoon?.email || "").toLowerCase() === email);

    const payload: Record<string, any> = {
      given_name: professional.voornaam || undefined,
      surname: professional.achternaam || undefined,
      email,
      ...(telefoon ? { phone: telefoon } : {}),
      relationship: {
        representative: true,
        ...(metadata.stripe_eigenaar_bevestigd === true
          ? { owner: true, title: "Eigenaar / vennoot" }
          : {}),
      },
      ...(geboortedatum
        ? {
            date_of_birth: {
              day: geboortedatum.day,
              month: geboortedatum.month,
              year: geboortedatum.year,
            },
          }
        : {}),
      ...(adresRegel && woonplaats && postcode
        ? {
            address: {
              line1: adresRegel,
              city: String(woonplaats).trim(),
              postal_code: String(postcode).trim().toUpperCase(),
              country: "nl",
            },
          }
        : {}),
    };

    const url = bestaandePersoon?.id
      ? `https://api.stripe.com/v2/core/accounts/${encodeURIComponent(professional.stripe_account_id)}/persons/${encodeURIComponent(bestaandePersoon.id)}`
      : `https://api.stripe.com/v2/core/accounts/${encodeURIComponent(professional.stripe_account_id)}/persons`;

    const personResponse = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/json",
        "Stripe-Version": STRIPE_API_VERSION,
      },
      body: JSON.stringify(payload),
    });

    const person = await personResponse.json();
    if (!personResponse.ok) {
      return NextResponse.json(
        { error: person?.error?.message || "Stripe-verificatiegegevens konden niet worden voorbereid." },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, person_id: person.id });
  } catch (error) {
    console.error("Stripe person prefill fout:", error);
    return NextResponse.json(
      { error: "Stripe-verificatiegegevens konden niet worden voorbereid." },
      { status: 500 }
    );
  }
}
