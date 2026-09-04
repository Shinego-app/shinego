import { NextResponse } from "next/server";
import { maakFactuurPdf } from "@/lib/factuur";

export async function GET() {
  const pdfBytes = await maakFactuurPdf({
    factuurnummer: "TEST-0001",
    datum: new Date().toLocaleDateString("nl-NL"),

    klantNaam: "Test Klant",
    klantEmail: "test@shinego.nl",
    klantStraat: "Teststraat",
    klantHuisnummer: "10",
    klantToevoeging: null,
    klantPostcode: "1234 AB",
    klantPlaats: "Amsterdam",

    professionalBedrijfsnaam: "Test Glazenwasser",
    professionalKvK: "12345678",
    professionalBtwNummer: "NL123456789B01",

    omschrijving: "Glazenwassen buitenramen",
    bedrag: 25,
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="test-factuur.pdf"',
    },
  });
}