"use client";

import { useEffect, useState } from "react";

type Keuze = {
  id: string;
  titel: string;
  tekst: string;
  afbeelding: string;
  woningtype: string;
  type: string;
  telescoop: boolean;
};

const keuzes: Keuze[] = [
  {
    id: "woning",
    titel: "Woning",
    tekst: "Rijtjeshuis, twee-onder-een-kap, vrijstaande woning of villa",
    afbeelding: "https://littwin-offingen.de/produkte/fenster/img/internorm-kunststoff-alu-fenster-lg.jpg",
    woningtype: "",
    type: "buiten",
    telescoop: false,
  },
  {
    id: "appartement",
    titel: "Appartement / flat",
    tekst: "Ideaal voor appartementen",
    afbeelding: "https://www.marsh.com/content/dam/marsh/Imagery/marsh-2/thumbnail-768x768/modern-apartment-building-in-urban-setting-768x768.jpeg",
    woningtype: "appartement",
    type: "buiten",
    telescoop: false,
  },
  {
    id: "bedrijf",
    titel: "Winkel / bedrijfspand",
    tekst: "Voor zakelijke panden",
    afbeelding: "https://isoflex.co.in/Images/commercial.jpg",
    woningtype: "bedrijfspand",
    type: "bedrijf",
    telescoop: false,
  },
  {
    id: "hoog",
    titel: "Gevel / hoog glas",
    tekst: "Telewash met telescoopsteel",
    afbeelding: "https://egel.fi/assets/img/team/ikkunoidenpesu.jpg",
    woningtype: "tussenwoning",
    type: "telewash",
    telescoop: true,
  },
];

export default function GlazenwassenPage() {
  const [gekozen, setGekozen] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");

    if (type === "woning") {
      localStorage.setItem(
        "shinegoGlazenwassen",
        JSON.stringify({
          woningtype: "",
          verdiepingen: ["1"],
          ramen: 0,
          glasOppervlak: "",
          telescoop: false,
          type: "buiten",
          frequentie: "eenmalig",
        })
      );
      window.location.replace("/boeken/glazenwassen/details");
      return;
    }

    if (type === "appartement") {
      localStorage.setItem(
        "shinegoGlazenwassen",
        JSON.stringify({
          woningtype: "appartement",
          verdiepingen: [],
          ramen: 0,
          glasOppervlak: "",
          telescoop: false,
          type: "buiten",
          frequentie: "eenmalig",
        })
      );
      window.location.replace("/boeken/glazenwassen/details");
      return;
    }

    if (type === "bedrijf") {
      localStorage.setItem(
        "shinegoGlazenwassen",
        JSON.stringify({
          woningtype: "bedrijfspand",
          verdiepingen: ["1"],
          ramen: 0,
          glasOppervlak: "",
          telescoop: false,
          type: "bedrijf",
          frequentie: "eenmalig",
        })
      );
      window.location.replace("/boeken/glazenwassen/details");
      return;
    }

    if (type === "telewash") {
      localStorage.setItem(
        "shinegoGlazenwassen",
        JSON.stringify({
          woningtype: "tussenwoning",
          verdiepingen: ["1"],
          ramen: 0,
          glasOppervlak: "",
          telescoop: true,
          type: "telewash",
          frequentie: "eenmalig",
        })
      );
      window.location.replace("/boeken/glazenwassen/details");
    }
  }, []);

  function kies(optie: Keuze) {
    setGekozen(optie.id);
    localStorage.setItem(
      "shinegoGlazenwassen",
      JSON.stringify({
        woningtype: optie.woningtype,
        verdiepingen: optie.woningtype === "appartement" ? [] : ["1"],
        ramen: 0,
        glasOppervlak: "",
        telescoop: optie.telescoop,
        type: optie.type,
        frequentie: "eenmalig",
      })
    );
    window.location.href = "/boeken/glazenwassen/details";
  }

  const stappen = ["Keuze", "Details", "Prijs", "Gegevens", "Bevestigen"];

  return (
    <main className="min-h-screen bg-[#fbfdff] text-[#16355f]">
      <div className="mx-auto max-w-5xl px-5 py-7 sm:px-8 sm:py-10">
        <header className="flex items-center justify-between">
          <a href="/" className="text-[28px] font-extrabold tracking-tight text-[#123c70]">
            Shine<span className="text-[#4d7ef0]">Go</span><span className="ml-1 text-[#6e96f5]">✦</span>
          </a>
          <a href="/" aria-label="Menu" className="flex h-10 w-10 items-center justify-center rounded-xl text-2xl text-[#6b83a2] hover:bg-[#f0f5ff]">≡</a>
        </header>

        <div className="mt-4 grid grid-cols-5 gap-1">
          {stappen.map((stap, index) => {
            const actief = index === 0;
            return (
              <div key={stap} className="text-center">
                <div className="flex items-center">
                  <span className={`h-px flex-1 ${index === 0 ? "bg-transparent" : "bg-[#e2eaf6]"}`} />
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${actief ? "bg-[#4f78e8] text-white" : "text-[#7690ad]"}`}>{index + 1}</span>
                  <span className={`h-px flex-1 ${index === 4 ? "bg-transparent" : "bg-[#e2eaf6]"}`} />
                </div>
                <div className={`mt-1 text-[10px] sm:text-xs ${actief ? "font-bold text-[#4f78e8]" : "text-[#7c91aa]"}`}>{stap}</div>
              </div>
            );
          })}
        </div>

        <section className="relative mt-7 overflow-hidden rounded-[30px] bg-white px-5 py-7 shadow-[0_18px_60px_rgba(45,77,120,0.10)] sm:px-9 sm:py-9">
          <div className="relative max-w-3xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#18375f] sm:text-4xl">Kies je glasbewassing</h1>
            <p className="mt-2 text-sm text-[#778ba4] sm:text-base">Wat kunnen we voor je doen?</p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {keuzes.map((optie) => (
                <button
                  key={optie.id}
                  type="button"
                  onClick={() => kies(optie)}
                  className={`group overflow-hidden rounded-2xl border text-left transition ${gekozen === optie.id ? "border-[#6287ef] bg-[#f3f7ff] shadow-md" : "border-[#dbe5f2] bg-white hover:-translate-y-0.5 hover:border-[#9bb6f6] hover:shadow-md"}`}
                >
                  <div className="h-36 overflow-hidden bg-[#edf5fc]">
                    <img src={optie.afbeelding} alt={optie.titel} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
                  </div>
                  <div className="flex min-h-[105px] items-center gap-3 p-5">
                    <div className="min-w-0">
                      <div className="text-lg font-extrabold text-[#1c3d69]">{optie.titel}</div>
                      <div className="mt-1 text-sm leading-5 text-[#7a8da5]">{optie.tekst}</div>
                    </div>
                    <span className="ml-auto text-xl text-[#708bc2] transition group-hover:translate-x-1">›</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-4 border-t border-[#edf2f8] pt-7 sm:grid-cols-3">
              <div className="flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef5ff] text-xl">🛡️</span><div><strong className="block text-sm text-[#29496f]">Vaste prijzen</strong><span className="text-xs text-[#8293a8]">Geen verrassingen</span></div></div>
              <div className="flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0fbf3] text-xl">🍃</span><div><strong className="block text-sm text-[#29496f]">Betrouwbare professionals</strong><span className="text-xs text-[#8293a8]">Geverifieerd door ShineGo</span></div></div>
              <div className="flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4f6ff] text-xl">☆</span><div><strong className="block text-sm text-[#29496f]">Snel een afspraak</strong><span className="text-xs text-[#8293a8]">Wanneer het jou uitkomt</span></div></div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
