"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { boekingOpslaan } from "../../../../lib/boekingopslaan";

type GlazenwassenGegevens = {
  woningtype: string;
  verdiepingen: string[];
  ramen: number;
  telescoop: boolean;
  type: string;
  frequentie: string;
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
  kortingPercentage: number;
  kortingBedrag: number;
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
  const router = useRouter();
  const [klus, setKlus] = useState<GlazenwassenGegevens | null>(null);
  const [details, setDetails] = useState<GlazenwassenDetails | null>(null);
  const [prijs, setPrijs] = useState<Prijs | null>(null);
  const [klant, setKlant] = useState<KlantGegevens | null>(null);
  const [akkoordVoorwaarden, setAkkoordVoorwaarden] = useState(false);
  const [akkoordStartBedenktijd, setAkkoordStartBedenktijd] = useState(false);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");

  useEffect(() => {
    try {
      const klusData = localStorage.getItem("shinegoGlazenwassen");
      const detailsData = localStorage.getItem("shinegoGlazenwassenDetails");
      const prijsData = localStorage.getItem("shinegoPrijs");
      const klantData = localStorage.getItem("shinegoKlantGegevens");

      if (klusData) setKlus(JSON.parse(klusData));
      if (detailsData) setDetails(JSON.parse(detailsData));
      if (prijsData) setPrijs(JSON.parse(prijsData));
      if (klantData) setKlant(JSON.parse(klantData));
    } catch (error) {
      console.error(error);
      setFout("De boekingsgegevens konden niet worden geladen.");
    }
  }, []);

  async function bevestigBoeking() {
    if (!klus || !details || !prijs || !klant) {
      setFout("Niet alle gegevens zijn aanwezig. Ga terug en controleer de boeking.");
      return;
    }

    if (!klant.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(klant.email.trim())) {
      setFout("Vul een geldig e-mailadres in.");
      return;
    }

    if (!akkoordVoorwaarden) {
      setFout("Ga akkoord met de algemene voorwaarden en het annuleringsbeleid om verder te gaan.");
      return;
    }

    if (!akkoordStartBedenktijd) {
      setFout("Geef toestemming om de dienstverlening zo nodig binnen de wettelijke bedenktijd te laten starten.");
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
        glasbewassing_type: klus.type,
        frequentie: klus.frequentie,
        bereikbaar: details.bereikbaar,
        kozijnen: details.kozijnen,
        opmerking: details.opmerking,
        basisprijs: prijs.basisprijs,
        ramen_prijs: prijs.ramenPrijs,
        verdieping_toeslag: prijs.verdiepingToeslag,
        bereik_toeslag: prijs.bereikToeslag,
        kozijnen_toeslag: prijs.kozijnenToeslag,
        korting_percentage: prijs.kortingPercentage,
        korting_bedrag: prijs.kortingBedrag,
        totaalprijs: prijs.totaal,
        gewenste_datum: klant.gewensteDatum,
        gewenste_tijd: klant.gewensteTijd,
        thuis_nodig: klant.thuisNodig,
        akkoord_voorwaarden: akkoordVoorwaarden,
        akkoord_start_binnen_bedenktijd: akkoordStartBedenktijd,
        professional_id: null,
      });

      const betaalResponse = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    } catch (error) {
      console.error(error);
      setFout(
        error instanceof Error
          ? error.message
          : "Er ging iets mis bij het opslaan van de boeking."
      );
      setBezig(false);
    }
  }

  const soortGlasbewassing =
    klus?.type === "binnen"
      ? "Ramen binnen wassen"
      : klus?.type === "telewash"
        ? "Telewash"
        : klus?.type === "bedrijf"
          ? "Winkel / bedrijfspand"
          : "Ramen buiten wassen";

  const frequentieTekst =
    klus?.frequentie === "4weken"
      ? "Elke 4 weken"
      : klus?.frequentie === "8weken"
        ? "Elke 8 weken"
        : klus?.frequentie === "12weken"
          ? "Elke 12 weken"
          : "Eenmalig";

  const rijClass = "flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-5";
  const waardeClass = "break-words font-bold text-gray-900 sm:max-w-[60%] sm:text-right";

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
          <a href="/" className="text-2xl font-bold text-blue-600">
            ShineGo
          </a>
          <button
            type="button"
            onClick={() => router.back()}
            className="font-medium text-gray-600 hover:text-gray-900"
          >
            ← Terug
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            Controleer je boeking
          </h1>
          <p className="mt-3 text-base leading-7 text-gray-600 sm:text-lg">
            Controleer je gegevens en de totaalprijs voordat je naar de betaling gaat.
          </p>
        </div>

        {!klus || !details || !prijs || !klant ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
            <p className="text-gray-600">Boekingsgegevens laden...</p>
          </div>
        ) : (
          <>
            <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-7">
              <h2 className="text-xl font-bold text-gray-900">Klantgegevens</h2>
              <div className="mt-5 space-y-4">
                <div className={rijClass}>
                  <span className="text-gray-500">Naam</span>
                  <strong className={waardeClass}>{klant.voornaam} {klant.achternaam}</strong>
                </div>
                <div className={rijClass}>
                  <span className="text-gray-500">E-mail</span>
                  <strong className={waardeClass}>{klant.email}</strong>
                </div>
                <div className={rijClass}>
                  <span className="text-gray-500">Telefoon</span>
                  <strong className={waardeClass}>{klant.telefoon}</strong>
                </div>
                <div className={rijClass}>
                  <span className="text-gray-500">Adres</span>
                  <strong className={waardeClass}>
                    {klant.straat} {klant.huisnummer}{klant.toevoeging ? ` ${klant.toevoeging}` : ""}
                    <br />
                    {klant.postcode} {klant.plaats}
                  </strong>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-gray-200 bg-white p-5 sm:mt-6 sm:p-7">
              <h2 className="text-xl font-bold text-gray-900">Opdracht</h2>
              <div className="mt-5 space-y-4">
                <div className={rijClass}><span className="text-gray-500">Dienst</span><strong className={waardeClass}>Glazenwassen</strong></div>
                <div className={rijClass}><span className="text-gray-500">Woningtype</span><strong className={waardeClass}>{klus.woningtype}</strong></div>
                <div className={rijClass}><span className="text-gray-500">Soort glasbewassing</span><strong className={waardeClass}>{soortGlasbewassing}</strong></div>
                <div className={rijClass}><span className="text-gray-500">Frequentie</span><strong className={waardeClass}>{frequentieTekst}</strong></div>
                {klus.verdiepingen.length > 0 && (
                  <div className={rijClass}><span className="text-gray-500">Verdiepingen</span><strong className={waardeClass}>{klus.verdiepingen.join(", ")}</strong></div>
                )}
                <div className={rijClass}><span className="text-gray-500">Aantal ramen</span><strong className={waardeClass}>{klus.ramen}</strong></div>
                <div className={rijClass}><span className="text-gray-500">Bereikbaarheid</span><strong className={waardeClass}>{details.bereikbaar === "ja" ? "Goed bereikbaar" : "Moeilijk bereikbaar"}</strong></div>
                <div className={rijClass}><span className="text-gray-500">Gewenste datum</span><strong className={waardeClass}>{klant.gewensteDatum}</strong></div>
                <div className={rijClass}><span className="text-gray-500">Gewenste tijd</span><strong className={waardeClass}>{klant.gewensteTijd}</strong></div>
                <div className={rijClass}><span className="text-gray-500">Moet je thuis zijn?</span><strong className={waardeClass}>{klant.thuisNodig === "ja" ? "Ja" : klant.thuisNodig === "nee" ? "Nee" : "-"}</strong></div>
              </div>
            </div>

            <div className="mt-5 rounded-3xl bg-blue-600 p-5 text-white sm:mt-6 sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                <div>
                  <p className="text-sm text-blue-100">Totaalprijs</p>
                  <p className="mt-1 font-semibold">{soortGlasbewassing}</p>
                  {prijs.kortingPercentage > 0 && (
                    <p className="mt-2 text-sm text-blue-100">
                      Abonnementskorting ({Math.round(prijs.kortingPercentage * 100)}%): - €{prijs.kortingBedrag.toFixed(2).replace(".", ",")}
                    </p>
                  )}
                </div>
                <div className="text-4xl font-bold">€{prijs.totaal.toFixed(2).replace(".", ",")}</div>
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-gray-200 bg-white p-5 sm:mt-6 sm:p-7">
              <h2 className="text-xl font-bold text-gray-900">Voorwaarden en bedenktijd</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Lees vóór het betalen de algemene voorwaarden en het annuleringsbeleid. Als je afspraak binnen de wettelijke bedenktijd valt, hebben we je uitdrukkelijke toestemming nodig om de dienstverlening binnen die periode te mogen starten.
              </p>

              <label className={`mt-6 flex cursor-pointer items-start gap-4 rounded-2xl border-2 p-4 transition ${akkoordVoorwaarden ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white hover:border-blue-300"}`}>
                <input
                  type="checkbox"
                  checked={akkoordVoorwaarden}
                  onChange={(event) => setAkkoordVoorwaarden(event.target.checked)}
                  className="sr-only"
                />
                <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 text-base font-bold ${akkoordVoorwaarden ? "border-blue-600 bg-blue-600 text-white" : "border-gray-400 bg-white text-transparent"}`}>
                  ✓
                </span>
                <span className="text-sm leading-6 text-gray-700">
                  Ik ga akkoord met de{" "}
                  <a href="/voorwaarden" target="_blank" className="font-semibold text-blue-600 underline" onClick={(event) => event.stopPropagation()}>
                    algemene voorwaarden
                  </a>{" "}
                  en het daarin opgenomen annuleringsbeleid.
                </span>
              </label>

              <label className={`mt-4 flex cursor-pointer items-start gap-4 rounded-2xl border-2 p-4 transition ${akkoordStartBedenktijd ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white hover:border-blue-300"}`}>
                <input
                  type="checkbox"
                  checked={akkoordStartBedenktijd}
                  onChange={(event) => setAkkoordStartBedenktijd(event.target.checked)}
                  className="sr-only"
                />
                <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 text-base font-bold ${akkoordStartBedenktijd ? "border-blue-600 bg-blue-600 text-white" : "border-gray-400 bg-white text-transparent"}`}>
                  ✓
                </span>
                <span className="text-sm leading-6 text-gray-700">
                  Ik verzoek ShineGo uitdrukkelijk om de dienstverlening, indien nodig, al binnen mijn wettelijke bedenktijd te laten starten. Ik begrijp dat ik bij herroeping mogelijk moet betalen voor het deel van de dienst dat op mijn verzoek al is uitgevoerd.
                </span>
              </label>
            </div>

            {fout && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
                <strong>Kan nog niet doorgaan.</strong>
                <p className="mt-1">{fout}</p>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 border-t border-gray-200 pt-6 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:pt-8">
              <a
                href="/boeken/glazenwassen/gegevens"
                className="order-2 rounded-xl px-4 py-3 text-center font-semibold text-gray-600 hover:text-gray-900 sm:order-1 sm:p-0"
              >
                ← Vorige
              </a>

              <button
                type="button"
                onClick={bevestigBoeking}
                disabled={bezig}
                className={`order-1 w-full rounded-xl px-6 py-4 text-lg font-bold text-white sm:order-2 sm:w-auto sm:px-10 ${
                  bezig ? "cursor-not-allowed bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {bezig ? "Betaling starten..." : "Boeken en betalen"}
              </button>
            </div>
            <p className="mt-3 text-center text-sm text-gray-500 sm:text-right">
              Door op “Boeken en betalen” te klikken ga je een betalingsverplichting aan.
            </p>
          </>
        )}
      </section>
    </main>
  );
}
