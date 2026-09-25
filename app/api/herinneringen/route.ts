import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const resend = new Resend(process.env.RESEND_API_KEY!);

function datumMorgenAmsterdam() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Amsterdam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const nu = new Date();
  const morgen = new Date(nu.getTime() + 24 * 60 * 60 * 1000);
  return formatter.format(morgen);
}

function formatDatum(value: string | null | undefined) {
  if (!value) return "Nog niet gekozen";

  const datum = new Date(`${value}T12:00:00`);
  if (Number.isNaN(datum.getTime())) return value;

  return datum.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Niet toegestaan" }, { status: 401 });
  }

  const morgen = datumMorgenAmsterdam();

  const { data: boekingen, error: boekingenError } = await supabaseAdmin
    .from("boekingen")
    .select(
      "id, voornaam, achternaam, email, straat, huisnummer, toevoeging, postcode, plaats, gewenste_datum, gewenste_tijd, status, betaald, professional_id, herinnering_klant_verzonden, herinnering_professional_verzonden"
    )
    .eq("gewenste_datum", morgen)
    .eq("betaald", true)
    .neq("status", "afgerond");

  if (boekingenError) {
    console.error("Herinneringen: boekingen ophalen mislukt", boekingenError);
    return NextResponse.json(
      { error: "Boekingen ophalen mislukt" },
      { status: 500 }
    );
  }

  let klantVerzonden = 0;
  let professionalVerzonden = 0;
  let nietGekoppeld = 0;
  const fouten: string[] = [];
  const beheerEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "info@shinego.nl";

  for (const boeking of boekingen ?? []) {
    const adres = `${boeking.straat ?? ""} ${boeking.huisnummer ?? ""}${
      boeking.toevoeging ? ` ${boeking.toevoeging}` : ""
    }, ${boeking.postcode ?? ""} ${boeking.plaats ?? ""}`.trim();

    if (!boeking.professional_id) {
      nietGekoppeld += 1;

      const meldingen = [
        resend.emails.send(
          {
            from: "ShineGo <noreply@shinego.nl>",
            to: beheerEmail,
            subject: `Actie nodig: boeking ${boeking.id} voor morgen nog niet gekoppeld`,
            html: `
              <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
                <h2 style="color:#b45309">Betaalde boeking zonder professional</h2>
                <p>Boeking <strong>#${boeking.id}</strong> staat gepland voor morgen, maar er is nog geen professional gekoppeld.</p>
                <p><strong>Datum:</strong> ${formatDatum(boeking.gewenste_datum)}<br>
                <strong>Tijd:</strong> ${escapeHtml(boeking.gewenste_tijd || "-")}<br>
                <strong>Regio:</strong> ${escapeHtml(boeking.postcode || "")} ${escapeHtml(boeking.plaats || "")}</p>
                <p>Controleer deze boeking direct in de ShineGo-admin en neem zo nodig contact op met de klant.</p>
                <p><a href="https://www.shinego.nl/admin" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700">Open admin</a></p>
              </div>
            `,
          },
          {
            idempotencyKey: `unassigned-admin/${boeking.id}/${morgen}`,
          }
        ),
      ];

      if (boeking.email) {
        meldingen.push(
          resend.emails.send(
            {
              from: "ShineGo <noreply@shinego.nl>",
              to: boeking.email,
              subject: `Update over je ShineGo-boeking ${boeking.id}`,
              html: `
                <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
                  <h2 style="color:#2563eb">Update over je afspraak</h2>
                  <p>Beste ${escapeHtml(boeking.voornaam ?? "klant")},</p>
                  <p>Je boeking staat voor morgen gepland, maar er is op dit moment nog geen professional definitief gekoppeld.</p>
                  <p>ShineGo controleert dit en neemt contact met je op als er iets aan de afspraak moet wijzigen. Je hoeft op dit moment niets te doen.</p>
                  <p>Met vriendelijke groet,<br><strong>ShineGo</strong></p>
                </div>
              `,
            },
            {
              idempotencyKey: `unassigned-customer/${boeking.id}/${morgen}`,
            }
          )
        );
      }

      const resultaten = await Promise.allSettled(meldingen);
      if (resultaten.some((resultaat) => resultaat.status === "rejected")) {
        fouten.push(`niet-gekoppeld:${boeking.id}`);
      }
      continue;
    }

    if (!boeking.herinnering_klant_verzonden && boeking.email) {
      const { error: klantMailError } = await resend.emails.send({
        from: "ShineGo <noreply@shinego.nl>",
        to: boeking.email,
        subject: `Herinnering: morgen je ShineGo-afspraak (${boeking.id})`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
            <h2 style="color: #2563eb;">Morgen is je ShineGo-afspraak</h2>
            <p>Beste ${escapeHtml(boeking.voornaam ?? "klant")},</p>
            <p>Dit is een herinnering dat je glazenwasafspraak morgen gepland staat.</p>
            <div style="margin: 24px 0; padding: 18px; background: #f9fafb; border-radius: 12px;">
              <p style="margin: 0 0 8px;"><strong>Boekingsnummer:</strong> ${boeking.id}</p>
              <p style="margin: 0 0 8px;"><strong>Datum:</strong> ${formatDatum(boeking.gewenste_datum)}</p>
              <p style="margin: 0 0 8px;"><strong>Tijd:</strong> ${escapeHtml(boeking.gewenste_tijd || "Nog niet gekozen")}</p>
              <p style="margin: 0;"><strong>Adres:</strong> ${escapeHtml(adres)}</p>
            </div>
            <p>Zorg dat de ramen volgens de gemaakte afspraak bereikbaar zijn.</p>
            <p>Met vriendelijke groet,<br /><strong>ShineGo</strong></p>
          </div>
        `,
      });

      if (klantMailError) {
        console.error(`Herinnering klant boeking ${boeking.id} mislukt`, klantMailError);
        fouten.push(`klant:${boeking.id}`);
      } else {
        const { error: markeerKlantError } = await supabaseAdmin
          .from("boekingen")
          .update({ herinnering_klant_verzonden: true })
          .eq("id", boeking.id)
          .eq("herinnering_klant_verzonden", false);

        if (markeerKlantError) {
          console.error(`Klant-herinnering markeren ${boeking.id} mislukt`, markeerKlantError);
          fouten.push(`klant-markeren:${boeking.id}`);
        } else {
          klantVerzonden += 1;
        }
      }
    }

    if (
      !boeking.herinnering_professional_verzonden &&
      boeking.professional_id
    ) {
      const { data: professional, error: professionalError } = await supabaseAdmin
        .from("professionals")
        .select("id, email, voornaam, bedrijfsnaam")
        .eq("id", boeking.professional_id)
        .maybeSingle();

      if (professionalError) {
        console.error(`Professional boeking ${boeking.id} ophalen mislukt`, professionalError);
        fouten.push(`professional-ophalen:${boeking.id}`);
        continue;
      }

      if (professional?.email) {
        const naam = professional.voornaam || professional.bedrijfsnaam || "professional";
        const { error: professionalMailError } = await resend.emails.send({
          from: "ShineGo <noreply@shinego.nl>",
          to: professional.email,
          subject: `Herinnering: morgen ShineGo-opdracht ${boeking.id}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
              <h2 style="color: #2563eb;">Morgen staat er een opdracht gepland</h2>
              <p>Beste ${escapeHtml(naam)},</p>
              <p>Dit is een herinnering voor je ShineGo-opdracht van morgen.</p>
              <div style="margin: 24px 0; padding: 18px; background: #f9fafb; border-radius: 12px;">
                <p style="margin: 0 0 8px;"><strong>Opdracht:</strong> ${boeking.id}</p>
                <p style="margin: 0 0 8px;"><strong>Klant:</strong> ${escapeHtml(
                  [boeking.voornaam, boeking.achternaam].filter(Boolean).join(" ") || "-"
                )}</p>
                <p style="margin: 0 0 8px;"><strong>Datum:</strong> ${formatDatum(boeking.gewenste_datum)}</p>
                <p style="margin: 0 0 8px;"><strong>Tijd:</strong> ${escapeHtml(boeking.gewenste_tijd || "Nog niet gekozen")}</p>
                <p style="margin: 0;"><strong>Adres:</strong> ${escapeHtml(adres)}</p>
              </div>
              <p>Controleer voor vertrek de opdrachtgegevens in je ShineGo-dashboard.</p>
              <p>Met vriendelijke groet,<br /><strong>ShineGo</strong></p>
            </div>
          `,
        });

        if (professionalMailError) {
          console.error(
            `Herinnering professional boeking ${boeking.id} mislukt`,
            professionalMailError
          );
          fouten.push(`professional:${boeking.id}`);
        } else {
          const { error: markeerProfessionalError } = await supabaseAdmin
            .from("boekingen")
            .update({ herinnering_professional_verzonden: true })
            .eq("id", boeking.id)
            .eq("herinnering_professional_verzonden", false);

          if (markeerProfessionalError) {
            console.error(
              `Professional-herinnering markeren ${boeking.id} mislukt`,
              markeerProfessionalError
            );
            fouten.push(`professional-markeren:${boeking.id}`);
          } else {
            professionalVerzonden += 1;
          }
        }
      }
    }
  }

  return NextResponse.json({
    success: fouten.length === 0,
    datum: morgen,
    boekingen: boekingen?.length ?? 0,
    klant_verzonden: klantVerzonden,
    professional_verzonden: professionalVerzonden,
    niet_gekoppeld: nietGekoppeld,
    fouten,
  });
}
