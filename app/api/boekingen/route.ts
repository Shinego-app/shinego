import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function tekst(value: unknown, max = 200) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function geheelGetal(value: unknown, min: number, max: number) {
  const getal = Number(value);
  if (!Number.isInteger(getal) || getal < min || getal > max) return null;
  return getal;
}

function geld(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export async function POST(request: Request) {
  try {
    const body = record(await request.json());
    const klus = record(body.klus);
    const details = record(body.details);
    const klant = record(body.klant);

    if (body.akkoordVoorwaarden !== true || body.akkoordStartBedenktijd !== true) {
      return NextResponse.json(
        { error: "De verplichte akkoordverklaringen ontbreken." },
        { status: 400 }
      );
    }

    const voornaam = tekst(klant.voornaam, 80);
    const achternaam = tekst(klant.achternaam, 100);
    const email = tekst(klant.email, 254).toLowerCase();
    const telefoon = tekst(klant.telefoon, 40);
    const postcodeRaw = tekst(klant.postcode, 12).replace(/\s/g, "").toUpperCase();
    const huisnummer = tekst(klant.huisnummer, 20);
    const toevoeging = tekst(klant.toevoeging, 20);
    const straat = tekst(klant.straat, 120);
    const plaats = tekst(klant.plaats, 120);
    const gewensteDatum = tekst(klant.gewensteDatum, 20);
    const gewensteTijd = tekst(klant.gewensteTijd, 40);
    const thuisNodig = tekst(klant.thuisNodig, 40);

    if (
      !voornaam ||
      !achternaam ||
      !email ||
      !postcodeRaw ||
      !huisnummer ||
      !straat ||
      !plaats ||
      !gewensteDatum ||
      !gewensteTijd
    ) {
      return NextResponse.json({ error: "De boekingsgegevens zijn onvolledig." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Ongeldig e-mailadres." }, { status: 400 });
    }

    if (!/^[1-9][0-9]{3}[A-Z]{2}$/.test(postcodeRaw)) {
      return NextResponse.json({ error: "Ongeldige Nederlandse postcode." }, { status: 400 });
    }

    const postcode = `${postcodeRaw.slice(0, 4)} ${postcodeRaw.slice(4)}`;
    const woningtype = tekst(klus.woningtype, 80);
    const type = tekst(klus.type, 30).toLowerCase();
    const frequentie = tekst(klus.frequentie, 30).toLowerCase() || "eenmalig";

    if (!new Set(["buiten", "telewash", "bedrijf", "binnen"]).has(type)) {
      return NextResponse.json({ error: "Ongeldig type glasbewassing." }, { status: 400 });
    }

    if (!new Set(["eenmalig", "4weken", "8weken", "12weken"]).has(frequentie)) {
      return NextResponse.json({ error: "Ongeldige frequentie." }, { status: 400 });
    }

    const verdiepingen = Array.isArray(klus.verdiepingen)
      ? Array.from(
          new Set(
            klus.verdiepingen
              .map((waarde) => String(waarde))
              .filter((waarde) => ["1", "2", "3", "4"].includes(waarde))
          )
        )
      : [];

    const heeftNieuweVerdeling =
      klus.ramenVoorkant !== undefined ||
      klus.ramenAchterkant !== undefined ||
      klus.ramenZijkant !== undefined;

    const oudAantal = geheelGetal(klus.ramen, 0, 300) ?? 0;
    const voorkant = heeftNieuweVerdeling
      ? geheelGetal(klus.ramenVoorkant ?? 0, 0, 150)
      : oudAantal;
    const achterkant = heeftNieuweVerdeling
      ? geheelGetal(klus.ramenAchterkant ?? 0, 0, 150)
      : klus.achterkant === true
        ? oudAantal
        : 0;
    const zijkant = heeftNieuweVerdeling
      ? geheelGetal(klus.ramenZijkant ?? 0, 0, 150)
      : 0;

    if (voorkant === null || achterkant === null || zijkant === null) {
      return NextResponse.json({ error: "Ongeldig aantal ramen." }, { status: 400 });
    }

    const totaalRamen = voorkant + achterkant + zijkant;
    const alleenBinnen = klus.alleenBinnen === true || type === "binnen";
    const binnenkant = klus.binnenkant === true && !alleenBinnen;
    const telescoop = alleenBinnen ? false : klus.telescoop === true;
    const kozijnen = details.kozijnen === true;

    const glasOppervlak = tekst(klus.glasOppervlak, 20);
    const bedrijfsPrijzen: Record<string, [number, number]> = {
      "0-15": [49, 69],
      "16-30": [69, 99],
      "31-50": [109, 149],
      "51-100": [189, 259],
      "101-200": [349, 469],
      "201-500": [749, 999],
    };

    if (type === "bedrijf" || woningtype === "bedrijfspand") {
      if (glasOppervlak === "500+") {
        return NextResponse.json(
          { error: "Voor meer dan 500 m² is een offerte nodig." },
          { status: 400 }
        );
      }
      if (!bedrijfsPrijzen[glasOppervlak]) {
        return NextResponse.json({ error: "Ongeldige zakelijke glasoppervlakte." }, { status: 400 });
      }
    } else if (totaalRamen <= 0 || totaalRamen > 300) {
      return NextResponse.json({ error: "Ongeldig totaal aantal ramen." }, { status: 400 });
    }

    const bedrijfsPrijs = bedrijfsPrijzen[glasOppervlak]
      ? bedrijfsPrijzen[glasOppervlak][telescoop ? 1 : 0]
      : 0;
    const basisprijs =
      type === "bedrijf" || woningtype === "bedrijfspand"
        ? bedrijfsPrijs
        : alleenBinnen
          ? 0
          : type === "telewash"
            ? 29.95
            : 19.95;
    const prijsPerRaam = type === "bedrijf" || woningtype === "bedrijfspand" ? 0 : 3;
    const ramenPrijs = alleenBinnen ? 0 : totaalRamen * prijsPerRaam;
    const binnenRamenPrijs = binnenkant || alleenBinnen ? totaalRamen * prijsPerRaam : 0;
    const alleenBinnenToeslag = alleenBinnen ? 15 : 0;
    const verdiepingToeslag = alleenBinnen ? 0 : verdiepingen.includes("4") ? 15 : 0;
    const bereikToeslag = 0;
    const kozijnenToeslag = kozijnen ? 9.95 + Math.max(0, totaalRamen - 10) : 0;
    const kortingPercentage =
      frequentie === "4weken" ? 0.12 : frequentie === "8weken" ? 0.1 : frequentie === "12weken" ? 0.07 : 0;

    const totaalVoorKorting =
      type === "bedrijf" || woningtype === "bedrijfspand"
        ? bedrijfsPrijs
        : basisprijs + ramenPrijs + binnenRamenPrijs + alleenBinnenToeslag;
    const subtotaal = totaalVoorKorting + verdiepingToeslag + kozijnenToeslag;
    const kortingBedrag = subtotaal * kortingPercentage;
    const totaalprijs = geld(subtotaal - kortingBedrag);

    const verwachteTotaalprijs = Number(body.verwachteTotaalprijs);
    if (
      !Number.isFinite(verwachteTotaalprijs) ||
      Math.abs(geld(verwachteTotaalprijs) - totaalprijs) > 0.01
    ) {
      return NextResponse.json(
        { error: "De prijs is gewijzigd. Ga terug naar de prijspagina en controleer de boeking opnieuw." },
        { status: 409 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("boekingen")
      .insert({
        voornaam,
        achternaam,
        email,
        telefoon: telefoon || null,
        postcode,
        huisnummer,
        toevoeging: toevoeging || null,
        straat,
        plaats,
        dienst: "glazenwassen",
        woningtype: woningtype || null,
        verdiepingen,
        aantal_ramen: totaalRamen,
        telescoop,
        glasbewassing_type: alleenBinnen ? "binnen" : type,
        frequentie,
        bereikbaar: tekst(details.bereikbaar, 30) || "ja",
        kozijnen,
        opmerking: tekst(details.opmerking, 1000) || null,
        basisprijs: geld(basisprijs),
        ramen_prijs: geld(ramenPrijs),
        verdieping_toeslag: geld(verdiepingToeslag),
        bereik_toeslag: geld(bereikToeslag),
        kozijnen_toeslag: geld(kozijnenToeslag),
        korting_percentage: kortingPercentage,
        korting_bedrag: geld(kortingBedrag),
        totaalprijs,
        status: "nieuw",
        betaalstatus: "open",
        betaald: false,
        gewenste_datum: gewensteDatum,
        gewenste_tijd: gewensteTijd,
        thuis_nodig: thuisNodig || null,
        akkoord_voorwaarden: true,
        akkoord_start_binnen_bedenktijd: true,
        professional_id: null,
      })
      .select("id, totaalprijs")
      .single();

    if (error || !data) {
      console.error("Server-side boeking opslaan mislukt:", error);
      return NextResponse.json({ error: "Boeking kon niet worden opgeslagen." }, { status: 500 });
    }

    return NextResponse.json({ booking: data });
  } catch (error) {
    console.error("Boeking API fout:", error);
    return NextResponse.json({ error: "Boeking kon niet worden opgeslagen." }, { status: 500 });
  }
}
