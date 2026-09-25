import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) {
      return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !userData.user) {
      return NextResponse.json({ error: "Ongeldige sessie." }, { status: 401 });
    }

    const body = await request.json();
    const bedrijfsnaam = String(body.bedrijfsnaam || "").trim();
    const voornaam = String(body.voornaam || "").trim();
    const achternaam = String(body.achternaam || "").trim();
    const telefoon = String(body.telefoon || "").trim();
    const postcodeRaw = String(body.postcode || "").replace(/\s/g, "").toUpperCase();
    const woonplaats = String(body.woonplaats || "").trim();
    const straat = String(body.straat || "").trim();
    const huisnummer = String(body.huisnummer || "").trim();
    const toevoeging = String(body.toevoeging || "").trim();
    const kvkNummer = String(body.kvk_nummer || "").replace(/\D/g, "");
    const btwNummer = String(body.btw_nummer || "").replace(/[\s.\-]/g, "").toUpperCase();
    const avbVerzekeraar = String(body.avb_verzekeraar || "").trim();
    const avbPolisnummer = String(body.avb_polisnummer || "").trim();
    const avbBevestigd = body.avb_bevestigd === true;
    const werkgebiedKm = Number(body.werkgebied_km);

    if (
      !bedrijfsnaam || !voornaam || !achternaam || !telefoon ||
      !postcodeRaw || !woonplaats || !straat || !huisnummer || !kvkNummer
    ) {
      return NextResponse.json({ error: "Vul alle verplichte gegevens in." }, { status: 400 });
    }

    if (![10, 15, 25, 35, 50, 75, 100].includes(werkgebiedKm)) {
      return NextResponse.json({ error: "Kies een geldige voorkeursafstand voor meldingen." }, { status: 400 });
    }

    const schoonTelefoon = telefoon.replace(/[\s().-]/g, "");
    if (!/^(?:\+31|0031|0)[1-9][0-9]{8}$/.test(schoonTelefoon)) {
      return NextResponse.json({ error: "Vul een geldig Nederlands telefoonnummer in." }, { status: 400 });
    }

    if (!/^[1-9][0-9]{3}[A-Z]{2}$/.test(postcodeRaw)) {
      return NextResponse.json({ error: "Vul een geldige Nederlandse postcode in." }, { status: 400 });
    }

    if (!/^\d{8}$/.test(kvkNummer)) {
      return NextResponse.json({ error: "Vul een geldig KVK-nummer van 8 cijfers in." }, { status: 400 });
    }

    if (btwNummer && !/^NL\d{9}B\d{2}$/.test(btwNummer)) {
      return NextResponse.json({ error: "Vul een geldig Nederlands BTW-id in." }, { status: 400 });
    }

    const postcode = `${postcodeRaw.slice(0, 4)} ${postcodeRaw.slice(4)}`;

    const { data: professional, error: professionalError } = await supabaseAdmin
      .from("professionals")
      .update({
        bedrijfsnaam,
        voornaam,
        achternaam,
        telefoon,
        postcode,
        woonplaats,
        straat,
        huisnummer,
        toevoeging: toevoeging || null,
        kvk_nummer: kvkNummer,
        btw_nummer: btwNummer || null,
        avb_verzekeraar: avbVerzekeraar || null,
        avb_polisnummer: avbPolisnummer || null,
        avb_bevestigd: avbBevestigd,
        werkgebied_km: werkgebiedKm,
      })
      .eq("user_id", userData.user.id)
      .select("*")
      .single();

    if (professionalError || !professional) {
      return NextResponse.json({ error: "Gegevens konden niet worden opgeslagen." }, { status: 500 });
    }

    const bestaandeMetadata = userData.user.user_metadata || {};
    const { error: metadataError } = await supabaseAdmin.auth.admin.updateUserById(userData.user.id, {
      user_metadata: {
        ...bestaandeMetadata,
        werkgebied_km: werkgebiedKm,
        avb_verzekeraar: avbVerzekeraar || null,
        avb_polisnummer: avbPolisnummer || null,
        avb_bevestigd: avbBevestigd,
      },
    });

    if (metadataError) {
      console.error("Professional metadata fout:", metadataError);
      return NextResponse.json({ error: "Profielgegevens konden niet volledig worden opgeslagen." }, { status: 500 });
    }

    return NextResponse.json({ professional });
  } catch (error) {
    console.error("Professional profiel fout:", error);
    return NextResponse.json({ error: "Gegevens konden niet worden opgeslagen." }, { status: 500 });
  }
}
