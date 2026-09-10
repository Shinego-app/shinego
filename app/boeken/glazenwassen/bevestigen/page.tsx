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
    } catch {
      setFout("De boekingsgegevens konden niet worden geladen.");
    }
  }, []);

  async function bevestigBoeking() {
    if (!klus || !details || !prijs || !klant) { setFout("Niet alle gegevens zijn aanwezig."); return; }
    if (!klant.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(klant.email.trim())) { setFout("Vul een geldig e-mailadres in."); return; }
    if (!akkoordVoorwaarden) { setFout("Ga akkoord met de algemene voorwaarden en het annuleringsbeleid."); return; }
    if (!akkoordStartBedenktijd) { setFout("Geef toestemming voor start binnen de wettelijke bedenktijd indien nodig."); return; }

    setBezig(true);
    setFout("");

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

      const betaalResponse = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const betaalData = await betaalResponse.json();
      if (!betaalResponse.ok || !betaalData.url) throw new Error("Stripe betaling kon niet worden gestart.");
      window.location.href = betaalData.url;
    } catch (error) {
      setFout(error instanceof Error ? error.message : "Er ging iets mis bij het opslaan van de boeking.");
      setBezig(false);
    }
  }

  const soort = klus?.type === "binnen" ? "Ramen binnen wassen" : klus?.type === "telewash" ? "Telescoopsteel" : klus?.type === "bedrijf" ? "Winkel / bedrijfspand" : "Ramen buiten wassen";
  const frequentie = klus?.frequentie === "4weken" ? "Elke 4 weken" : klus?.frequentie === "8weken" ? "Elke 8 weken" : klus?.frequentie === "12weken" ? "Elke 12 weken" : "Eenmalig";
  const stappen = ["Keuze", "Details", "Prijs", "Gegevens", "Bevestigen"];

  return (
    <main className="min-h-screen bg-[#fbfdff] text-[#16355f]">
      <div className="mx-auto max-w-5xl px-5 py-7 sm:px-8 sm:py-10">
        <header className="flex items-center justify-between">
          <a href="/" className="text-[28px] font-extrabold tracking-tight text-[#123c70]">Shine<span className="text-[#4d7ef0]">Go</span><span className="ml-1 text-[#6e96f5]">✦</span></a>
          <a href="/" aria-label="Menu" className="flex h-10 w-10 items-center justify-center rounded-xl text-2xl text-[#6b83a2] hover:bg-[#f0f5ff]">≡</a>
        </header>

        <div className="mt-4 grid grid-cols-5 gap-1">
          {stappen.map((stap, index) => {
            const actief = index === 4;
            const klaar = index < 4;
            return (
              <div key={stap} className="text-center">
                <div className="flex items-center">
                  <span className={`h-px flex-1 ${index === 0 ? "bg-transparent" : "bg-[#b9c9ed]"}`} />
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${actief ? "bg-[#4f78e8] text-white" : klaar ? "bg-[#e9efff] text-[#4f78e8]" : "text-[#7690ad]"}`}>{index + 1}</span>
                  <span className={`h-px flex-1 ${index === 4 ? "bg-transparent" : klaar ? "bg-[#b9c9ed]" : "bg-[#e2eaf6]"}`} />
                </div>
                <div className={`mt-1 text-[10px] sm:text-xs ${actief ? "font-bold text-[#4f78e8]" : "text-[#7c91aa]"}`}>{stap}</div>
              </div>
            );
          })}
        </div>

        <section className="relative mt-7 overflow-hidden rounded-[30px] bg-white px-5 py-7 shadow-[0_18px_60px_rgba(45,77,120,0.10)] sm:px-9 sm:py-9">
          <div className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[34%] overflow-hidden lg:block">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80" alt="Schone moderne ramen" className="h-full w-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent" />
          </div>

          <div className="relative max-w-3xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#18375f] sm:text-4xl">Controleer je boeking</h1>
            <p className="mt-2 text-sm text-[#778ba4] sm:text-base">Nog één controle, daarna ga je veilig betalen.</p>

            {!klus || !details || !prijs || !klant ? (
              <p className="mt-8 text-[#7c91aa]">Boekingsgegevens laden...</p>
            ) : (
              <>
                <div className="mt-7 grid gap-6 sm:grid-cols-2">
                  <div>
                    <h2 className="text-sm font-extrabold text-[#385575]">Jouw gegevens</h2>
                    <dl className="mt-3 space-y-2 text-sm text-[#6f8197]">
                      <div className="flex justify-between gap-3"><dt>Naam</dt><dd className="text-right font-semibold text-[#29496f]">{klant.voornaam} {klant.achternaam}</dd></div>
                      <div className="flex justify-between gap-3"><dt>E-mail</dt><dd className="text-right font-semibold text-[#29496f]">{klant.email}</dd></div>
                      <div className="flex justify-between gap-3"><dt>Adres</dt><dd className="text-right font-semibold text-[#29496f]">{klant.straat} {klant.huisnummer}<br />{klant.postcode} {klant.plaats}</dd></div>
                    </dl>
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-[#385575]">Opdracht</h2>
                    <dl className="mt-3 space-y-2 text-sm text-[#6f8197]">
                      <div className="flex justify-between gap-3"><dt>Dienst</dt><dd className="font-semibold text-[#29496f]">{soort}</dd></div>
                      <div className="flex justify-between gap-3"><dt>Frequentie</dt><dd className="font-semibold text-[#29496f]">{frequentie}</dd></div>
                      <div className="flex justify-between gap-3"><dt>Datum</dt><dd className="font-semibold text-[#29496f]">{klant.gewensteDatum}</dd></div>
                      <div className="flex justify-between gap-3"><dt>Tijd</dt><dd className="font-semibold text-[#29496f]">{klant.gewensteTijd}</dd></div>
                    </dl>
                  </div>
                </div>

                <div className="mt-7 flex items-center justify-between rounded-2xl bg-[#f4f7ff] px-5 py-4">
                  <div><span className="text-xs font-bold uppercase tracking-wider text-[#71859d]">Totaalprijs</span><div className="mt-1 text-sm font-semibold text-[#667b95]">{soort}</div></div>
                  <strong className="text-3xl font-extrabold text-[#29496f]">€ {prijs.totaal.toFixed(2).replace(".", ",")}</strong>
                </div>

                <div className="mt-6 space-y-3">
                  <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${akkoordVoorwaarden ? "border-[#6f8de3] bg-[#f2f5ff]" : "border-[#e0e7f0]"}`}><input type="checkbox" checked={akkoordVoorwaarden} onChange={(e) => setAkkoordVoorwaarden(e.target.checked)} className="mt-1" /><span className="text-xs leading-5 text-[#657991]">Ik ga akkoord met de <a href="/voorwaarden" target="_blank" className="font-bold text-[#4f71cf] underline">algemene voorwaarden</a> en het annuleringsbeleid.</span></label>
                  <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${akkoordStartBedenktijd ? "border-[#6f8de3] bg-[#f2f5ff]" : "border-[#e0e7f0]"}`}><input type="checkbox" checked={akkoordStartBedenktijd} onChange={(e) => setAkkoordStartBedenktijd(e.target.checked)} className="mt-1" /><span className="text-xs leading-5 text-[#657991]">Ik verzoek ShineGo om de dienstverlening, indien nodig, binnen de wettelijke bedenktijd te laten starten.</span></label>
                </div>

                {fout && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{fout}</div>}
              </>
            )}
          </div>

          <div className="relative mt-8 flex items-center justify-between border-t border-[#edf2f7] pt-5">
            <a href="/boeken/glazenwassen/gegevens" className="px-2 py-3 text-sm font-bold text-[#8090a3]">← Terug</a>
            <button type="button" onClick={bevestigBoeking} disabled={bezig || !klus || !details || !prijs || !klant} className={`min-w-48 rounded-xl px-7 py-3.5 text-sm font-extrabold text-white ${bezig ? "cursor-not-allowed bg-[#aebddd]" : "bg-[#5578dc] shadow-[0_8px_20px_rgba(73,103,190,.24)] hover:bg-[#466bd4]"}`}>{bezig ? "Betaling starten..." : "Boeken en betalen →"}</button>
          </div>
        </section>
      </div>
    </main>
  );
}
