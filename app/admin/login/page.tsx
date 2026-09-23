"use client";

import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const [stap, setStap] = useState<"request" | "code">("request");
  const [code, setCode] = useState("");
  const [bezig, setBezig] = useState(false);
  const [melding, setMelding] = useState("");

  async function verstuurCode() {
    setBezig(true);
    setMelding("");

    try {
      const response = await fetch("/api/admin-auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await response.json();

      if (!response.ok) {
        setMelding(data.error || "De inlogcode kon niet worden verstuurd.");
        return;
      }

      setStap("code");
      setMelding("Er is een 6-cijferige inlogcode verstuurd naar het beheer-e-mailadres.");
    } catch {
      setMelding("De inlogcode kon niet worden verstuurd. Probeer het opnieuw.");
    } finally {
      setBezig(false);
    }
  }

  async function controleerCode(event: FormEvent) {
    event.preventDefault();
    setBezig(true);
    setMelding("");

    try {
      const response = await fetch("/api/admin-auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMelding(data.error || "Verificatie mislukt.");
        return;
      }

      window.location.href = "/admin";
    } catch {
      setMelding("Verificatie mislukt. Probeer het opnieuw.");
    } finally {
      setBezig(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto w-full max-w-md">
        <a href="/" className="text-2xl font-bold text-blue-600">ShineGo</a>

        <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold text-blue-600">Beveiligde beheeromgeving</p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">Admin inloggen</h1>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Toegang tot de beheeromgeving wordt bevestigd met een eenmalige code via het vaste ShineGo-beheer-e-mailadres.
            </p>
          </div>

          {stap === "request" ? (
            <div>
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
                De inlogcode wordt alleen naar het ingestelde beheer-e-mailadres gestuurd en is 10 minuten geldig.
              </div>

              <button
                type="button"
                onClick={verstuurCode}
                disabled={bezig}
                className="mt-5 w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 disabled:bg-gray-300"
              >
                {bezig ? "Code versturen..." : "Stuur inlogcode →"}
              </button>
            </div>
          ) : (
            <form onSubmit={controleerCode}>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-800">6-cijferige inlogcode</span>
                <input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-center text-2xl font-bold tracking-[0.35em] text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  required
                  autoFocus
                />
              </label>

              <button
                type="submit"
                disabled={bezig || code.length !== 6}
                className="mt-5 w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 disabled:bg-gray-300"
              >
                {bezig ? "Controleren..." : "Inloggen →"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStap("request");
                  setCode("");
                  setMelding("");
                }}
                className="mt-3 w-full px-4 py-2 text-sm font-semibold text-gray-600"
              >
                ← Nieuwe code aanvragen
              </button>
            </form>
          )}

          {melding && (
            <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
              {melding}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
