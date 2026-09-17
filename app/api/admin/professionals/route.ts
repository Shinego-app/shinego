import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const professionalId = body?.professional_id;

    if (!professionalId) {
      return NextResponse.json(
        { error: "Professional id ontbreekt." },
        { status: 400 }
      );
    }

    const { data: professional, error: professionalError } = await supabaseAdmin
      .from("professionals")
      .select("id, user_id, bedrijfsnaam, voornaam, achternaam, email")
      .eq("id", professionalId)
      .single();

    if (professionalError || !professional) {
      return NextResponse.json(
        { error: "Professional niet gevonden." },
        { status: 404 }
      );
    }

    const { count: gekoppeldCount, error: gekoppeldError } = await supabaseAdmin
      .from("boekingen")
      .select("id", { count: "exact", head: true })
      .eq("professional_id", professionalId);

    if (gekoppeldError) {
      return NextResponse.json(
        {
          error: "Boekingshistorie kon niet worden gecontroleerd.",
          details: gekoppeldError.message,
        },
        { status: 500 }
      );
    }

    const { count: geannuleerdCount, error: geannuleerdError } = await supabaseAdmin
      .from("boekingen")
      .select("id", { count: "exact", head: true })
      .eq("geannuleerde_professional_id", professionalId);

    if (geannuleerdError) {
      return NextResponse.json(
        {
          error: "Annuleringshistorie kon niet worden gecontroleerd.",
          details: geannuleerdError.message,
        },
        { status: 500 }
      );
    }

    if ((gekoppeldCount || 0) > 0 || (geannuleerdCount || 0) > 0) {
      return NextResponse.json(
        {
          error:
            "Deze professional heeft boekingshistorie en kan daarom niet worden verwijderd. Zet het account in plaats daarvan op niet actief.",
        },
        { status: 409 }
      );
    }

    if (professional.user_id) {
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
        professional.user_id
      );

      if (authError) {
        return NextResponse.json(
          {
            error: "Het loginaccount kon niet worden verwijderd.",
            details: authError.message,
          },
          { status: 500 }
        );
      }
    }

    const { error: deleteError } = await supabaseAdmin
      .from("professionals")
      .delete()
      .eq("id", professionalId);

    if (deleteError) {
      return NextResponse.json(
        {
          error: "Professionalprofiel kon niet worden verwijderd.",
          details: deleteError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Professional verwijderen mislukt:", error);

    return NextResponse.json(
      { error: "Er is een onverwachte fout opgetreden." },
      { status: 500 }
    );
  }
}
