import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { magOpdrachtStarten } from "@/lib/opdrachtTijd";

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization");
    const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;

    if (!token) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !user) return NextResponse.json({ error: "Ongeldige sessie." }, { status: 401 });

    const { booking_id } = await request.json();
    if (!booking_id) return NextResponse.json({ error: "Opdracht ontbreekt." }, { status: 400 });

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
      .select("id, status, betaald, professional_id, gewenste_datum, gewenste_tijd")
      .eq("id", booking_id)
      .eq("professional_id", professional.id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: "Opdracht niet gevonden of niet aan jou toegewezen." }, { status: 404 });
    }

    if (booking.betaald !== true) {
      return NextResponse.json({ error: "Deze opdracht is nog niet betaald." }, { status: 400 });
    }

    if (booking.status !== "toegewezen") {
      return NextResponse.json({ error: "Alleen een toegewezen opdracht kan worden gestart." }, { status: 400 });
    }

    const tijdControle = magOpdrachtStarten(booking.gewenste_datum, booking.gewenste_tijd);
    if (!tijdControle.toegestaan) {
      return NextResponse.json({ error: tijdControle.reden }, { status: 400 });
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("boekingen")
      .update({ status: "onderweg" })
      .eq("id", booking.id)
      .eq("professional_id", professional.id)
      .eq("status", "toegewezen")
      .select("*")
      .single();

    if (updateError) {
      return NextResponse.json({ error: "Opdracht starten mislukt." }, { status: 500 });
    }

    return NextResponse.json({ booking: updated });
  } catch (error) {
    console.error("Opdracht starten fout:", error);
    return NextResponse.json({ error: "Opdracht starten mislukt." }, { status: 500 });
  }
}
