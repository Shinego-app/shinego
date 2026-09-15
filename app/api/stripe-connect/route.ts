import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
        "id, email, stripe_account_id, bedrijfsnaam, telefoon, postcode, woonplaats, straat, huisnummer, toevoeging, kvk_nummer, btw_nummer"
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

    const adresRegel = [professional.straat, professional.huisnummer, professional.toevoeging]
      .filter(Boolean)
      .join(" ")
      .trim();

    let accountId: string | null = professional.stripe_account_id;

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        country: "NL",
        email,
        business_type: "company",
        business_profile: {
          name: professional.bedrijfsnaam || undefined,
          product_description: "Glazenwasservice via ShineGo",
        },
        company: {
          name: professional.bedrijfsnaam || undefined,
          phone: professional.telefoon || undefined,
          address: {
            line1: adresRegel || undefined,
            postal_code: professional.postcode || undefined,
            city: professional.woonplaats || undefined,
            country: "NL",
          },
        },
        capabilities: {
          transfers: { requested: true },
        },
        tos_acceptance: {
          service_agreement: "recipient",
        },
        metadata: {
          shinego_professional_id: String(professional.id),
          kvk_nummer: professional.kvk_nummer || "",
          btw_nummer: professional.btw_nummer || "",
        },
      });

      accountId = account.id;

      const { error: updateError } = await supabaseAdmin
        .from("professionals")
        .update({ stripe_account_id: accountId, uitbetalingen_actief: false })
        .eq("id", professional.id);

      if (updateError) throw updateError;
    } else {
      await stripe.accounts.update(accountId, {
        email,
        business_profile: {
          name: professional.bedrijfsnaam || undefined,
          product_description: "Glazenwasservice via ShineGo",
        },
        metadata: {
          shinego_professional_id: String(professional.id),
          kvk_nummer: professional.kvk_nummer || "",
          btw_nummer: professional.btw_nummer || "",
        },
      });
    }

    return NextResponse.json({ account_id: accountId });
  } catch (error) {
    console.error("Stripe Connect fout:", error);
    const message = error instanceof Error ? error.message : "Stripe Connect kon niet worden gestart.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
