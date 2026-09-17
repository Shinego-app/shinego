import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { maakFactuurPdf, maakFactuurnummer } from "@/lib/factuur";

function isAdminAuthorized(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Basic ")) return false;

  try {
    const decoded = Buffer.from(authorization.slice(6), "base64").toString("utf8");
    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex === -1) return false;

    const username = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);
    return username === "admin" && password === adminPassword;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return new NextResponse("Inloggen vereist", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="ShineGo Admin"',
      },
    });
  }

  const bookingId = request.nextUrl.searchParams.get("booking_id");

  if (!bookingId || !/^\d+$/.test(bookingId)) {
    return NextResponse.json(
      { error: "booking_id ontbreekt of is ongeldig" },
      { status: 400 }
    );
  }

  const { data: booking, error: bookingError } = await supabaseAdmin
    .from("boekingen")
    .select("*")
    .eq("id", Number(bookingId))
    .single();

  if (bookingError || !booking) {
    return NextResponse.json(
      { error: "Boeking niet gevonden" },
      { status: 404 }
    );
  }

  if (!booking.professional_id) {
    return NextResponse.json(
      { error: "Geen professional gekoppeld aan deze boeking" },
      { status: 400 }
    );
  }

  const { data: professional, error: professionalError } = await supabaseAdmin
    .from("professionals")
    .select("*")
    .eq("id", booking.professional_id)
    .single();

  if (professionalError || !professional) {
    return NextResponse.json(
      { error: "Professional niet gevonden" },
      { status: 404 }
    );
  }

  const factuurnummer =
    booking.factuurnummer ?? maakFactuurnummer(Number(booking.id));

  if (!booking.factuurnummer) {
    await supabaseAdmin
      .from("boekingen")
      .update({ factuurnummer })
      .eq("id", booking.id);
  }

  const pdfBytes = await maakFactuurPdf({
    factuurnummer,
    datum: new Date().toLocaleDateString("nl-NL"),
    klantNaam: `${booking.voornaam} ${booking.achternaam}`,
    klantEmail: booking.email,
    klantStraat: booking.straat,
    klantHuisnummer: String(booking.huisnummer),
    klantToevoeging: booking.toevoeging,
    klantPostcode: booking.postcode,
    klantPlaats: booking.plaats,
    professionalBedrijfsnaam: professional.bedrijfsnaam,
    professionalKvK: professional.kvk_nummer,
    professionalBtwNummer: professional.btw_nummer,
    omschrijving: booking.dienst_naam || booking.dienst || "Glazenwassen",
    bedrag: Number(booking.totaalprijs),
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${factuurnummer}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
