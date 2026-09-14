"use client";

import { FormEvent, useState } from "react";

export default function HerroepenPage() {
  const [bezig, setBezig] = useState(false);
  const [melding, setMelding] = useState("");
  const [gelukt, setGelukt] = useState(false);

  async function verzendHerroeping(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBezig(true);
    setMelding("");
    setGelukt(false);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      naam: String(formData.get("naam") ?? ""),
      email: String(formData.get("email") ?? ""),
      boekingsnummer: String(formData.get("boekingsnummer") ?? ""),
      verklaring: formData.get("verklaring") === "on",
      website: String(formData.get("website") ?? ""),
    };

    try {
      const response = await fetch("/api/herroepen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        setMelding(data.error || "De herroeping kon niet worden verzonden.");
        return;
      }

      form.reset();
      setGelukt(true);
      setMelding(
        "Je herroeping is ontvangen. We hebben direct een ontvangstbevestiging naar je e-mailadres gestuurd."
      );
    } catch {
      setMelding("De herroeping kon niet worden verzonden. Probeer het opnieuw of mail info@shinego.nl.");
    } finally {
      setBezig(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <a href="/" className="mb-8 inline-block font-semibold text-blue-600 hover:text-blue-700">
          ← Terug naar ShineGo
        </a>

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">ShineGo</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Hier de overeenkomst herroepen
          </h1>
          <p className="mt-4 leading-7 text-slate-600">
            Heb je als consument online een overeenkomst met ShineGo gesloten en geldt voor jouw overeenkomst een wettelijk herroepingsrecht? Dan kun je dat recht hieronder online uitoefenen.
          </p>
          <p className="mt-3 leading-7 text-slate-600">
            Vul de gegevens in waarmee we de overeenkomst kunnen herkennen. Na verzending ontvang je zonder onnodige vertraging een bevestiging per e-mail met de inhoud, datum en het tijdstip van je herroeping.
          </p>

          <form onSubmit={verzendHerroeping} className="mt-8 space-y-5 rounded-2xl bg-slate-950 p-6 text-white sm:p-8">
            <label className="block">
              <span className="text-sm font-semibold">Naam *</span>
              <input
                name="naam"
                required
                maxLength={120}
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

            <label className="block">
              <span className="text-sm font-semibold">Boekingsnummer *</span>
              <input
                name="boekingsnummer"
                required
                maxLength={80}
                placeholder="Bijvoorbeeld 63"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-500"
              />
            </label>

            <div className="hidden" aria-hidden="true">
              <label>
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-700 p-4">
              <input name="verklaring" type="checkbox" required className="mt-1 h-5 w-5" />
              <span className="text-sm leading-6 text-slate-200">
                Ik verklaar dat ik de overeenkomst behorend bij deze boeking wil herroepen.
              </span>
            </label>

            {melding && (
              <p className={`rounded-xl px-4 py-3 text-sm font-semibold ${gelukt ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-900"}`}>
                {melding}
              </p>
            )}

            <button
              type="submit"
              disabled={bezig}
              className="w-full rounded-xl bg-blue-600 px-6 py-4 text-base font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {bezig ? "Herroeping verzenden..." : "Herroeping bevestigen"}
            </button>
          </form>

          <div className="mt-7 space-y-3 text-sm leading-6 text-slate-600">
            <p>
              Deze functie is bedoeld voor het wettelijke herroepingsrecht bij overeenkomsten op afstand. Een gewone annulering van een geplande opdracht kan andere gevolgen hebben volgens de algemene voorwaarden en het annuleringsbeleid.
            </p>
            <p>
              Kun je je boekingsnummer niet vinden? Mail dan <a href="mailto:info@shinego.nl" className="font-semibold text-blue-600 underline hover:text-blue-700">info@shinego.nl</a> en vermeld het e-mailadres waarmee je hebt geboekt.
            </p>
            <p className="text-slate-500">ShineGo · KvK 57712913 · btw-id NL001205368B47</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            <a href="/voorwaarden" className="font-semibold text-blue-600 hover:text-blue-700">Algemene voorwaarden →</a>
            <a href="/contact" className="font-semibold text-blue-600 hover:text-blue-700">Contact →</a>
          </div>
        </div>
      </div>
    </main>
  );
}
