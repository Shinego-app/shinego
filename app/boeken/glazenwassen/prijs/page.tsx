"use client";

import { useEffect, useMemo, useState } from "react";

type Gegevens = { woningtype: string; verdiepingen: string[]; ramen: number; glasOppervlak: string; telescoop: boolean; type: string; frequentie: string; };
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
    if (!gegevens || !details) return { bedrijfsPrijs: 0, basisprijs: 0, ramenPrijs: 0, verdiepingToeslag: 0, bereikToeslag: 0, kozijnenToeslag: 0, kortingPercentage: 0, kortingBedrag: 0, totaal: 0 };
    const bedrijfsPrijs = gegevens.glasOppervlak === "0-15" ? (gegevens.telescoop ? 69 : 49) : gegevens.glasOppervlak === "16-30" ? (gegevens.telescoop ? 99 : 69) : gegevens.glasOppervlak === "31-50" ? (gegevens.telescoop ? 149 : 109) : gegevens.glasOppervlak === "51-100" ? (gegevens.telescoop ? 259 : 189) : gegevens.glasOppervlak === "101-200" ? (gegevens.telescoop ? 469 : 349) : gegevens.glasOppervlak === "201-500" ? (gegevens.telescoop ? 999 : 749) : gegevens.glasOppervlak === "500+" ? -1 : 0;
    const basisprijs = gegevens.type === "bedrijf" ? bedrijfsPrijs : gegevens.type === "binnen" ? 31.95 : gegevens.type === "telewash" ? 29.95 : 19.95;
    const prijsPerRaam = gegevens.type === "binnen" ? 3.2 : gegevens.type === "telewash" ? 3 : gegevens.type === "bedrijf" ? 0 : 2;
    const ramenPrijs = gegevens.type === "bedrijf" ? 0 : gegevens.ramen * prijsPerRaam;
    const totaalVoorKorting = gegevens.woningtype === "bedrijfspand" ? bedrijfsPrijs : basisprijs + ramenPrijs;
    const kortingPercentage = gegevens.frequentie === "4weken" ? 0.12 : gegevens.frequentie === "8weken" ? 0.1 : gegevens.frequentie === "12weken" ? 0.07 : 0;
    let verdiepingToeslag = 0;
    if (gegevens.verdiepingen.includes("2")) verdiepingToeslag += 15;
    if (gegevens.verdiepingen.includes("3")) verdiepingToeslag += 22.5;
    if (gegevens.verdiepingen.includes("4")) verdiepingToeslag += 30;
    const bereikToeslag = details.bereikbaar === "nee" ? 15 : 0;
    const kozijnenToeslag = details.kozijnen ? 9.95 + Math.max(0, gegevens.ramen - 10) : 0;
    const subtotaal = totaalVoorKorting + verdiepingToeslag + bereikToeslag + kozijnenToeslag;
    const kortingBedrag = subtotaal * kortingPercentage;
    const totaal = subtotaal - kortingBedrag;
    return { bedrijfsPrijs, basisprijs, ramenPrijs, verdiepingToeslag, bereikToeslag, kozijnenToeslag, kortingPercentage, kortingBedrag, totaal };
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#eaf6ff] to-[#f8fcff] text-[#123c70]">
      <div className="mx-auto max-w-5xl px-5 py-5 sm:px-8 sm:py-7">
        <header className="flex items-center justify-between"><a href="/" className="text-[29px] font-extrabold tracking-tight text-[#0d3f79]">Shine<span className="text-[#1683f8]">Go</span><span className="ml-1 text-[#1683f8]">✦</span></a><a href="/" aria-label="Menu" className="flex h-9 w-9 items-center justify-center text-2xl font-bold text-[#1683f8]">≡</a></header>
        <div className="mx-auto mt-3 grid max-w-3xl grid-cols-5 gap-1">{stappen.map((stap,index)=>{const actief=index===2;const klaar=index<2;return <div key={stap} className="text-center"><div className="flex items-center"><span className={`h-px flex-1 ${index===0?"bg-transparent":klaar||actief?"bg-[#7db9eb]":"bg-[#b9d8f4]"}`} /><span className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-extrabold ${actief?"border-[#1683f8] bg-[#1683f8] text-white":klaar?"border-[#9ccbf0] bg-[#eaf6ff] text-[#1683f8]":"border-[#a9cbea] bg-[#eef8ff] text-[#4b7197]"}`}>{index+1}</span><span className={`h-px flex-1 ${index===4?"bg-transparent":klaar?"bg-[#7db9eb]":"bg-[#b9d8f4]"}`} /></div><div className={`mt-1 text-[10px] sm:text-xs ${actief?"font-bold text-[#1683f8]":"text-[#52779b]"}`}>{stap}</div></div>})}</div>

        <section className="mt-5 rounded-[28px] border border-[#d5e9f8] bg-white/90 px-5 py-6 shadow-[0_18px_55px_rgba(40,93,140,.12)] sm:px-7 sm:py-7">
          <div className="grid gap-7 lg:grid-cols-[1.2fr_.8fr] lg:gap-10">
            <div>
              <h1 className="text-[32px] font-extrabold leading-tight tracking-[-.035em] text-[#0b3d75] sm:text-[38px]">Jouw prijs</h1>
              <p className="mt-1 text-sm font-medium text-[#537797] sm:text-base">Hier zie je een overzicht van de prijs.</p>
              <div className="mt-5 divide-y divide-[#dcecf8] text-sm">
                <div className="flex items-center justify-between py-3"><span className="text-[#4f708f]">{gegevens.woningtype === "bedrijfspand" ? "Zakelijke glasprijs" : `Basisprijs (${gegevens.ramen} ramen)`}</span><strong className="text-[#123c70]">{offerteOpMaat ? "Offerte" : geld(gegevens.woningtype === "bedrijfspand" ? prijs.bedrijfsPrijs : prijs.basisprijs + prijs.ramenPrijs)}</strong></div>
                {prijs.verdiepingToeslag > 0 && <div className="flex items-center justify-between py-3"><span className="text-[#4f708f]">Hoogtetoeslag</span><strong>{geld(prijs.verdiepingToeslag)}</strong></div>}
                {prijs.kozijnenToeslag > 0 && <div className="flex items-center justify-between py-3"><span className="text-[#4f708f]">Kozijnen schoonmaken</span><strong>{geld(prijs.kozijnenToeslag)}</strong></div>}
                {prijs.bereikToeslag > 0 && <div className="flex items-center justify-between py-3"><span className="text-[#4f708f]">Moeilijk bereikbaar</span><strong>{geld(prijs.bereikToeslag)}</strong></div>}
                {prijs.kortingPercentage > 0 && <div className="flex items-center justify-between py-3"><span className="text-[#4f708f]">Periodieke korting ({Math.round(prijs.kortingPercentage*100)}%)</span><strong className="text-emerald-600">- {geld(prijs.kortingBedrag)}</strong></div>}
                <div className="flex items-center justify-between pt-4"><span className="text-lg font-extrabold text-[#0b3d75]">Totaal</span><strong className="text-3xl font-extrabold text-[#0b3d75]">{offerteOpMaat?"Offerte":geld(prijs.totaal)}</strong></div>
              </div>
              <div className="mt-5 rounded-2xl bg-[#eafaf1] px-4 py-4"><div className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#21a366] text-white">✓</span><div><strong className="text-sm text-[#27643f]">Vaste prijs</strong><p className="mt-1 text-xs leading-5 text-[#5f7f6b]">Geen verrassingen, je weet vooraf precies waar je aan toe bent.</p></div></div></div>
              <a href="/prijzen" className="mt-3 flex items-center justify-between rounded-xl border border-[#d5e9f8] bg-[#f7fbff] px-4 py-3 text-sm font-semibold text-[#3971a4]"><span>ⓘ &nbsp;Hoe zijn onze prijzen opgebouwd?</span><span>›</span></a>
            </div>
            <aside className="rounded-[24px] bg-gradient-to-b from-[#eef8ff] to-[#e4f3ff] p-5">
              <div className="space-y-4">
                <div className="flex gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl">🏷️</span><div><strong className="block text-sm text-[#123c70]">Eerlijke prijzen</strong><span className="text-xs text-[#6d89a4]">Duidelijke opbouw</span></div></div>
                <div className="flex gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl">🗓️</span><div><strong className="block text-sm text-[#123c70]">Geen verrassingen</strong><span className="text-xs text-[#6d89a4]">Vaste tarieven</span></div></div>
                <div className="flex gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl">🛡️</span><div><strong className="block text-sm text-[#123c70]">Betrouwbare professionals</strong><span className="text-xs text-[#6d89a4]">Geverifieerd door ShineGo</span></div></div>
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
