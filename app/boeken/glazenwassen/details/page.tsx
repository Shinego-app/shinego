"use client";

import { useEffect, useState } from "react";

type Gegevens = {
  woningtype: string;
  verdiepingen: string[];
  ramen: number;
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
      setGegevens(JSON.parse(opgeslagen));
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
      {/* HEADER */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="text-2xl font-bold text-blue-600">
            ShineGo
          </a>

          <a
            href="/boeken/glazenwassen"
            className="font-medium text-gray-600 hover:text-blue-600"
          >
            ← Terug
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-12">
        {/* VOORTGANG */}
        <div className="mb-10">
          <div className="mb-3 flex justify-between">
            <span className="text-sm font-semibold text-blue-600">
              Stap 3 van 4
            </span>

            <span className="text-sm text-gray-500">
              Details van de klus
            </span>
          </div>

          <div className="h-2 rounded-full bg-gray-200">
            <div className="h-2 w-3/4 rounded-full bg-blue-600" />
          </div>
        </div>

        {/* TITEL */}
        <div className="mb-10">
          <div className="mb-4 text-5xl">🪟</div>

          <h1 className="text-4xl font-bold text-gray-900">
            Nog een paar details
          </h1>

          <p className="mt-3 text-lg text-gray-600">
            Hiermee kunnen we de opdracht en prijs beter bepalen.
          </p>
        </div>

        {/* SAMENVATTING */}
        {gegevens && (
          <div className="mb-6 rounded-2xl bg-blue-50 p-6">
            <h2 className="font-bold text-blue-900">
              Jouw glazenwasopdracht
            </h2>

            <div className="mt-4 grid gap-3 text-sm text-blue-900 sm:grid-cols-3">
              <div>
                <p className="text-blue-700">Woningtype</p>
                <p className="font-bold">
                  {gegevens.woningtype}
                </p>
              </div>

              <div>
                <p className="text-blue-700">Verdiepingen</p>
                <p className="font-bold">
                  {gegevens.verdiepingen.join(",")}
                </p>
              </div>

              <div>
                <p className="text-blue-700">Aantal ramen</p>
                <p className="font-bold">
                  {gegevens.ramen}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* BEREIKBAARHEID */}
        <div className="rounded-3xl border border-gray-200 bg-white p-7">
          <h2 className="text-xl font-bold text-gray-900">
            1. Zijn alle ramen goed bereikbaar?
          </h2>

          <p className="mt-2 text-gray-500">
            Denk bijvoorbeeld aan ramen boven een aanbouw,
            serre of moeilijk bereikbare plek.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setBereikbaar("ja")}
              className={`rounded-2xl border-2 p-5 text-left transition ${
                bereikbaar === "ja"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="text-2xl">✓</div>

              <h3 className="mt-3 font-bold text-gray-900">
                Ja, goed bereikbaar
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                De ramen zijn normaal bereikbaar.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setBereikbaar("nee")}
              className={`rounded-2xl border-2 p-5 text-left transition ${
                bereikbaar === "nee"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="text-2xl">🪜</div>

              <h3 className="mt-3 font-bold text-gray-900">
                Moeilijk bereikbaar
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Voor sommige ramen is extra bereik nodig.
              </p>
            </button>
          </div>
        </div>

        {/* EXTRA VUIL */}
        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-7">
          <h2 className="text-xl font-bold text-gray-900">
            2. wil je de kozijnen ook laten scoonmaken?
          </h2>

          <p className="mt-2 text-gray-500">
            laat ook de kozijnen rondom de ramen schoonmaken
          
          </p>

          <label className="mt-6 flex cursor-pointer items-center justify-between rounded-2xl border-2 border-gray-200 p-5 hover:border-blue-300">
            <div>
              <p className="font-bold text-gray-900">
                kozijnen schoonmaken
              </p>

              <p className="mt-1 text-sm text-gray-500">
                laat ook kozijnen rondom de ramen schoonmaken.
              </p>
            </div>

            <input
              type="checkbox"
              checked={kozijnen}
              onChange={(e) => setkozijnen(e.target.checked)}
              className="h-6 w-6"
            />
          </label>
        </div>

        {/* OPMERKING */}
        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-7">
          <h2 className="text-xl font-bold text-gray-900">
            3. Wil je nog iets doorgeven?
          </h2>

          <p className="mt-2 text-gray-500">
            Dit is niet verplicht.
          </p>

          <textarea
            value={opmerking}
            onChange={(e) => setOpmerking(e.target.value)}
            placeholder="Bijvoorbeeld: achterzijde bereikbaar via de tuin..."
            rows={5}
            className="mt-5 w-full resize-none rounded-2xl border border-gray-300 p-4 text-gray-900 outline-none focus:border-blue-600"
          />
        </div>

        {/* ONDERKANT */}
        <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-8">
          <a
            href="/boeken/glazenwassen"
            className="font-semibold text-gray-600 hover:text-gray-900"
          >
            ← Vorige
          </a>

          <button
            type="button"
            disabled={!kanVerder}
            onClick={gaVerder}
            className={`rounded-xl px-10 py-4 text-lg font-bold transition ${
              kanVerder
                ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                : "cursor-not-allowed bg-gray-200 text-gray-400"
            }`}
          >
            Bekijk prijs →
          </button>
        </div>
      </section>
    </main>
  );
}