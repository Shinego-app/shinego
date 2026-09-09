import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { maakFactuurnummer } from "@/lib/factuur";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function escapeHtml(value: string | number | null | undefined) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatBedrag(value: number | string | null | undefined) {
  return `€${Number(value ?? 0).toFixed(2).replace(".", ",")}`;
}

function formatDatum(value: string | null | undefined) {
  if (!value) return "Nog niet gekozen";

  const datum = new Date(`${value}T12:00:00`);

  if (Number.isNaN(datum.getTime())) {
    return value;
  }

  return datum.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Geen Stripe-signature ontvangen" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Stripe webhook verificatie fout:", error);

    return NextResponse.json(
      { error: "Webhook verificatie mislukt" },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;

      if (bookingId && session.payment_intent) {
        const paymentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent.id;

        const platformCommissie =
          Math.round((session.amount_total ?? 0) * 0.15) / 100;
        const professionalBedrag =
          (session.amount_total ?? 0) / 100 - platformCommissie;
        const factuurnummer = maakFactuurnummer(Number(bookingId));

        const { data: bijgewerkteBoeking, error: updateError } =
          await supabaseAdmin
            .from("boekingen")
            .update({
              stripe_payment_id: paymentId,
              betaald: true,
              platform_commissie: platformCommissie,
              professional_bedrag: professionalBedrag,
              factuurnummer,
            })
            .eq("id", bookingId)
            .eq("betaald", false)
            .select(
              "id, voornaam, achternaam, email, straat, huisnummer, toevoeging, postcode, plaats, gewenste_datum, gewenste_tijd, totaalprijs"
            )
            .maybeSingle();

        if (updateError) {
          console.error("Boeking bijwerken na betaling mislukt:", updateError);
          throw updateError;
        }

        let boekingVoorMail = bijgewerkteBoeking;

        if (!boekingVoorMail) {
          const { data: bestaandeBoeking, error: bestaandeBoekingError } =
            await supabaseAdmin
              .from("boekingen")
              .select(
                "id, voornaam, achternaam, email, straat, huisnummer, toevoeging, postcode, plaats, gewenste_datum, gewenste_tijd, totaalprijs, betaald, stripe_payment_id"
              )
              .eq("id", bookingId)
              .eq("betaald", true)
              .eq("stripe_payment_id", paymentId)
              .maybeSingle();

          if (bestaandeBoekingError) {
            throw bestaandeBoekingError;
          }

          boekingVoorMail = bestaandeBoeking;
        }

        if (boekingVoorMail?.email) {
          const adres = `${boekingVoorMail.straat ?? ""} ${
            boekingVoorMail.huisnummer ?? ""
          }${
            boekingVoorMail.toevoeging
              ? ` ${boekingVoorMail.toevoeging}`
              : ""
          }, ${boekingVoorMail.postcode ?? ""} ${
            boekingVoorMail.plaats ?? ""
          }`.trim();

          const veiligeVoornaam = escapeHtml(boekingVoorMail.voornaam ?? "klant");
          const veiligeBoekingId = escapeHtml(boekingVoorMail.id);
          const veiligeDatum = escapeHtml(formatDatum(boekingVoorMail.gewenste_datum));
          const veiligeTijd = escapeHtml(
            boekingVoorMail.gewenste_tijd || "Nog niet gekozen"
          );
          const veiligAdres = escapeHtml(adres);
          const veiligBedrag = escapeHtml(formatBedrag(boekingVoorMail.totaalprijs));

          const { error: emailError } = await resend.emails.send(
            {
              from: "ShineGo <noreply@shinego.nl>",
              to: boekingVoorMail.email,
              subject: `Betaling ontvangen - ShineGo boeking ${boekingVoorMail.id}`,
              html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
                  <h2 style="color: #2563eb;">Je betaling is ontvangen</h2>
                  <p>Beste ${veiligeVoornaam},</p>
                  <p>Bedankt. We hebben je betaling voor je ShineGo-boeking ontvangen.</p>

                  <div style="margin: 24px 0; padding: 18px; background: #f9fafb; border-radius: 12px;">
                    <p style="margin: 0 0 8px;"><strong>Boekingsnummer:</strong> ${veiligeBoekingId}</p>
                    <p style="margin: 0 0 8px;"><strong>Dienst:</strong> Glazenwassen</p>
                    <p style="margin: 0 0 8px;"><strong>Gewenste datum:</strong> ${veiligeDatum}</p>
                    <p style="margin: 0 0 8px;"><strong>Gewenste tijd:</strong> ${veiligeTijd}</p>
                    <p style="margin: 0 0 8px;"><strong>Adres:</strong> ${veiligAdres}</p>
                    <p style="margin: 0;"><strong>Betaald:</strong> ${veiligBedrag}</p>
                  </div>

                  <p>Je boeking wordt nu verder verwerkt. Zodra er een professional aan je opdracht is gekoppeld, blijft de opdracht via ShineGo beheerd.</p>
                  <p>Bewaar deze e-mail voor je administratie.</p>
                  <p>Met vriendelijke groet,<br /><strong>ShineGo</strong></p>
                </div>
              `,
            },
            {
              idempotencyKey: `payment-confirmation/${boekingVoorMail.id}`,
            }
          );

          if (emailError) {
            console.error("Boekingsbevestiging verzenden mislukt:", emailError);
            throw new Error("Boekingsbevestiging verzenden mislukt");
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook verwerking fout:", error);

    return NextResponse.json(
      { error: "Webhook verwerking mislukt" },
      { status: 500 }
    );
  }
}
