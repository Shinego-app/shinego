"use client";

import { useEffect, useMemo, useState } from "react";

type Gegevens = {
  woningtype: string;
  verdiepingen: string[];
  ramen: number;
  glasOppervlak: string;
  telescoop: boolean;
  type: string;
  frequentie: string;
};

type Details = {
  bereikbaar: string;
  kozijnen: boolean;
  opmerking: string;
};

export default function PrijsPage() {
  const [gegevens, setGegevens] = useState<Gegevens | null>(null);
  const [details, setDetails] = useState<Details | null>(null);

  useEffect(() => {
    const opgeslagenGegevens = localStorage.getItem("shinegoGlazenwassen");
    const opgeslagenDetails = localStorage.getItem("shinegoGlazenwassenDetails");
    if (opgeslagenGegevens) setGegevens(JSON.parse(opgeslagenGegevens));
    if (opgeslagenDetails) setDetails(JSON.parse(opgeslagenDetails));
  }, []);

  const prijs = useMemo(() => {
    if (!gegevens || !details) {
      return { bedrijfsPrijs: 0, basisprijs: 0, ramenPrijs: 0, verdiepingToeslag: 0, bereikToeslag: 0, kozijnenToeslag: 0, kortingPercentage: 0, kortingBedrag: 0, totaal: 0 };
    }

    const bedrijfsPrijs =
      gegevens.glasOppervlak === "0-15" ? (gegevens.telescoop ? 69 : 49) :
      gegevens.glasOppervlak === "16-30" ? (gegevens.telescoop ? 99 : 69) :
      gegevens.glasOppervlak === "31-50" ? (gegevens.telescoop ? 149 : 109) :
      gegevens.glasOppervlak === "51-100" ? (gegevens.telescoop ? 259 : 189) :
      gegevens.glasOppervlak === "101-200" ? (gegevens.telescoop ? 469 : 349) :
      gegevens.glasOppervlak === "201-500" ? (gegevens.telescoop ? 999 : 749) :
      gegevens.glasOppervlak === "500+" ? -1 : 0;

    const basisprijs = gegevens.type === "bedrijf" ? bedrijfsPrijs : gegevens.type === "binnen" ? 31.95 : gegevens.type === "telewash" ? 29.95 : 19.95;
    const prijsPerRaam = gegevens.type === "binnen" ? 3.2 : gegevens.type === "telewash" ? 3 : gegevens.type === "bedrijf" ? 0 : 2;
    const ramenPrijs = gegevens.type === "bedrijf" ? 0 : gegevens.ramen * prijsPerRaam;
    const totaalVoorKorting = gegevens.woningtype === "bedrijfspand" ? bedrijfsPrijs : basisprijs + ramenPrijs;
    const kortingPercentage = gegevens.frequentie === "4weken" ? 0.12 : gegevens.frequentie === "8weken" ? 0.1 : gegevens.frequentie === "12weken" ? 0.07 : 0;

    let verdiepingToeslag = 0;
    if (gegevens.verdiepingen.includes("2")) verdiepingToeslag += 15;
    if (gegevens.verdiepingen.includes("3")) verdiepingToeslag += 22.5;

    const bereikToeslag = details.bereikbaar === "nee" ? 15 : 0;
    const kozijnenToeslag = details.kozijnen ? 9.95 + Math.max(0, gegevens.ramen - 10) : 0;
    const subtotaal = totaalVoorKorting + verdiepingToeslag + bereikToeslag + kozijnenToeslag;
    const kortingBedrag = subtotaal * kortingPercentage;
    const totaal = subtotaal - kortingBedrag;

    return { bedrijfsPrijs, basisprijs, ramenPrijs, verdiepingToeslag, bereikToeslag, kozijnenToeslag, kortingPercentage, kortingBedrag, totaal };
  }, [gegevens, details]);

  function doorgaan() {
    if (!gegevens) return;
    if (gegevens.woningtype === "bedrijfspand" && gegevens.glasOppervlak === "500+") {
      window.location.href = "/contact?offerte=500plus";
      return;
    }
    localStorage.setItem("shinegoPrijs", JSON.stringify(prijs));
    window.location.href = "/boeken/glazenwassen/gegevens";
  }

  const geld = (bedrag: number) => `€ ${bedrag.toFixed(2).replace(".", ",")}`;
  const stappen = ["Keuze", "Details", "Prijs", "Gegevens", "Bevestigen"];

  if (!gegevens || !details) {
    return <main className="flex min-h-screen items-center justify-center bg-[#fbfdff]"><p className="text-[#7c91aa]">Gegevens laden...</p></main>;
  }

  const offerteOpMaat = gegevens.woningtype === "bedrijfspand" && gegevens.glasOppervlak === "500+";

  return (
    <main className="min-h-screen bg-[#fbfdff] text-[#16355f]">
      <div className="mx-auto max-w-5xl px-5 py-7 sm:px-8 sm:py-10">
        <header className="flex items-center justify-between">
          <a href="/" className="text-[28px] font-extrabold tracking-tight text-[#123c70]">Shine<span className="text-[#4d7ef0]">Go</span><span className="ml-1 text-[#6e96f5]">✦</span></a>
          <a href="/" aria-label="Menu" className="flex h-10 w-10 items-center justify-center rounded-xl text-2xl text-[#6b83a2] hover:bg-[#f0f5ff]">≡</a>
        </header>

        <div className="mt-4 grid grid-cols-5 gap-1">
          {stappen.map((stap, index) => {
            const actief = index === 2;
            const klaar = index < 2;
            return (
              <div key={stap} className="text-center">
                <div className="flex items-center">
                  <span className={`h-px flex-1 ${index === 0 ? "bg-transparent" : klaar || actief ? "bg-[#b9c9ed]" : "bg-[#e2eaf6]"}`} />
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${actief ? "bg-[#4f78e8] text-white" : klaar ? "bg-[#e9efff] text-[#4f78e8]" : "text-[#7690ad]"}`}>{index + 1}</span>
                  <span className={`h-px flex-1 ${index === 4 ? "bg-transparent" : klaar ? "bg-[#b9c9ed]" : "bg-[#e2eaf6]"}`} />
                </div>
                <div className={`mt-1 text-[10px] sm:text-xs ${actief ? "font-bold text-[#4f78e8]" : "text-[#7c91aa]"}`}>{stap}</div>
              </div>
            );
          })}
        </div>

        <section className="mt-7 rounded-[30px] bg-white px-5 py-7 shadow-[0_18px_60px_rgba(45,77,120,0.10)] sm:px-9 sm:py-9">
          <div className="grid gap-9 lg:grid-cols-[1.2fr_.8fr] lg:gap-14">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#18375f] sm:text-4xl">Jouw prijs</h1>
              <p className="mt-2 text-sm text-[#778ba4] sm:text-base">Hier zie je een overzicht van de prijs.</p>

              <div className="mt-7 divide-y divide-[#edf2f7] text-sm">
                <div className="flex items-center justify-between py-4"><span className="text-[#536b86]">{gegevens.woningtype === "bedrijfspand" ? "Zakelijke glasprijs" : `Basisprijs (${gegevens.ramen} ramen)`}</span><strong className="text-[#29496f]">{offerteOpMaat ? "Offerte" : geld(gegevens.woningtype === "bedrijfspand" ? prijs.bedrijfsPrijs : prijs.basisprijs + prijs.ramenPrijs)}</strong></div>
                {prijs.verdiepingToeslag > 0 && <div className="flex items-center justify-between py-4"><span className="text-[#536b86]">Hoogtetoeslag</span><strong className="text-[#29496f]">{geld(prijs.verdiepingToeslag)}</strong></div>}
                {prijs.kozijnenToeslag > 0 && <div className="flex items-center justify-between py-4"><span className="text-[#536b86]">Kozijnen schoonmaken</span><strong className="text-[#29496f]">{geld(prijs.kozijnenToeslag)}</strong></div>}
                {prijs.bereikToeslag > 0 && <div className="flex items-center justify-between py-4"><span className="text-[#536b86]">Moeilijk bereikbaar</span><strong className="text-[#29496f]">{geld(prijs.bereikToeslag)}</strong></div>}
                {prijs.kortingPercentage > 0 && <div className="flex items-center justify-between py-4"><span className="text-[#536b86]">Periodieke korting ({Math.round(prijs.kortingPercentage * 100)}%)</span><strong className="text-emerald-600">- {geld(prijs.kortingBedrag)}</strong></div>}
                <div className="flex items-center justify-between pt-5 text-lg"><span className="font-extrabold text-[#29496f]">Totaal</span><strong className="text-3xl font-extrabold text-[#29496f]">{offerteOpMaat ? "Offerte" : geld(prijs.totaal)}</strong></div>
              </div>

              <div className="mt-7 rounded-2xl bg-[#f1fbf3] px-4 py-4">
                <div className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#70b879] text-white">✓</span><div><strong className="text-sm text-[#3c6a43]">Vaste prijs</strong><p className="mt-1 text-xs leading-5 text-[#6d8b72]">Geen verrassingen, je weet vooraf precies wat je aan toe bent.</p></div></div>
              </div>

              <a href="/prijzen" className="mt-4 flex items-center justify-between rounded-xl border border-transparent px-1 py-3 text-sm font-semibold text-[#61789c] hover:text-[#496fda]"><span>ⓘ &nbsp;Hoe zijn onze prijzen opgebouwd?</span><span>›</span></a>
            </div>

            <aside className="relative min-h-[360px]">
              <div className="space-y-5 pt-1">
                <div className="flex gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0f4ff] text-xl">🏷️</span><div><strong className="block text-sm text-[#375575]">Eerlijke prijzen</strong><span className="text-xs text-[#8998aa]">Duidelijke opbouw</span></div></div>
                <div className="flex gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1f7ff] text-xl">🗓️</span><div><strong className="block text-sm text-[#375575]">Geen verrassingen</strong><span className="text-xs text-[#8998aa]">Vaste tarieven</span></div></div>
                <div className="flex gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1f7ff] text-xl">🛡️</span><div><strong className="block text-sm text-[#375575]">Betrouwbare professionals</strong><span className="text-xs text-[#8998aa]">Gecontroleerd door ShineGo</span></div></div>
              </div>
              <div className="absolute bottom-6 right-5 -rotate-6 text-2xl font-medium italic text-[#7a8291]">Dat is<br />ShineGo</div>
            </aside>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-[#edf2f7] pt-5">
            <a href="/boeken/glazenwassen/details" className="px-2 py-3 text-sm font-bold text-[#8090a3]">← Terug</a>
            <button type="button" onClick={doorgaan} className="min-w-44 rounded-xl bg-[#5578dc] px-7 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(73,103,190,.24)] hover:bg-[#466bd4]">{offerteOpMaat ? "Offerte aanvragen →" : "Verder →"}</button>
          </div>
        </section>
      </div>
    </main>
  );
}
