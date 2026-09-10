"use client";

import { useEffect, useState } from "react";

type Keuze = {
  id: string;
  titel: string;
  tekst: string;
  woningtype: string;
  type: string;
  telescoop: boolean;
};

const keuzes: Keuze[] = [
  { id: "woning", titel: "Woning", tekst: "Twee-onder-een-kap, rijtjeshuis, vrijstaande woning of villa", woningtype: "", type: "buiten", telescoop: false },
  { id: "appartement", titel: "Appartement / flat", tekst: "Ideaal voor appartementen", woningtype: "appartement", type: "buiten", telescoop: false },
  { id: "bedrijf", titel: "Winkel / bedrijfspand", tekst: "Voor zakelijke panden", woningtype: "bedrijfspand", type: "bedrijf", telescoop: false },
  { id: "hoog", titel: "Gevel / hoog glas", tekst: "Met telescoopsteel", woningtype: "tussenwoning", type: "telewash", telescoop: true },
];

function KeuzeIllustratie({ id }: { id: string }) {
  if (id === "woning") {
    return (
      <div className="relative h-[74px] w-[88px] overflow-hidden rounded-xl bg-gradient-to-b from-[#dff3ff] to-[#f9fdff]">
        <div className="absolute bottom-2 left-3 h-10 w-14 rounded-sm bg-white shadow-sm" />
        <div className="absolute bottom-[42px] left-2 h-0 w-0 border-x-[31px] border-b-[24px] border-x-transparent border-b-[#4a95d8]" />
        <div className="absolute bottom-3 left-7 h-5 w-3 rounded-t-sm bg-[#8ac8f0]" />
        <div className="absolute bottom-5 left-4 h-3 w-3 bg-[#9ed3f4]" />
        <div className="absolute bottom-5 right-4 h-3 w-3 bg-[#9ed3f4]" />
        <div className="absolute bottom-1 right-1 h-4 w-8 rounded-full bg-[#83c987]" />
      </div>
    );
  }

  if (id === "appartement") {
    return (
      <div className="relative h-[74px] w-[88px] overflow-hidden rounded-xl bg-gradient-to-b from-[#dff3ff] to-[#f9fdff]">
        <div className="absolute bottom-2 left-6 h-14 w-10 rounded-t-sm bg-white shadow-sm" />
        {[0,1,2].map((r) => [0,1].map((c) => <span key={`${r}-${c}`} className="absolute h-3 w-3 rounded-sm bg-[#80c4ee]" style={{ left: 31 + c * 17, top: 13 + r * 16 }} />))}
        <div className="absolute bottom-2 left-5 h-2 w-12 rounded-full bg-[#7dc789]" />
      </div>
    );
  }

  if (id === "bedrijf") {
    return (
      <div className="relative h-[74px] w-[88px] overflow-hidden rounded-xl bg-gradient-to-b from-[#dff3ff] to-[#f9fdff]">
        <div className="absolute bottom-2 left-3 h-11 w-16 rounded-sm bg-[#2f82c4] shadow-sm" />
        <div className="absolute bottom-[43px] left-2 h-0 w-0 border-x-[34px] border-b-[18px] border-x-transparent border-b-[#246fae]" />
        <div className="absolute bottom-3 left-7 h-8 w-7 bg-[#b9e2fb]" />
        <div className="absolute bottom-3 left-4 h-5 w-8 bg-[#8fcbed]" />
        <div className="absolute bottom-1 right-1 h-4 w-7 rounded-full bg-[#80c98c]" />
      </div>
    );
  }

  return (
    <div className="relative h-[74px] w-[88px] overflow-hidden rounded-xl bg-gradient-to-b from-[#dff3ff] to-[#f9fdff]">
      <div className="absolute bottom-2 left-5 h-14 w-12 rounded-sm bg-[#55a6dc] shadow-sm" />
      <div className="absolute bottom-2 left-[29px] h-14 w-[2px] bg-white/80" />
      <div className="absolute bottom-2 left-[43px] h-14 w-[2px] bg-white/80" />
      <div className="absolute bottom-2 left-[57px] h-14 w-[2px] bg-white/80" />
      <div className="absolute bottom-[30px] left-2 h-[3px] w-[66px] -rotate-[64deg] rounded-full bg-[#234f79]" />
      <div className="absolute bottom-[51px] right-2 h-3 w-4 -rotate-[18deg] rounded-sm bg-[#234f79]" />
    </div>
  );
}

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
    <main className="min-h-screen bg-[linear-gradient(180deg,#dff1ff_0%,#f8fcff_72%,#eaf6ff_100%)] text-[#123c70]">
      <div className="mx-auto max-w-[760px] px-4 py-4 sm:px-6 sm:py-6">
        <header className="flex items-center justify-between">
          <a href="/" className="text-[29px] font-extrabold tracking-[-.035em] text-[#0d3f79]">Shine<span className="text-[#1683f8]">Go</span><span className="ml-1 text-[#1683f8]">✦</span></a>
          <a href="/" aria-label="Menu" className="text-2xl font-bold text-[#1683f8]">≡</a>
        </header>

        <div className="mt-2 grid grid-cols-5 gap-1">
          {stappen.map((stap, index) => (
            <div key={stap} className="text-center">
              <div className="flex items-center">
                <span className={`h-px flex-1 ${index === 0 ? "bg-transparent" : "bg-[#b7d7ee]"}`} />
                <span className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-extrabold ${index === 0 ? "border-[#1683f8] bg-[#1683f8] text-white" : "border-[#a7c9e4] bg-[#edf8ff] text-[#537595]"}`}>{index + 1}</span>
                <span className={`h-px flex-1 ${index === 4 ? "bg-transparent" : "bg-[#b7d7ee]"}`} />
              </div>
              <div className={`mt-1 text-[10px] ${index === 0 ? "font-bold text-[#1683f8]" : "text-[#537595]"}`}>{stap}</div>
            </div>
          ))}
        </div>

        <section className="mt-3 rounded-[26px] border border-[#cfe5f5] bg-white/88 px-4 py-5 shadow-[0_18px_55px_rgba(44,92,132,.12)] sm:px-5 sm:py-6">
          <h1 className="text-[31px] font-extrabold leading-tight tracking-[-.04em] text-[#0b3d75] sm:text-[36px]">Kies je glasbewassing</h1>
          <p className="mt-1 text-sm font-medium text-[#567997]">Wat kunnen we voor je doen?</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {keuzes.map((optie) => (
              <button key={optie.id} type="button" onClick={() => kies(optie)} className={`group rounded-2xl border p-3 text-left shadow-[0_6px_18px_rgba(53,105,148,.06)] transition ${gekozen === optie.id ? "border-[#1683f8] bg-[#f0f8ff]" : "border-[#cfe3f4] bg-white hover:border-[#76b9ed]"}`}>
                <div className="flex min-h-[105px] items-center gap-3">
                  <KeuzeIllustratie id={optie.id} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-extrabold leading-5 text-[#123c70] sm:text-base">{optie.titel}</div>
                    <div className="mt-1 text-[11px] leading-4 text-[#607f9b] sm:text-xs">{optie.tekst}</div>
                  </div>
                  <span className="text-2xl font-light text-[#1683f8] transition group-hover:translate-x-1">›</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-3 border-t border-[#dbeaf5] pt-4 sm:grid-cols-3">
            <div className="flex items-center gap-2"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8f5ff] text-lg">🛡️</span><div><strong className="block text-xs text-[#123c70]">Vaste prijzen</strong><span className="text-[10px] text-[#6685a1]">Geen verrassingen</span></div></div>
            <div className="flex items-center gap-2"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eafaf1] text-lg">🌿</span><div><strong className="block text-xs text-[#123c70]">Betrouwbare professionals</strong><span className="text-[10px] text-[#6685a1]">Geverifieerd door ShineGo</span></div></div>
            <div className="flex items-center gap-2"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf6ff] text-lg">☆</span><div><strong className="block text-xs text-[#123c70]">Snel een afspraak</strong><span className="text-[10px] text-[#6685a1]">Wanneer het jou uitkomt</span></div></div>
          </div>
        </section>
      </div>
    </main>
  );
}
