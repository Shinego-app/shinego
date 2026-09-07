import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

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

export async function maakProfessionalAfrekeningPdf(
  gegevens: ProfessionalAfrekeningGegevens
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const pagina = pdf.addPage([595, 842]);
  const normaal = await pdf.embedFont(StandardFonts.Helvetica);
  const vet = await pdf.embedFont(StandardFonts.HelveticaBold);

  pagina.drawText("ShineGo", {
    x: 50,
    y: 780,
    size: 24,
    font: vet,
    color: rgb(0.1, 0.3, 0.8),
  });

  pagina.drawText("UITBETALINGSAFREKENING", {
    x: 315,
    y: 780,
    size: 15,
    font: vet,
  });

  pagina.drawText(`Afrekening: ${gegevens.factuurnummer}`, {
    x: 50,
    y: 720,
    size: 11,
    font: normaal,
  });

  pagina.drawText(`Datum: ${gegevens.datum}`, {
    x: 50,
    y: 700,
    size: 11,
    font: normaal,
  });

  pagina.drawText(`Professional: ${gegevens.professionalBedrijfsnaam}`, {
    x: 50,
    y: 655,
    size: 11,
    font: vet,
  });

  if (gegevens.professionalKvK) {
    pagina.drawText(`KVK: ${gegevens.professionalKvK}`, {
      x: 50,
      y: 635,
      size: 10,
      font: normaal,
    });
  }

  if (gegevens.professionalBtwNummer) {
    pagina.drawText(`BTW-nummer: ${gegevens.professionalBtwNummer}`, {
      x: 50,
      y: 615,
      size: 10,
      font: normaal,
    });
  }

  pagina.drawText(`Opdracht: ${gegevens.bookingId}`, {
    x: 50,
    y: 570,
    size: 11,
    font: normaal,
  });

  pagina.drawText("Financiele afrekening", {
    x: 50,
    y: 525,
    size: 12,
    font: vet,
  });

  pagina.drawText(`Klantbedrag: EUR ${gegevens.klantbedrag.toFixed(2)}`, {
    x: 50,
    y: 495,
    size: 11,
    font: normaal,
  });

  pagina.drawText(
    `ShineGo platformcommissie: EUR ${gegevens.platformCommissie.toFixed(2)}`,
    {
      x: 50,
      y: 470,
      size: 11,
      font: normaal,
    }
  );

  pagina.drawText(
    `Uitbetaald aan professional: EUR ${gegevens.professionalBedrag.toFixed(2)}`,
    {
      x: 50,
      y: 435,
      size: 12,
      font: vet,
    }
  );

  if (gegevens.stripeTransferId) {
    pagina.drawText(`Stripe transfer: ${gegevens.stripeTransferId}`, {
      x: 50,
      y: 390,
      size: 9,
      font: normaal,
    });
  }

  pagina.drawText(
    "Deze afrekening hoort bij de via ShineGo uitgevoerde en uitbetaalde opdracht.",
    {
      x: 50,
      y: 340,
      size: 10,
      font: normaal,
    }
  );

  return pdf.save();
}
