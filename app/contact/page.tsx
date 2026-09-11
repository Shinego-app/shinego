"use client";

import { FormEvent, useEffect, useState } from "react";

type OfferteGegevens = {
  woningtype?: string;
  verdiepingen?: string[];
  glasOppervlak?: string;
  telescoop?: boolean;
  frequentie?: string;
};

function frequentieLabel(frequentie?: string) {
  if (frequentie === "4weken") return "Elke 4 weken";
  if (frequentie === "8weken") return "Elke 8 weken";
  if (frequentie === "12weken") return "Elke 12 weken";
  return "Eenmalig";
}

export default function ContactPage() {
  const [verzenden, setVerzenden] = useState(false);
  const [melding, setMelding] = useState("");
  const [gelukt, setGelukt] = useState(false);
  const [offerte500Plus, setOfferte500Plus] = useState(false);
  const [offerteGegevens, setOfferteGegevens] = useState<OfferteGegevens | null>(null);
  const [onderwerp, setOnderwerp] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isOfferte500Plus = params.get("offerte") === "500plus";

    if (!isOfferte500Plus) return;

    setOfferte500Plus(true);
    setOnderwerp("Offerteaanvraag – meer dan 500 m² glas");

    try {
      const opgeslagen = localStorage.getItem("shinegoGlazenwassen");
      if (opgeslagen) {
        setOfferteGegevens(JSON.parse(opgeslagen));
      }
    } catch {
      setOfferteGegevens(null);
    }
  }, []);

  async function verstuurContactformulier(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setVerzenden(true);
    setMelding("");
    setGelukt(false);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const bericht = String(formData.get("bericht") ?? "");

    const offerteSamenvatting = offerte500Plus
      ? [
          "",
          "--- Offertegegevens ---",
          `Situatie: Winkel / bedrijfspand`,
          `Glasoppervlak: ${offerteGegevens?.glasOppervlak ?? "500+"} m²`,
          `Verdiepingen: ${offerteGegevens?.verdiepingen?.join(", ") || "Niet opgegeven"}`,
          `Telescoopsteel: ${offerteGegevens?.telescoop ? "Ja" : "Nee"}`,
          `Frequentie: ${frequentieLabel(offerteGegevens?.frequentie)}`,
        ].join("\n")
      : "";

    const payload = {
      naam: String(formData.get("naam") ?? ""),
      email: String(formData.get("email") ?? ""),
      onderwerp: String(formData.get("onderwerp") ?? ""),
      bericht: `${bericht}${offerteSamenvatting}`,
      website: String(formData.get("website") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setMelding(data.error || "Verzenden is mislukt. Probeer het opnieuw.");
        return;
      }

      form.reset();
      if (offerte500Plus) {
        setOnderwerp("Offerteaanvraag – meer dan 500 m² glas");
      }
      setGelukt(true);
      setMelding(
        offerte500Plus
          ? "Bedankt. Je offerteaanvraag is verzonden naar ShineGo."
          : "Bedankt. Je bericht is verzonden naar ShineGo."
      );
    } catch {
      setMelding("Verzenden is mislukt. Probeer het later opnieuw.");
    } finally {
      setVerzenden(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
        <a
          href={offerte500Plus ? "/#diensten" : "/"}
          className="mb-8 inline-block font-semibold text-blue-600 hover:text-blue-700"
        >
          {offerte500Plus ? "← Terug naar glazenwassen" : "← Terug naar ShineGo"}
        </a>

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
            ShineGo
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {offerte500Plus ? "Offerte aanvragen – meer dan 500 m² glas" : "Contact"}
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            {offerte500Plus
              ? "Voor grotere winkel- en bedrijfspanden maken we een offerte op maat. Vul je contactgegevens en aanvullende informatie in; ShineGo neemt daarna contact met je op."
              : "Heb je een vraag over een boeking, betaling, opdracht of je account? Stuur ons een bericht via het contactformulier."}
          </p>

          {offerte500Plus ? (
            <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">
              <h2 className="text-lg font-bold text-blue-950">Jouw aanvraag</h2>
              <div className="mt-4 grid gap-3 text-sm text-blue-950 sm:grid-cols-2">
                <div className="flex justify-between gap-4">
                  <span className="text-blue-700">Situatie</span>
                  <strong>Winkel / bedrijfspand</strong>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-blue-700">Glasoppervlak</span>
                  <strong>{offerteGegevens?.glasOppervlak ?? "500+"} m²</strong>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-blue-700">Verdiepingen</span>
                  <strong>{offerteGegevens?.verdiepingen?.join(", ") || "Niet opgegeven"}</strong>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-blue-700">Telescoopsteel</span>
                  <strong>{offerteGegevens?.telescoop ? "Ja" : "Nee"}</strong>
                </div>
                <div className="flex justify-between gap-4 sm:col-span-2">
                  <span className="text-blue-700">Frequentie</span>
                  <strong>{frequentieLabel(offerteGegevens?.frequentie)}</strong>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-blue-800">
                Je betaalt nu niets. Na beoordeling ontvang je eerst een offerte op maat.
              </p>
            </div>
          ) : (
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <div className="text-2xl">💬</div>
                <h2 className="mt-3 text-lg font-bold">Vraag over je boeking</h2>
                <p className="mt-2 leading-6 text-slate-600">
                  Vermeld bij contact bij voorkeur je boekingsnummer. Zo kunnen we je sneller helpen.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <div className="text-2xl">🧽</div>
                <h2 className="mt-3 text-lg font-bold">Ben je professional?</h2>
                <p className="mt-2 leading-6 text-slate-600">
                  Voor vragen over opdrachten, je account of uitbetalingen kun je via hetzelfde formulier contact opnemen met ShineGo.
                </p>
              </div>
            </div>
          )}

          <form
            onSubmit={verstuurContactformulier}
            className="mt-8 rounded-2xl bg-slate-950 p-7 text-white"
          >
            <h2 className="text-xl font-bold">
              {offerte500Plus ? "Vul je gegevens in" : "Stuur ShineGo een bericht"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {offerte500Plus
                ? "Beschrijf eventueel bijzonderheden, bereikbaarheid of wensen voor het pand."
                : "We gebruiken je gegevens alleen om je vraag te behandelen."}
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold">Naam *</span>
                <input
                  name="naam"
                  type="text"
                  required
                  maxLength={100}
                  autoComplete="name"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-500"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold">E-mailadres *</span>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-500"
                />
              </label>
            </div>

            <label className="mt-5 block">
              <span className="text-sm font-semibold">Onderwerp *</span>
              <input
                name="onderwerp"
                type="text"
                required
                maxLength={150}
                value={onderwerp}
                onChange={(event) => setOnderwerp(event.target.value)}
                placeholder={offerte500Plus ? undefined : "Waar kunnen we je mee helpen?"}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-500"
              />
            </label>

            <label className="mt-5 block">
              <span className="text-sm font-semibold">
                {offerte500Plus ? "Aanvullende informatie *" : "Bericht *"}
              </span>
              <textarea
                name="bericht"
                required
                maxLength={5000}
                rows={6}
                placeholder={
                  offerte500Plus
                    ? "Bijvoorbeeld: type pand, bereikbaarheid, gewenste periode of andere bijzonderheden..."
                    : undefined
                }
                className="mt-2 w-full resize-y rounded-2xl border border-slate-700 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-500"
              />
            </label>

            <div className="hidden" aria-hidden="true">
              <label>
                Website
                <input name="website" type="text" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            {melding && (
              <p
                className={`mt-5 rounded-xl px-4 py-3 text-sm font-semibold ${
                  gelukt
                    ? "bg-emerald-100 text-emerald-900"
                    : "bg-red-100 text-red-900"
                }`}
              >
                {melding}
              </p>
            )}

            <button
              type="submit"
              disabled={verzenden}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {verzenden
                ? "Verzenden..."
                : offerte500Plus
                  ? "Offerte aanvragen"
                  : "Bericht versturen"}
            </button>

            <p className="mt-5 text-sm text-slate-400">
              Stuur nooit wachtwoorden, volledige betaalgegevens of andere gevoelige informatie mee.
            </p>
          </form>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            <a
              href="/veelgestelde-vragen"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Veelgestelde vragen →
            </a>
            <a
              href="/privacy"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Privacybeleid →
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
