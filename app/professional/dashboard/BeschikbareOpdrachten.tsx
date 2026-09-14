"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

function bedrag(value: unknown) {
  const nummer = Number(value);
  return Number.isFinite(nummer) ? `€${nummer.toFixed(2).replace(".", ",")}` : "Nog niet berekend";
}

function dienstLabel(opdracht: any) {
  if (opdracht.vereiste_dienst === "telewash") return "Telewash / telescoopsteel";
  if (opdracht.vereiste_dienst === "bedrijf") return "Winkel / bedrijfspand";
  if (opdracht.vereiste_dienst === "binnen") return "Binnenramen";
  return "Glazenwassen";
}

export default function BeschikbareOpdrachten() {
  const router = useRouter();
  const [laden, setLaden] = useState(true);
  const [opdrachten, setOpdrachten] = useState<any[]>([]);
  const [melding, setMelding] = useState("");
  const [bezigId, setBezigId] = useState<string | number | null>(null);

  async function token() {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  }

  async function ladenOpdrachten() {
    setLaden(true);
    setMelding("");
    const accessToken = await token();
    if (!accessToken) {
      setLaden(false);
      setMelding("Log opnieuw in om beschikbare opdrachten te bekijken.");
      return;
    }

    const response = await fetch("/api/professional-opdrachten", {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    const data = await response.json();
    setLaden(false);

    if (!response.ok) {
      setMelding(data.error || "Beschikbare opdrachten konden niet worden geladen.");
      return;
    }

    setOpdrachten(data.opdrachten || []);
    if (data.melding) setMelding(data.melding);
  }

  useEffect(() => {
    ladenOpdrachten();
  }, []);

  async function aannemen(id: string | number) {
    setBezigId(id);
    setMelding("");
    const accessToken = await token();
    if (!accessToken) {
      setBezigId(null);
      setMelding("Je sessie is verlopen. Log opnieuw in.");
      return;
    }

    const response = await fetch("/api/professional-opdrachten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ booking_id: id }),
    });
    const data = await response.json();
    setBezigId(null);

    if (!response.ok || !data.booking) {
      setMelding(data.error || "Opdracht kon niet worden aangenomen.");
      await ladenOpdrachten();
      return;
    }

    setOpdrachten((huidig) => huidig.filter((opdracht) => opdracht.id !== id));
    router.push(`/professional/dashboard/opdracht/${data.booking.id}`);
    router.refresh();
  }

  return (
    <section className="mt-8 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Beschikbare opdrachten</h2>
          <p className="mt-1 text-sm text-gray-600">Alleen betaalde opdrachten binnen jouw werkgebied en passend bij jouw diensten en materiaal worden hier getoond.</p>
        </div>
        <button type="button" onClick={ladenOpdrachten} disabled={laden} className="rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 disabled:opacity-50">
          {laden ? "Laden..." : "Vernieuwen"}
        </button>
      </div>

      {melding && <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm font-medium text-amber-800">{melding}</div>}

      {!laden && opdrachten.length === 0 && !melding && (
        <p className="mt-4 text-sm text-gray-600">Er zijn nu geen passende opdrachten beschikbaar.</p>
      )}

      <div className="mt-4 grid gap-4">
        {opdrachten.map((opdracht) => (
          <article key={opdracht.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <strong className="text-base text-gray-900">{dienstLabel(opdracht)}</strong>
                  {opdracht.afstand_km != null && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">± {opdracht.afstand_km} km</span>}
                </div>
                <div className="mt-3 grid gap-1 text-sm text-gray-700 sm:grid-cols-2 sm:gap-x-8">
                  <p><strong>Regio:</strong> {opdracht.postcode || "-"} {opdracht.plaats || ""}</p>
                  <p><strong>Datum:</strong> {opdracht.gewenste_datum || "Nog niet gepland"}</p>
                  <p><strong>Tijd:</strong> {opdracht.gewenste_tijd || "Nog niet gepland"}</p>
                  <p><strong>Type:</strong> {opdracht.woningtype || "Niet opgegeven"}</p>
                  <p><strong>Ramen:</strong> {opdracht.aantal_ramen ?? "Niet opgegeven"}</p>
                  <p><strong>Telescoopsteel:</strong> {opdracht.telescoop ? "Ja" : "Nee"}</p>
                  <p><strong>Kozijnen:</strong> {opdracht.kozijnen ? "Ja" : "Nee"}</p>
                  <p><strong>Lastig bereikbaar:</strong> {opdracht.lastig_bereikbaar ? "Ja" : "Nee"}</p>
                </div>
                <p className="mt-3 text-base font-bold text-gray-900">Jouw vergoeding: {bedrag(opdracht.professional_bedrag)}</p>
                <p className="mt-1 text-xs text-gray-500">Naam, telefoonnummer en exact adres worden pas zichtbaar nadat je de opdracht hebt aangenomen.</p>
              </div>
              <button type="button" onClick={() => aannemen(opdracht.id)} disabled={bezigId === opdracht.id} className="shrink-0 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                {bezigId === opdracht.id ? "Aannemen..." : "Opdracht aannemen"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
