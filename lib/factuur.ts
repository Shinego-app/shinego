import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { BtwRegel } from "@/lib/btw";
import { splitsBtwUitInclusief } from "@/lib/btw";

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
  professionalStraat?: string | null;
  professionalHuisnummer?: string | null;
  professionalToevoeging?: string | null;
  professionalPostcode?: string | null;
  professionalPlaats?: string | null;

  omschrijving: string;
  bedrag: number;
  btwRegels?: BtwRegel[];
};

function geld(value: number) {
  return Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
}

function bedragTekst(value: number) {
  return `EUR ${geld(value).toFixed(2).replace(".", ",")}`;
}

function tekst(value: unknown, fallback = "-") {
  const resultaat = String(value ?? "").trim();
  return resultaat || fallback;
}

function korteTekst(value: unknown, max = 43) {
  const resultaat = tekst(value);
  return resultaat.length > max ? `${resultaat.slice(0, max - 3)}...` : resultaat;
}

export async function maakFactuurPdf(
  gegevens: FactuurGegevens
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const pagina = pdf.addPage([595, 842]);

  const normaal = await pdf.embedFont(StandardFonts.Helvetica);
  const vet = await pdf.embedFont(StandardFonts.HelveticaBold);

  pagina.drawText("ShineGo", {
    x: 50,
    y: 790,
    size: 24,
    font: vet,
    color: rgb(0.1, 0.3, 0.8),
  });

  pagina.drawText("FACTUUR", {
    x: 430,
    y: 790,
    size: 18,
    font: vet,
  });

  pagina.drawText("Administratief opgesteld via ShineGo namens de uitvoerende professional.", {
    x: 50,
    y: 765,
    size: 8.5,
    font: normaal,
    color: rgb(0.35, 0.42, 0.5),
  });

  pagina.drawText(`Factuurnummer: ${gegevens.factuurnummer}`, {
    x: 50,
    y: 725,
    size: 10,
    font: normaal,
  });

  pagina.drawText(`Factuurdatum: ${gegevens.datum}`, {
    x: 330,
    y: 725,
    size: 10,
    font: normaal,
  });

  pagina.drawText("Leverancier / uitvoerder", {
    x: 50,
    y: 680,
    size: 11,
    font: vet,
  });

  let leverancierY = 660;
  const leverancierRegels = [
    tekst(gegevens.professionalBedrijfsnaam),
    [gegevens.professionalStraat, gegevens.professionalHuisnummer, gegevens.professionalToevoeging]
      .filter(Boolean)
      .join(" "),
    [gegevens.professionalPostcode, gegevens.professionalPlaats].filter(Boolean).join(" "),
    `KvK: ${tekst(gegevens.professionalKvK)}`,
    gegevens.professionalBtwNummer
      ? `Btw-id: ${tekst(gegevens.professionalBtwNummer)}`
      : "",
  ].filter(Boolean);

  for (const regel of leverancierRegels) {
    pagina.drawText(korteTekst(regel, 47), {
      x: 50,
      y: leverancierY,
      size: 9.5,
      font: normaal,
    });
    leverancierY -= 17;
  }

  pagina.drawText("Afnemer", {
    x: 330,
    y: 680,
    size: 11,
    font: vet,
  });

  let klantY = 660;
  const klantRegels = [
    tekst(gegevens.klantNaam),
    [gegevens.klantStraat, gegevens.klantHuisnummer, gegevens.klantToevoeging]
      .filter(Boolean)
      .join(" "),
    [gegevens.klantPostcode, gegevens.klantPlaats].filter(Boolean).join(" "),
    tekst(gegevens.klantEmail),
  ].filter(Boolean);

  for (const regel of klantRegels) {
    pagina.drawText(korteTekst(regel, 42), {
      x: 330,
      y: klantY,
      size: 9.5,
      font: normaal,
    });
    klantY -= 17;
  }

  pagina.drawText("Prestatie en btw", {
    x: 50,
    y: 555,
    size: 11,
    font: vet,
  });

  const regels =
    gegevens.btwRegels && gegevens.btwRegels.length > 0
      ? gegevens.btwRegels
      : [
          {
            omschrijving: gegevens.omschrijving || "Glasbewassing",
            tarief: 21 as const,
            bedragIncl: Number(gegevens.bedrag || 0),
          },
        ];

  const kolommen = {
    omschrijving: 50,
    tarief: 305,
    excl: 355,
    btw: 435,
    incl: 505,
  };

  pagina.drawText("Omschrijving", {
    x: kolommen.omschrijving,
    y: 525,
    size: 8.5,
    font: vet,
  });
  pagina.drawText("BTW", {
    x: kolommen.tarief,
    y: 525,
    size: 8.5,
    font: vet,
  });
  pagina.drawText("Excl.", {
    x: kolommen.excl,
    y: 525,
    size: 8.5,
    font: vet,
  });
  pagina.drawText("BTW-bedrag", {
    x: kolommen.btw,
    y: 525,
    size: 8.5,
    font: vet,
  });
  pagina.drawText("Incl.", {
    x: kolommen.incl,
    y: 525,
    size: 8.5,
    font: vet,
  });

  let rijY = 500;
  let totaalExcl = 0;
  let totaalBtw = 0;
  let totaalIncl = 0;

  for (const regel of regels.slice(0, 4)) {
    const uitsplitsing = splitsBtwUitInclusief(
      Number(regel.bedragIncl || 0),
      regel.tarief
    );

    totaalExcl += uitsplitsing.bedragExcl;
    totaalBtw += uitsplitsing.btwBedrag;
    totaalIncl += uitsplitsing.bedragIncl;

    pagina.drawText(korteTekst(regel.omschrijving, 38), {
      x: kolommen.omschrijving,
      y: rijY,
      size: 9,
      font: normaal,
    });
    pagina.drawText(`${regel.tarief}%`, {
      x: kolommen.tarief,
      y: rijY,
      size: 9,
      font: normaal,
    });
    pagina.drawText(uitsplitsing.bedragExcl.toFixed(2), {
      x: kolommen.excl,
      y: rijY,
      size: 9,
      font: normaal,
    });
    pagina.drawText(uitsplitsing.btwBedrag.toFixed(2), {
      x: kolommen.btw,
      y: rijY,
      size: 9,
      font: normaal,
    });
    pagina.drawText(uitsplitsing.bedragIncl.toFixed(2), {
      x: kolommen.incl,
      y: rijY,
      size: 9,
      font: normaal,
    });

    rijY -= 24;
  }

  totaalExcl = geld(totaalExcl);
  totaalBtw = geld(totaalBtw);
  totaalIncl = geld(totaalIncl);

  pagina.drawLine({
    start: { x: 50, y: rijY + 8 },
    end: { x: 545, y: rijY + 8 },
    thickness: 0.7,
    color: rgb(0.8, 0.85, 0.9),
  });

  pagina.drawText("Totaal excl. btw", {
    x: 355,
    y: rijY - 15,
    size: 9.5,
    font: normaal,
  });
  pagina.drawText(bedragTekst(totaalExcl), {
    x: 455,
    y: rijY - 15,
    size: 9.5,
    font: vet,
  });

  pagina.drawText("Totaal btw", {
    x: 355,
    y: rijY - 35,
    size: 9.5,
    font: normaal,
  });
  pagina.drawText(bedragTekst(totaalBtw), {
    x: 455,
    y: rijY - 35,
    size: 9.5,
    font: vet,
  });

  pagina.drawText("Totaal betaald", {
    x: 355,
    y: rijY - 60,
    size: 11,
    font: vet,
  });
  pagina.drawText(bedragTekst(totaalIncl), {
    x: 455,
    y: rijY - 60,
    size: 11,
    font: vet,
  });

  pagina.drawText(
    "De uitvoerende professional is de leverancier van de glasbewassing. ShineGo faciliteert de boeking en betaling.",
    {
      x: 50,
      y: 130,
      size: 8.5,
      font: normaal,
      color: rgb(0.35, 0.42, 0.5),
    }
  );

  pagina.drawText(
    `Omschrijving opdracht: ${korteTekst(gegevens.omschrijving || "Glasbewassing", 72)}`,
    {
      x: 50,
      y: 110,
      size: 8.5,
      font: normaal,
    }
  );

  return pdf.save();
}

export function maakFactuurnummer(boekingId: number) {
  const jaar = new Date().getFullYear();
  return `SG-${jaar}-${String(boekingId).padStart(6, "0")}`;
}
