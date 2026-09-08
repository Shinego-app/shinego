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
      return {
        bedrijfsPrijs: 0,
        basisprijs: 0,
        ramenPrijs: 0,
        verdiepingToeslag: 0,
        bereikToeslag: 0,
        kozijnenToeslag: 0,
        kortingPercentage: 0,
        kortingBedrag: 0,
        totaal: 0,
      };
    }

    const bedrijfsPrijs =
      gegevens.glasOppervlak === "0-15"
        ? gegevens.telescoop
          ? 59
          : 39
        : gegevens.glasOppervlak === "16-30"
          ? gegevens.telescoop
            ? 79
            : 59
          : gegevens.glasOppervlak === "31-50"
            ? gegevens.telescoop
              ? 119
              : 89
            : gegevens.glasOppervlak === "51-100"
              ? gegevens.telescoop
                ? 219
                : 159
              : gegevens.glasOppervlak === "101-200"
                ? gegevens.telescoop
                  ? 399
                  : 289
                : gegevens.glasOppervlak === "201-500"
                  ? gegevens.telescoop
                    ? 849
                    : 599
                  : gegevens.glasOppervlak === "500+"
                    ? -1
                    : 0;

    const basisprijs =
      gegevens.type === "bedrijf"
        ? bedrijfsPrijs
        : gegevens.type === "binnen"
          ? 25
          : gegevens.type === "telewash"
            ? 30
            : 20;

    const prijsPerRaam =
      gegevens.type === "binnen" ||
      gegevens.type === "telewash" ||
      gegevens.type === "bedrijf"
        ? 3
        : 2.5;

    const ramenPrijs = gegevens.type === "bedrijf" ? 0 : gegevens.ramen * prijsPerRaam;
    const totaalVoorKorting =
      gegevens.woningtype === "bedrijfspand"
        ? bedrijfsPrijs
        : basisprijs + ramenPrijs;

    const kortingPercentage =
      gegevens.frequentie === "4weken"
        ? 0.12
        : gegevens.frequentie === "8weken"
          ? 0.1
          : gegevens.frequentie === "12weken"
            ? 0.07
            : 0;

    let verdiepingToeslag = 0;
    if (gegevens.verdiepingen.includes("2")) verdiepingToeslag += 7.5;
    if (gegevens.verdiepingen.includes("3")) verdiepingToeslag += 21.5;

    const bereikToeslag = details.bereikbaar === "nee" ? 12.5 : 0;
    const kozijnenToeslag = details.kozijnen ? 10 : 0;

    const subtotaal =
      totaalVoorKorting + verdiepingToeslag + bereikToeslag + kozijnenToeslag;
    const kortingBedrag = subtotaal * kortingPercentage;
    const totaal = subtotaal - kortingBedrag;

    return {
      bedrijfsPrijs,
      basisprijs,
      ramenPrijs,
      verdiepingToeslag,
      bereikToeslag,
      kozijnenToeslag,
      kortingPercentage,
      kortingBedrag,
      totaal,
    };
  }, [gegevens, details]);

  function doorgaan() {
    if (
      gegevens?.woningtype === "bedrijfspand" &&
      gegevens.glasOppervlak === "500+"
    ) {
      alert("Voor bedrijfspanden vanaf 500 m² maken we een offerte op maat.");
      return;
    }

    localStorage.setItem("shinegoPrijs", JSON.stringify(prijs));
    window.location.href = "/boeken/glazenwassen/gegevens";
  }

  if (!gegevens || !details) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="rounded-2xl bg-white p-6 shadow sm:p-8">
          <p className="text-gray-600">Gegevens laden...</p>
        </div>
      </main>
    );
  }

  const offerteOpMaat =
    gegevens.woningtype === "bedrijfspand" && gegevens.glasOppervlak === "500+";

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
          <a href="/" className="text-2xl font-bold text-blue-600">
            ShineGo
          </a>
          <a
            href="/boeken/glazenwassen/details"
            className="text-sm font-medium text-gray-600 hover:text-blue-600 sm:text-base"
          >
            ← Terug
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-7 sm:mb-10">
          <div className="mb-3 flex justify-between gap-4">
            <span className="text-sm font-semibold text-blue-600">Stap 4 van 4</span>
            <span className="text-sm text-gray-500">Jouw prijs</span>
          </div>
          <div className="h-2 rounded-full bg-gray-200">
            <div className="h-2 w-full rounded-full bg-blue-600" />
          </div>
        </div>

        <div className="mb-7 text-center sm:mb-10">
          <div className="mb-3 text-4xl sm:mb-4 sm:text-5xl">✨</div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Jouw ShineGo-prijs</h1>
          <p className="mt-2 text-base text-gray-600 sm:mt-3 sm:text-lg">
            Op basis van de gegevens van jouw opdracht.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
          <div className="bg-blue-600 px-5 py-7 text-center text-white sm:px-8 sm:py-10">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-100 sm:text-sm">
              Geschatte totaalprijs
            </p>
            <div className={`mt-2 font-bold sm:mt-3 ${offerteOpMaat ? "text-3xl sm:text-5xl" : "text-5xl sm:text-6xl"}`}>
              {offerteOpMaat ? "Offerte op maat" : `€${prijs.totaal.toFixed(2).replace(".", ",")}`}
            </div>
            <p className="mt-2 text-sm text-blue-100 sm:mt-3 sm:text-base">
              Voor glazenwassen buitenzijde
            </p>
          </div>

          <div className="p-5 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900">Prijsopbouw</h2>

            <div className="mt-5 space-y-4 sm:mt-6">
              <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
                <span className="text-gray-600">
                  {gegevens.woningtype === "bedrijfspand" ? "Zakelijke glasprijs" : "Basisprijs"}
                </span>
                <span className="shrink-0 text-right font-semibold text-gray-900">
                  {offerteOpMaat
                    ? "Offerte op maat"
                    : `€${(
                        gegevens.woningtype === "bedrijfspand"
                          ? prijs.bedrijfsPrijs
                          : prijs.basisprijs
                      )
                        .toFixed(2)
                        .replace(".", ",")}`}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
                <span className="text-gray-600">
                  {gegevens.woningtype === "bedrijfspand"
                    ? gegevens.glasOppervlak
                    : `${gegevens.ramen} ramen`}
                </span>
                <span className="shrink-0 text-right font-semibold text-gray-900">
                  {gegevens.woningtype !== "bedrijfspand" &&
                    `€${prijs.ramenPrijs.toFixed(2).replace(".", ",")}`}
                </span>
              </div>

              {prijs.verdiepingToeslag > 0 && (
                <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
                  <span className="text-gray-600">Toeslag hoogte</span>
                  <span className="shrink-0 font-semibold text-gray-900">
                    €{prijs.verdiepingToeslag.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              )}

              {prijs.bereikToeslag > 0 && (
                <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
                  <span className="text-gray-600">Moeilijk bereikbare ramen</span>
                  <span className="shrink-0 font-semibold text-gray-900">
                    €{prijs.bereikToeslag.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              )}

              {prijs.kozijnenToeslag > 0 && (
                <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
                  <span className="text-gray-600">Kozijnen schoonmaken</span>
                  <span className="shrink-0 font-semibold text-gray-900">
                    €{prijs.kozijnenToeslag.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              )}

              {prijs.kortingPercentage > 0 && (
                <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
                  <span className="text-gray-600">
                    Abonnementskorting ({Math.round(prijs.kortingPercentage * 100)}%)
                  </span>
                  <span className="shrink-0 font-semibold text-green-600">
                    - €{prijs.kortingBedrag.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between gap-4 pt-2 text-lg sm:text-xl">
                <span className="font-bold text-gray-900">Totaal</span>
                <span className="font-bold text-blue-600">
                  {offerteOpMaat ? "Offerte" : `€${prijs.totaal.toFixed(2).replace(".", ",")}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-5 sm:p-7">
          <h2 className="text-xl font-bold text-gray-900">Jouw opdracht</h2>

          <div className="mt-5 space-y-3 text-sm">
            {[
              ["Woningtype", gegevens.woningtype],
              [
                "Frequentie",
                gegevens.frequentie === "4weken"
                  ? "Elke 4 weken"
                  : gegevens.frequentie === "8weken"
                    ? "Elke 8 weken"
                    : gegevens.frequentie === "12weken"
                      ? "Elke 12 weken"
                      : "Eenmalig",
              ],
              ["Telescoop", gegevens.telescoop ? "Ja" : "Nee"],
              ["Verdiepingen", gegevens.verdiepingen.join(", ") || "-"],
              [
                gegevens.woningtype === "bedrijfspand" ? "Glasoppervlak" : "Aantal ramen",
                gegevens.woningtype === "bedrijfspand"
                  ? `${gegevens.glasOppervlak} m²`
                  : String(gegevens.ramen),
              ],
              [
                "Bereikbaarheid",
                details.bereikbaar === "ja" ? "Goed bereikbaar" : "Moeilijk bereikbaar",
              ],
              ["Kozijnen schoonmaken", details.kozijnen ? "Ja" : "Nee"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-4">
                <span className="text-gray-500">{label}</span>
                <strong className="max-w-[55%] text-right text-gray-900">{value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-blue-50 p-5 sm:p-6">
          <p className="font-semibold text-blue-900">✓ Duidelijke prijs vooraf</p>
          <p className="mt-2 text-sm leading-relaxed text-blue-800">
            Je ziet vooraf wat de opdracht kost. Eventuele wijzigingen tijdens de klus worden niet automatisch toegevoegd zonder akkoord.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-gray-200 pt-6 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:pt-8">
          <button
            type="button"
            onClick={doorgaan}
            className="order-1 w-full rounded-xl bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-md hover:bg-blue-700 sm:order-2 sm:w-auto sm:px-10 sm:text-lg"
          >
            Doorgaan met boeken →
          </button>
          <a
            href="/boeken/glazenwassen/details"
            className="order-2 text-center font-semibold text-gray-600 hover:text-gray-900 sm:order-1 sm:text-left"
          >
            ← Vorige
          </a>
        </div>
      </section>
    </main>
  );
}
