"use client";

import { useEffect, useMemo, useState } from "react";

type Gegevens = { woningtype: string; verdiepingen: string[]; ramen: number; glasOppervlak: string; telescoop: boolean; type: string; frequentie: string; binnenkant?: boolean; alleenBinnen?: boolean; achterkant?: boolean; };
type Details = { bereikbaar: string; kozijnen: boolean; opmerking: string; };

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
    if (!gegevens || !details) return { bedrijfsPrijs: 0, basisprijs: 0, ramenPrijs: 0, achterkantPrijs: 0, binnenRamenPrijs: 0, alleenBinnenToeslag: 0, verdiepingToeslag: 0, bereikToeslag: 0, kozijnenToeslag: 0, kortingPercentage: 0, kortingBedrag: 0, totaal: 0 };
    const bedrijfsPrijs = gegevens.glasOppervlak === "0-15" ? (gegevens.telescoop ? 69 : 49) : gegevens.glasOppervlak === "16-30" ? (gegevens.telescoop ? 99 : 69) : gegevens.glasOppervlak === "31-50" ? (gegevens.telescoop ? 149 : 109) : gegevens.glasOppervlak === "51-100" ? (gegevens.telescoop ? 259 : 189) : gegevens.glasOppervlak === "101-200" ? (gegevens.telescoop ? 469 : 349) : gegevens.glasOppervlak === "201-500" ? (gegevens.telescoop ? 999 : 749) : gegevens.glasOppervlak === "500+" ? -1 : 0;
    const alleenBinnen = Boolean(gegevens.alleenBinnen) || gegevens.type === "binnen";
    const binnenkant = Boolean(gegevens.binnenkant) && !alleenBinnen;
    const basisprijs = gegevens.type === "bedrijf" ? bedrijfsPrijs : alleenBinnen ? 0 : gegevens.type === "telewash" ? 29.95 : 19.95;
    const prijsPerRaam = gegevens.type === "bedrijf" ? 0 : 4;
    const ramenPrijs = gegevens.type === "bedrijf" || alleenBinnen ? 0 : gegevens.ramen * prijsPerRaam;
    const achterkantPrijs = gegevens.type === "bedrijf" || alleenBinnen || !gegevens.achterkant ? 0 : basisprijs + ramenPrijs;
    const binnenRamenPrijs = gegevens.type === "bedrijf" ? 0 : (binnenkant || alleenBinnen ? gegevens.ramen * prijsPerRaam : 0);
    const alleenBinnenToeslag = alleenBinnen ? 15 : 0;
    const totaalVoorKorting = gegevens.woningtype === "bedrijfspand" ? bedrijfsPrijs : basisprijs + ramenPrijs + achterkantPrijs + binnenRamenPrijs + alleenBinnenToeslag;
    const kortingPercentage = gegevens.frequentie === "4weken" ? 0.12 : gegevens.frequentie === "8weken" ? 0.1 : gegevens.frequentie === "12weken" ? 0.07 : 0;
    const verdiepingToeslag = alleenBinnen ? 0 : gegevens.verdiepingen.includes("4") ? 15 : 0;
    const bereikToeslag = 0;
    const kozijnenToeslag = details.kozijnen ? 9.95 + Math.max(0, gegevens.ramen - 10) : 0;
    const subtotaal = totaalVoorKorting + verdiepingToeslag + kozijnenToeslag;
    const kortingBedrag = subtotaal * kortingPercentage;
    const totaal = subtotaal - kortingBedrag;
    return { bedrijfsPrijs, basisprijs, ramenPrijs, achterkantPrijs, binnenRamenPrijs, alleenBinnenToeslag, verdiepingToeslag, bereikToeslag, kozijnenToeslag, kortingPercentage, kortingBedrag, totaal };
  }, [gegevens, details]);

  function doorgaan() {
    if (!gegevens) return;
    if (gegevens.woningtype === "bedrijfspand" && gegevens.glasOppervlak === "500+") { window.location.href = "/contact?offerte=500plus"; return; }
    localStorage.setItem("shinegoPrijs", JSON.stringify(prijs));
    window.location.href = "/boeken/glazenwassen/gegevens";
  }

  const geld = (bedrag: number) => `€ ${bedrag.toFixed(2).replace(".", ",")}`;
  const stappen = ["Keuze", "Details", "Prijs", "Gegevens", "Bevestigen"];
  if (!gegevens || !details) return <main className="flex min-h-screen items-center justify-center bg-[#eef8ff]"><p className="text-[#52779b]">Gegevens laden...</p></main>;
  const offerteOpMaat = gegevens.woningtype === "bedrijfspand" && gegevens.glasOppervlak === "500+";
  const alleenBinnen = Boolean(gegevens.alleenBinnen) || gegevens.type === "binnen";

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#eaf6ff] to-[#f8fcff] text-[#123c70]">
      <div className="mx-auto max-w-5xl px-5 py-5 sm:px-8 sm:py-7">
        <header className="flex items-center justify-between"><a href="/" className="text-[29px] font-extrabold tracking-tight text-[#0d3f79]">Shine<span className="text-[#1683f8]">Go</span><span className="ml-1 text-[#1683f8]">✦</span></a><a href="/" aria-label="Menu" className="flex h-9 w-9 items-center justify-center text-2xl font-bold text-[#1683f8]">≡</a></header>
        <div className="mx-auto mt-3 grid max-w-3xl grid-cols-5 gap-1">{stappen.map((stap,index)=>{const actief=index===2;const klaar=index<2;return <div key={stap} className="text-center"><div className="flex items-center"><span className={`h-px flex-1 ${index===0?"bg-transparent":klaar||actief?"bg-[#7db9eb]":"bg-[#b9d8f4]"}`} /><span className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-extrabold ${actief?"border-[#1683f8] bg-[#1683f8] text-white":klaar?"border-[#9ccbf0] bg-[#eaf6ff] text-[#1683f8]":"border-[#a9cbea] bg-[#eef8ff] text-[#4b7197]"}`}>{index+1}</span><span className={`h-px flex-1 ${index===4?"bg-transparent":klaar?"bg-[#7db9eb]":"bg-[#b9d8f4]"}`} /></div><div className={`mt-1 text-[10px] sm:text-xs ${actief?"font-bold text-[#1683f8]":"text-[#52779b]"}`}>{stap}</div></div>})}</div>

        <section className="mt-5 rounded-[28px] border border-[#d5e9f8] bg-white/90 px-5 py-6 shadow-[0_18px_55px_rgba(40,93,140,.12)] sm:px-7 sm:py-7">
          <div className="grid gap-7 lg:grid-cols-[1.2fr_.8fr] lg:gap-10">
            <div>
              <h1 className="text-[32px] font-extrabold leading-tight tracking-[-.035em] text-[#0b3d75] sm:text-[38px]">Jouw prijs</h1>
              <p className="mt-1 text-sm font-medium text-[#537797] sm:text-base">Hier zie je vooraf de boekingsprijs voor deze opdracht.</p>
              <div className="mt-5 divide-y divide-[#dcecf8] text-sm">
                {gegevens.woningtype === "bedrijfspand" ? <div className="flex items-center justify-between py-3"><span className="text-[#4f708f]">Zakelijke glasprijs</span><strong className="text-[#123c70]">{offerteOpMaat ? "Offerte" : geld(prijs.bedrijfsPrijs)}</strong></div> : <>
                  {!alleenBinnen&&<div className="flex items-center justify-between py-3"><span className="text-[#4f708f]">Buitenzijde ({gegevens.ramen} ramen)</span><strong className="text-[#123c70]">{geld(prijs.basisprijs + prijs.ramenPrijs)}</strong></div>}
                  {prijs.achterkantPrijs > 0&&<div className="flex items-center justify-between py-3"><span className="text-[#4f708f]">Achterkant woning ({gegevens.ramen} ramen)</span><strong>{geld(prijs.achterkantPrijs)}</strong></div>}
                  {prijs.binnenRamenPrijs > 0&&<div className="flex items-center justify-between py-3"><span className="text-[#4f708f]">Binnenzijde ({gegevens.ramen} ramen)</span><strong>{geld(prijs.binnenRamenPrijs)}</strong></div>}
                  {prijs.alleenBinnenToeslag > 0&&<div className="flex items-center justify-between py-3"><span className="text-[#4f708f]">Starttoeslag alleen binnen</span><strong>{geld(prijs.alleenBinnenToeslag)}</strong></div>}
                </>}
                {prijs.verdiepingToeslag > 0 && <div className="flex items-center justify-between py-3"><span className="text-[#4f708f]">Hoogtetoeslag</span><strong>{geld(prijs.verdiepingToeslag)}</strong></div>}
                {prijs.kozijnenToeslag > 0 && <div className="flex items-center justify-between py-3"><span className="text-[#4f708f]">Kozijnen schoonmaken</span><strong>{geld(prijs.kozijnenToeslag)}</strong></div>}
                {prijs.kortingPercentage > 0 && <div className="flex items-center justify-between py-3"><span className="text-[#4f708f]">Periodieke korting ({Math.round(prijs.kortingPercentage*100)}%)</span><strong className="text-emerald-600">- {geld(prijs.kortingBedrag)}</strong></div>}
                <div className="flex items-center justify-between pt-4"><span className="text-lg font-extrabold text-[#0b3d75]">Totaal</span><strong className="text-3xl font-extrabold text-[#0b3d75]">{offerteOpMaat?"Offerte":geld(prijs.totaal)}</strong></div>
              </div>
              <div className="mt-5 rounded-2xl bg-[#eafaf1] px-4 py-4"><div className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#21a366] text-white">✓</span><div><strong className="text-sm text-[#27643f]">Prijs vooraf duidelijk</strong><p className="mt-1 text-xs leading-5 text-[#5f7f6b]">Je ziet vóór het boeken wat deze opdracht kost.</p></div></div></div>
              <a href="/prijzen" className="mt-3 flex items-center justify-between rounded-xl border border-[#d5e9f8] bg-[#f7fbff] px-4 py-3 text-sm font-semibold text-[#3971a4]"><span>ⓘ &nbsp;Hoe is deze boekingsprijs opgebouwd?</span><span>›</span></a>
            </div>
            <aside className="rounded-[24px] bg-gradient-to-b from-[#eef8ff] to-[#e4f3ff] p-5">
              <div className="space-y-4">
                <div className="flex gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl">🏷️</span><div><strong className="block text-sm text-[#123c70]">Duidelijke boekingsprijs</strong><span className="text-xs text-[#6d89a4]">Vooraf inzicht in de opbouw</span></div></div>
                <div className="flex gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl">🗓️</span><div><strong className="block text-sm text-[#123c70]">Vooraf bekend</strong><span className="text-xs text-[#6d89a4]">Geen verrassingen bij het boeken</span></div></div>
                <div className="flex gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl">🛡️</span><div><strong className="block text-sm text-[#123c70]">Zelfstandige professionals</strong><span className="text-xs text-[#6d89a4]">De opdracht wordt zelfstandig uitgevoerd</span></div></div>
              </div>
              <div className="mt-12 -rotate-6 text-right text-2xl font-medium italic text-[#4f6f8d]">Dat is<br />ShineGo ✨</div>
            </aside>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-[#dcecf8] pt-4"><a href="/boeken/glazenwassen/details" className="px-2 py-3 text-sm font-bold text-[#537797]">← Terug</a><button type="button" onClick={doorgaan} className="min-w-44 rounded-xl bg-[#1683f8] px-7 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(22,131,248,.24)]">{offerteOpMaat?"Offerte aanvragen →":"Verder →"}</button></div>
        </section>
      </div>
    </main>
  );
}
