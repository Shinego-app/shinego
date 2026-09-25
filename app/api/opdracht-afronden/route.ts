import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { maakFactuurPdf, maakFactuurnummer } from "@/lib/factuur";
import { magOpdrachtStarten } from "@/lib/opdrachtTijd";
import { maakCheckoutToken } from "@/lib/checkoutToken";
import { berekenKlantBtwRegels } from "@/lib/btw";

const resend = new Resend(process.env.RESEND_API_KEY!);

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const FREQUENTIE_DAGEN: Record<string, number> = {
  "4weken": 28,
  "8weken": 56,
  "12weken": 84,
};

function telDagenBijDatum(datum: string, dagen: number) {
  const match = String(datum || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const waarde = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12));
  waarde.setUTCDate(waarde.getUTCDate() + dagen);
  return waarde.toISOString().slice(0, 10);
}

function zonderInterneMarkeringen(value: unknown) {
  return String(value || "")
    .split("\n")
    .filter((regel) => !regel.trim().startsWith("[[shinego-"))
    .join("\n")
    .trim();
}

function formatDatumNl(value: string) {
  const datum = new Date(`${value}T12:00:00`);
  if (Number.isNaN(datum.getTime())) return value;
  return datum.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function maakVervolgBoeking(
  booking: Record<string, any>,
  voorkeurProfessionalId: string | number
) {
  const dagen = FREQUENTIE_DAGEN[String(booking.frequentie || "")];
  if (!dagen || !booking.gewenste_datum) return null;

  const volgendeDatum = telDagenBijDatum(String(booking.gewenste_datum), dagen);
  if (!volgendeDatum) return null;

  const vervolgMarker = `[[shinego-vervolg-van:${booking.id}]]`;
  const voorkeurMarker = `[[shinego-voorkeur-professional:${voorkeurProfessionalId}]]`;

  const { data: bestaand, error: bestaandError } = await supabaseAdmin
    .from("boekingen")
    .select("id, totaalprijs, gewenste_datum, betaald")
    .like("opmerking", `%${vervolgMarker}%`)
    .maybeSingle();

  if (bestaandError) throw bestaandError;

  let vervolg = bestaand;

  if (!vervolg) {
    const klantOpmerking = zonderInterneMarkeringen(booking.opmerking);
    const opmerking = [klantOpmerking, vervolgMarker, voorkeurMarker]
      .filter(Boolean)
      .join("\n");

    const { data: aangemaakt, error: insertError } = await supabaseAdmin
      .from("boekingen")
      .insert({
        voornaam: booking.voornaam,
        achternaam: booking.achternaam,
        email: booking.email,
        telefoon: booking.telefoon || null,
        postcode: booking.postcode,
        huisnummer: booking.huisnummer,
        toevoeging: booking.toevoeging || null,
        straat: booking.straat,
        plaats: booking.plaats,
        dienst: booking.dienst || "glazenwassen",
        woningtype: booking.woningtype || null,
        verdiepingen: booking.verdiepingen || [],
        aantal_ramen: booking.aantal_ramen,
        telescoop: booking.telescoop === true,
        glasbewassing_type: booking.glasbewassing_type,
        frequentie: booking.frequentie,
        bereikbaar: booking.bereikbaar || "ja",
        kozijnen: booking.kozijnen === true,
        opmerking: opmerking || null,
        basisprijs: Number(booking.basisprijs || 0),
        ramen_prijs: Number(booking.ramen_prijs || 0),
        verdieping_toeslag: Number(booking.verdieping_toeslag || 0),
        bereik_toeslag: Number(booking.bereik_toeslag || 0),
        kozijnen_toeslag: Number(booking.kozijnen_toeslag || 0),
        korting_percentage: Number(booking.korting_percentage || 0),
        korting_bedrag: Number(booking.korting_bedrag || 0),
        totaalprijs: Number(booking.totaalprijs),
        status: "nieuw",
        betaalstatus: "open",
        betaald: false,
        gewenste_datum: volgendeDatum,
        gewenste_tijd: booking.gewenste_tijd,
        thuis_nodig: booking.thuis_nodig || null,
        akkoord_voorwaarden: true,
        akkoord_start_binnen_bedenktijd: true,
        professional_id: null,
      })
      .select("id, totaalprijs, gewenste_datum, betaald")
      .single();

    if (insertError || !aangemaakt) {
      throw insertError || new Error("Vervolgboeking kon niet worden aangemaakt.");
    }
    vervolg = aangemaakt;
  }

  if (vervolg.betaald === true) return null;

  const token = maakCheckoutToken(
    vervolg.id,
    Number(vervolg.totaalprijs),
    120 * 24 * 60 * 60 * 1000
  );
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.shinego.nl").replace(/\/$/, "");
  const betaalUrl =
    `${siteUrl}/boeken/glazenwassen/vervolg?booking=${encodeURIComponent(String(vervolg.id))}&token=${encodeURIComponent(token)}`;

  return {
    id: vervolg.id,
    datum: String(vervolg.gewenste_datum || volgendeDatum),
    bedrag: Number(vervolg.totaalprijs),
    betaalUrl,
  };
}


export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get("authorization");
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

    const { booking_id } = await req.json();

    if (!booking_id) {
      return NextResponse.json(
        { error: "booking_id ontbreekt" },
        { status: 400 }
      );
    }

    const { data: professional, error: professionalLookupError } = await supabaseAdmin
      .from("professionals")
      .select("id, bedrijfsnaam, kvk_nummer, btw_nummer, straat, huisnummer, toevoeging, postcode, woonplaats")
      .eq("user_id", user.id)
      .single();

    if (professionalLookupError || !professional) {
      return NextResponse.json(
        { error: "Professional niet gevonden" },
        { status: 404 }
      );
    }

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("boekingen")
      .select("*")
      .eq("id", booking_id)
      .eq("professional_id", professional.id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: "Boeking niet gevonden of niet aan jou toegewezen" },
        { status: 404 }
      );
    }

    if (booking.betaald !== true) {
      return NextResponse.json(
        { error: "Boeking is niet betaald" },
        { status: 400 }
      );
    }

    const tijdControle = magOpdrachtStarten(booking.gewenste_datum, booking.gewenste_tijd);
    if (!tijdControle.toegestaan) {
      return NextResponse.json(
        { error: tijdControle.reden },
        { status: 400 }
      );
    }

    const alAfgerond = booking.status === "afgerond";

    if (!alAfgerond && booking.status !== "onderweg") {
      return NextResponse.json(
        { error: "Alleen een gestarte opdracht kan worden afgerond" },
        { status: 400 }
      );
    }

    const factuurnummer =
      booking.factuurnummer ?? maakFactuurnummer(Number(booking.id));

    if (!alAfgerond) {
      const { data: bijgewerkt, error: updateError } = await supabaseAdmin
        .from("boekingen")
        .update({
          status: "afgerond",
          factuurnummer,
        })
        .eq("id", booking.id)
        .eq("professional_id", professional.id)
        .eq("status", "onderweg")
        .select("id")
        .maybeSingle();

      if (updateError) {
        return NextResponse.json(
          { error: "Opdracht afronden mislukt" },
          { status: 500 }
        );
      }

      if (!bijgewerkt) {
        return NextResponse.json(
          { error: "De opdrachtstatus is intussen gewijzigd. Vernieuw de pagina." },
          { status: 409 }
        );
      }
    }

    let vervolgInfo: Awaited<ReturnType<typeof maakVervolgBoeking>> = null;
    try {
      vervolgInfo = await maakVervolgBoeking(booking, professional.id);
    } catch (vervolgError) {
      console.error("Vervolgboeking aanmaken mislukt:", vervolgError);
    }

    const pdfBytes = await maakFactuurPdf({
      factuurnummer,
      datum: new Date().toLocaleDateString("nl-NL"),
      klantNaam: `${booking.voornaam} ${booking.achternaam}`,
      klantEmail: booking.email,
      klantStraat: booking.straat,
      klantHuisnummer: booking.huisnummer,
      klantToevoeging: booking.toevoeging,
      klantPostcode: booking.postcode,
      klantPlaats: booking.plaats,
      professionalBedrijfsnaam: professional.bedrijfsnaam,
      professionalKvK: professional.kvk_nummer,
      professionalBtwNummer: professional.btw_nummer,
      professionalStraat: professional.straat,
      professionalHuisnummer: professional.huisnummer,
      professionalToevoeging: professional.toevoeging,
      professionalPostcode: professional.postcode,
      professionalPlaats: professional.woonplaats,
      omschrijving: "Glazenwassen via ShineGo",
      bedrag: Number(booking.totaalprijs),
      btwRegels: berekenKlantBtwRegels(booking),
    });

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://shinego.nl").replace(/\/$/, "");
    const reviewUrl = `${siteUrl}/review/${booking.review_token}`;

    const { error: klantEmailError } = await resend.emails.send(
      {
      from: "ShineGo <noreply@shinego.nl>",
      to: booking.email,
      subject: `Factuur ${factuurnummer} - ShineGo`,
      html: `
        <p>Beste ${escapeHtml(booking.voornaam)},</p>
        <p>Je opdracht is afgerond. In de bijlage vind je jouw factuur.</p>
        <p>Hoe was je ervaring met ${escapeHtml(professional.bedrijfsnaam)}? Je helpt andere klanten en de professional met een korte beoordeling.</p>
        <p><a href="${reviewUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:600;">Geef een beoordeling</a></p>
        ${vervolgInfo ? `
          <hr style="border:0;border-top:1px solid #e5e7eb;margin:28px 0;">
          <h3 style="color:#0b3d75;">Je volgende glasbewassing staat klaar</h3>
          <p>Je koos voor een terugkerende afspraak. De volgende beurt is gepland voor <strong>${formatDatumNl(vervolgInfo.datum)}</strong>.</p>
          <p>Er wordt <strong>niet automatisch afgeschreven</strong>. De volgende afspraak wordt pas definitief nadat je deze afzonderlijk hebt betaald.</p>
          <p><strong>Bedrag:</strong> €${vervolgInfo.bedrag.toFixed(2).replace(".", ",")}</p>
          <p><a href="${vervolgInfo.betaalUrl}" style="display:inline-block;background:#1683f8;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700;">Volgende afspraak betalen →</a></p>
          <p style="font-size:13px;color:#64748b;">ShineGo houdt waar mogelijk rekening met dezelfde glazenwasser, maar de professional blijft vrij om een opdracht wel of niet aan te nemen.</p>
        ` : ""}
        <p>Bedankt voor het gebruik van ShineGo.</p>
      `,
      attachments: [
        {
          filename: `${factuurnummer}.pdf`,
          content: Buffer.from(pdfBytes),
        },
      ],
      },
      {
        idempotencyKey: `completion-customer-invoice/${booking.id}/${factuurnummer}`,
      }
    );

    if (klantEmailError) {
      return NextResponse.json(
        { error: "Opdracht is afgerond, maar factuurmail naar klant verzenden mislukt" },
        { status: 500 }
      );
    }

    if (user.email) {
      const professionalBedrag = Number(booking.professional_bedrag || 0);
      const uitbetalingTekst = professionalBedrag > 0
        ? `<p>Jouw bedrag voor deze opdracht is <strong>€${professionalBedrag.toFixed(2).replace(".", ",")}</strong>.</p>`
        : "";

      const { error: professionalEmailError } = await resend.emails.send(
        {
        from: "ShineGo <noreply@shinego.nl>",
        to: user.email,
        subject: `Factuurkopie ${factuurnummer} - ShineGo`,
        html: `
          <p>Beste ${escapeHtml(professional.bedrijfsnaam)},</p>
          <p>De opdracht is succesvol afgerond.</p>
          ${uitbetalingTekst}
          <p>In de bijlage vind je een factuurkopie voor je administratie.</p>
          <p>Met vriendelijke groet,<br />ShineGo</p>
        `,
        attachments: [
          {
            filename: `${factuurnummer}.pdf`,
            content: Buffer.from(pdfBytes),
          },
        ],
        },
        {
          idempotencyKey: `completion-professional-copy/${booking.id}/${factuurnummer}`,
        }
      );

      if (professionalEmailError) {
        console.error("Factuurmail professional fout:", professionalEmailError);
        return NextResponse.json(
          { error: "Opdracht is afgerond en klantmail is verzonden, maar factuurmail naar professional is mislukt" },
          { status: 500 }
        );
      }
    } else {
      console.warn("Geen e-mailadres gevonden voor professional:", professional.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Opdracht afronden fout:", error);

    return NextResponse.json(
      { error: "Onverwachte fout" },
      { status: 500 }
    );
  }
}
