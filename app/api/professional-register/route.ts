import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      user_id,
      bedrijfsnaam,
      telefoon,
      postcode,
      woonplaats,
      kvk_nummer,
      btw_nummer,
      avb_verzekeraar,
      avb_polisnummer,
      diensten,
      werkgebied_km,
    } = body;

    if (
      !user_id ||
      !bedrijfsnaam ||
      !telefoon ||
      !postcode ||
      !woonplaats ||
      !kvk_nummer ||
      !btw_nummer ||
      !avb_verzekeraar ||
      !avb_polisnummer
    ) {
      return NextResponse.json({ error: "Onvolledige professionalgegevens." }, { status: 400 });
    }

    const { data: bestaand } = await supabaseAdmin
      .from("professionals")
      .select("id")
      .eq("user_id", user_id)
      .maybeSingle();

    if (bestaand) {
      return NextResponse.json({ professional: bestaand, already_exists: true });
    }

    const { data, error } = await supabaseAdmin
      .from("professionals")
      .insert({
        user_id,
        bedrijfsnaam,
        telefoon,
        postcode,
        woonplaats,
        kvk_nummer,
        btw_nummer,
        avb_verzekeraar,
        avb_polisnummer,
        avb_bevestigd: true,
        diensten: Array.isArray(diensten) ? diensten : ["glazenwasser"],
        werkgebied_km: Number(werkgebied_km) || 25,
        actief: false,
        geverifieerd: false,
        uitbetalingen_actief: false,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Professional opslaan mislukt:", error);
      return NextResponse.json(
        { error: "Professional kon niet in Supabase worden opgeslagen.", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ professional: data });
  } catch (error) {
    console.error("Professional registratie API fout:", error);
    return NextResponse.json({ error: "Onverwachte fout bij professionalregistratie." }, { status: 500 });
  }
}
