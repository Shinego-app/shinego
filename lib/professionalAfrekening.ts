import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { berekenPlatformCommissieBtw } from "@/lib/btw";

export type ProfessionalAfrekeningGegevens = {
  factuurnummer: string;
  datum: string;
  professionalBedrijfsnaam: string;
  professionalKvK?: string | null;
  professionalBtwNummer?: string | null;
  bookingId: string | number;
  klantbedrag: number;
  platformCommissie: number;
  professionalBedrag: number;
  stripeTransferId?: string | null;
};

function geld(value: number) {
  return Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
}

function bedrag(value: number) {
  return `EUR ${geld(value).toFixed(2).replace(".", ",")}`;
}

export async function maakProfessionalAfrekeningPdf(
  gegevens: ProfessionalAfrekeningGegevens
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const pagina = pdf.addPage([595, 842]);
  const normaal = await pdf.embedFont(StandardFonts.Helvetica);
  const vet = await pdf.embedFont(StandardFonts.HelveticaBold);

  const commissie = berekenPlatformCommissieBtw(
    Number(gegevens.platformCommissie || 0)
  );

  const factuurJaarMatch = String(gegevens.factuurnummer || "").match(/^SG-(\d{4})-/);
  const factuurJaar = factuurJaarMatch?.[1] || String(new Date().getFullYear());
  const platformFactuurnummer = `SG-COM-${factuurJaar}-${String(
    gegevens.bookingId
  ).padStart(6, "0")}`;

  pagina.drawText("ShineGo", {
    x: 50,
    y: 790,
    size: 24,
    font: vet,
    color: rgb(0.1, 0.3, 0.8),
  });

  pagina.drawText("UITBETALINGSAFREKENING", {
    x: 310,
    y: 790,
    size: 15,
    font: vet,
  });

  pagina.drawText("Overzicht van uitbetaling en ShineGo-platformkosten.", {
    x: 50,
    y: 765,
    size: 8.5,
    font: normaal,
    color: rgb(0.35, 0.42, 0.5),
  });

  pagina.drawText(`Klantfactuur: ${gegevens.factuurnummer}`, {
    x: 50,
    y: 725,
    size: 10,
    font: normaal,
  });

  pagina.drawText(`Platformreferentie: ${platformFactuurnummer}`, {
    x: 300,
    y: 725,
    size: 10,
    font: normaal,
  });

  pagina.drawText(`Datum: ${gegevens.datum}`, {
    x: 50,
    y: 705,
    size: 10,
    font: normaal,
  });

  pagina.drawText("ShineGo platform", {
    x: 50,
    y: 660,
    size: 11,
    font: vet,
  });
  pagina.drawText("Handelsnaam: ShineGo", {
    x: 50,
    y: 640,
    size: 9.5,
    font: normaal,
  });
  pagina.drawText("KvK: 57712913", {
    x: 50,
    y: 623,
    size: 9.5,
    font: normaal,
  });
  pagina.drawText("Btw-id: NL001205368B47", {
    x: 50,
    y: 606,
    size: 9.5,
    font: normaal,
  });
  pagina.drawText("E-mail: info@shinego.nl", {
    x: 50,
    y: 589,
    size: 9.5,
    font: normaal,
  });

  pagina.drawText("Professional", {
    x: 330,
    y: 660,
    size: 11,
    font: vet,
  });
  pagina.drawText(String(gegevens.professionalBedrijfsnaam || "-"), {
    x: 330,
    y: 640,
    size: 9.5,
    font: normaal,
  });
  pagina.drawText(`KvK: ${gegevens.professionalKvK || "-"}`, {
    x: 330,
    y: 623,
    size: 9.5,
    font: normaal,
  });
  pagina.drawText(`Btw-id: ${gegevens.professionalBtwNummer || "-"}`, {
    x: 330,
    y: 606,
    size: 9.5,
    font: normaal,
  });

  pagina.drawText(`Opdracht: ${gegevens.bookingId}`, {
    x: 50,
    y: 550,
    size: 10,
    font: vet,
  });

  pagina.drawText("Financiele afrekening", {
    x: 50,
    y: 510,
    size: 12,
    font: vet,
  });

  pagina.drawText("Opdrachtwaarde klant (incl. btw)", {
    x: 50,
    y: 480,
    size: 10,
    font: normaal,
  });
  pagina.drawText(bedrag(gegevens.klantbedrag), {
    x: 410,
    y: 480,
    size: 10,
    font: vet,
  });

  pagina.drawText("ShineGo platformcommissie excl. btw", {
    x: 50,
    y: 450,
    size: 10,
    font: normaal,
  });
  pagina.drawText(bedrag(commissie.bedragExcl), {
    x: 410,
    y: 450,
    size: 10,
    font: normaal,
  });

  pagina.drawText("Btw over platformcommissie (21%)", {
    x: 50,
    y: 425,
    size: 10,
    font: normaal,
  });
  pagina.drawText(bedrag(commissie.btwBedrag), {
    x: 410,
    y: 425,
    size: 10,
    font: normaal,
  });

  pagina.drawText("Totale ShineGo-inhouding incl. btw", {
    x: 50,
    y: 400,
    size: 10,
    font: vet,
  });
  pagina.drawText(bedrag(commissie.bedragIncl), {
    x: 410,
    y: 400,
    size: 10,
    font: vet,
  });

  pagina.drawLine({
    start: { x: 50, y: 378 },
    end: { x: 545, y: 378 },
    thickness: 0.7,
    color: rgb(0.8, 0.85, 0.9),
  });

  pagina.drawText("Uitbetaald aan professional", {
    x: 50,
    y: 350,
    size: 12,
    font: vet,
  });
  pagina.drawText(bedrag(gegevens.professionalBedrag), {
    x: 410,
    y: 350,
    size: 12,
    font: vet,
  });

  if (gegevens.stripeTransferId) {
    pagina.drawText(`Stripe transfer: ${gegevens.stripeTransferId}`, {
      x: 50,
      y: 310,
      size: 8.5,
      font: normaal,
      color: rgb(0.35, 0.42, 0.5),
    });
  }

  pagina.drawText(
    "De 15% ShineGo-platformcommissie blijft ongewijzigd; dit overzicht splitst alleen de daarin begrepen 21% btw uit.",
    {
      x: 50,
      y: 245,
      size: 8.5,
      font: normaal,
      color: rgb(0.35, 0.42, 0.5),
    }
  );

  pagina.drawText(
    "Deze wijziging verandert de klantprijs, Stripe-betaling of netto uitbetaling niet.",
    {
      x: 50,
      y: 228,
      size: 8.5,
      font: normaal,
      color: rgb(0.35, 0.42, 0.5),
    }
  );

  return pdf.save();
}
