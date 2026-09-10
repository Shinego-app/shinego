"use client";

import { useEffect, useState } from "react";

type Keuze = { id: string; titel: string; tekst: string; woningtype: string; type: string; telescoop: boolean; afbeelding: string };

const keuzes: Keuze[] = [
  { id: "woning", titel: "Woning", tekst: "Twee-onder-een-kap, rijtjeshuis, vrijstaande woning of villa", woningtype: "", type: "buiten", telescoop: false, afbeelding: "/booking/woning.svg" },
  { id: "appartement", titel: "Appartement / flat", tekst: "Ideaal voor appartementen", woningtype: "appartement", type: "buiten", telescoop: false, afbeelding: "/booking/appartement.svg" },
  { id: "bedrijf", titel: "Winkel / bedrijfspand", tekst: "Voor zakelijke panden", woningtype: "bedrijfspand", type: "bedrijf", telescoop: false, afbeelding: "/booking/bedrijf.svg" },
  { id: "hoog", titel: "Gevel / hoog glas", tekst: "Met telescoopsteel", woningtype: "tussenwoning", type: "telewash", telescoop: true, afbeelding: "/booking/hoog.svg" },
];

export default function GlazenwassenPage() {
  const [gekozen, setGekozen] = useState("");

  useEffect(() => {
    const type = new URLSearchParams(window.location.search).get("type");
    const optie = keuzes.find((k) => k.id === type || (type === "telewash" && k.id === "hoog"));
    if (!optie) return;
    localStorage.setItem("shinegoGlazenwassen", JSON.stringify({
      woningtype: optie.woningtype,
      verdiepingen: optie.woningtype === "appartement" ? [] : ["1"],
      ramen: 0,
      glasOppervlak: "",
      telescoop: optie.telescoop,
      type: optie.type,
      frequentie: "eenmalig",
    }));
    window.location.replace("/boeken/glazenwassen/details");
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
    <main className="min-h-screen bg-[linear-gradient(180deg,#eaf7ff_0%,#f8fcff_50%,#e8f6ff_100%)] text-[#103d73]">
      <div className="mx-auto w-full max-w-[390px] px-4 pb-7 pt-2 sm:max-w-[390px]">
        <header className="flex items-center justify-between">
          <a href="/" className="text-[25px] font-extrabold tracking-[-.045em] text-[#0b3d74]">Shine<span className="text-[#1687f7]">Go</span><span className="ml-[2px] align-top text-[14px] text-[#1687f7]">✦</span></a>
          <span className="text-[22px] font-bold text-[#1687f7]">≡</span>
        </header>

        <div className="mt-1 grid grid-cols-5">
          {stappen.map((stap, index) => (
            <div key={stap} className="text-center">
              <div className="flex items-center">
                <span className={`h-px flex-1 ${index === 0 ? "bg-transparent" : "bg-[#bad9ee]"}`} />
                <span className={`flex h-5 w-5 items-center justify-center rounded-full border text-[8px] font-bold ${index === 0 ? "border-[#1687f7] bg-[#1687f7] text-white" : "border-[#a9cee8] bg-[#edf8ff] text-[#5f7f9a]"}`}>{index + 1}</span>
                <span className={`h-px flex-1 ${index === 4 ? "bg-transparent" : "bg-[#bad9ee]"}`} />
              </div>
              <div className={`mt-[3px] text-[7px] ${index === 0 ? "font-bold text-[#1687f7]" : "text-[#6786a0]"}`}>{stap}</div>
            </div>
          ))}
        </div>

        <section className="mt-2">
          <h1 className="text-[24px] font-extrabold leading-none tracking-[-.045em] text-[#0c3c72]">Kies je glasbewassing</h1>
          <p className="mt-1 text-[11px] font-medium text-[#557995]">Wat kunnen we voor je doen?</p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {keuzes.map((optie) => (
              <button key={optie.id} type="button" onClick={() => kies(optie)} className={`min-h-[74px] rounded-[12px] border bg-white/95 px-2 py-2 text-left shadow-[0_5px_14px_rgba(44,95,135,.08)] transition ${gekozen === optie.id ? "border-[#1687f7]" : "border-[#cfe3f2]"}`}>
                <div className="flex h-full items-center gap-2">
                  <img src={optie.afbeelding} alt="" className="h-[54px] w-[54px] shrink-0 rounded-[9px] object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-extrabold leading-[1.15] text-[#123f74]">{optie.titel}</div>
                    <div className="mt-1 text-[7.5px] leading-[1.35] text-[#6887a0]">{optie.tekst}</div>
                  </div>
                  <span className="text-[20px] font-light text-[#1687f7]">›</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[#d6e8f4] pt-4">
            <div className="flex gap-2"><span className="text-[20px]">🛡️</span><div><div className="text-[9px] font-extrabold">Vaste prijzen</div><div className="mt-[2px] text-[7px] leading-tight text-[#6c89a0]">Geen verrassingen</div></div></div>
            <div className="flex gap-2"><span className="text-[20px]">🌿</span><div><div className="text-[9px] font-extrabold">Betrouwbare professionals</div><div className="mt-[2px] text-[7px] leading-tight text-[#6c89a0]">Geverifieerd door ShineGo</div></div></div>
            <div className="flex gap-2"><span className="text-[20px]">☆</span><div><div className="text-[9px] font-extrabold">Snel een afspraak</div><div className="mt-[2px] text-[7px] leading-tight text-[#6c89a0]">Wanneer het jou uitkomt</div></div></div>
          </div>
        </section>
      </div>
    </main>
  );
}
