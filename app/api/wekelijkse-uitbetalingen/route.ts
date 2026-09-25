import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { maakFactuurnummer } from "@/lib/factuur";
import { maakProfessionalAfrekeningPdf } from "@/lib/professionalAfrekening";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Niet toegestaan" }, { status: 401 });
  }

  const [afgerondeResultaat, annuleringenResultaat] = await Promise.all([
    supabaseAdmin
      .from("boekingen")
      .select("*")
      .eq("status", "afgerond")
      .eq("betaald", true)
      .eq("uitbetaald", false)
      .not("professional_id", "is", null)
      .order("gewenste_datum", { ascending: true })
      .limit(100),
    supabaseAdmin
      .from("boekingen")
      .select("*")
      .eq("status", "geannuleerd")
      .eq("betaald", true)
      .eq("uitbetaald", false)
      .eq("vergoeding_goedgekeurd", true)
      .gt("professional_vergoeding", 0)
      .not("geannuleerde_professional_id", "is", null)
      .order("gewenste_datum", { ascending: true })
      .limit(100),
  ]);

  const boekingenError =
    afgerondeResultaat.error || annuleringenResultaat.error;

  if (boekingenError) {
    console.error("Wekelijkse uitbetalingen: boekingen ophalen mislukt", boekingenError);
    return NextResponse.json({ error: "Boekingen ophalen mislukt" }, { status: 500 });
  }

  const boekingen = [
    ...(afgerondeResultaat.data || []),
    ...(annuleringenResultaat.data || []),
  ]
    .sort((a, b) =>
      String(a.gewenste_datum || "").localeCompare(
        String(b.gewenste_datum || "")
      )
    )
    .slice(0, 100);

  let uitgevoerd = 0;
  let overgeslagen = 0;
  const fouten: Array<{ booking_id: string | number; reden: string }> = [];

  for (const booking of boekingen || []) {
    try {
      const isAnnuleringsvergoeding = booking.status === "geannuleerd";
      const professionalId = isAnnuleringsvergoeding
        ? booking.geannuleerde_professional_id
        : booking.professional_id;
      const uitbetalingsbedrag = Number(
        isAnnuleringsvergoeding
          ? booking.professional_vergoeding || 0
          : booking.professional_bedrag || 0
      );

      if (isAnnuleringsvergoeding) {
        if (booking.vergoeding_goedgekeurd !== true || uitbetalingsbedrag <= 0) {
          overgeslagen += 1;
          continue;
        }
        if (booking.terugbetaald !== true) {
          overgeslagen += 1;
          fouten.push({ booking_id: booking.id, reden: "Annuleringsvergoeding wacht op klantterugbetaling." });
          continue;
        }
      }

      if (!professionalId || !booking.stripe_payment_id) {
        overgeslagen += 1;
        fouten.push({ booking_id: booking.id, reden: "Professional of Stripe-betaling ontbreekt." });
        continue;
      }

      const { data: professional, error: professionalError } = await supabaseAdmin
        .from("professionals")
        .select("id, email, stripe_account_id, bedrijfsnaam, kvk_nummer, btw_nummer")
        .eq("id", professionalId)
        .single();

      if (professionalError || !professional?.stripe_account_id) {
        overgeslagen += 1;
        fouten.push({ booking_id: booking.id, reden: "Stripe Connect-account ontbreekt." });
        continue;
      }

      const account = await stripe.accounts.retrieve(professional.stripe_account_id);
      const transfersActive = account.capabilities?.transfers === "active";
      const payoutsEnabled = account.payouts_enabled === true;
      const uitbetalingenActief = transfersActive && payoutsEnabled;

      await supabaseAdmin
        .from("professionals")
        .update({ uitbetalingen_actief: uitbetalingenActief })
        .eq("id", professional.id);

      if (!uitbetalingenActief) {
        overgeslagen += 1;
        fouten.push({ booking_id: booking.id, reden: "Stripe-uitbetalingen zijn nog niet actief." });
        continue;
      }

      const amount = Math.round(uitbetalingsbedrag * 100);
      if (!amount || amount <= 0) {
        overgeslagen += 1;
        fouten.push({ booking_id: booking.id, reden: "Ongeldig professionalbedrag." });
        continue;
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(booking.stripe_payment_id);
      const chargeId =
        typeof paymentIntent.latest_charge === "string"
          ? paymentIntent.latest_charge
          : paymentIntent.latest_charge?.id;

      if (!chargeId) {
        overgeslagen += 1;
        fouten.push({ booking_id: booking.id, reden: "Stripe charge ontbreekt." });
        continue;
      }

      const transfer = await stripe.transfers.create(
        {
          amount,
          currency: "eur",
          destination: professional.stripe_account_id,
          source_transaction: chargeId,
          metadata: { booking_id: String(booking.id) },
        },
        {
          idempotencyKey: `shinego-payout-booking-${booking.id}`,
        }
      );

      const factuurnummer =
        booking.factuurnummer ?? maakFactuurnummer(Number(booking.id));

      const { data: bijgewerkt, error: updateError } = await supabaseAdmin
        .from("boekingen")
        .update({
          uitbetaald: true,
          uitbetaald_bedrag: uitbetalingsbedrag,
          stripe_transfer_id: transfer.id,
          factuurnummer,
        })
        .eq("id", booking.id)
        .eq("uitbetaald", false)
        .select("id")
        .maybeSingle();

      if (updateError) throw updateError;
      if (!bijgewerkt) {
        overgeslagen += 1;
        continue;
      }

      uitgevoerd += 1;

      if (professional.email) {
        try {
          const klantbedrag = isAnnuleringsvergoeding
            ? Number(booking.annuleringskosten ?? 0)
            : Number(booking.totaalprijs ?? 0);
          const professionalBedrag = uitbetalingsbedrag;
          const platformCommissie = isAnnuleringsvergoeding
            ? Math.max(0, klantbedrag - professionalBedrag)
            : Number(
                booking.platform_commissie ??
                  Math.max(0, klantbedrag - professionalBedrag)
              );

          const pdfBytes = await maakProfessionalAfrekeningPdf({
            factuurnummer,
            datum: new Date().toLocaleDateString("nl-NL"),
            professionalBedrijfsnaam: professional.bedrijfsnaam,
            professionalKvK: professional.kvk_nummer,
            professionalBtwNummer: professional.btw_nummer,
            bookingId: booking.id,
            klantbedrag,
            platformCommissie,
            professionalBedrag,
            grondslagLabel: isAnnuleringsvergoeding
              ? "Annuleringskosten klant (incl. btw)"
              : undefined,
            stripeTransferId: transfer.id,
          });

          const { error: emailError } = await resend.emails.send(
            {
              from: "ShineGo <noreply@shinego.nl>",
              to: professional.email,
              subject: isAnnuleringsvergoeding
                ? `Annuleringsvergoeding ${factuurnummer} - ShineGo`
                : `Uitbetalingsafrekening ${factuurnummer} - ShineGo`,
              html: `
                <p>Beste ${professional.bedrijfsnaam || "professional"},</p>
                <p>${isAnnuleringsvergoeding
                  ? `De annuleringsvergoeding voor opdracht ${booking.id} is uitbetaald.`
                  : `De wekelijkse uitbetaling voor opdracht ${booking.id} is uitgevoerd.`}</p>
                <p>In de bijlage vind je de uitbetalingsafrekening.</p>
                <p>Met vriendelijke groet,<br>ShineGo</p>
              `,
              attachments: [
                {
                  filename: `afrekening-${factuurnummer}.pdf`,
                  content: Buffer.from(pdfBytes),
                },
              ],
            },
            {
              idempotencyKey: `weekly-payout-receipt/${booking.id}/${transfer.id}`,
            }
          );

          if (emailError) {
            console.error(`Afrekening boeking ${booking.id} verzenden mislukt:`, emailError);
          }
        } catch (emailError) {
          console.error(`Afrekening boeking ${booking.id} fout:`, emailError);
        }
      }
    } catch (error) {
      console.error(`Wekelijkse uitbetaling boeking ${booking.id} mislukt:`, error);
      fouten.push({
        booking_id: booking.id,
        reden: error instanceof Error ? error.message : "Onbekende fout",
      });
    }
  }

  if (fouten.length > 0) {
    const beheerEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "info@shinego.nl";
    try {
      await resend.emails.send({
        from: "ShineGo <noreply@shinego.nl>",
        to: beheerEmail,
        subject: "ShineGo wekelijkse uitbetalingen: controle nodig",
        html: `
          <p>De wekelijkse uitbetalingsronde is uitgevoerd.</p>
          <p><strong>Uitgevoerd:</strong> ${uitgevoerd}<br>
          <strong>Overgeslagen:</strong> ${overgeslagen}<br>
          <strong>Fouten/controlepunten:</strong> ${fouten.length}</p>
          <pre style="white-space:pre-wrap">${JSON.stringify(fouten, null, 2)}</pre>
        `,
      });
    } catch (mailError) {
      console.error("Adminmelding wekelijkse uitbetalingen mislukt:", mailError);
    }
  }

  return NextResponse.json({
    success: fouten.length === 0,
    gecontroleerd: boekingen?.length ?? 0,
    uitgevoerd,
    overgeslagen,
    fouten,
  });
}
