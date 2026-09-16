import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function laadBoeking(token: string) {
  const { data: booking, error } = await supabaseAdmin
    .from("boekingen")
    .select("id, voornaam, professional_id, status")
    .eq("review_token", token)
    .single();

  if (error || !booking || booking.status !== "afgerond") {
    return null;
  }

  return booking;
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")?.trim();

  if (!token) {
    return NextResponse.json({ error: "Reviewlink ontbreekt." }, { status: 400 });
  }

  const booking = await laadBoeking(token);
  if (!booking) {
    return NextResponse.json({ error: "Deze reviewlink is ongeldig of nog niet actief." }, { status: 404 });
  }

  const [{ data: professional }, { data: bestaandeReview }] = await Promise.all([
    supabaseAdmin
      .from("professionals")
      .select("bedrijfsnaam")
      .eq("id", booking.professional_id)
      .single(),
    supabaseAdmin
      .from("reviews")
      .select("rating, opmerking")
      .eq("booking_id", booking.id)
      .maybeSingle(),
  ]);

  return NextResponse.json({
    voornaam: booking.voornaam,
    bedrijfsnaam: professional?.bedrijfsnaam || "de professional",
    al_beoordeeld: Boolean(bestaandeReview),
    review: bestaandeReview || null,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = typeof body.token === "string" ? body.token.trim() : "";
    const rating = Number(body.rating);
    const opmerking = typeof body.opmerking === "string" ? body.opmerking.trim() : "";

    if (!token) {
      return NextResponse.json({ error: "Reviewlink ontbreekt." }, { status: 400 });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Kies een beoordeling van 1 tot 5 sterren." }, { status: 400 });
    }

    if (opmerking.length > 1000) {
      return NextResponse.json({ error: "Je toelichting mag maximaal 1000 tekens bevatten." }, { status: 400 });
    }

    const booking = await laadBoeking(token);
    if (!booking) {
      return NextResponse.json({ error: "Deze reviewlink is ongeldig of nog niet actief." }, { status: 404 });
    }

    const { data: bestaandeReview } = await supabaseAdmin
      .from("reviews")
      .select("id")
      .eq("booking_id", booking.id)
      .maybeSingle();

    if (bestaandeReview) {
      return NextResponse.json({ error: "Voor deze opdracht is al een review geplaatst." }, { status: 409 });
    }

    const { error: insertError } = await supabaseAdmin.from("reviews").insert({
      booking_id: booking.id,
      rating,
      opmerking: opmerking || null,
    });

    if (insertError) {
      console.error("Review opslaan fout:", insertError);
      return NextResponse.json({ error: "Review opslaan is mislukt." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Review API fout:", error);
    return NextResponse.json({ error: "Onverwachte fout." }, { status: 500 });
  }
}
