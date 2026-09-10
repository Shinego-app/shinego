"use client";

import { useEffect, useState } from "react";
import { boekingOpslaan } from "../../../../lib/boekingopslaan";

type GlazenwassenGegevens = { woningtype: string; verdiepingen: string[]; ramen: number; telescoop: boolean; type: string; frequentie: string; };
type GlazenwassenDetails = { bereikbaar: string; extraVuil?: boolean; kozijnen: boolean; opmerking: string; };
type Prijs = { basisprijs: number; ramenPrijs: number; verdiepingToeslag: number; bereikToeslag: number; kozijnenToeslag: number; kortingPercentage: number; kortingBedrag: number; totaal: number; };
type KlantGegevens = { voornaam: string; achternaam: string; email: string; telefoon: string; postcode: string; huisnummer: string; toevoeging?: string; straat: string; plaats: string; gewensteDatum: string; gewensteTijd: string; thuisNodig: string; };

export default function BevestigenPage() {
  const [klus, setKlus] = useState<GlazenwassenGegevens | null>(null);
  const [details, setDetails] = useState<GlazenwassenDetails | null>(null);
  const [prijs, setPrijs] = useState<Prijs | null>(null);
  const [klant, setKlant] = useState<KlantGegevens | null>(null);
  const [akkoordVoorwaarden, setAkkoordVoorwaarden] = useState(false);
  const [akkoordStartBedenktijd, setAkkoordStartBedenktijd] = useState(false);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");

  useEffect(() => {
    try {
      const klusData = localStorage.getItem("shinegoGlazenwassen");
      const detailsData = localStorage.getItem("shinegoGlazenwassenDetails");
      const prijsData = localStorage.getItem("shinegoPrijs");
      const klantData = localStorage.getItem("shinegoKlantGegevens");
      if (klusData) setKlus(JSON.parse(klusData));
      if (detailsData) setDetails(JSON.parse(detailsData));
      if (prijsData) setPrijs(JSON.parse(prijsData));
      if (klantData) setKlant(JSON.parse(klantData));
    } catch { setFout("De boekingsgegevens konden niet worden geladen."); }
  }, []);

  async function bevestigBoeking() {
    if (!klus || !details || !prijs || !klant) { setFout("Niet alle gegevens zijn aanwezig."); return; }
    if (!klant.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(klant.email.trim())) { setFout("Vul een geldig e-mailadres in."); return; }
    if (!akkoordVoorwaarden) { setFout("Ga akkoord met de algemene voorwaarden en het annuleringsbeleid."); return; }
    if (!akkoordStartBedenktijd) { setFout("Geef toestemming voor start binnen de wettelijke bedenktijd indien nodig."); return; }
    setBezig(true); setFout("");
    try {
      const nieuweBoeking = await boekingOpslaan({
        voornaam: klant.voornaam, achternaam: klant.achternaam, email: klant.email, telefoon: klant.telefoon,
        postcode: klant.postcode, huisnummer: klant.huisnummer, toevoeging: klant.toevoeging || "", straat: klant.straat, plaats: klant.plaats,
        dienst: "glazenwassen", woningtype: klus.woningtype, telescoop: klus.telescoop, verdiepingen: klus.verdiepingen, aantal_ramen: klus.ramen,
        glasbewassing_type: klus.type, frequentie: klus.frequentie, bereikbaar: details.bereikbaar, kozijnen: details.kozijnen, opmerking: details.opmerking,
        basisprijs: prijs.basisprijs, ramen_prijs: prijs.ramenPrijs, verdieping_toeslag: prijs.verdiepingToeslag, bereik_toeslag: prijs.bereikToeslag,
        kozijnen_toeslag: prijs.kozijnenToeslag, korting_percentage: prijs.kortingPercentage, korting_bedrag: prijs.kortingBedrag, totaalprijs: prijs.totaal,
        gewenste_datum: klant.gewensteDatum, gewenste_tijd: klant.gewensteTijd, thuis_nodig: klant.thuisNodig,
        akkoord_voorwaarden: akkoordVoorwaarden, akkoord_start_binnen_bedenktijd: akkoordStartBedenktijd, professional_id: null,
      });
      const bookingId = nieuweBoeking?.[0]?.id;
      if (bookingId) localStorage.setItem("shinegoLaatsteBoekingId", String(bookingId));
      const betaalResponse = await fetch("/api/stripe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bookingId }) });
      const betaalData = await betaalResponse.json();
      if (!betaalResponse.ok || !betaalData.url) throw new Error("Stripe betaling kon niet worden gestart.");
      window.location.href = betaalData.url;
    } catch (error) { setFout(error instanceof Error ? error.message : "Er ging iets mis bij het opslaan van de boeking."); setBezig(false); }
  }

  const soort = klus?.type === "binnen" ? "Ramen binnen wassen" : klus?.type === "telewash" ? "Telescoopsteel" : klus?.type === "bedrijf" ? "Winkel / bedrijfspand" : "Ramen buiten wassen";
  const frequentie = klus?.frequentie === "4weken" ? "Elke 4 weken" : klus?.frequentie === "8weken" ? "Elke 8 weken" : klus?.frequentie === "12weken" ? "Elke 12 weken" : "Eenmalig";
  const stappen = ["Keuze", "Details", "Prijs", "Gegevens", "Bevestigen"];

  return <main className="min-h-screen bg-gradient-to-b from-[#eaf6ff] to-[#f8fcff] text-[#123c70]">
    <div className="mx-auto max-w-5xl px-5 py-5 sm:px-8 sm:py-7">
      <header className="flex items-center justify-between"><a href="/" className="text-[29px] font-extrabold tracking-tight text-[#0d3f79]">Shine<span className="text-[#1683f8]">Go</span><span className="ml-1 text-[#1683f8]">✦</span></a><a href="/" aria-label="Menu" className="flex h-9 w-9 items-center justify-center text-2xl font-bold text-[#1683f8]">≡</a></header>
      <div className="mx-auto mt-3 grid max-w-3xl grid-cols-5 gap-1">{stappen.map((stap,index)=>{const actief=index===4;const klaar=index<4;return <div key={stap} className="text-center"><div className="flex items-center"><span className={`h-px flex-1 ${index===0?"bg-transparent":"bg-[#7db9eb]"}`} /><span className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-extrabold ${actief?"border-[#1683f8] bg-[#1683f8] text-white":klaar?"border-[#9ccbf0] bg-[#eaf6ff] text-[#1683f8]":"border-[#a9cbea] bg-[#eef8ff] text-[#4b7197]"}`}>{index+1}</span><span className={`h-px flex-1 ${index===4?"bg-transparent":"bg-[#7db9eb]"}`} /></div><div className={`mt-1 text-[10px] sm:text-xs ${actief?"font-bold text-[#1683f8]":"text-[#52779b]"}`}>{stap}</div></div>})}</div>

      <section className="mt-5 rounded-[28px] border border-[#d5e9f8] bg-white/90 px-5 py-6 shadow-[0_18px_55px_rgba(40,93,140,.12)] sm:px-7 sm:py-7">
        <h1 className="text-[32px] font-extrabold leading-tight tracking-[-.035em] text-[#0b3d75] sm:text-[38px]">Controleer je boeking</h1>
        <p className="mt-1 text-sm font-medium text-[#537797] sm:text-base">Nog één controle, daarna ga je veilig betalen.</p>
        {!klus || !details || !prijs || !klant ? <p className="mt-8 text-[#6d89a4]">Boekingsgegevens laden...</p> : <>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#d5e9f8] bg-[#f8fcff] p-4"><h2 className="text-sm font-extrabold">Jouw gegevens</h2><dl className="mt-3 space-y-2 text-sm text-[#5f7e9c]"><div className="flex justify-between gap-3"><dt>Naam</dt><dd className="text-right font-semibold text-[#123c70]">{klant.voornaam} {klant.achternaam}</dd></div><div className="flex justify-between gap-3"><dt>E-mail</dt><dd className="text-right font-semibold text-[#123c70]">{klant.email}</dd></div><div className="flex justify-between gap-3"><dt>Adres</dt><dd className="text-right font-semibold text-[#123c70]">{klant.straat} {klant.huisnummer}<br />{klant.postcode} {klant.plaats}</dd></div></dl></div>
            <div className="rounded-2xl border border-[#d5e9f8] bg-[#f8fcff] p-4"><h2 className="text-sm font-extrabold">Opdracht</h2><dl className="mt-3 space-y-2 text-sm text-[#5f7e9c]"><div className="flex justify-between"><dt>Dienst</dt><dd className="font-semibold text-[#123c70]">{soort}</dd></div><div className="flex justify-between"><dt>Frequentie</dt><dd className="font-semibold text-[#123c70]">{frequentie}</dd></div><div className="flex justify-between"><dt>Datum</dt><dd className="font-semibold text-[#123c70]">{klant.gewensteDatum}</dd></div><div className="flex justify-between"><dt>Tijd</dt><dd className="font-semibold text-[#123c70]">{klant.gewensteTijd}</dd></div></dl></div>
          </div>
          <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#eaf6ff] px-5 py-4"><div><span className="text-xs font-bold uppercase tracking-wider text-[#537797]">Totaalprijs</span><div className="mt-1 text-sm font-semibold text-[#4f708f]">{soort}</div></div><strong className="text-3xl font-extrabold text-[#0b3d75]">€ {prijs.totaal.toFixed(2).replace(".", ",")}</strong></div>
          <div className="mt-5 space-y-3"><label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${akkoordVoorwaarden?"border-[#1683f8] bg-[#eef8ff]":"border-[#d5e9f8] bg-white"}`}><input type="checkbox" checked={akkoordVoorwaarden} onChange={(e)=>setAkkoordVoorwaarden(e.target.checked)} className="mt-1" /><span className="text-xs leading-5 text-[#5f7e9c]">Ik ga akkoord met de <a href="/voorwaarden" target="_blank" className="font-bold text-[#1683f8] underline">algemene voorwaarden</a> en het annuleringsbeleid.</span></label><label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${akkoordStartBedenktijd?"border-[#1683f8] bg-[#eef8ff]":"border-[#d5e9f8] bg-white"}`}><input type="checkbox" checked={akkoordStartBedenktijd} onChange={(e)=>setAkkoordStartBedenktijd(e.target.checked)} className="mt-1" /><span className="text-xs leading-5 text-[#5f7e9c]">Ik verzoek ShineGo om de dienstverlening, indien nodig, binnen de wettelijke bedenktijd te laten starten.</span></label></div>
          {fout && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{fout}</div>}
        </>}
        <div className="mt-6 flex items-center justify-between border-t border-[#dcecf8] pt-4"><a href="/boeken/glazenwassen/gegevens" className="px-2 py-3 text-sm font-bold text-[#537797]">← Terug</a><button type="button" onClick={bevestigBoeking} disabled={bezig || !klus || !details || !prijs || !klant} className={`min-w-48 rounded-xl px-7 py-3.5 text-sm font-extrabold text-white ${bezig?"cursor-not-allowed bg-[#bfd3e5]":"bg-[#1683f8] shadow-[0_8px_20px_rgba(22,131,248,.24)]"}`}>{bezig?"Betaling starten...":"Boeken en betalen →"}</button></div>
      </section>
    </div>
  </main>;
}
