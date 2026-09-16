"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ReviewPage() {
  const params = useParams<{ token: string }>();
  const token = params?.token || "";
  const [laden, setLaden] = useState(true);
  const [fout, setFout] = useState("");
  const [gegevens, setGegevens] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [opmerking, setOpmerking] = useState("");
  const [versturen, setVersturen] = useState(false);
  const [klaar, setKlaar] = useState(false);

  useEffect(() => {
    if (!token) return;

    async function laadReview() {
      const response = await fetch(`/api/review?token=${encodeURIComponent(token)}`);
      const result = await response.json();

      if (!response.ok) {
        setFout(result.error || "Deze reviewlink kan niet worden geopend.");
      } else {
        setGegevens(result);
        if (result.al_beoordeeld) {
          setRating(result.review?.rating || 0);
          setOpmerking(result.review?.opmerking || "");
          setKlaar(true);
        }
      }
      setLaden(false);
    }

    laadReview();
  }, [token]);

  async function verstuurReview() {
    setFout("");
    if (rating < 1) {
      setFout("Kies eerst hoeveel sterren je wilt geven.");
      return;
    }

    setVersturen(true);
    const response = await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, rating, opmerking }),
    });
    const result = await response.json();
    setVersturen(false);

    if (!response.ok) {
      setFout(result.error || "Je review kon niet worden opgeslagen.");
      return;
    }

    setKlaar(true);
  }

  if (laden) {
    return <main className="min-h-screen bg-gray-50 px-4 py-12"><div className="mx-auto max-w-xl">Review laden...</div></main>;
  }

  if (fout && !gegevens) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Review</h1>
          <p className="mt-3 text-gray-700">{fout}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-blue-600">ShineGo</p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Hoe was je ervaring?</h1>
        <p className="mt-3 text-gray-600">
          {gegevens?.voornaam ? `Hoi ${gegevens.voornaam}, ` : ""}
          beoordeel de uitgevoerde opdracht van <strong>{gegevens?.bedrijfsnaam}</strong>.
        </p>

        <div className="mt-7">
          <p className="mb-3 font-semibold text-gray-900">Jouw beoordeling</p>
          <div className="flex gap-2" aria-label="Kies 1 tot 5 sterren">
            {[1, 2, 3, 4, 5].map((ster) => (
              <button
                key={ster}
                type="button"
                disabled={klaar}
                onClick={() => setRating(ster)}
                aria-label={`${ster} ster${ster === 1 ? "" : "ren"}`}
                className={`text-4xl leading-none ${ster <= rating ? "text-amber-400" : "text-gray-300"} disabled:cursor-default`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <label className="mt-7 block">
          <span className="mb-2 block font-semibold text-gray-900">Toelichting <span className="font-normal text-gray-500">(optioneel)</span></span>
          <textarea
            value={opmerking}
            disabled={klaar}
            onChange={(e) => setOpmerking(e.target.value)}
            maxLength={1000}
            rows={5}
            placeholder="Vertel kort wat goed ging of wat beter kon."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
          />
          {!klaar && <span className="mt-1 block text-right text-xs text-gray-500">{opmerking.length}/1000</span>}
        </label>

        {fout && <p className="mt-4 text-sm font-medium text-red-600">{fout}</p>}

        {klaar ? (
          <div className="mt-6 rounded-xl bg-green-50 p-4 text-green-800">
            <strong>Bedankt voor je beoordeling.</strong>
            <p className="mt-1 text-sm">Je review is opgeslagen.</p>
          </div>
        ) : (
          <button
            type="button"
            onClick={verstuurReview}
            disabled={versturen || rating < 1}
            className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {versturen ? "Review versturen..." : "Review versturen"}
          </button>
        )}
      </div>
    </main>
  );
}
