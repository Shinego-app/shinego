import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Resend } from "resend";
import { heeftBenodigdeDienst, ligtBinnenWerkgebied } from "@/lib/opdrachtMatching";

const resend = new Resend(process.env.RESEND_API_KEY!);

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization");
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

    const body = await request.json();
    const { booking_id, reden } = body;

    if (!booking_id) {
      return NextResponse.json({ error: "Boeking ontbreekt." }, { status: 400 });
    }

    const annuleringsreden = String(reden || "").trim();
    if (!annuleringsreden) {
      return NextResponse.json({ error: "Vul een reden van annulering in." }, { status: 400 });
    }

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
      .select("id, status, professional_id, uitbetaald")
      .eq("id", booking_id)
      .eq("professional_id", professional.id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: "Opdracht niet gevonden." }, { status: 404 });
    }

    if (booking.uitbetaald === true || booking.status === "afgerond" || booking.status === "geannuleerd") {
      return NextResponse.json(
        { error: "Deze opdracht kan niet meer door de professional worden geannuleerd." },
        { status: 400 }
      );
    }

    const { data: updatedBooking, error: updateError } = await supabaseAdmin
      .from("boekingen")
      .update({
        status: "nieuw",
        annuleringsreden,
        annuleringskosten: 0,
        professional_vergoeding: 0,
        vergoeding_goedgekeurd: false,
        geannuleerd_door: "professional",
        klant_niet_thuis: false,
        niet_thuis_bewijs: null,
        geannuleerde_professional_id: professional.id,
        professional_id: null,
      })
      .eq("id", booking_id)
      .eq("professional_id", professional.id)
      .select("*")
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Opdracht kon niet worden geannuleerd.", details: updateError.message },
        { status: 500 }
      );
    }

    try {
      const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.shinego.nl").replace(/\/$/, "");
      const beheerEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "info@shinego.nl";
      const meldingen: Promise<unknown>[] = [];

      if (updatedBooking.email) {
        meldingen.push(
          resend.emails.send(
            {
              from: "ShineGo <noreply@shinego.nl>",
              to: updatedBooking.email,
              subject: `Update over je ShineGo-boeking #${updatedBooking.id}`,
              html: `
                <p>Beste ${escapeHtml(updatedBooking.voornaam || "klant")},</p>
                <p>De eerder gekoppelde professional kan je afspraak niet uitvoeren.</p>
                <p>Je boeking blijft actief en ShineGo stelt de opdracht opnieuw beschikbaar voor een passende professional. Je hoeft hiervoor niets opnieuw te betalen.</p>
                <p><strong>Datum:</strong> ${escapeHtml(updatedBooking.gewenste_datum || "-")}<br>
                <strong>Tijd:</strong> ${escapeHtml(updatedBooking.gewenste_tijd || "-")}</p>
                <p>We houden je op de hoogte zodra er opnieuw een professional is gekoppeld.</p>
              `,
            },
            {
              idempotencyKey: `professional-cancel-customer/${updatedBooking.id}/${professional.id}`,
            }
          )
        );
      }

      meldingen.push(
        resend.emails.send(
          {
            from: "ShineGo <noreply@shinego.nl>",
            to: beheerEmail,
            subject: `Professional annuleerde ShineGo-opdracht #${updatedBooking.id}`,
            html: `
              <p>Opdracht <strong>#${updatedBooking.id}</strong> is door de gekoppelde professional geannuleerd en opnieuw beschikbaar gemaakt.</p>
              <p><strong>Reden:</strong> ${escapeHtml(annuleringsreden)}</p>
              <p><a href="${siteUrl}/admin">Open ShineGo beheer</a></p>
            `,
          },
          {
            idempotencyKey: `professional-cancel-admin/${updatedBooking.id}/${professional.id}`,
          }
        )
      );

      const { data: kandidaten, error: kandidatenError } = await supabaseAdmin
        .from("professionals")
        .select("id, email, voornaam, bedrijfsnaam, postcode, huisnummer, werkgebied_km, diensten, actief, geverifieerd")
        .eq("actief", true)
        .eq("geverifieerd", true)
        .neq("id", professional.id)
        .not("email", "is", null)
        .limit(100);

      if (kandidatenError) {
        console.error("Professionals na annulering ophalen mislukt:", kandidatenError);
      } else {
        const matches = await Promise.all(
          (kandidaten || [])
            .filter((kandidaat) => heeftBenodigdeDienst(kandidaat, updatedBooking))
            .map(async (kandidaat) => ({
              kandidaat,
              bereik: await ligtBinnenWerkgebied(kandidaat, updatedBooking),
            }))
        );

        for (const { kandidaat, bereik } of matches) {
          if (!kandidaat.email || bereik.binnen !== true) continue;

          meldingen.push(
            resend.emails.send(
              {
                from: "ShineGo <noreply@shinego.nl>",
                to: kandidaat.email,
                subject: `ShineGo-opdracht opnieuw beschikbaar (#${updatedBooking.id})`,
                html: `
                  <p>Beste ${escapeHtml(kandidaat.voornaam || kandidaat.bedrijfsnaam || "professional")},</p>
                  <p>Er is een betaalde ShineGo-opdracht opnieuw beschikbaar in jouw werkgebied.</p>
                  <p><strong>Regio:</strong> ${escapeHtml(updatedBooking.postcode || "")} ${escapeHtml(updatedBooking.plaats || "")}<br>
                  <strong>Datum:</strong> ${escapeHtml(updatedBooking.gewenste_datum || "-")}<br>
                  <strong>Tijd:</strong> ${escapeHtml(updatedBooking.gewenste_tijd || "-")}<br>
                  <strong>Afstand:</strong> ${bereik.afstand_km == null ? "Onbekend" : `± ${bereik.afstand_km} km`}</p>
                  <p><a href="${siteUrl}/professional/dashboard">Bekijk beschikbare opdrachten</a></p>
                `,
              },
              {
                idempotencyKey: `reopened-job/${updatedBooking.id}/${professional.id}/${kandidaat.id}`,
              }
            )
          );
        }
      }

      await Promise.allSettled(meldingen);
    } catch (meldingError) {
      console.error("Meldingen na professionalannulering mislukt:", meldingError);
    }

    return NextResponse.json({ booking: updatedBooking });
  } catch (error) {
    console.error("Professional annuleren fout:", error);
    return NextResponse.json(
      { error: "Opdracht kon niet worden geannuleerd." },
      { status: 500 }
    );
  }
}
