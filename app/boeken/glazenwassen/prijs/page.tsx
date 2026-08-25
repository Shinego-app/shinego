"use client";

import { useEffect, useMemo, useState } from "react";

type Gegevens = {
  woningtype: string;
  verdiepingen: string[];
  ramen: number;
  telescoop: boolean;
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
    const opgeslagenGegevens = localStorage.getItem(
      "shinegoGlazenwassen"
    );

    const opgeslagenDetails = localStorage.getItem(
      "shinegoGlazenwassenDetails"
    );

    if (opgeslagenGegevens) {
      setGegevens(JSON.parse(opgeslagenGegevens));
    }

    if (opgeslagenDetails) {
      setDetails(JSON.parse(opgeslagenDetails));
    }
  }, []);

  const prijs = useMemo(() => {
    if (!gegevens || !details) {
      return {
        basisprijs: 0,
        ramenPrijs: 0,
        verdiepingToeslag: 0,
        bereikToeslag: 0,
        kozijnenToeslag: 0,
        totaal: 0,
      };
    }

    const basisprijs = 20;

    const ramenPrijs = gegevens.ramen * 2;

    let verdiepingToeslag = 0;

    if (gegevens.verdiepingen.includes("2")) {
      verdiepingToeslag += 7.5;
    }

    if (gegevens.verdiepingen.includes("3")) {
      verdiepingToeslag += 15;
    }

    const bereikToeslag =
      details.bereikbaar === "nee" ? 12.5 : 0;

    const kozijnenToeslag =
      details.kozijnen ? 10 : 0;

    const totaal =
      basisprijs +
      ramenPrijs +
      verdiepingToeslag +
      bereikToeslag +
      kozijnenToeslag;

    return {
      basisprijs,
      ramenPrijs,
      verdiepingToeslag,
      bereikToeslag,
      kozijnenToeslag,
      totaal,
    };
  }, [gegevens, details]);

  function doorgaan() {
    localStorage.setItem(
      "shinegoPrijs",
      JSON.stringify(prijs)
    );

    window.location.href =
      "/boeken/glazenwassen/gegevens";
  }

  if (!gegevens || !details) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-2xl bg-white p-8 shadow">
          <p className="text-gray-600">
            Gegevens laden...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a
            href="/"
            className="text-2xl font-bold text-blue-600"
          >
            ShineGo
          </a>

          <a
            href="/boeken/glazenwassen/details"
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
              Stap 4 van 4
            </span>

            <span className="text-sm text-gray-500">
              Jouw prijs
            </span>
          </div>

          <div className="h-2 rounded-full bg-gray-200">
            <div className="h-2 w-full rounded-full bg-blue-600" />
          </div>
        </div>

        {/* TITEL */}
        <div className="mb-10 text-center">
          <div className="mb-4 text-5xl">
            ✨
          </div>

          <h1 className="text-4xl font-bold text-gray-900">
            Jouw ShineGo-prijs
          </h1>

          <p className="mt-3 text-lg text-gray-600">
            Op basis van de gegevens van jouw opdracht.
          </p>
        </div>

        {/* PRIJSKAART */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
          <div className="bg-blue-600 px-8 py-10 text-center text-white">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">
              Geschatte totaalprijs
            </p>

            <div className="mt-3 text-6xl font-bold">
              €{prijs.totaal.toFixed(2).replace(".", ",")}
            </div>

            <p className="mt-3 text-blue-100">
              Voor glazenwassen buitenzijde
            </p>
          </div>

          {/* PRIJSOPBOUW */}
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900">
              Prijsopbouw
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between border-b border-gray-100 pb-4">
                <span className="text-gray-600">
                  Basisprijs
                </span>

                <span className="font-semibold text-gray-900">
                  €{prijs.basisprijs.toFixed(2).replace(".", ",")}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-100 pb-4">
                <span className="text-gray-600">
                  {gegevens.ramen} ramen
                </span>

                <span className="font-semibold text-gray-900">
                  €{prijs.ramenPrijs.toFixed(2).replace(".", ",")}
                </span>
              </div>

              {prijs.verdiepingToeslag > 0 && (
                <div className="flex justify-between border-b border-gray-100 pb-4">
                  <span className="text-gray-600">
                    Toeslag hoogte
                  </span>

                  <span className="font-semibold text-gray-900">
                    €
                    {prijs.verdiepingToeslag
                      .toFixed(2)
                      .replace(".", ",")}
                  </span>
                </div>
              )}

              {prijs.bereikToeslag > 0 && (
                <div className="flex justify-between border-b border-gray-100 pb-4">
                  <span className="text-gray-600">
                    Moeilijk bereikbare ramen
                  </span>

                  <span className="font-semibold text-gray-900">
                    €
                    {prijs.bereikToeslag
                      .toFixed(2)
                      .replace(".", ",")}
                  </span>
                </div>
              )}

              {prijs.kozijnenToeslag > 0 && (
                <div className="flex justify-between border-b border-gray-100 pb-4">
                  <span className="text-gray-600">
                    kozijnen schoonmaken
                  </span>

                  <span className="font-semibold text-gray-900">
                    €
                    {prijs.kozijnenToeslag
                      .toFixed(2)
                      .replace(".", ",")}
                  </span>
                </div>
              )}

              <div className="flex justify-between pt-3 text-xl">
                <span className="font-bold text-gray-900">
                  Totaal
                </span>

                <span className="font-bold text-blue-600">
                  €{prijs.totaal.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* OPDRACHT */}
        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-7">
          <h2 className="text-xl font-bold text-gray-900">
            Jouw opdracht
          </h2>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">
                Woningtype
              </span>

              <strong className="text-gray-900">
                {gegevens.woningtype}
              </strong>
            </div>
          <div className="flex justify-between"><span className="text-gray-500">Telescoop</span><strong className="text-gray-900">{gegevens.telescoop ?"ja" : "nee"}</strong></div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Verdiepingen
              </span>

              <strong className="text-gray-900">
                {gegevens.verdiepingen.join(",")}
              </strong>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Aantal ramen
              </span>

              <strong className="text-gray-900">
                {gegevens.ramen}
              </strong>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Bereikbaarheid
              </span>

              <strong className="text-gray-900">
                {details.bereikbaar === "ja"
                  ? "Goed bereikbaar"
                  : "Moeilijk bereikbaar"}
              </strong>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                kozijnen schoonmaken
              </span>

              <strong className="text-gray-900">
                {details.kozijnen ? "Ja" : "Nee"}
              </strong>
            </div>
          </div>
        </div>

        {/* INFO */}
        <div className="mt-6 rounded-2xl bg-blue-50 p-6">
          <p className="font-semibold text-blue-900">
            ✓ Duidelijke prijs vooraf
          </p>

          <p className="mt-2 text-sm leading-relaxed text-blue-800">
            Je ziet vooraf wat de opdracht kost. Eventuele wijzigingen
            tijdens de klus worden niet automatisch toegevoegd zonder
            akkoord.
          </p>
        </div>

        {/* KNOPPEN */}
        <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-8">
          <a
            href="/boeken/glazenwassen/details"
            className="font-semibold text-gray-600 hover:text-gray-900"
          >
            ← Vorige
          </a>

          <button
            type="button"
            onClick={doorgaan}
            className="rounded-xl bg-blue-600 px-10 py-4 text-lg font-bold text-white shadow-md hover:bg-blue-700"
          >
            Doorgaan met boeken →
          </button>
        </div>
      </section>
    </main>
  );
}