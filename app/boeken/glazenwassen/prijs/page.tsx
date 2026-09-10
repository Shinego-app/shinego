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
    if (gegevens?.woningtype === "bedrijfspand" && gegevens.glasOppervlak === "500+") {
      window.location.href = "/contact?offerte=500plus";
      return;
    }
    localStorage.setItem("shinegoPrijs", JSON.stringify(prijs));
    window.location.href = "/boeken/glazenwassen/gegevens";
  }

  if (!gegevens || !details) {
    return <main className="flex min-h-screen items-center justify-center bg-[#eef8ff] px-4"><div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-lg"><p className="text-[#66809a]">Gegevens laden...</p></div></main>;
  }

  const offerteOpMaat = gegevens.woningtype === "bedrijfspand" && gegevens.glasOppervlak === "500+";
  const stappen = ["Keuze", "Situatie", "Details", "Prijs", "Gegevens"];
  const geld = (bedrag: number) => `€${bedrag.toFixed(2).replace(".", ",")}`;

  return (
    <main className="min-h-screen bg-[#eef8ff] text-[#0b2b5b]">
      <header className="border-b border-sky-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="/" className="text-2xl font-extrabold tracking-tight text-[#0b3d75]">Shine<span className="text-[#1683f8]">Go✦</span></a>
          <a href="/boeken/glazenwassen/details" className="rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-bold text-[#245d91]">← Terug</a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
        <div className="mb-7 rounded-3xl border border-sky-100 bg-white/75 px-4 py-4 shadow-sm sm:px-6">
          <div className="grid grid-cols-5 gap-1 sm:gap-3">
            {stappen.map((stap, index) => {
              const nummer = index + 1;
              const actief = nummer === 4;
              const klaar = nummer < 4;
              return (
                <div key={stap} className="text-center">
                  <div className="flex items-center">
                    <div className={`h-px flex-1 ${index === 0 ? "bg-transparent" : klaar || actief ? "bg-[#9fd1ff]" : "bg-sky-100"}`} />
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${actief ? "bg-[#1683f8] text-white shadow-md" : klaar ? "bg-[#dff1ff] text-[#1177df]" : "border border-sky-200 bg-white text-[#66809a]"}`}>{nummer}</div>
                    <div className={`h-px flex-1 ${index === stappen.length - 1 ? "bg-transparent" : klaar ? "bg-[#9fd1ff]" : "bg-sky-100"}`} />
                  </div>
                  <div className={`mt-2 text-[10px] font-semibold sm:text-xs ${actief ? "text-[#1177df]" : "text-[#66809a]"}`}>{stap}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-sky-100 bg-gradient-to-br from-white via-[#f8fcff] to-[#dff1ff] p-5 shadow-lg sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[#bfe3ff]/45 blur-3xl" />
          <div className="relative grid gap-7 lg:grid-cols-[1.1fr_.9fr] lg:gap-10">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#1683f8]">Jouw prijs</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Helder. Vooraf. Zonder verrassingen.</h1>
              <p className="mt-3 text-base leading-7 text-[#5b7591]">Hier zie je precies hoe jouw ShineGo-prijs is opgebouwd.</p>

              <div className="mt-7 overflow-hidden rounded-[1.75rem] border border-sky-100 bg-white shadow-lg">
                <div className="bg-gradient-to-br from-[#dff1ff] via-[#eef8ff] to-white px-5 py-6 sm:px-7">
                  <div className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#1683f8]">Totaalprijs</div>
                  <div className={`mt-2 font-extrabold text-[#0b2b5b] ${offerteOpMaat ? "text-3xl" : "text-5xl sm:text-6xl"}`}>{offerteOpMaat ? "Offerte op maat" : geld(prijs.totaal)}</div>
                  <p className="mt-2 text-sm text-[#66809a]">Voor de gekozen glasbewassing</p>
                </div>

                <div className="p-5 sm:p-7">
                  <h2 className="text-xl font-extrabold">Prijsopbouw</h2>
                  <div className="mt-5 divide-y divide-sky-100">
                    <div className="flex items-center justify-between gap-4 py-3"><span className="text-[#5b7591]">{gegevens.woningtype === "bedrijfspand" ? "Zakelijke glasprijs" : "Basisprijs"}</span><strong>{offerteOpMaat ? "Offerte" : geld(gegevens.woningtype === "bedrijfspand" ? prijs.bedrijfsPrijs : prijs.basisprijs)}</strong></div>
                    {gegevens.woningtype !== "bedrijfspand" && <div className="flex items-center justify-between gap-4 py-3"><span className="text-[#5b7591]">{gegevens.ramen} ramen</span><strong>{geld(prijs.ramenPrijs)}</strong></div>}
                    {prijs.verdiepingToeslag > 0 && <div className="flex items-center justify-between gap-4 py-3"><span className="text-[#5b7591]">Hoogtetoeslag</span><strong>{geld(prijs.verdiepingToeslag)}</strong></div>}
                    {prijs.bereikToeslag > 0 && <div className="flex items-center justify-between gap-4 py-3"><span className="text-[#5b7591]">Moeilijk bereikbaar</span><strong>{geld(prijs.bereikToeslag)}</strong></div>}
                    {prijs.kozijnenToeslag > 0 && <div className="flex items-center justify-between gap-4 py-3"><span className="text-[#5b7591]">Kozijnen schoonmaken</span><strong>{geld(prijs.kozijnenToeslag)}</strong></div>}
                    {prijs.kortingPercentage > 0 && <div className="flex items-center justify-between gap-4 py-3"><span className="text-[#5b7591]">Abonnementskorting ({Math.round(prijs.kortingPercentage * 100)}%)</span><strong className="text-emerald-600">- {geld(prijs.kortingBedrag)}</strong></div>}
                    <div className="flex items-center justify-between gap-4 pt-5 text-xl"><span className="font-extrabold">Totaal</span><strong className="text-2xl text-[#1683f8]">{offerteOpMaat ? "Offerte" : geld(prijs.totaal)}</strong></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                <div className="flex gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">✓</span><div><div className="font-extrabold text-emerald-800">Vaste prijs vooraf</div><p className="mt-1 text-sm leading-5 text-emerald-700">Extra werkzaamheden worden niet zomaar toegevoegd zonder jouw akkoord.</p></div></div>
              </div>

              <a href="/prijzen" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm font-extrabold text-[#1177df]">ⓘ Hoe zijn onze prijzen opgebouwd? →</a>
            </div>

            <aside className="lg:pt-12">
              <div className="sticky top-24 rounded-[1.75rem] border border-sky-100 bg-white/90 p-6 shadow-lg">
                <h2 className="text-xl font-extrabold">Jouw opdracht</h2>
                <div className="mt-5 space-y-4 text-sm">
                  {[
                    ["Woningtype", gegevens.woningtype],
                    ["Frequentie", gegevens.frequentie === "4weken" ? "Elke 4 weken" : gegevens.frequentie === "8weken" ? "Elke 8 weken" : gegevens.frequentie === "12weken" ? "Elke 12 weken" : "Eenmalig"],
                    ["Telescoopsteel", gegevens.telescoop ? "Ja" : "Nee"],
                    ["Verdiepingen", gegevens.verdiepingen.join(", ") || "-"],
                    [gegevens.woningtype === "bedrijfspand" ? "Glasoppervlak" : "Aantal ramen", gegevens.woningtype === "bedrijfspand" ? `${gegevens.glasOppervlak} m²` : String(gegevens.ramen)],
                    ["Bereikbaarheid", details.bereikbaar === "ja" ? "Goed bereikbaar" : "Moeilijk bereikbaar"],
                    ["Kozijnen", details.kozijnen ? "Ja" : "Nee"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-start justify-between gap-4 border-b border-sky-50 pb-3 last:border-0"><span className="text-[#66809a]">{label}</span><strong className="max-w-[55%] text-right">{value}</strong></div>
                  ))}
                </div>
                <div className="mt-6 grid gap-3">
                  <div className="rounded-2xl bg-[#eaf5ff] p-4"><div className="font-extrabold">💶 Eerlijke prijzen</div><div className="mt-1 text-sm text-[#66809a]">Duidelijke opbouw vooraf</div></div>
                  <div className="rounded-2xl bg-[#eaf5ff] p-4"><div className="font-extrabold">🛡️ Geen verrassingen</div><div className="mt-1 text-sm text-[#66809a]">Je ziet het bedrag vóór je betaalt</div></div>
                </div>
              </div>
            </aside>
          </div>

          <div className="relative mt-8 flex flex-col-reverse gap-3 border-t border-sky-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <a href="/boeken/glazenwassen/details" className="rounded-xl border border-sky-200 bg-white px-6 py-3.5 text-center font-bold text-[#245d91]">← Terug</a>
            <button type="button" onClick={doorgaan} className="rounded-xl bg-[#1683f8] px-7 py-4 text-base font-extrabold text-white shadow-lg hover:bg-[#0d6fd8]">{offerteOpMaat ? "Offerte aanvragen →" : "Verder →"}</button>
          </div>
        </div>
      </section>
    </main>
  );
}
