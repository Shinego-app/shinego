import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { maakFactuurnummer } from "@/lib/factuur";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

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

        // Alleen een bevestigingsmail sturen wanneer deze webhook de boeking
        // daadwerkelijk van onbetaald naar betaald heeft gezet. Hierdoor
        // veroorzaakt een herhaalde Stripe-webhook geen dubbele e-mail.
        if (bijgewerkteBoeking?.email) {
          const adres = `${bijgewerkteBoeking.straat ?? ""} ${
            bijgewerkteBoeking.huisnummer ?? ""
          }${
            bijgewerkteBoeking.toevoeging
              ? ` ${bijgewerkteBoeking.toevoeging}`
              : ""
          }, ${bijgewerkteBoeking.postcode ?? ""} ${
            bijgewerkteBoeking.plaats ?? ""
          }`.trim();

          const { error: emailError } = await resend.emails.send({
            from: "ShineGo <noreply@shinego.nl>",
            to: bijgewerkteBoeking.email,
            subject: `Betaling ontvangen - ShineGo boeking ${bijgewerkteBoeking.id}`,
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
                <h2 style="color: #2563eb;">Je betaling is ontvangen</h2>
                <p>Beste ${bijgewerkteBoeking.voornaam ?? "klant"},</p>
                <p>Bedankt. We hebben je betaling voor je ShineGo-boeking ontvangen.</p>

                <div style="margin: 24px 0; padding: 18px; background: #f9fafb; border-radius: 12px;">
                  <p style="margin: 0 0 8px;"><strong>Boekingsnummer:</strong> ${bijgewerkteBoeking.id}</p>
                  <p style="margin: 0 0 8px;"><strong>Dienst:</strong> Glazenwassen</p>
                  <p style="margin: 0 0 8px;"><strong>Gewenste datum:</strong> ${formatDatum(
                    bijgewerkteBoeking.gewenste_datum
                  )}</p>
                  <p style="margin: 0 0 8px;"><strong>Gewenste tijd:</strong> ${
                    bijgewerkteBoeking.gewenste_tijd || "Nog niet gekozen"
                  }</p>
                  <p style="margin: 0 0 8px;"><strong>Adres:</strong> ${adres}</p>
                  <p style="margin: 0;"><strong>Betaald:</strong> ${formatBedrag(
                    bijgewerkteBoeking.totaalprijs
                  )}</p>
                </div>

                <p>Je boeking wordt nu verder verwerkt. Zodra er een professional aan je opdracht is gekoppeld, blijft de opdracht via ShineGo beheerd.</p>
                <p>Bewaar deze e-mail voor je administratie.</p>
                <p>Met vriendelijke groet,<br /><strong>ShineGo</strong></p>
              </div>
            `,
          });

          if (emailError) {
            // De betaling is al correct verwerkt. Een tijdelijk mailprobleem mag
            // Stripe daarom niet laten denken dat de betaling zelf is mislukt.
            console.error("Boekingsbevestiging verzenden mislukt:", emailError);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook fout:", error);

    return NextResponse.json(
      { error: "Webhook verificatie mislukt" },
      { status: 400 }
    );
  }
}
