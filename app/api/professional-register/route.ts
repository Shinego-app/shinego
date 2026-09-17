import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

function normaliseerDiensten(value: unknown) {
  const invoer = Array.isArray(value) ? value : [];
  const toegestaan = new Set(["glazenwasser", "telewash", "bedrijf", "binnen"]);
  const diensten = invoer
    .map((dienst) => String(dienst || "").toLowerCase())
    .map((dienst) => (dienst === "glazenwassen" ? "glazenwasser" : dienst))
    .filter((dienst) => toegestaan.has(dienst));

  if (!diensten.includes("glazenwasser")) diensten.unshift("glazenwasser");
  return Array.from(new Set(diensten));
}

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization") || "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";

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

    const metadata = user.user_metadata || {};
    if (metadata.account_type && metadata.account_type !== "professional") {
      return NextResponse.json({ error: "Dit account is geen professional-account." }, { status: 403 });
    }

    const { data: bestaand, error: bestaandError } = await supabaseAdmin
      .from("professionals")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (bestaandError) {
      throw bestaandError;
    }

    if (bestaand) {
      return NextResponse.json({ professional: bestaand, already_exists: true });
    }

    const bedrijfsnaam = String(metadata.bedrijfsnaam || "").trim();
    const telefoon = String(metadata.telefoon || "").trim();
    const postcode = String(metadata.postcode || "").trim();
    const woonplaats = String(metadata.woonplaats || "").trim();
    const kvkNummer = String(metadata.kvk_nummer || "").replace(/\D/g, "");
    const btwNummer = String(metadata.btw_nummer || "").replace(/[\s.\-]/g, "").toUpperCase();
    const avbVerzekeraar = String(metadata.avb_verzekeraar || "").trim();
    const avbPolisnummer = String(metadata.avb_polisnummer || "").trim();

    if (
      !bedrijfsnaam ||
      !telefoon ||
      !postcode ||
      !woonplaats ||
      !/^\d{8}$/.test(kvkNummer) ||
      !/^NL\d{9}B\d{2}$/.test(btwNummer) ||
      !avbVerzekeraar ||
      !avbPolisnummer
    ) {
      return NextResponse.json(
        { error: "De registratiegegevens in het geverifieerde account zijn onvolledig." },
        { status: 400 }
      );
    }

    const werkgebiedKm = Number(metadata.werkgebied_km);
    const veiligeWerkafstand = [10, 15, 25, 35, 50, 75, 100].includes(werkgebiedKm)
      ? werkgebiedKm
      : 25;

    const { data, error } = await supabaseAdmin
      .from("professionals")
      .insert({
        user_id: user.id,
        email: user.email || null,
        bedrijfsnaam,
        voornaam: String(metadata.voornaam || "").trim() || null,
        achternaam: String(metadata.achternaam || "").trim() || null,
        telefoon,
        postcode,
        woonplaats,
        straat: String(metadata.straat || "").trim() || null,
        huisnummer: String(metadata.huisnummer || "").trim() || null,
        toevoeging: String(metadata.toevoeging || "").trim() || null,
        kvk_nummer: kvkNummer,
        btw_nummer: btwNummer,
        avb_verzekeraar: avbVerzekeraar,
        avb_polisnummer: avbPolisnummer,
        avb_bevestigd: metadata.avb_bevestigd === true,
        diensten: normaliseerDiensten(metadata.diensten),
        werkgebied_km: veiligeWerkafstand,
        actief: false,
        geverifieerd: false,
        uitbetalingen_actief: false,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Professional opslaan mislukt:", error);
      return NextResponse.json(
        { error: "Professional kon niet in Supabase worden opgeslagen." },
        { status: 500 }
      );
    }

    return NextResponse.json({ professional: data });
  } catch (error) {
    console.error("Professional registratie API fout:", error);
    return NextResponse.json(
      { error: "Onverwachte fout bij professionalregistratie." },
      { status: 500 }
    );
  }
}
