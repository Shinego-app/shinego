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
  {
    id: "woning",
    titel: "Woning",
    tekst: "Twee-onder-een-kap, rijtjeshuis, vrijstaande woning of villa",
    woningtype: "",
    type: "buiten",
    telescoop: false,
  },
  {
    id: "appartement",
    titel: "Appartement / flat",
    tekst: "Ideaal voor appartementen",
    woningtype: "appartement",
    type: "buiten",
    telescoop: false,
  },
  {
    id: "bedrijf",
    titel: "Winkel / bedrijfspand",
    tekst: "Voor zakelijke panden",
    woningtype: "bedrijfspand",
    type: "bedrijf",
    telescoop: false,
  },
  {
    id: "hoog",
    titel: "Gevel / hoog glas",
    tekst: "Met telescoopsteel",
    woningtype: "tussenwoning",
    type: "telewash",
    telescoop: true,
  },
];

function KeuzeIllustratie({ id }: { id: string }) {
  if (id === "woning") {
    return (
      <div className="relative h-[74px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-[linear-gradient(180deg,#e8f7ff_0%,#ffffff_100%)]">
        <div className="absolute bottom-[8px] left-[15px] h-[35px] w-[54px] rounded-[3px] bg-white shadow-[0_2px_5px_rgba(37,96,135,.14)]" />
        <div className="absolute bottom-[41px] left-[10px] h-0 w-0 border-x-[30px] border-b-[22px] border-x-transparent border-b-[#3f92d7]" />
        <div className="absolute bottom-[10px] left-[35px] h-[21px] w-[11px] rounded-t-[2px] bg-[#93cdf1]" />
        <div className="absolute bottom-[21px] left-[22px] h-[11px] w-[11px] bg-[#a8daf6]" />
        <div className="absolute bottom-[21px] right-[20px] h-[11px] w-[11px] bg-[#a8daf6]" />
        <div className="absolute bottom-[4px] left-[5px] h-[10px] w-[24px] rounded-full bg-[#8fd28b]" />
        <div className="absolute bottom-[4px] right-[3px] h-[12px] w-[25px] rounded-full bg-[#7bc77a]" />
      </div>
    );
  }

  if (id === "appartement") {
    return (
      <div className="relative h-[74px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-[linear-gradient(180deg,#e8f7ff_0%,#ffffff_100%)]">
        <div className="absolute bottom-[7px] left-[27px] h-[57px] w-[34px] rounded-t-[4px] bg-white shadow-[0_2px_5px_rgba(37,96,135,.14)]" />
        {[0, 1, 2].map((row) =>
          [0, 1].map((col) => (
            <span
              key={`${row}-${col}`}
              className="absolute h-[11px] w-[9px] rounded-[1px] bg-[#7fc3ef]"
              style={{ left: 32 + col * 16, top: 13 + row * 15 }}
            />
          )),
        )}
        <div className="absolute bottom-[7px] left-[38px] h-[15px] w-[10px] bg-[#69b5e7]" />
        <div className="absolute bottom-[3px] left-[15px] h-[10px] w-[21px] rounded-full bg-[#8bd18c]" />
        <div className="absolute bottom-[3px] right-[10px] h-[10px] w-[20px] rounded-full bg-[#7dc57b]" />
      </div>
    );
  }

  if (id === "bedrijf") {
    return (
      <div className="relative h-[74px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-[linear-gradient(180deg,#e8f7ff_0%,#ffffff_100%)]">
        <div className="absolute bottom-[8px] left-[13px] h-[39px] w-[60px] rounded-[3px] bg-[#2f83c5] shadow-[0_2px_5px_rgba(37,96,135,.14)]" />
        <div className="absolute bottom-[45px] left-[9px] h-0 w-0 border-x-[34px] border-b-[17px] border-x-transparent border-b-[#226ca7]" />
        <div className="absolute bottom-[10px] left-[20px] h-[20px] w-[15px] bg-[#a7d8f5]" />
        <div className="absolute bottom-[10px] left-[41px] h-[27px] w-[22px] bg-[#c6e9fa]" />
        <div className="absolute bottom-[3px] left-[5px] h-[10px] w-[24px] rounded-full bg-[#84ca82]" />
        <div className="absolute bottom-[3px] right-[2px] h-[11px] w-[24px] rounded-full bg-[#7fc67d]" />
      </div>
    );
  }

  return (
    <div className="relative h-[74px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-[linear-gradient(180deg,#e8f7ff_0%,#ffffff_100%)]">
      <div className="absolute bottom-[7px] left-[26px] h-[58px] w-[38px] rounded-[3px] bg-[linear-gradient(90deg,#4aa7df_0%,#7fd1f1_100%)] shadow-[0_2px_5px_rgba(37,96,135,.14)]" />
      <div className="absolute bottom-[7px] left-[37px] h-[58px] w-[2px] bg-white/80" />
      <div className="absolute bottom-[7px] left-[49px] h-[58px] w-[2px] bg-white/80" />
      <div className="absolute bottom-[7px] left-[60px] h-[58px] w-[2px] bg-white/80" />
      <div className="absolute bottom-[30px] left-[7px] h-[3px] w-[64px] -rotate-[64deg] rounded-full bg-[#28577e]" />
      <div className="absolute right-[5px] top-[13px] h-[12px] w-[17px] -rotate-[18deg] rounded-[2px] bg-[#28577e]" />
    </div>
  );
}

function TrustIcon({ type }: { type: "shield" | "leaf" | "star" }) {
  if (type === "shield") {
    return (
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <path d="M16 3.7 26 7v7.2c0 6.6-4.1 11.8-10 14.1C10.1 26 6 20.8 6 14.2V7l10-3.3Z" fill="#e9f6ff" stroke="#1887ee" strokeWidth="2" />
        <path d="m11.4 15.8 3 3 6.4-7" fill="none" stroke="#1887ee" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "leaf") {
    return (
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <path d="M25.8 5.8C16.8 5.8 8.2 9.4 7.6 18c-.3 4.6 3 7.9 7 7.9 7.9 0 10.8-8.4 11.2-20.1Z" fill="#ebfaf1" stroke="#18a45c" strokeWidth="2" />
        <path d="M7 27c4.6-7.3 9-10.8 15-14" fill="none" stroke="#18a45c" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
      <path d="m16 4.5 3.4 6.9 7.6 1.1-5.5 5.4 1.3 7.6-6.8-3.6-6.8 3.6 1.3-7.6L5 12.5l7.6-1.1L16 4.5Z" fill="#edf7ff" stroke="#1887ee" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

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
        }),
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
        }),
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
        }),
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
        }),
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
      }),
    );
    window.location.href = "/boeken/glazenwassen/details";
  }

  const stappen = ["Keuze", "Details", "Prijs", "Gegevens", "Bevestigen"];

  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#e4f4ff_0%,#f6fbff_58%,#eaf7ff_100%)] text-[#123c70]">
      <div className="relative mx-auto min-h-screen w-full max-w-[760px] px-4 pb-7 pt-3 sm:px-6 sm:pb-10 sm:pt-5">
        <div className="pointer-events-none absolute -right-24 top-10 h-56 w-56 rounded-full bg-white/45 blur-2xl" />
        <div className="pointer-events-none absolute -left-24 bottom-6 h-48 w-48 rounded-full bg-[#cceeff]/35 blur-2xl" />

        <header className="relative z-10 flex items-center justify-between">
          <a href="/" className="text-[27px] font-extrabold tracking-[-.04em] text-[#0c3e78] sm:text-[30px]">
            Shine<span className="text-[#1687f7]">Go</span><span className="ml-[2px] align-top text-[16px] text-[#1687f7]">✦</span>
          </a>
          <a href="/" aria-label="Menu" className="flex h-9 w-9 items-center justify-center rounded-full text-[24px] font-bold leading-none text-[#1787ee]">≡</a>
        </header>

        <div className="relative z-10 mt-1 grid grid-cols-5 gap-0">
          {stappen.map((stap, index) => (
            <div key={stap} className="text-center">
              <div className="flex items-center">
                <span className={`h-px flex-1 ${index === 0 ? "bg-transparent" : "bg-[#b6d9f1]"}`} />
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-extrabold sm:h-8 sm:w-8 sm:text-[11px] ${
                    index === 0
                      ? "border-[#1687f7] bg-[#1687f7] text-white shadow-[0_3px_9px_rgba(22,135,247,.25)]"
                      : "border-[#a9cee8] bg-[#eff8ff] text-[#557b9c]"
                  }`}
                >
                  {index + 1}
                </span>
                <span className={`h-px flex-1 ${index === 4 ? "bg-transparent" : "bg-[#b6d9f1]"}`} />
              </div>
              <div className={`mt-1 text-[9px] sm:text-[10px] ${index === 0 ? "font-bold text-[#1687f7]" : "font-medium text-[#617f99]"}`}>
                {stap}
              </div>
            </div>
          ))}
        </div>

        <section className="relative z-10 mt-3">
          <h1 className="text-[29px] font-extrabold leading-[1.05] tracking-[-.045em] text-[#0b3d75] sm:text-[34px]">Kies je glasbewassing</h1>
          <p className="mt-1 text-[13px] font-medium text-[#587b98] sm:text-sm">Wat kunnen we voor je doen?</p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {keuzes.map((optie) => (
              <button
                key={optie.id}
                type="button"
                onClick={() => kies(optie)}
                className={`group w-full rounded-[17px] border bg-white/95 px-3 py-2.5 text-left shadow-[0_7px_18px_rgba(47,103,145,.08)] transition active:scale-[.99] ${
                  gekozen === optie.id
                    ? "border-[#1687f7] ring-2 ring-[#1687f7]/10"
                    : "border-[#c8e1f2] hover:border-[#67b4ec]"
                }`}
              >
                <div className="flex min-h-[91px] items-center gap-3">
                  <KeuzeIllustratie id={optie.id} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-extrabold leading-[1.15] text-[#123d72] sm:text-[15px]">{optie.titel}</div>
                    <div className="mt-1.5 max-w-[185px] text-[10px] font-medium leading-[1.35] text-[#607f9b] sm:text-[11px]">{optie.tekst}</div>
                  </div>
                  <span className="pr-1 text-[26px] font-light leading-none text-[#1687f7] transition group-hover:translate-x-0.5">›</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2.5 sm:gap-4">
            <div className="flex items-start gap-1.5 sm:gap-2">
              <TrustIcon type="shield" />
              <div className="pt-[2px]">
                <strong className="block text-[10px] font-extrabold leading-tight text-[#123d72] sm:text-xs">Vaste prijzen</strong>
                <span className="mt-1 block text-[8px] font-medium leading-[1.25] text-[#69869f] sm:text-[10px]">Geen verrassingen</span>
              </div>
            </div>

            <div className="flex items-start gap-1.5 sm:gap-2">
              <TrustIcon type="leaf" />
              <div className="pt-[2px]">
                <strong className="block text-[10px] font-extrabold leading-tight text-[#123d72] sm:text-xs">Betrouwbare professionals</strong>
                <span className="mt-1 block text-[8px] font-medium leading-[1.25] text-[#69869f] sm:text-[10px]">Geverifieerd door ShineGo</span>
              </div>
            </div>

            <div className="flex items-start gap-1.5 sm:gap-2">
              <TrustIcon type="star" />
              <div className="pt-[2px]">
                <strong className="block text-[10px] font-extrabold leading-tight text-[#123d72] sm:text-xs">Snel een afspraak</strong>
                <span className="mt-1 block text-[8px] font-medium leading-[1.25] text-[#69869f] sm:text-[10px]">Wanneer het jou uitkomt</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
