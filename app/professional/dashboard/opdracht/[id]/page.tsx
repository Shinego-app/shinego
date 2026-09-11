"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const verdiepingNaam: Record<string,string> = { "1":"Begane grond", "2":"1e verdieping", "3":"2e verdieping", "4":"3e verdieping" };

export default function OpdrachtPage() {
  const router = useRouter();
  const params = useParams();
  const opdrachtId = params.id as string;
  const [opdracht, setOpdracht] = useState<any>(null);
  const [laden, setLaden] = useState(true);
  const [uitbetalenBezig, setUitbetalenBezig] = useState(false);
  const [afrekeningBezig, setAfrekeningBezig] = useState(false);
  const [annulerenBezig, setAnnulerenBezig] = useState(false);

  useEffect(() => {
    async function laadOpdracht() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLaden(false); return; }
      const { data: professional } = await supabase.from("professionals").select("id").eq("user_id", user.id).single();
      if (!professional) { setLaden(false); return; }
      const { data } = await supabase.from("boekingen").select("*").eq("id", opdrachtId).eq("professional_id", professional.id).single();
      setOpdracht(data); setLaden(false);
    }
    laadOpdracht();
  }, [opdrachtId]);

  async function startOpdracht() {
    const { error } = await supabase.from("boekingen").update({ status: "onderweg" }).eq("id", opdrachtId).eq("professional_id", opdracht.professional_id);
    if (!error) setOpdracht({ ...opdracht, status: "onderweg" });
  }

  async function annuleerOpdracht() {
    if (annulerenBezig) return;
    const reden = window.prompt("Reden van annulering:");
    if (reden === null) return;
    if (!reden.trim()) { alert("Vul een reden van annulering in."); return; }
    if (!window.confirm("Weet je zeker dat je deze opdracht wilt annuleren? De opdracht wordt opnieuw beschikbaar voor een andere professional.")) return;
    setAnnulerenBezig(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) { alert("Je sessie is verlopen. Log opnieuw in."); return; }
      const response = await fetch("/api/professional-opdracht-annuleren", { method:"POST", headers:{"Content-Type":"application/json",Authorization:`Bearer ${session.access_token}`}, body:JSON.stringify({ booking_id:opdrachtId, reden:reden.trim() }) });
      const resultaat = await response.json();
      if (!response.ok) { alert(resultaat.error || "Opdracht annuleren mislukt."); return; }
      alert("Opdracht is geannuleerd en opnieuw beschikbaar gemaakt."); router.push("/professional/dashboard"); router.refresh();
    } catch (error) { console.error("Opdracht annuleren mislukt:", error); alert("Opdracht annuleren mislukt."); }
    finally { setAnnulerenBezig(false); }
  }

  async function afrondOpdracht() {
    const response = await fetch("/api/opdracht-afronden", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ booking_id:opdrachtId }) });
    const resultaat = await response.json();
    if (!response.ok) { console.error("Afronden mislukt:", resultaat); return; }
    setOpdracht({ ...opdracht, status:"afgerond" });
  }

  async function voerUitbetalingUit() {
    if (uitbetalenBezig) return; setUitbetalenBezig(true);
    try {
      const response = await fetch("/api/stripe-payout", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ booking_id:opdrachtId }) });
      const resultaat = await response.json();
      if (!response.ok) { alert(resultaat.error || "Uitbetaling mislukt."); return; }
      alert("Uitbetaling geslaagd."); setOpdracht({ ...opdracht, uitbetaald:true });
    } catch (error) { console.error("Uitbetaling mislukt:", error); alert("Uitbetaling mislukt."); }
    finally { setUitbetalenBezig(false); }
  }

  async function mailAfrekening() {
    if (afrekeningBezig) return; setAfrekeningBezig(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) { alert("Je sessie is verlopen. Log opnieuw in."); return; }
      const response = await fetch("/api/professional-afrekening", { method:"POST", headers:{"Content-Type":"application/json",Authorization:`Bearer ${session.access_token}`}, body:JSON.stringify({ booking_id:opdrachtId }) });
      const resultaat = await response.json();
      if (!response.ok) { alert(resultaat.error || "Afrekening verzenden mislukt."); return; }
      alert("Uitbetalingsafrekening is per e-mail verzonden.");
    } catch (error) { console.error("Afrekening verzenden mislukt:", error); alert("Afrekening verzenden mislukt."); }
    finally { setAfrekeningBezig(false); }
  }

  if (laden) return <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-700">Opdracht laden...</main>;
  if (!opdracht) return <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-700">Opdracht niet gevonden.</main>;

  const statusLabel = String(opdracht.status || "Onbekend").replaceAll("_", " ");
  const verdiepingenTekst = Array.isArray(opdracht.verdiepingen) && opdracht.verdiepingen.length ? opdracht.verdiepingen.map((v:any)=>verdiepingNaam[String(v)] || String(v)).join(", ") : "Niet opgegeven";
  const frequentie = opdracht.frequentie === "4weken" ? "Elke 4 weken" : opdracht.frequentie === "8weken" ? "Elke 8 weken" : opdracht.frequentie === "12weken" ? "Elke 12 weken" : "Eenmalig";

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <button type="button" onClick={() => router.push("/professional/dashboard")} className="mb-5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700 shadow-sm hover:border-blue-200 hover:text-blue-700">← Terug naar dashboard</button>
        <div className="overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl"><div className="px-6 py-7 sm:px-8"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-wider text-blue-400">ShineGo opdracht</p><h1 className="mt-2 text-3xl font-extrabold">{opdracht.voornaam} {opdracht.achternaam}</h1><p className="mt-2 text-slate-300">{opdracht.gewenste_datum || "Nog niet gepland"} · {opdracht.gewenste_tijd || "Nog niet gepland"}</p></div><span className="w-fit rounded-full bg-blue-500/15 px-4 py-2 text-sm font-bold capitalize text-blue-300 ring-1 ring-blue-400/20">{statusLabel}</span></div></div></div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"><p className="text-sm font-bold uppercase tracking-wider text-blue-600">Klant & locatie</p><div className="mt-5 space-y-4 text-sm"><Info label="Adres" value={`${opdracht.straat || ""} ${opdracht.huisnummer || ""}${opdracht.toevoeging ? ` ${opdracht.toevoeging}` : ""}`.trim() || "Niet opgegeven"} /><Info label="Postcode" value={opdracht.postcode || "Niet opgegeven"} /><Info label="Plaats" value={opdracht.plaats || "Niet opgegeven"} /><Info label="Telefoon" value={opdracht.telefoon || "Niet opgegeven"} /><Info label="Datum" value={opdracht.gewenste_datum || "Niet opgegeven"} /><Info label="Tijd" value={opdracht.gewenste_tijd || "Niet opgegeven"} /><Info label="Thuis nodig" value={opdracht.thuis_nodig || "Niet opgegeven"} /></div></section>

          <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"><p className="text-sm font-bold uppercase tracking-wider text-blue-600">Opdrachtgegevens</p><div className="mt-5 space-y-4 text-sm"><Info label="Woningtype" value={opdracht.woningtype || "Niet opgegeven"} /><Info label="Aantal ramen" value={opdracht.aantal_ramen || "Niet opgegeven"} /><Info label="Verdiepingen" value={verdiepingenTekst} /><Info label="Telescoopsteel" value={opdracht.telescoop ? "Ja" : "Nee"} /><Info label="Kozijnen" value={opdracht.kozijnen_toeslag > 0 || opdracht.kozijnen === true ? "Ja" : "Nee"} /><Info label="Extra lastig bereikbaar" value={opdracht.bereikbaarheid === "nee" || opdracht.moeilijk_bereikbaar === true ? "Ja" : "Nee"} /><Info label="Frequentie" value={frequentie} />{opdracht.opmerking && <Info label="Opmerking" value={opdracht.opmerking} />}</div></section>
        </div>

        <section className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-6"><p className="text-sm font-bold uppercase tracking-wider text-blue-700">Jouw vergoeding</p><p className="mt-2 text-3xl font-extrabold text-slate-950">€{opdracht.professional_bedrag || "0,00"}</p></section>

        <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold text-slate-900">Acties</h2><p className="mt-1 text-sm text-slate-500">Kies alleen de actie die bij de huidige status hoort.</p><div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {opdracht.status === "toegewezen" && <button type="button" onClick={startOpdracht} className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700">Opdracht starten</button>}
          {opdracht.status === "onderweg" && <button type="button" onClick={afrondOpdracht} className="rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700">Opdracht afronden</button>}
          {(opdracht.status === "toegewezen" || opdracht.status === "onderweg") && <button type="button" onClick={annuleerOpdracht} disabled={annulerenBezig} className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 font-bold text-red-700 hover:bg-red-100 disabled:opacity-50">{annulerenBezig ? "Opdracht annuleren..." : "Opdracht annuleren"}</button>}
          {opdracht.status === "afgerond" && opdracht.uitbetaald !== true && <button type="button" onClick={voerUitbetalingUit} disabled={uitbetalenBezig} className="rounded-xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-slate-800 disabled:opacity-50">{uitbetalenBezig ? "Uitbetaling uitvoeren..." : "Uitbetaling uitvoeren"}</button>}
          {opdracht.uitbetaald === true && <button type="button" onClick={mailAfrekening} disabled={afrekeningBezig} className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50">{afrekeningBezig ? "Afrekening verzenden..." : "Afrekening e-mailen"}</button>}
        </div>{opdracht.uitbetaald === true && <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">✓ Uitbetaling uitgevoerd</div>}</section>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0"><span className="text-slate-500">{label}</span><span className="text-right font-semibold text-slate-900">{String(value)}</span></div>;
}
