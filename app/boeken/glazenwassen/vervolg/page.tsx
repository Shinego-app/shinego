"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function VervolgBetalingPage() {
  const params = useSearchParams();
  const bookingId = params.get("booking") || "";
  const checkoutToken = params.get("token") || "";
  const [bezig, setBezig] = useState(false);
  const [melding, setMelding] = useState("");

  const geldig = useMemo(
    () => Boolean(bookingId && checkoutToken && /^\d+$/.test(bookingId)),
    [bookingId, checkoutToken]
  );

  async function betalen() {
    if (!geldig || bezig) return;
    setBezig(true);
    setMelding("");

    try {
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          checkoutToken,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.url) {
        setMelding(data.error || "Betaling kon niet worden gestart.");
        setBezig(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setMelding("Betaling kon niet worden gestart. Probeer het opnieuw.");
      setBezig(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#eaf6ff] to-[#f8fcff] px-4 py-10 text-[#123c70] sm:px-6">
      <div className="mx-auto max-w-xl">
        <a href="/" className="text-[29px] font-extrabold tracking-tight text-[#0d3f79]">
          Shine<span className="text-[#1683f8]">Go</span>
          <span className="ml-1 text-[#1683f8]">✦</span>
        </a>

        <section className="mt-8 rounded-[28px] border border-[#d5e9f8] bg-white p-6 shadow-[0_18px_50px_rgba(46,79,119,.12)] sm:p-9">
          <div className="inline-flex rounded-full bg-[#e7f4ff] px-4 py-2 text-sm font-extrabold text-[#1678d4]">
            Terugkerende afspraak
          </div>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[#0b3d75]">
            Bevestig je volgende glasbewassing
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#607b98] sm:text-base">
            ShineGo schrijft niets automatisch af. Met de knop hieronder betaal en bevestig je alleen deze volgende afspraak.
          </p>

          {!geldig ? (
            <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-800">
              Deze betaallink is niet compleet of niet meer geldig. Gebruik de nieuwste e-mail van ShineGo.
            </div>
          ) : (
            <button
              type="button"
              onClick={betalen}
              disabled={bezig}
              className="mt-7 w-full rounded-xl bg-[#1683f8] px-6 py-4 text-base font-extrabold text-white shadow-[0_10px_25px_rgba(22,131,248,.25)] disabled:opacity-50"
            >
              {bezig ? "Veilige betaling openen..." : "Afspraak betalen en bevestigen →"}
            </button>
          )}

          {melding && (
            <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
              {melding}
            </div>
          )}

          <p className="mt-6 text-xs leading-5 text-[#7890a8]">
            Na betaling wordt de opdracht beschikbaar gemaakt voor een passende glazenwasser. Waar mogelijk houden we rekening met de professional van je vorige afspraak.
          </p>
        </section>
      </div>
    </main>
  );
}
