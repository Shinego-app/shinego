"use client";

import { useEffect, useState } from "react";
import { boekingOpslaan } from "../../../../lib/boekingopslaan";

type GlazenwassenGegevens = {
  woningtype: string;
  verdiepingen: string[];
  ramen: number;
  telescoop: boolean;
};

type GlazenwassenDetails = {
  bereikbaar: string;
  extraVuil: boolean;
  kozijnen: boolean;
  opmerking: string;
};

type Prijs = {
  basisprijs: number;
  ramenPrijs: number;
  verdiepingToeslag: number;
  bereikToeslag: number;
  kozijnenToeslag: number;
  totaal: number;
};

type KlantGegevens = {
  voornaam: string;
  achternaam: string;
  email: string;
  telefoon: string;
  postcode: string;
  huisnummer: string;
  toevoeging?: string;
  straat: string;
  plaats: string;
  gewensteDatum: string;
  gewensteTijd: string;
  thuisNodig: string;
};

export default function BevestigenPage() {
  const [klus, setKlus] =
    useState<GlazenwassenGegevens | null>(null);

  const [details, setDetails] =
    useState<GlazenwassenDetails | null>(null);

  const [prijs, setPrijs] =
    useState<Prijs | null>(null);

  const [klant, setKlant] =
    useState<KlantGegevens | null>(null);

  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");
  const [gelukt, setGelukt] = useState(false);
  const [boekingId, setBoekingId] = useState("");

  useEffect(() => {
    try {
      const klusData = localStorage.getItem(
        "shinegoGlazenwassen"
      );

      const detailsData = localStorage.getItem(
        "shinegoGlazenwassenDetails"
      );

      const prijsData = localStorage.getItem(
        "shinegoPrijs"
      );

      const klantData = localStorage.getItem(
        "shinegoKlantGegevens"
      );

      if (klusData) {
        setKlus(JSON.parse(klusData));
      }

      if (detailsData) {
        setDetails(JSON.parse(detailsData));
      }

      if (prijsData) {
        setPrijs(JSON.parse(prijsData));
      }

      if (klantData) {
        setKlant(JSON.parse(klantData));
      }
    } catch (error) {
      console.error(error);
      setFout("De boekingsgegevens konden niet worden geladen.");
    }
  }, []);

  async function bevestigBoeking() {
    if (!klus || !details || !prijs || !klant) {
      setFout(
        "Niet alle gegevens zijn aanwezig. Ga terug en controleer de boeking."
      );
      return;
    }

    setBezig(true);
    setFout("");

    try {
      const nieuweBoeking = await boekingOpslaan({
        voornaam: klant.voornaam,
        achternaam: klant.achternaam,
        email: klant.email,
        telefoon: klant.telefoon,

        postcode: klant.postcode,
        huisnummer: klant.huisnummer,
        toevoeging: klant.toevoeging || "",
        straat: klant.straat,
        plaats: klant.plaats,

        dienst: "glazenwassen",

        woningtype: klus.woningtype,
        telescoop: klus.telescoop,
        verdiepingen: klus.verdiepingen,
        aantal_ramen: klus.ramen,

        bereikbaar: details.bereikbaar,
        kozijnen: details.kozijnen,
        
        opmerking: details.opmerking,

        basisprijs: prijs.basisprijs,
        ramen_prijs: prijs.ramenPrijs,
        verdieping_toeslag: prijs.verdiepingToeslag,
        bereik_toeslag: prijs.bereikToeslag,
        kozijnen_toeslag: prijs.kozijnenToeslag,

        totaalprijs: prijs.totaal,
        gewenste_datum: klant.gewensteDatum,
        gewenste_tijd: klant.gewensteTijd,
        thuis_nodig: klant.thuisNodig,

        professional_id: null,
      });

      const betaalResponse = await fetch("/api/stripe", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    amount: prijs.totaal,
    email: klant.email,
    name: `${klant.voornaam} ${klant.achternaam}`,
    bookingId: nieuweBoeking?.[0]?.id,
  }),
});
  


const betaalData = await betaalResponse.json();

if (!betaalResponse.ok || !betaalData.url) {
  throw new Error("Stripe betaling kon niet worden gestart.");
}

window.location.href = betaalData.url;
return;if (nieuweBoeking?.[0]?.id) {
        setBoekingId(nieuweBoeking[0].id);
      }

      setGelukt(true);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setFout(error.message);
      } else {
        setFout(
          "Er ging iets mis bij het opslaan van de boeking."
        );
      }
    } finally {
      setBezig(false);
    }
  }

  if (gelukt) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-5">
            <a
              href="/"
              className="text-2xl font-bold text-blue-600"
            >
              ShineGo
            </a>
          </div>
        </header>

        <section className="mx-auto max-w-2xl px-6 py-16">
          <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-lg">
            <div className="text-6xl">✅</div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Boeking ontvangen
            </h1>

            <p className="mt-4 text-gray-600">
              Je ShineGo-boeking is succesvol opgeslagen.
            </p>

            {boekingId && (
              <div className="mt-6 rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Boekingsnummer
                </p>

                <p className="mt-1 break-all font-semibold text-gray-900">
                  {boekingId}
                </p>
              </div>
            )}

            <a
              href="/"
              className="mt-8 inline-block rounded-xl bg-blue-600 px-8 py-4 font-bold text-white hover:bg-blue-700"
            >
              Terug naar ShineGo
            </a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <a
            href="/"
            className="text-2xl font-bold text-blue-600"
          >
            ShineGo
          </a>

          <a
            href="/boeken/glazenwassen/gegevens"
            className="font-medium text-gray-600 hover:text-blue-600"
          >
            ← Terug
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Controleer je boeking
          </h1>

          <p className="mt-3 text-lg text-gray-600">
            Controleer de gegevens voordat je de opdracht bevestigt.
          </p>
        </div>

        {!klus || !details || !prijs || !klant ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8">
            <p className="text-gray-600">
              Boekingsgegevens laden...
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-3xl border border-gray-200 bg-white p-7">
              <h2 className="text-xl font-bold text-gray-900">
                Klantgegevens
              </h2>

              <div className="mt-5 space-y-3">
                <div className="flex justify-between gap-5">
                  <span className="text-gray-500">
                    Naam
                  </span>

                  <strong className="text-right">
                    {klant.voornaam} {klant.achternaam}
                  </strong>
                </div>

                <div className="flex justify-between gap-5">
                  <span className="text-gray-500">
                    E-mail
                  </span>

                  <strong className="text-right">
                    {klant.email}
                  </strong>
                </div>

                <div className="flex justify-between gap-5">
                  <span className="text-gray-500">
                    Telefoon
                  </span>

                  <strong className="text-right">
                    {klant.telefoon}
                  </strong>
                </div>

                <div className="flex justify-between gap-5">
                  <span className="text-gray-500">
                    Adres
                  </span>

                  <strong className="text-right">
                    {klant.straat} {klant.huisnummer}
                    {klant.toevoeging
                      ? ` ${klant.toevoeging}`
                      : ""}
                    <br />
                    {klant.postcode} {klant.plaats}
                  </strong>
                </div>
              </div>
            </div>
            
            <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-7">
              <h2 className="text-xl font-bold text-gray-900">
                Opdracht
              </h2>

              <div className="mt-5 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Dienst
                  </span>

                  <strong>Glazenwassen</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Woningtype
                  </span>

                  <strong>{klus.woningtype}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Verdiepingen
                  </span>

                  <strong>{klus.verdiepingen}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Aantal ramen
                  </span>

                  <strong>{klus.ramen}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Bereikbaarheid
                  </span>

                  <strong>
                    {details.bereikbaar === "ja"
                      ? "Goed bereikbaar"
                      : "Moeilijk bereikbaar"}
                  </strong>
                </div>
                <div className="flex justify-between">
                <span className="text-gray-500">
                   Gewenste datum
                  </span>
                  <strong>{klant.gewensteDatum}</strong>
                </div>
                <div className="flex justify-between">
                <span className="text-gray-500">
                Gewenste tijd
                </span>
              <strong>{klant.gewensteTijd}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Moet je thuis zijn?</span>
              <strong>{klant.thuisNodig === "ja" ? "ja" : klant.thuisNodig === "nee" ? "Nee" : "-"}</strong>
            </div>
            </div>
            </div>
            <div className="mt-6 rounded-3xl bg-blue-600 p-7 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100">
                    Totaalprijs
                  </p>

                  <p className="mt-1 font-semibold">
                    Glazenwassen buitenzijde
                  </p>
                </div>

                <div className="text-4xl font-bold">
                  €
                  {prijs.totaal
                    .toFixed(2)
                    .replace(".", ",")}
                </div>
              </div>
            </div>

            {fout && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
                <strong>Boeking niet opgeslagen.</strong>

                <p className="mt-1">{fout}</p>
              </div>
            )}

            <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-8">
              <a
                href="/boeken/glazenwassen/gegevens"
                className="font-semibold text-gray-600 hover:text-gray-900"
              >
                ← Vorige
              </a>

              <button
                type="button"
                onClick={bevestigBoeking}
                disabled={bezig}
                className={`rounded-xl px-10 py-4 text-lg font-bold text-white ${
                  bezig
                    ? "cursor-not-allowed bg-blue-400"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {bezig
                  ? "Boeking opslaan..."
                  : "Boeking bevestigen"}
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}