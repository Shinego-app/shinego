"use client";

import { useEffect, useState } from "react";

type Keuze = {
  id: string;
  titel: string;
  tekst: string;
  icoon: string;
  woningtype: string;
  type: string;
  telescoop: boolean;
};

const keuzes: Keuze[] = [
  { id: "woning", titel: "Woning", tekst: "Twee-onder-een-kap, rijtjeshuis, villa", icoon: "🏡", woningtype: "", type: "buiten", telescoop: false },
  { id: "appartement", titel: "Appartement / flat", tekst: "Ideaal voor appartementen", icoon: "🏢", woningtype: "appartement", type: "buiten", telescoop: false },
  { id: "bedrijf", titel: "Winkel / bedrijfspand", tekst: "Voor zakelijke panden", icoon: "🏬", woningtype: "bedrijfspand", type: "bedrijf", telescoop: false },
  { id: "hoog", titel: "Gevel / hoog glas", tekst: "Met telescoopsteel", icoon: "🏙️", woningtype: "tussenwoning", type: "telewash", telescoop: true },
];

export default function GlazenwassenPage() {
  const [gekozen, setGekozen] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");

    if (type === "woning") {
      localStorage.setItem("shinegoGlazenwassen", JSON.stringify({ woningtype: "", verdiepingen: ["1"], ramen: 0, glasOppervlak: "", telescoop: false, type: "buiten", frequentie: "eenmalig" }));
      window.location.replace("/boeken/glazenwassen/details");
      return;
    }
    if (type === "appartement") {
      localStorage.setItem("shinegoGlazenwassen", JSON.stringify({ woningtype: "appartement", verdiepingen: [], ramen: 0, glasOppervlak: "", telescoop: false, type: "buiten", frequentie: "eenmalig" }));
      window.location.replace("/boeken/glazenwassen/details");
      return;
    }
    if (type === "bedrijf") {
      localStorage.setItem("shinegoGlazenwassen", JSON.stringify({ woningtype: "bedrijfspand", verdiepingen: ["1"], ramen: 0, glasOppervlak: "", telescoop: false, type: "bedrijf", frequentie: "eenmalig" }));
      window.location.replace("/boeken/glazenwassen/details");
      return;
    }
    if (type === "telewash") {
      localStorage.setItem("shinegoGlazenwassen", JSON.stringify({ woningtype: "tussenwoning", verdiepingen: ["1"], ramen: 0, glasOppervlak: "", telescoop: true, type: "telewash", frequentie: "eenmalig" }));
      window.location.replace("/boeken/glazenwassen/details");
    }
  }, []);

  function kies(optie: Keuze) {
    setGekozen(optie.id);
    localStorage.setItem("shinegoGlazenwassen", JSON.stringify({
      woningtype: optie.woningtype,
      verdiepingen: optie.woningtype === "appartement" ? [] : ["1"],
      ramen: 0,
      glasOppervlak: "",
      telescoop: optie.telescoop,
      type: optie.type,
      frequentie: "eenmalig",
    }));
    window.location.href = "/boeken/glazenwassen/details";
  }

  const stappen = ["Keuze", "Details", "Prijs", "Gegevens", "Bevestigen"];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#eaf6ff] to-[#f8fcff] text-[#123c70]">
      <div className="mx-auto max-w-5xl px-5 py-5 sm:px-8 sm:py-7">
        <header className="flex items-center justify-between">
          <a href="/" className="text-[29px] font-extrabold tracking-tight text-[#0d3f79]">Shine<span className="text-[#1683f8]">Go</span><span className="ml-1 text-[#1683f8]">✦</span></a>
          <a href="/" aria-label="Menu" className="flex h-9 w-9 items-center justify-center text-2xl font-bold text-[#1683f8]">≡</a>
        </header>

        <div className="mx-auto mt-3 grid max-w-3xl grid-cols-5 gap-1">
          {stappen.map((stap, index) => (
            <div key={stap} className="text-center">
              <div className="flex items-center">
                <span className={`h-px flex-1 ${index === 0 ? "bg-transparent" : "bg-[#b9d8f4]"}`} />
                <span className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-extrabold ${index === 0 ? "border-[#1683f8] bg-[#1683f8] text-white" : "border-[#a9cbea] bg-[#eef8ff] text-[#4b7197]"}`}>{index + 1}</span>
                <span className={`h-px flex-1 ${index === 4 ? "bg-transparent" : "bg-[#b9d8f4]"}`} />
              </div>
              <div className={`mt-1 text-[10px] sm:text-xs ${index === 0 ? "font-bold text-[#1683f8]" : "text-[#52779b]"}`}>{stap}</div>
            </div>
          ))}
        </div>

        <section className="relative mx-auto mt-5 overflow-hidden rounded-[28px] border border-[#d5e9f8] bg-white/85 px-5 py-6 shadow-[0_18px_55px_rgba(40,93,140,.12)] sm:px-7 sm:py-7">
          <div className="pointer-events-none absolute right-0 top-0 hidden h-40 w-56 bg-gradient-to-bl from-[#ccecff] via-[#e8f7ff] to-transparent sm:block" />
          <div className="relative">
            <h1 className="text-[32px] font-extrabold leading-tight tracking-[-.035em] text-[#0b3d75] sm:text-[38px]">Kies je glasbewassing</h1>
            <p className="mt-1 text-sm font-medium text-[#537797] sm:text-base">Wat kunnen we voor je doen?</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {keuzes.map((optie) => (
                <button key={optie.id} type="button" onClick={() => kies(optie)} className={`group min-h-[126px] rounded-2xl border p-4 text-left shadow-[0_6px_18px_rgba(53,105,148,.07)] transition ${gekozen === optie.id ? "border-[#1683f8] bg-[#f0f8ff]" : "border-[#cfe3f4] bg-white hover:border-[#78b9ee]"}`}>
                  <div className="flex h-full items-center gap-4">
                    <span className="flex h-[72px] w-[86px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#dff3ff] to-[#f5fbff] text-[46px] shadow-inner">{optie.icoon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-base font-extrabold leading-5 text-[#123c70] sm:text-lg">{optie.titel}</div>
                      <div className="mt-1 text-xs leading-5 text-[#5f7e9c] sm:text-sm">{optie.tekst}</div>
                    </div>
                    <span className="text-2xl font-light text-[#1683f8] transition group-hover:translate-x-1">›</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-3 border-t border-[#dcecf8] pt-5 sm:grid-cols-3">
              <div className="flex items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e8f5ff] text-xl">🛡️</span><div><strong className="block text-sm text-[#123c70]">Vaste prijzen</strong><span className="text-xs text-[#6685a1]">Geen verrassingen</span></div></div>
              <div className="flex items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eafaf1] text-xl">🌿</span><div><strong className="block text-sm text-[#123c70]">Betrouwbare professionals</strong><span className="text-xs text-[#6685a1]">Geverifieerd door ShineGo</span></div></div>
              <div className="flex items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#edf6ff] text-xl">☆</span><div><strong className="block text-sm text-[#123c70]">Snel een afspraak</strong><span className="text-xs text-[#6685a1]">Wanneer het jou uitkomt</span></div></div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
