"use client";

import { useEffect, useState } from "react";

type Gegevens = {
  woningtype: string;
  verdiepingen: string[];
  ramen: number;
  glasOppervlak: string;
  telescoop: boolean;
  type: string;
  frequentie: string;
};

export default function DetailsPage() {
  const [gegevens, setGegevens] = useState<Gegevens | null>(null);
  const [bereikbaar, setBereikbaar] = useState("");
  const [kozijnen, setKozijnen] = useState(false);
  const [opmerking, setOpmerking] = useState("");

  useEffect(() => {
    const opgeslagen = localStorage.getItem("shinegoGlazenwassen");
    if (!opgeslagen) return;
    const opgeslagenGegevens: Gegevens = JSON.parse(opgeslagen);
    if (opgeslagenGegevens.woningtype === "bedrijfspand" && opgeslagenGegevens.glasOppervlak === "500+") {
      window.location.href = "/contact?offerte=500plus";
      return;
    }
    setGegevens(opgeslagenGegevens);
  }, []);

  const kanVerder = bereikbaar !== "";

  function gaVerder() {
    if (!kanVerder) return;
    localStorage.setItem("shinegoGlazenwassenDetails", JSON.stringify({ bereikbaar, kozijnen, opmerking }));
    window.location.href = "/boeken/glazenwassen/prijs";
  }

  const stappen = ["Keuze", "Situatie", "Details", "Prijs", "Gegevens"];

  return (
    <main className="min-h-screen bg-[#eef8ff] text-[#0b2b5b]">
      <header className="border-b border-sky-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="/" className="text-2xl font-extrabold tracking-tight text-[#0b3d75]">Shine<span className="text-[#1683f8]">Go✦</span></a>
          <a href="/boeken/glazenwassen" className="rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-bold text-[#245d91]">← Terug</a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
        <div className="mb-7 rounded-3xl border border-sky-100 bg-white/75 px-4 py-4 shadow-sm sm:px-6">
          <div className="grid grid-cols-5 gap-1 sm:gap-3">
            {stappen.map((stap, index) => {
              const nummer = index + 1;
              const actief = nummer === 3;
              const klaar = nummer < 3;
              return (
                <div key={stap} className="text-center">
                  <div className="flex items-center">
                    <div className={`h-px flex-1 ${index === 0 ? "bg-transparent" : klaar || actief ? "bg-[#9fd1ff]" : "bg-sky-100"}`} />
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${actief ? "bg-[#1683f8] text-white shadow-md" : klaar ? "bg-[#dff1ff] text-[#1177df]" : "border border-sky-200 bg-white text-[#66809a]"}`}>{nummer}</div>
                    <div className={`h-px flex-1 ${index === stappen.length - 1 ? "bg-transparent" : klaar ? "bg-[#9fd1ff]" : "bg-sky-100"}`} />
                  </div>
                  <div className={`mt-2 text-[10px] font-semibold sm:text-xs ${actief ? "text-[#1177df]" : "text-[#66809a]"}`}>{stap}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-sky-100 bg-gradient-to-br from-white via-[#f8fcff] to-[#dff1ff] p-5 shadow-lg sm:p-8">
          <div className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-[#bfe3ff]/45 blur-3xl" />
          <div className="relative grid gap-7 lg:grid-cols-[1.15fr_.85fr] lg:gap-10">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#1683f8]">Details</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Nog een paar details</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[#5b7591]">Hiermee kunnen we de opdracht en prijs beter bepalen.</p>

              {gegevens && (
                <div className="mt-7 grid gap-3 rounded-2xl border border-sky-100 bg-[#eaf5ff] p-5 sm:grid-cols-3">
                  <div><div className="text-xs font-bold uppercase tracking-wide text-[#66809a]">Woningtype</div><div className="mt-1 font-extrabold">{gegevens.woningtype}</div></div>
                  <div><div className="text-xs font-bold uppercase tracking-wide text-[#66809a]">Verdiepingen</div><div className="mt-1 font-extrabold">{gegevens.verdiepingen.length ? gegevens.verdiepingen.join(", ") : "-"}</div></div>
                  <div><div className="text-xs font-bold uppercase tracking-wide text-[#66809a]">Aantal ramen</div><div className="mt-1 font-extrabold">{gegevens.ramen}</div></div>
                </div>
              )}

              <div className="mt-6 rounded-2xl border border-sky-100 bg-white/90 p-5">
                <h2 className="text-xl font-extrabold">1. Zijn alle ramen goed bereikbaar?</h2>
                <p className="mt-2 text-sm leading-6 text-[#66809a]">De verdieping heb je al gekozen. Hier gaat het alleen om obstakels zoals een serre, uitbouw of schuin dak.</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <button type="button" onClick={() => setBereikbaar("ja")} className={`rounded-2xl border-2 p-5 text-left transition ${bereikbaar === "ja" ? "border-[#1683f8] bg-[#eaf5ff] shadow-md" : "border-sky-100 bg-[#f8fcff] hover:border-sky-300"}`}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl shadow-sm">✓</div>
                    <h3 className="mt-4 font-extrabold">Goed bereikbaar</h3>
                    <p className="mt-1 text-sm leading-5 text-[#66809a]">Normaal bereikbaar vanaf de grond, balkon of een veilige werkplek.</p>
                  </button>
                  <button type="button" onClick={() => setBereikbaar("nee")} className={`rounded-2xl border-2 p-5 text-left transition ${bereikbaar === "nee" ? "border-[#1683f8] bg-[#eaf5ff] shadow-md" : "border-sky-100 bg-[#f8fcff] hover:border-sky-300"}`}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl shadow-sm">🪜</div>
                    <h3 className="mt-4 font-extrabold">Extra lastig bereikbaar</h3>
                    <p className="mt-1 text-sm leading-5 text-[#66809a]">Bijvoorbeeld boven een serre, uitbouw, obstakel of schuin dak.</p>
                  </button>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-sky-100 bg-white/90 p-5">
                <h2 className="text-xl font-extrabold">2. Kozijnen schoonmaken?</h2>
                <button type="button" onClick={() => setKozijnen(!kozijnen)} className={`mt-4 w-full rounded-2xl border-2 p-5 text-left transition ${kozijnen ? "border-[#1683f8] bg-[#eaf5ff]" : "border-sky-100 bg-[#f8fcff] hover:border-sky-300"}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div><div className="font-extrabold">Kozijnen meenemen</div><div className="mt-1 text-sm text-[#66809a]">Ook de kozijnen rondom de ramen schoonmaken.</div></div>
                    <div className={`relative h-7 w-12 shrink-0 rounded-full ${kozijnen ? "bg-[#1683f8]" : "bg-sky-100"}`}><div className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${kozijnen ? "left-6" : "left-1"}`} /></div>
                  </div>
                </button>
              </div>

              <div className="mt-6 rounded-2xl border border-sky-100 bg-white/90 p-5">
                <h2 className="text-xl font-extrabold">3. Wil je nog iets doorgeven?</h2>
                <p className="mt-1 text-sm text-[#66809a]">Niet verplicht.</p>
                <textarea value={opmerking} onChange={(e) => setOpmerking(e.target.value)} placeholder="Bijvoorbeeld: achterzijde bereikbaar via de tuin..." rows={4} className="mt-4 w-full resize-none rounded-2xl border border-sky-200 bg-white p-4 text-[#0b2b5b] outline-none" />
              </div>
            </div>

            <aside className="lg:pt-12">
              <div className="sticky top-24 overflow-hidden rounded-[1.75rem] border border-sky-100 bg-white/90 shadow-lg">
                <div className="bg-gradient-to-br from-[#dff1ff] via-[#eef8ff] to-white p-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">✨</div>
                  <h2 className="mt-5 text-2xl font-extrabold">Veilig en duidelijk</h2>
                  <p className="mt-2 leading-6 text-[#66809a]">We rekenen bereikbaarheid vooraf mee, zodat je straks niet voor verrassingen staat.</p>
                </div>
                <div className="space-y-4 p-6 text-sm">
                  <div className="flex gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#eaf5ff]">🛡️</span><div><strong className="block">Veilig werken</strong><span className="text-[#66809a]">Geen onnodige risico's op hoogte</span></div></div>
                  <div className="flex gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#eaf5ff]">💶</span><div><strong className="block">Prijs vooraf</strong><span className="text-[#66809a]">Toeslagen worden vooraf getoond</span></div></div>
                </div>
              </div>
            </aside>
          </div>

          <div className="relative mt-8 flex flex-col-reverse gap-3 border-t border-sky-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <a href="/boeken/glazenwassen" className="rounded-xl border border-sky-200 bg-white px-6 py-3.5 text-center font-bold text-[#245d91]">← Terug</a>
            <button type="button" disabled={!kanVerder} onClick={gaVerder} className={`rounded-xl px-7 py-4 text-base font-extrabold transition ${kanVerder ? "bg-[#1683f8] text-white shadow-lg hover:bg-[#0d6fd8]" : "cursor-not-allowed bg-sky-100 text-[#9ab0c4]"}`}>Bekijk prijs →</button>
          </div>
        </div>
      </section>
    </main>
  );
}
