import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { heeftBenodigdeDienst, ligtBinnenWerkgebied, vereisteDienst } from "@/lib/opdrachtMatching";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function nuNederland() {
  const delen = new Intl.DateTimeFormat("nl-NL", {
    timeZone: "Europe/Amsterdam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const waarde = (type: string) =>
    delen.find((deel) => deel.type === type)?.value || "";

  return {
    datum: `${waarde("year")}-${waarde("month")}-${waarde("day")}`,
    tijd: `${waarde("hour")}:${waarde("minute")}`,
  };
}

function vandaagNederland() {
  return nuNederland().datum;
}

function tijdvakVerlopen(
  gewensteDatum?: string | null,
  gewensteTijd?: string | null
) {
  if (!gewensteDatum) return true;

  const nu = nuNederland();
  const datum = String(gewensteDatum).slice(0, 10);

  if (datum < nu.datum) return true;
  if (datum > nu.datum) return false;

  const tijden = String(gewensteTijd || "").match(/(\d{1,2}:\d{2})/g) || [];
  const einde = tijden[1] || tijden[0];
  if (!einde) return false;

  const [uur, minuut] = einde.split(":");
  const eindTijd = `${uur.padStart(2, "0")}:${minuut}`;
  return nu.tijd >= eindTijd;
}

function normaliseerDiensten(value: unknown) {
  const invoer = Array.isArray(value) ? value : [];
  return Array.from(new Set(invoer.map((dienst) => {
    const naam = String(dienst || "").toLowerCase();
    return naam === "glazenwassen" ? "glazenwasser" : naam;
  })));
}

async function haalProfessional(request: Request) {
  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;
  if (!token) return { error: "Niet ingelogd.", status: 401 as const };

  const {
    data: { user },
    error: userError,
  } = await supabaseAdmin.auth.getUser(token);

  if (userError || !user) return { error: "Ongeldige sessie.", status: 401 as const };

  const { data: professional, error: professionalError } = await supabaseAdmin
    .from("professionals")
    .select("id, email, bedrijfsnaam, voornaam, postcode, huisnummer, woonplaats, werkgebied_km, diensten, actief, geverifieerd")
    .eq("user_id", user.id)
    .single();

  if (professionalError || !professional) {
    return { error: "Professional niet gevonden.", status: 404 as const };
  }

  return { professional };
}

export async function GET(request: Request) {
  try {
    const resultaat = await haalProfessional(request);
    if ("error" in resultaat) {
      return NextResponse.json({ error: resultaat.error }, { status: resultaat.status });
    }

    const professional = resultaat.professional;
    const diensten = normaliseerDiensten(professional.diensten);

    if (!professional.actief || !professional.geverifieerd) {
      return NextResponse.json({
        opdrachten: [],
        profiel_actief: false,
        werkgebied_km: Number(professional.werkgebied_km || 25),
        diensten,
        melding: "Je profiel moet eerst actief en geverifieerd zijn voordat je beschikbare opdrachten kunt aannemen.",
      });
    }

    const vandaag = vandaagNederland();

    const { data: boekingen, error: boekingenError } = await supabaseAdmin
      .from("boekingen")
      .select("id, created_at, postcode, huisnummer, plaats, woningtype, glasbewassing_type, telescoop, aantal_ramen, verdiepingen, kozijnen, bereikbaar, gewenste_datum, gewenste_tijd, professional_bedrag, totaalprijs, status, betaald, professional_id")
      .eq("status", "nieuw")
      .eq("betaald", true)
      .is("professional_id", null)
      .gte("gewenste_datum", vandaag)
      .order("gewenste_datum", { ascending: true })
      .order("gewenste_tijd", { ascending: true })
      .limit(100);

    if (boekingenError) {
      return NextResponse.json({ error: "Beschikbare opdrachten konden niet worden geladen." }, { status: 500 });
    }

    const gematchteOpdrachten = await Promise.all(
      (boekingen || []).map(async (boeking) => {
        const werkgebied = await ligtBinnenWerkgebied(professional, boeking);
        return {
          binnen_werkgebied: werkgebied.binnen,
          opdracht: {
            id: boeking.id,
            plaats: boeking.plaats,
            postcode: boeking.postcode,
            woningtype: boeking.woningtype,
            glasbewassing_type: boeking.glasbewassing_type,
            telescoop: boeking.telescoop,
            aantal_ramen: boeking.aantal_ramen,
            verdiepingen: boeking.verdiepingen,
            kozijnen: boeking.kozijnen,
            lastig_bereikbaar: boeking.bereikbaar === "nee",
            gewenste_datum: boeking.gewenste_datum,
            gewenste_tijd: boeking.gewenste_tijd,
            professional_bedrag: boeking.professional_bedrag,
            vereiste_dienst: vereisteDienst(boeking),
            dienst_match: heeftBenodigdeDienst(professional, boeking),
            afstand_km: werkgebied.afstand_km,
          },
        };
      })
    );

    const opdrachten = gematchteOpdrachten
      .filter(
        (item) =>
          item.binnen_werkgebied &&
          !tijdvakVerlopen(
            item.opdracht.gewenste_datum,
            item.opdracht.gewenste_tijd
          )
      )
      .map((item) => item.opdracht);

    return NextResponse.json({
      opdrachten,
      profiel_actief: true,
      werkgebied_km: Number(professional.werkgebied_km || 25),
      diensten,
    });
  } catch (error) {
    console.error("Beschikbare opdrachten fout:", error);
    return NextResponse.json({ error: "Beschikbare opdrachten konden niet worden geladen." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const resultaat = await haalProfessional(request);
    if ("error" in resultaat) {
      return NextResponse.json({ error: resultaat.error }, { status: resultaat.status });
    }

    const professional = resultaat.professional;
    if (!professional.actief || !professional.geverifieerd) {
      return NextResponse.json({ error: "Je profiel is nog niet vrijgegeven voor opdrachten." }, { status: 403 });
    }

    const body = await request.json();
    const bookingId = body?.booking_id;
    if (!bookingId) {
      return NextResponse.json({ error: "Opdracht ontbreekt." }, { status: 400 });
    }

    const { data: boeking, error: boekingError } = await supabaseAdmin
      .from("boekingen")
      .select("id, postcode, huisnummer, plaats, woningtype, glasbewassing_type, telescoop, gewenste_datum, gewenste_tijd, status, betaald, professional_id")
      .eq("id", bookingId)
      .single();

    if (boekingError || !boeking) {
      return NextResponse.json({ error: "Opdracht niet gevonden." }, { status: 404 });
    }

    if (boeking.status !== "nieuw" || boeking.betaald !== true || boeking.professional_id) {
      return NextResponse.json({ error: "Deze opdracht is niet meer beschikbaar." }, { status: 409 });
    }

    if (
      !boeking.gewenste_datum ||
      boeking.gewenste_datum < vandaagNederland() ||
      tijdvakVerlopen(boeking.gewenste_datum, (boeking as any).gewenste_tijd)
    ) {
      return NextResponse.json({ error: "Het geplande tijdvak van deze opdracht is inmiddels verstreken." }, { status: 409 });
    }

    if (!heeftBenodigdeDienst(professional, boeking)) {
      return NextResponse.json({ error: "Deze opdracht vraagt een dienst of materiaal dat niet in je profiel staat." }, { status: 403 });
    }

    const werkgebied = await ligtBinnenWerkgebied(professional, boeking);
    if (werkgebied.afstand_km == null) {
      return NextResponse.json(
        { error: "De afstand tot deze opdracht kon niet betrouwbaar worden gecontroleerd. Probeer het later opnieuw." },
        { status: 503 }
      );
    }

    if (!werkgebied.binnen) {
      return NextResponse.json(
        { error: `Deze opdracht valt buiten je ingestelde werkgebied van ${Number(professional.werkgebied_km || 25)} km.` },
        { status: 403 }
      );
    }

    const { data: aangenomen, error: updateError } = await supabaseAdmin
      .from("boekingen")
      .update({
        professional_id: professional.id,
        status: "toegewezen",
      })
      .eq("id", bookingId)
      .eq("status", "nieuw")
      .eq("betaald", true)
      .is("professional_id", null)
      .gte("gewenste_datum", vandaagNederland())
      .select("*")
      .maybeSingle();

    if (updateError) {
      return NextResponse.json({ error: "Opdracht kon niet worden aangenomen." }, { status: 500 });
    }

    if (!aangenomen) {
      return NextResponse.json({ error: "Deze opdracht is niet meer beschikbaar." }, { status: 409 });
    }

    if (aangenomen.email) {
      try {
        const professionalNaam =
          professional.bedrijfsnaam || professional.voornaam || "de professional";

        const { error: mailError } = await resend.emails.send(
          {
            from: "ShineGo <noreply@shinego.nl>",
            to: aangenomen.email,
            subject: `Professional gekoppeld - ShineGo boeking ${aangenomen.id}`,
            html: `
              <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
                <h2 style="color:#2563eb">Er is een glazenwasser aan je opdracht gekoppeld</h2>
                <p>Beste ${escapeHtml(aangenomen.voornaam || "klant")},</p>
                <p><strong>${escapeHtml(professionalNaam)}</strong> heeft je ShineGo-opdracht aangenomen.</p>
                <div style="margin:20px 0;padding:16px;background:#f9fafb;border-radius:12px">
                  <p style="margin:0 0 6px"><strong>Boekingsnummer:</strong> ${aangenomen.id}</p>
                  <p style="margin:0 0 6px"><strong>Datum:</strong> ${aangenomen.gewenste_datum || "-"}</p>
                  <p style="margin:0"><strong>Tijd:</strong> ${aangenomen.gewenste_tijd || "-"}</p>
                </div>
                <p>De boeking en betaling blijven via ShineGo beheerd.</p>
                <p>Met vriendelijke groet,<br><strong>ShineGo</strong></p>
              </div>
            `,
          },
          {
            idempotencyKey: `job-accepted/${aangenomen.id}/${professional.id}`,
          }
        );

        if (mailError) {
          console.error("Klantmelding na aannemen opdracht mislukt:", mailError);
        }
      } catch (mailError) {
        console.error("Klantmelding na aannemen opdracht fout:", mailError);
      }
    }

    return NextResponse.json({ booking: aangenomen });
  } catch (error) {
    console.error("Opdracht aannemen fout:", error);
    return NextResponse.json({ error: "Opdracht kon niet worden aangenomen." }, { status: 500 });
  }
}
