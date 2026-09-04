import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type FactuurGegevens = {
  factuurnummer: string;
  datum: string;

  klantNaam: string;
  klantEmail: string;
  klantStraat: string;
  klantHuisnummer: string;
  klantToevoeging?: string | null;
  klantPostcode: string;
  klantPlaats: string;

  professionalBedrijfsnaam: string;
  professionalKvK: string;
  professionalBtwNummer?: string | null;

  omschrijving: string;
  bedrag: number;
};

export async function maakFactuurPdf(
  gegevens: FactuurGegevens
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

  pagina.drawText("FACTUUR", {
    x: 430,
    y: 780,
    size: 18,
    font: vet,
  });

  pagina.drawText(`Factuurnummer: ${gegevens.factuurnummer}`, {
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

  pagina.drawText(`Klant: ${gegevens.klantNaam}`, {
    x: 50,
    y: 660,
    size: 11,
    font: normaal,
  });

  pagina.drawText(`E-mail: ${gegevens.klantEmail}`, {
    x: 50,
    y: 640,
    size: 11,
    font: normaal,
  });
  pagina.drawText(
  `Adres: ${gegevens.klantStraat} ${gegevens.klantHuisnummer}${gegevens.klantToevoeging ? ` ${gegevens.klantToevoeging}` : ""}`,
  {
    x: 50,
    y: 620,
    size: 11,
    font: normaal,
  }
);

pagina.drawText(
  `${gegevens.klantPostcode} ${gegevens.klantPlaats}`,
  {
    x: 50,
    y: 600,
    size: 11,
    font: normaal,
  }
);
pagina.drawText(`Uitgevoerd door: ${gegevens.professionalBedrijfsnaam}`, {
  x: 50,
  y: 560,
  size: 11,
  font: vet,
});

pagina.drawText(`KVK: ${gegevens.professionalKvK}`, {
  x: 50,
  y: 540,
  size: 10,
  font: normaal,
});

if (gegevens.professionalBtwNummer) {
  pagina.drawText(`BTW-nummer: ${gegevens.professionalBtwNummer}`, {
    x: 50,
    y: 520,
    size: 10,
    font: normaal,
  });
}

  pagina.drawText("Omschrijving", {
    x: 50,
    y: 480,
    size: 11,
    font: vet,
  });

  pagina.drawText(gegevens.omschrijving, {
    x: 50,
    y: 455,
    size: 11,
    font: normaal,
  });

  pagina.drawText(`Totaal betaald: EUR ${gegevens.bedrag.toFixed(2)}`, {
    x: 350,
    y: 500,
    size: 12,
    font: vet,
  });

  return pdf.save();
}
export function maakFactuurnummer(boekingId: number) {
  const jaar = new Date().getFullYear();
  return `SG-${jaar}-${String(boekingId).padStart(6, "0")}`;
}