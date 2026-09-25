import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

const resend = new Resend(process.env.RESEND_API_KEY!);

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function GET() {
  try {
    const { data: boekingen, error: boekingenError } = await supabaseAdmin
      .from("boekingen")
      .select("*")
      .eq("betaald", true)
      .order("created_at", { ascending: false });

    if (boekingenError) {
      console.error("Fout bij ophalen boekingen:", boekingenError);
      return NextResponse.json(
        { error: "Boekingen konden niet worden opgehaald.", details: boekingenError.message },
        { status: 500 }
      );
    }

    const { data: professionals, error: professionalsError } = await supabaseAdmin
      .from("professionals")
      .select("*")
      .order("created_at", { ascending: false });

    if (professionalsError) {
      console.error("Fout bij ophalen professionals:", professionalsError);
      return NextResponse.json(
        { error: "Professionals konden niet worden opgehaald.", details: professionalsError.message },
        { status: 500 }
      );
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (authError) {
      console.error("Fout bij ophalen Auth-gebruikers:", authError);
    }

    const usersById = new Map((authData?.users ?? []).map((user) => [user.id, user]));
    const professionalsMetControle = (professionals ?? []).map((professional) => {
      const user = professional.user_id ? usersById.get(professional.user_id) : undefined;
      const metadata = user?.user_metadata ?? {};

      return {
        ...professional,
        avb_verzekeraar: professional.avb_verzekeraar || metadata.avb_verzekeraar || null,
        avb_polisnummer: professional.avb_polisnummer || metadata.avb_polisnummer || null,
        avb_bevestigd: professional.avb_bevestigd === true || metadata.avb_bevestigd === true,
      };
    });

    return NextResponse.json({
      boekingen: boekingen ?? [],
      professionals: professionalsMetControle,
    });
  } catch (error) {
    console.error("Admin API fout:", error);
    return NextResponse.json({ error: "Er is een onverwachte fout opgetreden." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      geverifieerd,
      actief,
      booking_id,
      professional_id,
      booking_status,
      annuleringsreden,
      annuleringskosten,
      professional_vergoeding,
      vergoeding_goedgekeurd,
      geannuleerd_door,
      klant_niet_thuis,
      niet_thuis_bewijs,
      geannuleerde_professional_id,
      uitbetaald,
    } = body;

    if (booking_id && booking_status) {
      if (!["nieuw", "geannuleerd"].includes(String(booking_status))) {
        return NextResponse.json(
          { error: "Deze statuswijziging is niet toegestaan via de beheeractie." },
          { status: 400 }
        );
      }

      const effectieveAnnuleringskosten =
        geannuleerd_door === "shinego" ? 0 : Math.max(0, Number(annuleringskosten || 0));

      const goedgekeurdeVergoeding =
        geannuleerd_door === "shinego"
          ? 0
          : vergoeding_goedgekeurd === true && klant_niet_thuis
            ? Math.min(effectieveAnnuleringskosten, 25)
            : Number(professional_vergoeding || 0);

      const { data: huidigeBoeking, error: huidigeBoekingError } = await supabaseAdmin
        .from("boekingen")
        .select("id, professional_id")
        .eq("id", booking_id)
        .single();

      if (huidigeBoekingError || !huidigeBoeking) {
        return NextResponse.json(
          { error: "Boeking kon niet worden gevonden." },
          { status: 404 }
        );
      }

      const vorigeProfessionalId =
        geannuleerde_professional_id || huidigeBoeking.professional_id || null;

      const { data: booking, error: bookingError } = await supabaseAdmin
        .from("boekingen")
        .update({
          status: booking_status,
          annuleringsreden,
          annuleringskosten: effectieveAnnuleringskosten,
          professional_vergoeding: goedgekeurdeVergoeding,
          vergoeding_goedgekeurd,
          geannuleerd_door,
          klant_niet_thuis,
          niet_thuis_bewijs,
          geannuleerde_professional_id: vorigeProfessionalId,
          ...(booking_status === "geannuleerd" ||
          (booking_status === "nieuw" && ["professional", "shinego"].includes(geannuleerd_door))
            ? { professional_id: null }
            : {}),
        })
        .eq("id", booking_id)
        .select("*")
        .maybeSingle();

      if (bookingError) {
        return NextResponse.json(
          { error: "Boekingstatus kon niet worden bijgewerkt.", details: bookingError.message },
          { status: 500 }
        );
      }

      if (!booking) {
        return NextResponse.json(
          { error: "Boeking kon niet worden bijgewerkt." },
          { status: 409 }
        );
      }

      try {
        const meldingen: Promise<unknown>[] = [];
        const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.shinego.nl").replace(/\/$/, "");

        if (
          booking_status === "geannuleerd" &&
          klant_niet_thuis !== true &&
          booking.email
        ) {
          const terugTeBetalen = Math.max(
            0,
            Number(booking.totaalprijs || 0) - effectieveAnnuleringskosten
          );

          meldingen.push(
            resend.emails.send(
              {
                from: "ShineGo <noreply@shinego.nl>",
                to: booking.email,
                subject: `ShineGo-boeking #${booking.id} geannuleerd`,
                html: `
                  <p>Beste ${escapeHtml(booking.voornaam || "klant")},</p>
                  <p>Je ShineGo-boeking is geannuleerd.</p>
                  <p><strong>Annuleringskosten:</strong> €${effectieveAnnuleringskosten.toFixed(2).replace(".", ",")}<br>
                  <strong>Terug te betalen:</strong> €${terugTeBetalen.toFixed(2).replace(".", ",")}</p>
                  <p>Een eventuele terugbetaling wordt via ShineGo verwerkt.</p>
                  <p>Met vriendelijke groet,<br>ShineGo</p>
                `,
              },
              {
                idempotencyKey: `booking-cancelled-customer/${booking.id}/${geannuleerd_door || "admin"}`,
              }
            )
          );
        }

        if (vorigeProfessionalId && booking_status === "geannuleerd") {
          const { data: vorigeProfessional } = await supabaseAdmin
            .from("professionals")
            .select("email, voornaam, bedrijfsnaam")
            .eq("id", vorigeProfessionalId)
            .maybeSingle();

          if (vorigeProfessional?.email) {
            meldingen.push(
              resend.emails.send(
                {
                  from: "ShineGo <noreply@shinego.nl>",
                  to: vorigeProfessional.email,
                  subject: `ShineGo-opdracht #${booking.id} geannuleerd`,
                  html: `
                    <p>Beste ${escapeHtml(vorigeProfessional.voornaam || vorigeProfessional.bedrijfsnaam || "professional")},</p>
                    <p>Opdracht <strong>#${booking.id}</strong> is geannuleerd en staat niet meer in je planning.</p>
                    <p><strong>Datum:</strong> ${escapeHtml(booking.gewenste_datum || "-")}<br>
                    <strong>Tijd:</strong> ${escapeHtml(booking.gewenste_tijd || "-")}</p>
                    <p>Controleer je dashboard voor je actuele opdrachten.</p>
                    <p><a href="${siteUrl}/professional/dashboard">Open dashboard</a></p>
                  `,
                },
                {
                  idempotencyKey: `booking-cancelled-professional/${booking.id}/${vorigeProfessionalId}`,
                }
              )
            );
          }
        }

        if (
          booking_status === "nieuw" &&
          geannuleerd_door === "professional" &&
          booking.email
        ) {
          meldingen.push(
            resend.emails.send(
              {
                from: "ShineGo <noreply@shinego.nl>",
                to: booking.email,
                subject: `Update over je ShineGo-boeking #${booking.id}`,
                html: `
                  <p>Beste ${escapeHtml(booking.voornaam || "klant")},</p>
                  <p>De eerder gekoppelde professional kan je afspraak niet uitvoeren.</p>
                  <p>Je betaalde boeking blijft actief en ShineGo stelt de opdracht opnieuw beschikbaar. Je hoeft niets opnieuw te betalen.</p>
                  <p>We houden je op de hoogte zodra een nieuwe professional is gekoppeld.</p>
                `,
              },
              {
                idempotencyKey: `admin-professional-cancel-customer/${booking.id}/${vorigeProfessionalId || "unknown"}`,
              }
            )
          );
        }

        await Promise.allSettled(meldingen);
      } catch (meldingError) {
        console.error("Meldingen na admin-statuswijziging mislukt:", meldingError);
      }

      return NextResponse.json({ booking });
    }

    if (booking_id && professional_id) {
      const { data: gekozenProfessional, error: gekozenProfessionalError } = await supabaseAdmin
        .from("professionals")
        .select("id, email, bedrijfsnaam, voornaam, actief, geverifieerd")
        .eq("id", professional_id)
        .single();

      if (
        gekozenProfessionalError ||
        !gekozenProfessional ||
        gekozenProfessional.actief !== true ||
        gekozenProfessional.geverifieerd !== true
      ) {
        return NextResponse.json(
          { error: "Kies een actieve en geverifieerde professional." },
          { status: 400 }
        );
      }

      const { data: booking, error: bookingError } = await supabaseAdmin
        .from("boekingen")
        .update({ professional_id, status: "toegewezen" })
        .eq("id", booking_id)
        .eq("betaald", true)
        .eq("status", "nieuw")
        .is("professional_id", null)
        .select("*")
        .maybeSingle();

      if (bookingError) {
        console.error("Fout bij koppelen professional:", bookingError);
        return NextResponse.json(
          { error: "Professional kon niet aan de boeking worden gekoppeld.", details: bookingError.message },
          { status: 500 }
        );
      }

      if (!booking) {
        return NextResponse.json(
          { error: "Deze boeking is niet meer beschikbaar voor toewijzing." },
          { status: 409 }
        );
      }

      try {
        const professionalNaam =
          gekozenProfessional.bedrijfsnaam || gekozenProfessional.voornaam || "de professional";
        const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.shinego.nl").replace(/\/$/, "");

        const meldingen: Promise<unknown>[] = [];

        if (booking.email) {
          meldingen.push(
            resend.emails.send(
              {
                from: "ShineGo <noreply@shinego.nl>",
                to: booking.email,
                subject: `Professional gekoppeld - ShineGo boeking ${booking.id}`,
                html: `
                  <p>Beste ${escapeHtml(booking.voornaam || "klant")},</p>
                  <p><strong>${escapeHtml(professionalNaam)}</strong> is aan je ShineGo-opdracht gekoppeld.</p>
                  <p><strong>Datum:</strong> ${escapeHtml(booking.gewenste_datum || "-")}<br>
                  <strong>Tijd:</strong> ${escapeHtml(booking.gewenste_tijd || "-")}</p>
                  <p>De boeking en betaling blijven via ShineGo beheerd.</p>
                `,
              },
              { idempotencyKey: `admin-assignment-customer/${booking.id}/${professional_id}` }
            )
          );
        }

        if (gekozenProfessional.email) {
          meldingen.push(
            resend.emails.send(
              {
                from: "ShineGo <noreply@shinego.nl>",
                to: gekozenProfessional.email,
                subject: `ShineGo-opdracht toegewezen (#${booking.id})`,
                html: `
                  <p>Beste ${escapeHtml(gekozenProfessional.voornaam || gekozenProfessional.bedrijfsnaam || "professional")},</p>
                  <p>ShineGo heeft opdracht <strong>#${booking.id}</strong> aan je gekoppeld.</p>
                  <p><strong>Datum:</strong> ${escapeHtml(booking.gewenste_datum || "-")}<br>
                  <strong>Tijd:</strong> ${escapeHtml(booking.gewenste_tijd || "-")}<br>
                  <strong>Regio:</strong> ${escapeHtml(booking.postcode || "")} ${escapeHtml(booking.plaats || "")}</p>
                  <p><a href="${siteUrl}/professional/dashboard/opdracht/${booking.id}">Open opdracht in je dashboard</a></p>
                `,
              },
              { idempotencyKey: `admin-assignment-professional/${booking.id}/${professional_id}` }
            )
          );
        }

        await Promise.allSettled(meldingen);
      } catch (mailError) {
        console.error("Melding na handmatige toewijzing mislukt:", mailError);
      }

      return NextResponse.json({ booking });
    }

    if (!id) {
      return NextResponse.json({ error: "Professional id ontbreekt." }, { status: 400 });
    }

    const { data: huidigeProfessional, error: professionalError } = await supabaseAdmin
      .from("professionals")
      .select("id, user_id, email, bedrijfsnaam, voornaam, actief, geverifieerd, kvk_nummer, btw_nummer, avb_verzekeraar, avb_polisnummer, avb_bevestigd")
      .eq("id", id)
      .single();

    if (professionalError || !huidigeProfessional) {
      return NextResponse.json({ error: "Professional kon niet worden gevonden." }, { status: 404 });
    }

    let avbVerzekeraar = huidigeProfessional.avb_verzekeraar || null;
    let avbPolisnummer = huidigeProfessional.avb_polisnummer || null;
    let avbBevestigd = huidigeProfessional.avb_bevestigd === true;
    let authEmail: string | null = null;

    if (huidigeProfessional.user_id) {
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(huidigeProfessional.user_id);
      const metadata = userData?.user?.user_metadata ?? {};
      authEmail = userData?.user?.email || null;
      avbVerzekeraar = avbVerzekeraar || metadata.avb_verzekeraar || null;
      avbPolisnummer = avbPolisnummer || metadata.avb_polisnummer || null;
      avbBevestigd = avbBevestigd || metadata.avb_bevestigd === true;
    }

    if (geverifieerd === true && actief === true) {
      if (
        !huidigeProfessional.kvk_nummer ||
        !huidigeProfessional.btw_nummer
      ) {
        return NextResponse.json(
          { error: "Goedkeuren kan pas nadat KVK- en btw-gegevens compleet zijn." },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabaseAdmin
      .from("professionals")
      .update({
        geverifieerd,
        actief,
        avb_verzekeraar: avbVerzekeraar,
        avb_polisnummer: avbPolisnummer,
        avb_bevestigd: avbBevestigd,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Fout bij bijwerken professional:", error);
      return NextResponse.json(
        { error: "Professional kon niet worden bijgewerkt.", details: error.message },
        { status: 500 }
      );
    }

    const zojuistGeactiveerd =
      geverifieerd === true &&
      actief === true &&
      (huidigeProfessional.geverifieerd !== true || huidigeProfessional.actief !== true);

    let goedkeuringsmailVerzonden = false;
    if (zojuistGeactiveerd) {
      const ontvanger = huidigeProfessional.email || authEmail;

      if (ontvanger) {
        try {
          const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.shinego.nl").replace(/\/$/, "");
          const aanspreeknaam =
            huidigeProfessional.voornaam || huidigeProfessional.bedrijfsnaam || "professional";

          const { error: emailError } = await resend.emails.send({
            from: "ShineGo <noreply@shinego.nl>",
            to: ontvanger,
            subject: "Je ShineGo-profiel is goedgekeurd en actief",
            html: `
              <p>Beste ${escapeHtml(aanspreeknaam)},</p>
              <p>Goed nieuws: je ShineGo-profiel is gecontroleerd, goedgekeurd en nu actief.</p>
              <p>Je kunt vanaf nu beschikbare opdrachten bekijken die passen bij je diensten en werkgebied.</p>
              <p>Controleer in je dashboard ook je werkgebied, diensten en uitbetalingsinstellingen.</p>
              <p><a href="${siteUrl}/professional/dashboard" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:600;">Naar mijn dashboard</a></p>
              <p>Met vriendelijke groet,<br />ShineGo</p>
            `,
          });

          if (emailError) {
            console.error("Goedkeuringsmail professional mislukt:", emailError);
          } else {
            goedkeuringsmailVerzonden = true;
          }
        } catch (emailError) {
          console.error("Goedkeuringsmail professional fout:", emailError);
        }
      } else {
        console.warn("Geen e-mailadres voor goedkeuringsmail professional:", huidigeProfessional.id);
      }
    }

    return NextResponse.json({
      professional: data,
      goedkeuringsmail_verzonden: goedkeuringsmailVerzonden,
    });
  } catch (error) {
    console.error("Admin PATCH fout:", error);
    return NextResponse.json({ error: "Er is een onverwachte fout opgetreden." }, { status: 500 });
  }
}
