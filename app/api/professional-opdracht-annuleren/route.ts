import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization");
    const token = authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : null;

    if (!token) {
      return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
    }

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Ongeldige sessie." }, { status: 401 });
    }

    const body = await request.json();
    const { booking_id, reden } = body;

    if (!booking_id) {
      return NextResponse.json({ error: "Boeking ontbreekt." }, { status: 400 });
    }

    const annuleringsreden = String(reden || "").trim();
    if (!annuleringsreden) {
      return NextResponse.json({ error: "Vul een reden van annulering in." }, { status: 400 });
    }

    const { data: professional, error: professionalError } = await supabaseAdmin
      .from("professionals")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (professionalError || !professional) {
      return NextResponse.json({ error: "Professional niet gevonden." }, { status: 404 });
    }

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("boekingen")
      .select("id, status, professional_id, uitbetaald")
      .eq("id", booking_id)
      .eq("professional_id", professional.id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: "Opdracht niet gevonden." }, { status: 404 });
    }

    if (booking.uitbetaald === true || booking.status === "afgerond" || booking.status === "geannuleerd") {
      return NextResponse.json(
        { error: "Deze opdracht kan niet meer door de professional worden geannuleerd." },
        { status: 400 }
      );
    }

    const { data: updatedBooking, error: updateError } = await supabaseAdmin
      .from("boekingen")
      .update({
        status: "nieuw",
        annuleringsreden,
        annuleringskosten: 0,
        professional_vergoeding: 0,
        vergoeding_goedgekeurd: false,
        geannuleerd_door: "professional",
        klant_niet_thuis: false,
        niet_thuis_bewijs: null,
        geannuleerde_professional_id: professional.id,
        professional_id: null,
      })
      .eq("id", booking_id)
      .eq("professional_id", professional.id)
      .select("*")
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Opdracht kon niet worden geannuleerd.", details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ booking: updatedBooking });
  } catch (error) {
    console.error("Professional annuleren fout:", error);
    return NextResponse.json(
      { error: "Opdracht kon niet worden geannuleerd." },
      { status: 500 }
    );
  }
}
