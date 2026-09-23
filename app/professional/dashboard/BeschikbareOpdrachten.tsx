"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [zoeken, setZoeken] = useState("");
  const [afstand, setAfstand] = useState("25");
  const [werkgebiedKm, setWerkgebiedKm] = useState(25);
  const [typeFilter, setTypeFilter] = useState("alle");
  const [diensten, setDiensten] = useState<string[]>(["glazenwasser"]);
  const [voorkeurBezig, setVoorkeurBezig] = useState(false);
  const [voorkeurMelding, setVoorkeurMelding] = useState("");

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
    if (data.werkgebied_km) {
      const nieuwWerkgebied = Number(data.werkgebied_km);
      setWerkgebiedKm(nieuwWerkgebied);
      setAfstand(String(nieuwWerkgebied));
    }
    if (Array.isArray(data.diensten)) setDiensten(data.diensten);
    if (data.melding) setMelding(data.melding);
  }

  useEffect(() => {
    ladenOpdrachten();
  }, []);

  function wisselDienst(dienst: string, actief: boolean) {
    setDiensten((huidig) => actief ? Array.from(new Set([...huidig, dienst])) : huidig.filter((item) => item !== dienst));
  }

  async function voorkeurenOpslaan() {
    setVoorkeurBezig(true);
    setVoorkeurMelding("");
    const accessToken = await token();
    if (!accessToken) {
      setVoorkeurBezig(false);
      setVoorkeurMelding("Je sessie is verlopen. Log opnieuw in.");
      return;
    }

    if (diensten.length === 0) {
      setVoorkeurBezig(false);
      setVoorkeurMelding("Kies minimaal één dienst die je kunt uitvoeren.");
      return;
    }

    const meldingsAfstand = Number(afstand);
    const response = await fetch("/api/professional-voorkeuren", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ werkgebied_km: meldingsAfstand, diensten }),
    });
    const data = await response.json();
    setVoorkeurBezig(false);

    if (!response.ok) {
      setVoorkeurMelding(data.error || "Voorkeuren konden niet worden opgeslagen.");
      return;
    }

    setDiensten(data.professional?.diensten || diensten);
    setVoorkeurMelding("Diensten en meldingsafstand opgeslagen.");
    await ladenOpdrachten();
  }

  const zichtbareOpdrachten = useMemo(() => {
    const zoekterm = zoeken.trim().toLowerCase();
    const maxAfstand = Number(afstand);

    return opdrachten.filter((opdracht) => {
      const matchZoeken =
        !zoekterm ||
        String(opdracht.plaats || "").toLowerCase().includes(zoekterm) ||
        String(opdracht.postcode || "").replace(/\s/g, "").toLowerCase().includes(zoekterm.replace(/\s/g, ""));

      const matchAfstand =
        opdracht.afstand_km != null && Number(opdracht.afstand_km) <= maxAfstand;

      const matchType = typeFilter === "alle" || opdracht.vereiste_dienst === typeFilter;

      return matchZoeken && matchAfstand && matchType;
    });
  }, [opdrachten, zoeken, afstand, typeFilter]);

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
          <p className="mt-1 text-sm text-gray-600">Bekijk open betaalde opdrachten binnen jouw ingestelde werkgebied. Klantgegevens blijven verborgen tot je een opdracht aanneemt.</p>
        </div>
        <button type="button" onClick={ladenOpdrachten} disabled={laden} className="rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 disabled:opacity-50">
          {laden ? "Laden..." : "Vernieuwen"}
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
        <h3 className="font-bold text-gray-900">Mijn diensten en meldingen</h3>
        <p className="mt-1 text-sm text-gray-600">Deze keuzes bepalen welke opdrachten je kunt aannemen en voor welke soorten opdrachten je later meldingen krijgt.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white p-3"><input type="checkbox" checked={diensten.includes("glazenwasser")} onChange={(e) => wisselDienst("glazenwasser", e.target.checked)} className="h-5 w-5" /><span className="text-sm font-semibold text-gray-800">Glazenwassen</span></label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white p-3"><input type="checkbox" checked={diensten.includes("telewash")} onChange={(e) => wisselDienst("telewash", e.target.checked)} className="h-5 w-5" /><span className="text-sm font-semibold text-gray-800">Telewash / telescoopsteel</span></label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white p-3"><input type="checkbox" checked={diensten.includes("bedrijf")} onChange={(e) => wisselDienst("bedrijf", e.target.checked)} className="h-5 w-5" /><span className="text-sm font-semibold text-gray-800">Winkel / bedrijfspand</span></label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white p-3"><input type="checkbox" checked={diensten.includes("binnen")} onChange={(e) => wisselDienst("binnen", e.target.checked)} className="h-5 w-5" /><span className="text-sm font-semibold text-gray-800">Binnenramen</span></label>
        </div>
        <div className="mt-4">
          <label className="block max-w-xs"><span className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-700">Werkgebied</span><select value={afstand} onChange={(e) => setAfstand(e.target.value)} className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900"><option value="10">10 km</option><option value="15">15 km</option><option value="25">25 km</option><option value="35">35 km</option><option value="50">50 km</option><option value="75">75 km</option><option value="100">100 km</option></select></label>
          <div className="mt-4 flex justify-end">
            <button type="button" onClick={voorkeurenOpslaan} disabled={voorkeurBezig} className="w-full rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white disabled:opacity-50 sm:w-auto">{voorkeurBezig ? "Opslaan..." : "Voorkeuren opslaan"}</button>
          </div>
        </div>
        {voorkeurMelding && <p className="mt-3 text-sm font-medium text-gray-700">{voorkeurMelding}</p>}
      </div>

      <div className="mt-5 grid gap-3 rounded-2xl bg-blue-50 p-4 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-blue-800">Plaats of postcode</span>
          <input value={zoeken} onChange={(e) => setZoeken(e.target.value)} placeholder="Bijv. Deventer of 7411" className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-400" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-blue-800">Zoekafstand</span>
          <select value={afstand} onChange={(e) => setAfstand(e.target.value)} className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-400">
            {[10, 15, 25, 35, 50, 75, 100].filter((km) => km <= werkgebiedKm).map((km) => (
              <option key={km} value={String(km)}>Tot {km} km</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-blue-800">Soort opdracht</span>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-400">
            <option value="alle">Alle opdrachten</option><option value="glazenwasser">Glazenwassen</option><option value="telewash">Telewash / telescoopsteel</option><option value="bedrijf">Winkel / bedrijfspand</option><option value="binnen">Binnenramen</option>
          </select>
        </label>
      </div>

      {melding && <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm font-medium text-amber-800">{melding}</div>}
      {!laden && zichtbareOpdrachten.length === 0 && !melding && <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">Geen opdrachten gevonden met deze filters binnen jouw werkgebied van <strong>{werkgebiedKm} km</strong>.</div>}

      <div className="mt-4 grid gap-4">
        {zichtbareOpdrachten.map((opdracht) => (
          <article key={opdracht.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <strong className="text-base text-gray-900">{dienstLabel(opdracht)}</strong>
                  {opdracht.afstand_km != null && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">± {opdracht.afstand_km} km</span>}
                  {!opdracht.dienst_match && <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">Niet in jouw profiel</span>}
                </div>
                <div className="mt-3 grid gap-1 text-sm text-gray-700 sm:grid-cols-2 sm:gap-x-8">
                  <p><strong>Regio:</strong> {opdracht.postcode || "-"} {opdracht.plaats || ""}</p><p><strong>Datum:</strong> {opdracht.gewenste_datum || "Nog niet gepland"}</p><p><strong>Tijd:</strong> {opdracht.gewenste_tijd || "Nog niet gepland"}</p><p><strong>Type:</strong> {opdracht.woningtype || "Niet opgegeven"}</p><p><strong>Ramen:</strong> {opdracht.aantal_ramen ?? "Niet opgegeven"}</p><p><strong>Telescoopsteel:</strong> {opdracht.telescoop ? "Ja" : "Nee"}</p><p><strong>Kozijnen:</strong> {opdracht.kozijnen ? "Ja" : "Nee"}</p><p><strong>Lastig bereikbaar:</strong> {opdracht.lastig_bereikbaar ? "Ja" : "Nee"}</p>
                </div>
                <p className="mt-3 text-base font-bold text-gray-900">Jouw vergoeding: {bedrag(opdracht.professional_bedrag)}</p>
                <p className="mt-1 text-xs text-gray-500">Naam, telefoonnummer en exact adres worden pas zichtbaar nadat je de opdracht hebt aangenomen.</p>
              </div>
              <button type="button" onClick={() => aannemen(opdracht.id)} disabled={bezigId === opdracht.id || !opdracht.dienst_match} className="shrink-0 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600">
                {!opdracht.dienst_match ? "Profiel aanpassen" : bezigId === opdracht.id ? "Aannemen..." : "Opdracht aannemen"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
