import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function GET() {
  try {
    const { data: boekingen, error: boekingenError } =
      await supabaseAdmin
        .from("boekingen")
        .select("*")
        .order("created_at", { ascending: false });

    if (boekingenError) {
      console.error("Fout bij ophalen boekingen:", boekingenError);

      return NextResponse.json(
        {
          error: "Boekingen konden niet worden opgehaald.",
          details: boekingenError.message,
        },
        { status: 500 }
      );
    }

    const { data: professionals, error: professionalsError } =
      await supabaseAdmin
        .from("professionals")
        .select("*")
        .order("created_at", { ascending: false });

    if (professionalsError) {
      console.error(
        "Fout bij ophalen professionals:",
        professionalsError
      );

      return NextResponse.json(
        {
          error: "Professionals konden niet worden opgehaald.",
          details: professionalsError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      boekingen: boekingen ?? [],
      professionals: professionals ?? [],
    });
  } catch (error) {
    console.error("Admin API fout:", error);

    return NextResponse.json(
      {
        error: "Er is een onverwachte fout opgetreden.",
      },
      { status: 500 }
    );
  }
}
export async function PATCH(request: Request) {  
  try {
    const body = await request.json();

   const { id, geverifieerd, actief, booking_id, professional_id, booking_status, annuleringsreden, annuleringskosten,professional_vergoeding,vergoeding_goedgekeurd,geannuleerd_door,klant_niet_thuis,niet_thuis_bewijs,geannuleerde_professional_id,uitbetaald} = body; 
  if (booking_id && booking_status) {
 const goedgekeurdeVergoeding =
  vergoeding_goedgekeurd === true && klant_niet_thuis
    ? Math.min(Number(annuleringskosten || 0), 25)
    : Number(professional_vergoeding || 0);

const { data: huidigeBoeking } = await supabaseAdmin
  .from("boekingen")
  .select("betaald, uitbetaald, professional_bedrag")
  .eq("id", booking_id)
  .single();

const uitbetaaldBedrag =
  klant_niet_thuis === true
    ? goedgekeurdeVergoeding
    : Number(huidigeBoeking?.professional_bedrag || 0);

if (uitbetaald === true && (!huidigeBoeking?.betaald || huidigeBoeking?.uitbetaald)) {
  return NextResponse.json(
    { error: "Deze boeking kan niet worden uitbetaald." },
    { status: 400 }
  );
} 
  const { data: booking, error: bookingError } = await supabaseAdmin
    .from("boekingen")
    .update({ status: booking_status, annuleringsreden, annuleringskosten,professional_vergoeding:goedgekeurdeVergoeding,vergoeding_goedgekeurd,geannuleerd_door, klant_niet_thuis, niet_thuis_bewijs,geannuleerde_professional_id, ...(booking_status === "nieuw" && ["professional", "shinego"] .includes(geannuleerd_door)? { professional_id: null } : {}),uitbetaald_bedrag: uitbetaald === true && (!klant_niet_thuis || vergoeding_goedgekeurd === true) ? uitbetaaldBedrag : 0, uitbetaald: uitbetaald === true && (!klant_niet_thuis || vergoeding_goedgekeurd === true) })
    .eq("id", booking_id)
    .select("*");

  if (bookingError) {
    return NextResponse.json(
      {
        error: "Boekingstatus kon niet worden bijgewerkt.",
        details: bookingError.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ booking });
}  
  
  
    
  

  
    
    


    if (booking_id && professional_id) {
    
const { data: booking, error: bookingError } = await supabaseAdmin
  .from("boekingen")
  .update({
    professional_id,
    status: "toegewezen",
})
  .eq("id", booking_id)
  .select("*");

if (bookingError) {
  console.error("Fout bij koppelen professional:", bookingError);

  return NextResponse.json(
    {
      error: "Professional kon niet aan de boeking worden gekoppeld.",
      details: bookingError.message,
    },
    { status: 500 }
  );
}

return NextResponse.json({ booking });   
}   
if (!id) {
      return NextResponse.json(
        {
          error: "Professional id ontbreekt.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("professionals")
      .update({
        geverifieerd,
        actief,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(
        "Fout bij bijwerken professional:",
        error
      );

      return NextResponse.json(
        {
          error: "Professional kon niet worden bijgewerkt.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      professional: data,
    });
  } catch (error) {
    console.error("Admin PATCH fout:", error);

    return NextResponse.json(
      {
        error: "Er is een onverwachte fout opgetreden.",
      },
      { status: 500 }
    );
  }
}