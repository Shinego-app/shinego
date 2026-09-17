import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) {
      return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !userData.user) {
      return NextResponse.json({ error: "Ongeldige sessie." }, { status: 401 });
    }

    const { data: professional, error: professionalError } = await supabaseAdmin
      .from("professionals")
      .select("id")
      .eq("user_id", userData.user.id)
      .single();

    if (professionalError || !professional) {
      return NextResponse.json({ error: "Professional niet gevonden." }, { status: 404 });
    }

    const { data: boekingen, error: boekingenError } = await supabaseAdmin
      .from("boekingen")
      .select("id")
      .eq("professional_id", professional.id);

    if (boekingenError) {
      console.error("Professional reviews boekingen fout:", boekingenError);
      return NextResponse.json({ error: "Beoordelingen konden niet worden geladen." }, { status: 500 });
    }

    const bookingIds = (boekingen || []).map((boeking) => boeking.id);
    if (bookingIds.length === 0) {
      return NextResponse.json({ aantal: 0, gemiddelde: null });
    }

    const { data: reviews, error: reviewsError } = await supabaseAdmin
      .from("reviews")
      .select("rating")
      .in("booking_id", bookingIds);

    if (reviewsError) {
      console.error("Professional reviews laden fout:", reviewsError);
      return NextResponse.json({ error: "Beoordelingen konden niet worden geladen." }, { status: 500 });
    }

    const ratings = (reviews || [])
      .map((review) => Number(review.rating))
      .filter((rating) => Number.isFinite(rating));

    const gemiddelde = ratings.length > 0
      ? ratings.reduce((som, rating) => som + rating, 0) / ratings.length
      : null;

    return NextResponse.json({
      aantal: ratings.length,
      gemiddelde,
    });
  } catch (error) {
    console.error("Professional reviews API fout:", error);
    return NextResponse.json({ error: "Beoordelingen konden niet worden geladen." }, { status: 500 });
  }
}
