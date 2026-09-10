"use client";

import { useEffect, useState } from "react";

export default function GlazenwassenPage() {
  const [woningtype, setWoningtype] = useState("");
  const [verdiepingen, setVerdiepingen] = useState<string[]>([]);
  const [ramen, setRamen] = useState(0);
  const [glasOppervlak, setGlasOppervlak] = useState("");
  const [telescoop, setTelescoop] = useState(false);
  const [type, setType] = useState("");
  const [frequentie, setFrequentie] = useState("eenmalig");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setType(params.get("type") || "");
  }, []);

  const woningtypes = [
    { id: "tussenwoning", naam: "Tussenwoning", icoon: "🏠", uitleg: "Rijtjeshuis / tussenwoning" },
    { id: "hoekwoning", naam: "Hoekwoning", icoon: "🏡", uitleg: "Woning met extra zijramen" },
    { id: "vrijstaand", naam: "Vrijstaande woning", icoon: "🏘️", uitleg: "Vrijstaande woning" },
    { id: "appartement", naam: "Appartement / flat", icoon: "🏢", uitleg: "Appartement of flat" },
    { id: "bedrijfspand", naam: "Winkel / bedrijfspand", icoon: "🏬", uitleg: "Voor zakelijke panden" },
  ];

  const kanVerder =
    woningtype !== "" &&
    (woningtype === "appartement" || verdiepingen.length > 0) &&
    (woningtype === "bedrijfspand"
      ? glasOppervlak !== "" && glasOppervlak !== "500+"
      : ramen > 0);

  function opgeslagenGegevens() {
    return {
      woningtype,
      verdiepingen,
      ramen,
      glasOppervlak,
      telescoop,
      type,
      frequentie,
    };
  }

  function gaVerder() {
    if (!kanVerder) return;
    localStorage.setItem("shinegoGlazenwassen", JSON.stringify(opgeslagenGegevens()));
    window.location.href = `/boeken/glazenwassen/details?type=${type}`;
  }

  function offerteAanvragen() {
    localStorage.setItem("shinegoGlazenwassen", JSON.stringify(opgeslagenGegevens()));
    window.location.href = `/boeken/glazenwassen/details?type=${type}`;
  }

  const stappen = ["Keuze", "Situatie", "Details", "Prijs", "Gegevens"];

  return (
    <main className="min-h-screen bg-[#eef8ff] text-[#0b2b5b]">
      <header className="border-b border-sky-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="/" className="text-2xl font-extrabold tracking-tight text-[#0b3d75]">
            Shine<span className="text-[#1683f8]">Go✦</span>
          </a>
          <a href="/boeken" className="rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-bold text-[#245d91] hover:border-sky-300">
            ← Terug
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
        <div className="mb-7 rounded-3xl border border-sky-100 bg-white/75 px-4 py-4 shadow-sm sm:px-6">
          <div className="grid grid-cols-5 gap-1 sm:gap-3">
            {stappen.map((stap, index) => {
              const nummer = index + 1;
              const actief = nummer === 2;
              const klaar = nummer < 2;
              return (
                <div key={stap} className="text-center">
                  <div className="flex items-center">
                    <div className={`h-px flex-1 ${index === 0 ? "bg-transparent" : klaar || actief ? "bg-[#9fd1ff]" : "bg-sky-100"}`} />
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${actief ? "bg-[#1683f8] text-white shadow-md" : klaar ? "bg-[#dff1ff] text-[#1177df]" : "border border-sky-200 bg-white text-[#66809a]"}`}>
                      {nummer}
                    </div>
                    <div className={`h-px flex-1 ${index === stappen.length - 1 ? "bg-transparent" : klaar ? "bg-[#9fd1ff]" : "bg-sky-100"}`} />
                  </div>
                  <div className={`mt-2 text-[10px] font-semibold sm:text-xs ${actief ? "text-[#1177df]" : "text-[#66809a]"}`}>{stap}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-sky-100 bg-gradient-to-br from-white via-[#f7fbff] to-[#dff1ff] p-5 shadow-lg sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#bfe3ff]/50 blur-3xl" />
          <div className="relative grid gap-7 lg:grid-cols-[1.2fr_.8fr] lg:gap-10">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#1683f8]">Jouw situatie</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0b2b5b] sm:text-4xl">Vertel ons wat we gaan schoonmaken</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[#5b7591]">Kies je woning, het aantal ramen en wat er nodig is. We gebruiken dit om straks een duidelijke prijs te berekenen.</p>

              <div className="mt-7">
                <h2 className="text-lg font-extrabold text-[#0b2b5b]">1. Kies jouw situatie</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {woningtypes.map((woning) => {
                    const gekozen = woningtype === woning.id;
                    return (
                      <button
                        key={woning.id}
                        type="button"
                        onClick={() => setWoningtype(woning.id)}
                        className={`group rounded-2xl border-2 p-4 text-left transition sm:p-5 ${gekozen ? "border-[#1683f8] bg-[#eaf5ff] shadow-md" : "border-[#d9e9f7] bg-white/90 hover:border-[#9fd1ff] hover:bg-[#f5fbff]"}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eef8ff] text-2xl">{woning.icoon}</div>
                          <div className="min-w-0">
                            <div className="font-extrabold text-[#0b2b5b]">{woning.naam}</div>
                            <div className="mt-1 text-sm leading-5 text-[#66809a]">{woning.uitleg}</div>
                          </div>
                          <div className={`ml-auto mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${gekozen ? "bg-[#1683f8] text-white" : "border border-sky-200 text-transparent"}`}>✓</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {woningtype !== "" && (
                <>
                  {woningtype !== "bedrijfspand" && (
                    <div className="mt-6 rounded-2xl border border-sky-100 bg-white/90 p-5">
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h2 className="text-lg font-extrabold text-[#0b2b5b]">2. Aantal ramen</h2>
                          <p className="mt-1 text-sm text-[#66809a]">Tel de ramen die je wilt laten reinigen.</p>
                        </div>
                        <div className="flex items-center gap-4 rounded-2xl bg-[#eef8ff] p-2">
                          <button type="button" onClick={() => setRamen(Math.max(0, ramen - 1))} className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-200 bg-white text-2xl font-bold text-[#245d91]">−</button>
                          <div className="min-w-16 text-center">
                            <div className="text-3xl font-extrabold text-[#0b2b5b]">{ramen}</div>
                            <div className="text-xs text-[#66809a]">ramen</div>
                          </div>
                          <button type="button" onClick={() => setRamen(ramen + 1)} className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1683f8] text-2xl font-bold text-white shadow-md">+</button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 rounded-2xl border border-sky-100 bg-white/90 p-5">
                    <h2 className="text-lg font-extrabold text-[#0b2b5b]">3. Verdiepingen</h2>
                    <p className="mt-1 text-sm text-[#66809a]">Welke verdiepingen moeten worden gewassen?</p>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {["1", "2", "3"].map((aantal) => {
                        const gekozen = verdiepingen.includes(aantal);
                        return (
                          <button
                            key={aantal}
                            type="button"
                            onClick={() => setVerdiepingen((vorige) => vorige.includes(aantal) ? vorige.filter((v) => v !== aantal) : [...vorige, aantal])}
                            className={`rounded-xl border-2 px-3 py-3 text-sm font-extrabold transition ${gekozen ? "border-[#1683f8] bg-[#1683f8] text-white" : "border-sky-100 bg-[#f8fcff] text-[#245d91] hover:border-sky-300"}`}
                          >
                            {aantal === "1" ? "1e" : aantal === "2" ? "2e" : "3e"}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <button type="button" onClick={() => setTelescoop(!telescoop)} className={`rounded-2xl border-2 p-5 text-left transition ${telescoop ? "border-[#1683f8] bg-[#eaf5ff]" : "border-sky-100 bg-white/90 hover:border-sky-300"}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-extrabold text-[#0b2b5b]">Telescoopsteel nodig?</div>
                          <div className="mt-1 text-sm text-[#66809a]">Voor hogere of lastig bereikbare ramen</div>
                        </div>
                        <div className={`relative h-7 w-12 shrink-0 rounded-full transition ${telescoop ? "bg-[#1683f8]" : "bg-sky-100"}`}>
                          <div className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${telescoop ? "left-6" : "left-1"}`} />
                        </div>
                      </div>
                    </button>

                    <div className="rounded-2xl border border-sky-100 bg-[#eaf5ff] p-5">
                      <div className="font-extrabold text-[#0b3d75]">✓ Duidelijke prijs vooraf</div>
                      <div className="mt-1 text-sm leading-5 text-[#5b7591]">Hoogte en bereikbaarheid worden meegenomen vóórdat je betaalt.</div>
                    </div>
                  </div>
                </>
              )}

              {woningtype === "bedrijfspand" && (
                <div className="mt-6 rounded-2xl border border-sky-100 bg-white/90 p-5">
                  <h2 className="text-lg font-extrabold text-[#0b2b5b]">2. Hoeveel m² glas?</h2>
                  <p className="mt-1 text-sm text-[#66809a]">Kies het geschatte totale glasoppervlak.</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {[
                      ["0-15", "Tot 15 m²"], ["16-30", "16 - 30 m²"], ["31-50", "31 - 50 m²"],
                      ["51-100", "51 - 100 m²"], ["101-200", "101 - 200 m²"], ["201-500", "201 - 500 m²"], ["500+", "Meer dan 500 m²"],
                    ].map(([waarde, label]) => (
                      <button key={waarde} type="button" onClick={() => setGlasOppervlak(waarde)} className={`rounded-xl border-2 p-3 text-left text-sm font-bold transition ${glasOppervlak === waarde ? "border-[#1683f8] bg-[#eaf5ff] text-[#0b3d75]" : "border-sky-100 bg-[#f8fcff] text-[#466482] hover:border-sky-300"}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                  {glasOppervlak === "500+" && <p className="mt-3 rounded-xl bg-[#eaf5ff] p-3 text-sm font-semibold text-[#245d91]">Meer dan 500 m²? We maken hiervoor een offerte op maat.</p>}
                </div>
              )}

              <div className="mt-6 rounded-2xl border border-sky-100 bg-white/90 p-5">
                <h2 className="text-lg font-extrabold text-[#0b2b5b]">Hoe vaak wil je de ramen laten wassen?</h2>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {[
                    { id: "eenmalig", label: "Eenmalig", korting: "" },
                    { id: "4weken", label: "Elke 4 weken", korting: "12% korting" },
                    { id: "8weken", label: "Elke 8 weken", korting: "10% korting" },
                    { id: "12weken", label: "Elke 12 weken", korting: "7% korting" },
                  ].map((optie) => (
                    <button key={optie.id} type="button" onClick={() => setFrequentie(optie.id)} className={`rounded-xl border-2 p-4 text-left transition ${frequentie === optie.id ? "border-[#1683f8] bg-[#eaf5ff]" : "border-sky-100 bg-[#f8fcff] hover:border-sky-300"}`}>
                      <div className="font-extrabold text-[#0b2b5b]">{optie.label}</div>
                      {optie.korting && <div className="mt-1 text-sm font-bold text-emerald-600">{optie.korting}</div>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <aside className="lg:pt-12">
              <div className="sticky top-24 overflow-hidden rounded-[1.75rem] border border-sky-100 bg-white/90 shadow-lg">
                <div className="bg-gradient-to-br from-[#dff1ff] via-[#eef8ff] to-white p-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">🪟</div>
                  <h2 className="mt-5 text-2xl font-extrabold text-[#0b2b5b]">Rustig en duidelijk boeken</h2>
                  <p className="mt-2 leading-6 text-[#66809a]">Je ziet straks precies hoe je prijs is opgebouwd.</p>
                </div>
                <div className="space-y-4 p-6 text-sm">
                  <div className="flex items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#eaf5ff]">🛡️</span><div><strong className="block text-[#0b2b5b]">Vaste prijzen</strong><span className="text-[#66809a]">Geen verrassingen achteraf</span></div></div>
                  <div className="flex items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#eaf5ff]">✓</span><div><strong className="block text-[#0b2b5b]">Betrouwbare professionals</strong><span className="text-[#66809a]">Gecontroleerd via ShineGo</span></div></div>
                  <div className="flex items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#eaf5ff]">📅</span><div><strong className="block text-[#0b2b5b]">Snel een afspraak</strong><span className="text-[#66809a]">Wanneer het jou uitkomt</span></div></div>
                </div>
              </div>
            </aside>
          </div>

          <div className="relative mt-8 flex flex-col-reverse gap-3 border-t border-sky-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <a href="/boeken" className="rounded-xl border border-sky-200 bg-white px-6 py-3.5 text-center font-bold text-[#245d91]">← Vorige</a>
            {woningtype === "bedrijfspand" && glasOppervlak === "500+" ? (
              <button type="button" onClick={offerteAanvragen} className="rounded-xl bg-[#1683f8] px-7 py-4 text-base font-extrabold text-white shadow-lg hover:bg-[#0d6fd8]">Offerte aanvragen →</button>
            ) : (
              <button type="button" disabled={!kanVerder} onClick={gaVerder} className={`rounded-xl px-7 py-4 text-base font-extrabold transition ${kanVerder ? "bg-[#1683f8] text-white shadow-lg hover:bg-[#0d6fd8]" : "cursor-not-allowed bg-sky-100 text-[#9ab0c4]"}`}>Verder →</button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
