import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function normaliseerDiensten(value: unknown) {
  const invoer = Array.isArray(value) ? value : [];
  const toegestaan = new Set(["glazenwasser", "telewash", "bedrijf", "binnen"]);
  const diensten = invoer
    .map((dienst) => String(dienst || "").toLowerCase())
    .map((dienst) => (dienst === "glazenwassen" ? "glazenwasser" : dienst))
    .filter((dienst) => toegestaan.has(dienst));

  if (!diensten.includes("glazenwasser")) diensten.unshift("glazenwasser");
  return Array.from(new Set(diensten));
}

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization");
    const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;
    if (!token) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !user) return NextResponse.json({ error: "Ongeldige sessie." }, { status: 401 });

    const body = await request.json();
    const werkgebiedKm = Number(body.werkgebied_km);
    const diensten = normaliseerDiensten(body.diensten);

    if (![10, 15, 25, 35, 50, 75, 100].includes(werkgebiedKm)) {
      return NextResponse.json({ error: "Kies een geldige voorkeursafstand voor meldingen." }, { status: 400 });
    }

    const { data: professional, error } = await supabaseAdmin
      .from("professionals")
      .update({ werkgebied_km: werkgebiedKm, diensten })
      .eq("user_id", user.id)
      .select("id, werkgebied_km, diensten")
      .single();

    if (error || !professional) {
      return NextResponse.json({ error: "Voorkeuren konden niet worden opgeslagen." }, { status: 500 });
    }

    return NextResponse.json({ professional });
  } catch (error) {
    console.error("Professional voorkeuren fout:", error);
    return NextResponse.json({ error: "Voorkeuren konden niet worden opgeslagen." }, { status: 500 });
  }
}
