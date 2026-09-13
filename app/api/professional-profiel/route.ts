import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function normaliseerGeboortedatum(value: string) {
  const match = value.trim().match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) return null;

  const [, dag, maand, jaar] = match;
  const datum = new Date(`${jaar}-${maand}-${dag}T00:00:00Z`);
  if (
    Number.isNaN(datum.getTime()) ||
    datum.getUTCFullYear() !== Number(jaar) ||
    datum.getUTCMonth() + 1 !== Number(maand) ||
    datum.getUTCDate() !== Number(dag)
  ) {
    return null;
  }

  return `${jaar}-${maand}-${dag}`;
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
    const geboortedatumInvoer = String(body.geboortedatum || "").trim();
    const iban = String(body.iban || "").replace(/\s/g, "").toUpperCase();

    if (
      !bedrijfsnaam ||
      !voornaam ||
      !achternaam ||
      !telefoon ||
      !postcodeRaw ||
      !woonplaats ||
      !straat ||
      !huisnummer ||
      !kvkNummer ||
      !geboortedatumInvoer ||
      !iban
    ) {
      return NextResponse.json({ error: "Vul alle verplichte gegevens in." }, { status: 400 });
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

    const geboortedatum = normaliseerGeboortedatum(geboortedatumInvoer);
    if (!geboortedatum) {
      return NextResponse.json({ error: "Vul je geboortedatum in als DD-MM-JJJJ." }, { status: 400 });
    }

    if (!/^NL\d{2}[A-Z]{4}\d{10}$/.test(iban)) {
      return NextResponse.json({ error: "Vul een geldig Nederlands IBAN in." }, { status: 400 });
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
        stripe_geboortedatum: geboortedatum,
        stripe_iban: iban,
      },
    });

    if (metadataError) {
      console.error("Professional metadata fout:", metadataError);
      return NextResponse.json({ error: "Geboortedatum en IBAN konden niet worden opgeslagen." }, { status: 500 });
    }

    return NextResponse.json({
      professional,
      verificatie: {
        geboortedatum,
        iban,
      },
    });
  } catch (error) {
    console.error("Professional profiel fout:", error);
    return NextResponse.json({ error: "Gegevens konden niet worden opgeslagen." }, { status: 500 });
  }
}
