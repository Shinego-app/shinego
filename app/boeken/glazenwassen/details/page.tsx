"use client";

import { useEffect, useState } from "react";

type Gegevens = {
  woningtype: string;
  verdiepingen: string[];
  ramen: number;
  glasOppervlak: string;
  telescoop: boolean;
  type: string;
  frequentie: string;
};

export default function DetailsPage() {
  const [gegevens, setGegevens] = useState<Gegevens | null>(null);
  const [bereikbaar, setBereikbaar] = useState("");
  const [kozijnen, setkozijnen] = useState(false);
  const [opmerking, setOpmerking] = useState("");

  useEffect(() => {
    const opgeslagen = localStorage.getItem("shinegoGlazenwassen");

    if (opgeslagen) {
      const opgeslagenGegevens: Gegevens = JSON.parse(opgeslagen);

      if (
        opgeslagenGegevens.woningtype === "bedrijfspand" &&
        opgeslagenGegevens.glasOppervlak === "500+"
      ) {
        window.location.href = "/contact?offerte=500plus";
        return;
      }

      setGegevens(opgeslagenGegevens);
    }
  }, []);

  const kanVerder = bereikbaar !== "";

  function gaVerder() {
    if (!kanVerder) return;

    const details = {
      bereikbaar,
      kozijnen,
      opmerking,
    };

    localStorage.setItem(
      "shinegoGlazenwassenDetails",
      JSON.stringify(details)
    );

    window.location.href = "/boeken/glazenwassen/prijs";
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
          <a href="/" className="text-2xl font-bold text-blue-600">ShineGo</a>
          <a href="/boeken/glazenwassen" className="text-sm font-semibold text-gray-600 hover:text-blue-600 sm:text-base">← Terug</a>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-7 sm:mb-10">
          <div className="mb-3 flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-blue-600">Stap 3 van 4</span>
            <span className="text-right text-sm text-gray-500">Details van de klus</span>
          </div>
          <div className="h-2 rounded-full bg-gray-200"><div className="h-2 w-3/4 rounded-full bg-blue-600" /></div>
        </div>

        <div className="mb-7 sm:mb-10">
          <div className="mb-3 text-4xl sm:mb-4 sm:text-5xl">🪟</div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Nog een paar details</h1>
          <p className="mt-3 text-base leading-7 text-gray-600 sm:text-lg">Hiermee kunnen we de opdracht en prijs beter bepalen.</p>
        </div>

        {gegevens && (
          <div className="mb-5 rounded-2xl bg-blue-50 p-5 sm:mb-6 sm:p-6">
            <h2 className="font-bold text-blue-900">Jouw glazenwasopdracht</h2>
            <div className="mt-4 grid gap-3 text-sm text-blue-900 sm:grid-cols-3">
              <div><p className="text-blue-700">Woningtype</p><p className="font-bold">{gegevens.woningtype}</p></div>
              <div><p className="text-blue-700">Verdiepingen</p><p className="font-bold">{gegevens.verdiepingen.length ? gegevens.verdiepingen.join(", ") : "-"}</p></div>
              <div><p className="text-blue-700">Aantal ramen</p><p className="font-bold">{gegevens.ramen}</p></div>
            </div>
          </div>
        )}

        <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-7">
          <h2 className="text-xl font-bold text-gray-900">1. Zijn alle ramen goed bereikbaar?</h2>
          <p className="mt-2 leading-6 text-gray-500">Denk bijvoorbeeld aan ramen boven een aanbouw, serre of moeilijk bereikbare plek.</p>
          <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4">
            <button type="button" onClick={() => setBereikbaar("ja")} className={`rounded-2xl border-2 p-4 text-left transition sm:p-5 ${bereikbaar === "ja" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}>
              <div className="text-2xl">✓</div><h3 className="mt-2 font-bold text-gray-900 sm:mt-3">Ja, goed bereikbaar</h3><p className="mt-1 text-sm text-gray-500">De ramen zijn normaal bereikbaar.</p>
            </button>
            <button type="button" onClick={() => setBereikbaar("nee")} className={`rounded-2xl border-2 p-4 text-left transition sm:p-5 ${bereikbaar === "nee" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}>
              <div className="text-2xl">🪜</div><h3 className="mt-2 font-bold text-gray-900 sm:mt-3">Moeilijk bereikbaar</h3><p className="mt-1 text-sm text-gray-500">Voor sommige ramen is extra bereik nodig.</p>
            </button>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-gray-200 bg-white p-5 sm:mt-6 sm:p-7">
          <h2 className="text-xl font-bold text-gray-900">2. Wil je de kozijnen ook laten schoonmaken?</h2>
          <p className="mt-2 leading-6 text-gray-500">Laat ook de kozijnen rondom de ramen schoonmaken.</p>
          <label className="mt-5 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border-2 border-gray-200 p-4 hover:border-blue-300 sm:mt-6 sm:p-5">
            <div><p className="font-bold text-gray-900">Kozijnen schoonmaken</p><p className="mt-1 text-sm text-gray-500">Ook de kozijnen rondom de ramen meenemen.</p></div>
            <input type="checkbox" checked={kozijnen} onChange={(e) => setkozijnen(e.target.checked)} className="h-6 w-6 shrink-0" />
          </label>
        </div>

        <div className="mt-5 rounded-3xl border border-gray-200 bg-white p-5 sm:mt-6 sm:p-7">
          <h2 className="text-xl font-bold text-gray-900">3. Wil je nog iets doorgeven?</h2>
          <p className="mt-2 text-gray-500">Dit is niet verplicht.</p>
          <textarea value={opmerking} onChange={(e) => setOpmerking(e.target.value)} placeholder="Bijvoorbeeld: achterzijde bereikbaar via de tuin..." rows={4} className="mt-4 w-full resize-none rounded-2xl border border-gray-300 p-4 text-gray-900 outline-none focus:border-blue-600 sm:mt-5" />
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:pt-8">
          <a href="/boeken/glazenwassen" className="py-2 text-center font-semibold text-gray-600 hover:text-gray-900 sm:text-left">← Vorige</a>
          <button type="button" disabled={!kanVerder} onClick={gaVerder} className={`w-full rounded-xl px-6 py-4 text-base font-bold transition sm:w-auto sm:px-10 sm:text-lg ${kanVerder ? "bg-blue-600 text-white shadow-md hover:bg-blue-700" : "cursor-not-allowed bg-gray-200 text-gray-400"}`}>Bekijk prijs →</button>
        </div>
      </section>
    </main>
  );
}
