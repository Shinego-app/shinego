import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const STRIPE_API_VERSION = "2026-07-29.preview";

export async function GET(request: Request) {
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
      .select("stripe_account_id")
      .eq("user_id", user.id)
      .single();

    if (professionalError || !professional?.stripe_account_id) {
      return NextResponse.json({ error: "Stripe-account niet gevonden." }, { status: 404 });
    }

    const params = new URLSearchParams();
    params.append("include[]", "requirements");
    params.append("include[]", "future_requirements");
    params.append("include[]", "configuration.recipient");

    const response = await fetch(
      `https://api.stripe.com/v2/core/accounts/${encodeURIComponent(professional.stripe_account_id)}?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
          "Stripe-Version": STRIPE_API_VERSION,
        },
        cache: "no-store",
      }
    );

    const account = await response.json();

    if (!response.ok) {
      console.error("Stripe requirements ophalen fout:", account);
      return NextResponse.json(
        { error: account?.error?.message || "Stripe-verificatie kon niet worden opgehaald." },
        { status: 400 }
      );
    }

    const entries = Array.isArray(account.requirements?.entries)
      ? account.requirements.entries
      : [];

    const openRequirements = entries
      .filter((entry: any) => entry?.status !== "satisfied")
      .map((entry: any) => ({
        description: entry.description,
        status: entry.status,
      }))
      .filter((entry: any) => typeof entry.description === "string");

    return NextResponse.json({ requirements: openRequirements });
  } catch (error) {
    console.error("Stripe requirements fout:", error);
    return NextResponse.json(
      { error: "Stripe-verificatie kon niet worden opgehaald." },
      { status: 500 }
    );
  }
}
