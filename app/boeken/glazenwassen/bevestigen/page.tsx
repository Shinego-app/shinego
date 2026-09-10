"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { boekingOpslaan } from "../../../../lib/boekingopslaan";

type GlazenwassenGegevens = { woningtype: string; verdiepingen: string[]; ramen: number; telescoop: boolean; type: string; frequentie: string; };
type GlazenwassenDetails = { bereikbaar: string; extraVuil: boolean; kozijnen: boolean; opmerking: string; };
type Prijs = { basisprijs: number; ramenPrijs: number; verdiepingToeslag: number; bereikToeslag: number; kozijnenToeslag: number; kortingPercentage: number; kortingBedrag: number; totaal: number; };
type KlantGegevens = { voornaam: string; achternaam: string; email: string; telefoon: string; postcode: string; huisnummer: string; toevoeging?: string; straat: string; plaats: string; gewensteDatum: string; gewensteTijd: string; thuisNodig: string; };

export default function BevestigenPage() {
  const router = useRouter();
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
    } catch (error) {
      console.error(error);
      setFout("De boekingsgegevens konden niet worden geladen.");
    }
  }, []);

  async function bevestigBoeking() {
    if (!klus || !details || !prijs || !klant) { setFout("Niet alle gegevens zijn aanwezig. Ga terug en controleer de boeking."); return; }
    if (!klant.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(klant.email.trim())) { setFout("Vul een geldig e-mailadres in."); return; }
    if (!akkoordVoorwaarden) { setFout("Ga akkoord met de algemene voorwaarden en het annuleringsbeleid om verder te gaan."); return; }
    if (!akkoordStartBedenktijd) { setFout("Geef toestemming om de dienstverlening zo nodig binnen de wettelijke bedenktijd te laten starten."); return; }
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
      const betaalResponse = await fetch("/api/stripe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount: prijs.totaal, email: klant.email, name: `${klant.voornaam} ${klant.achternaam}`, bookingId: nieuweBoeking?.[0]?.id }) });
      const betaalData = await betaalResponse.json();
      if (!betaalResponse.ok || !betaalData.url) throw new Error("Stripe betaling kon niet worden gestart.");
      window.location.href = betaalData.url;
    } catch (error) {
      console.error(error);
      setFout(error instanceof Error ? error.message : "Er ging iets mis bij het opslaan van de boeking.");
      setBezig(false);
    }
  }

  const soortGlasbewassing = klus?.type === "binnen" ? "Ramen binnen wassen" : klus?.type === "telewash" ? "Telescoopsteel" : klus?.type === "bedrijf" ? "Winkel / bedrijfspand" : "Ramen buiten wassen";
  const frequentieTekst = klus?.frequentie === "4weken" ? "Elke 4 weken" : klus?.frequentie === "8weken" ? "Elke 8 weken" : klus?.frequentie === "12weken" ? "Elke 12 weken" : "Eenmalig";
  const rijClass = "flex items-start justify-between gap-4 border-b border-sky-100 py-3 last:border-0";
  const waardeClass = "max-w-[58%] break-words text-right font-extrabold text-[#0b2b5b]";
  const stappen = ["Keuze", "Situatie", "Details", "Prijs", "Gegevens"];

  return (
    <main className="min-h-screen bg-[#eef8ff] text-[#0b2b5b]">
      <header className="border-b border-sky-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="/" className="text-2xl font-extrabold tracking-tight text-[#0b3d75]">Shine<span className="text-[#1683f8]">Go✦</span></a>
          <button type="button" onClick={() => router.back()} className="rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-bold text-[#245d91]">← Terug</button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
        <div className="mb-7 rounded-3xl border border-sky-100 bg-white/75 px-4 py-4 shadow-sm sm:px-6">
          <div className="grid grid-cols-5 gap-1 sm:gap-3">
            {stappen.map((stap, index) => <div key={stap} className="text-center"><div className="flex items-center"><div className={`h-px flex-1 ${index === 0 ? "bg-transparent" : "bg-[#9fd1ff]"}`} /><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#dff1ff] text-sm font-extrabold text-[#1177df]">{index + 1}</div><div className={`h-px flex-1 ${index === 4 ? "bg-transparent" : "bg-[#9fd1ff]"}`} /></div><div className="mt-2 text-[10px] font-semibold text-[#66809a] sm:text-xs">{stap}</div></div>)}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-sky-100 bg-gradient-to-br from-white via-[#f8fcff] to-[#dff1ff] p-5 shadow-lg sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#bfe3ff]/45 blur-3xl" />
          <div className="relative mb-7"><p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#1683f8]">Laatste controle</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Controleer je boeking</h1><p className="mt-3 max-w-2xl text-base leading-7 text-[#5b7591]">Controleer je gegevens en de totaalprijs. Daarna ga je veilig door naar de betaling.</p></div>

          {!klus || !details || !prijs || !klant ? <div className="relative rounded-2xl border border-sky-100 bg-white/90 p-6"><p className="text-[#66809a]">Boekingsgegevens laden...</p></div> : (
            <div className="relative grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
              <div className="space-y-6">
                <div className="rounded-[1.75rem] border border-sky-100 bg-white/90 p-5 shadow-sm sm:p-6"><h2 className="text-xl font-extrabold">Klantgegevens</h2><div className="mt-3 text-sm"><div className={rijClass}><span className="text-[#66809a]">Naam</span><strong className={waardeClass}>{klant.voornaam} {klant.achternaam}</strong></div><div className={rijClass}><span className="text-[#66809a]">E-mail</span><strong className={waardeClass}>{klant.email}</strong></div><div className={rijClass}><span className="text-[#66809a]">Telefoon</span><strong className={waardeClass}>{klant.telefoon}</strong></div><div className={rijClass}><span className="text-[#66809a]">Adres</span><strong className={waardeClass}>{klant.straat} {klant.huisnummer}{klant.toevoeging ? ` ${klant.toevoeging}` : ""}<br />{klant.postcode} {klant.plaats}</strong></div></div></div>

                <div className="rounded-[1.75rem] border border-sky-100 bg-white/90 p-5 shadow-sm sm:p-6"><h2 className="text-xl font-extrabold">Opdracht</h2><div className="mt-3 text-sm"><div className={rijClass}><span className="text-[#66809a]">Dienst</span><strong className={waardeClass}>Glazenwassen</strong></div><div className={rijClass}><span className="text-[#66809a]">Woningtype</span><strong className={waardeClass}>{klus.woningtype}</strong></div><div className={rijClass}><span className="text-[#66809a]">Soort</span><strong className={waardeClass}>{soortGlasbewassing}</strong></div><div className={rijClass}><span className="text-[#66809a]">Frequentie</span><strong className={waardeClass}>{frequentieTekst}</strong></div>{klus.verdiepingen.length > 0 && <div className={rijClass}><span className="text-[#66809a]">Verdiepingen</span><strong className={waardeClass}>{klus.verdiepingen.join(", ")}</strong></div>}<div className={rijClass}><span className="text-[#66809a]">Aantal ramen</span><strong className={waardeClass}>{klus.ramen}</strong></div><div className={rijClass}><span className="text-[#66809a]">Bereikbaarheid</span><strong className={waardeClass}>{details.bereikbaar === "ja" ? "Goed bereikbaar" : "Moeilijk bereikbaar"}</strong></div><div className={rijClass}><span className="text-[#66809a]">Datum</span><strong className={waardeClass}>{klant.gewensteDatum}</strong></div><div className={rijClass}><span className="text-[#66809a]">Tijd</span><strong className={waardeClass}>{klant.gewensteTijd}</strong></div></div></div>

                <div className="rounded-[1.75rem] border border-sky-100 bg-white/90 p-5 sm:p-6"><h2 className="text-xl font-extrabold">Voorwaarden en bedenktijd</h2><p className="mt-2 text-sm leading-6 text-[#66809a]">Controleer en bevestig beide punten voordat je betaalt.</p>
                  <label className={`mt-5 flex cursor-pointer items-start gap-4 rounded-2xl border-2 p-4 transition ${akkoordVoorwaarden ? "border-[#1683f8] bg-[#eaf5ff]" : "border-sky-100 bg-white"}`}><input type="checkbox" checked={akkoordVoorwaarden} onChange={(e) => setAkkoordVoorwaarden(e.target.checked)} className="sr-only" /><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 font-bold ${akkoordVoorwaarden ? "border-[#1683f8] bg-[#1683f8] text-white" : "border-sky-200 text-transparent"}`}>✓</span><span className="text-sm leading-6 text-[#466482]">Ik ga akkoord met de <a href="/voorwaarden" target="_blank" className="font-extrabold text-[#1177df] underline" onClick={(e) => e.stopPropagation()}>algemene voorwaarden</a> en het annuleringsbeleid.</span></label>
                  <label className={`mt-3 flex cursor-pointer items-start gap-4 rounded-2xl border-2 p-4 transition ${akkoordStartBedenktijd ? "border-[#1683f8] bg-[#eaf5ff]" : "border-sky-100 bg-white"}`}><input type="checkbox" checked={akkoordStartBedenktijd} onChange={(e) => setAkkoordStartBedenktijd(e.target.checked)} className="sr-only" /><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 font-bold ${akkoordStartBedenktijd ? "border-[#1683f8] bg-[#1683f8] text-white" : "border-sky-200 text-transparent"}`}>✓</span><span className="text-sm leading-6 text-[#466482]">Ik verzoek ShineGo uitdrukkelijk om de dienstverlening, indien nodig, binnen mijn wettelijke bedenktijd te laten starten. Ik begrijp dat bij herroeping betaling verschuldigd kan zijn voor het al uitgevoerde deel.</span></label>
                </div>
              </div>

              <aside><div className="sticky top-24 space-y-4"><div className="rounded-[1.75rem] bg-[#1683f8] p-6 text-white shadow-lg"><p className="text-sm font-bold text-blue-100">Totaalprijs</p><div className="mt-2 text-4xl font-extrabold">€{prijs.totaal.toFixed(2).replace(".", ",")}</div><p className="mt-2 font-semibold">{soortGlasbewassing}</p>{prijs.kortingPercentage > 0 && <p className="mt-2 text-sm text-blue-100">Inclusief {Math.round(prijs.kortingPercentage * 100)}% abonnementskorting</p>}</div><div className="rounded-[1.75rem] border border-sky-100 bg-[#eaf5ff] p-6"><div className="flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">🔒</span><div><h3 className="font-extrabold">Veilig betalen</h3><p className="mt-1 text-sm leading-5 text-[#66809a]">Je gaat hierna naar de beveiligde betaalomgeving.</p></div></div></div>{fout && <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"><strong>Kan nog niet doorgaan.</strong><p className="mt-1">{fout}</p></div>}</div></aside>
              <div className="lg:col-span-2 mt-2 flex flex-col-reverse gap-3 border-t border-sky-100 pt-6 sm:flex-row sm:items-center sm:justify-between"><a href="/boeken/glazenwassen/gegevens" className="rounded-xl border border-sky-200 bg-white px-6 py-3.5 text-center font-bold text-[#245d91]">← Vorige</a><button type="button" onClick={bevestigBoeking} disabled={bezig} className={`rounded-xl px-7 py-4 text-base font-extrabold text-white shadow-lg ${bezig ? "cursor-not-allowed bg-[#7bbcff]" : "bg-[#1683f8] hover:bg-[#0d6fd8]"}`}>{bezig ? "Betaling starten..." : "Boeken en betalen →"}</button></div>
              <p className="lg:col-span-2 -mt-3 text-center text-xs text-[#66809a] sm:text-right">Door op “Boeken en betalen” te klikken ga je een betalingsverplichting aan.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
