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
  const [ramen, setRamen] = useState(0);
  const [verdiepingen, setVerdiepingen] = useState<string[]>(["1"]);
  const [glasOppervlak, setGlasOppervlak] = useState("");
  const [telescoop, setTelescoop] = useState(false);
  const [kozijnen, setKozijnen] = useState(false);
  const [bereikbaar, setBereikbaar] = useState("ja");
  const [frequentie, setFrequentie] = useState("eenmalig");

  useEffect(() => {
    const opgeslagen = localStorage.getItem("shinegoGlazenwassen");
    if (!opgeslagen) {
      window.location.href = "/boeken/glazenwassen";
      return;
    }
    const data: Gegevens = JSON.parse(opgeslagen);
    setGegevens(data);
    setRamen(data.ramen || 0);
    setVerdiepingen(data.verdiepingen?.length ? data.verdiepingen : data.woningtype === "appartement" ? [] : ["1"]);
    setGlasOppervlak(data.glasOppervlak || "");
    setTelescoop(Boolean(data.telescoop));
    setFrequentie(data.frequentie || "eenmalig");
  }, []);

  const bedrijf = gegevens?.woningtype === "bedrijfspand";
  const kanVerder = Boolean(gegevens) && (bedrijf ? glasOppervlak !== "" : ramen > 0);

  function toggleVerdieping(verdieping: string) {
    setVerdiepingen((vorige) =>
      vorige.includes(verdieping) ? vorige.filter((v) => v !== verdieping) : [...vorige, verdieping]
    );
  }

  function gaVerder() {
    if (!gegevens || !kanVerder) return;

    const bijgewerkt: Gegevens = {
      ...gegevens,
      ramen,
      verdiepingen,
      glasOppervlak,
      telescoop,
      frequentie,
    };

    localStorage.setItem("shinegoGlazenwassen", JSON.stringify(bijgewerkt));
    localStorage.setItem(
      "shinegoGlazenwassenDetails",
      JSON.stringify({ bereikbaar, kozijnen, opmerking: "" })
    );

    if (bedrijf && glasOppervlak === "500+") {
      window.location.href = "/contact?offerte=500plus";
      return;
    }

    window.location.href = "/boeken/glazenwassen/prijs";
  }

  const stappen = ["Keuze", "Details", "Prijs", "Gegevens", "Bevestigen"];

  return (
    <main className="min-h-screen bg-[#fbfdff] text-[#16355f]">
      <div className="mx-auto max-w-5xl px-5 py-7 sm:px-8 sm:py-10">
        <header className="flex items-center justify-between">
          <a href="/" className="text-[28px] font-extrabold tracking-tight text-[#123c70]">Shine<span className="text-[#4d7ef0]">Go</span><span className="ml-1 text-[#6e96f5]">✦</span></a>
          <a href="/" aria-label="Menu" className="flex h-10 w-10 items-center justify-center rounded-xl text-2xl text-[#6b83a2] hover:bg-[#f0f5ff]">≡</a>
        </header>

        <div className="mt-4 grid grid-cols-5 gap-1">
          {stappen.map((stap, index) => {
            const actief = index === 1;
            const klaar = index < 1;
            return (
              <div key={stap} className="text-center">
                <div className="flex items-center">
                  <span className={`h-px flex-1 ${index === 0 ? "bg-transparent" : klaar || actief ? "bg-[#b9c9ed]" : "bg-[#e2eaf6]"}`} />
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${actief ? "bg-[#4f78e8] text-white" : klaar ? "bg-[#e9efff] text-[#4f78e8]" : "text-[#7690ad]"}`}>{index + 1}</span>
                  <span className={`h-px flex-1 ${index === 4 ? "bg-transparent" : klaar ? "bg-[#b9c9ed]" : "bg-[#e2eaf6]"}`} />
                </div>
                <div className={`mt-1 text-[10px] sm:text-xs ${actief ? "font-bold text-[#4f78e8]" : "text-[#7c91aa]"}`}>{stap}</div>
              </div>
            );
          })}
        </div>

        <section className="mt-7 overflow-hidden rounded-[30px] bg-white shadow-[0_18px_60px_rgba(45,77,120,0.10)]">
          <div className="grid lg:grid-cols-[1.18fr_.82fr]">
            <div className="px-5 py-7 sm:px-9 sm:py-9">
              <h1 className="text-3xl font-extrabold tracking-tight text-[#18375f] sm:text-4xl">Jouw situatie</h1>
              <p className="mt-2 text-sm text-[#778ba4] sm:text-base">Geef aan wat van toepassing is.</p>

              {!gegevens ? (
                <p className="mt-8 text-[#7c91aa]">Gegevens laden...</p>
              ) : (
                <>
                  {bedrijf ? (
                    <div className="mt-8">
                      <label className="text-sm font-bold text-[#385575]">Hoeveel m² glas?</label>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {[
                          ["0-15", "Tot 15 m²"], ["16-30", "16 - 30 m²"], ["31-50", "31 - 50 m²"],
                          ["51-100", "51 - 100 m²"], ["101-200", "101 - 200 m²"], ["201-500", "201 - 500 m²"], ["500+", "Meer dan 500 m²"],
                        ].map(([waarde, label]) => (
                          <button key={waarde} type="button" onClick={() => setGlasOppervlak(waarde)} className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold ${glasOppervlak === waarde ? "border-[#5c82e8] bg-[#f0f4ff] text-[#264b8a]" : "border-[#dde6f1] bg-white text-[#536c87]"}`}>{label}</button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mt-8 flex items-center justify-between border-b border-[#edf2f7] pb-5">
                        <div><div className="text-sm font-bold text-[#385575]">Aantal ramen</div><div className="mt-1 text-xs text-[#8998aa]">Buitenzijde van de ramen</div></div>
                        <div className="flex items-center gap-5">
                          <button type="button" onClick={() => setRamen(Math.max(0, ramen - 1))} className="h-9 w-9 rounded-full text-xl text-[#7b91aa] hover:bg-[#f2f6fb]">−</button>
                          <div className="min-w-8 text-center text-2xl font-extrabold text-[#294b75]">{ramen}</div>
                          <button type="button" onClick={() => setRamen(ramen + 1)} className="h-9 w-9 rounded-full text-xl font-bold text-[#5880e7] hover:bg-[#eef3ff]">+</button>
                        </div>
                      </div>

                      <div className="border-b border-[#edf2f7] py-5">
                        <div className="text-sm font-bold text-[#385575]">Verdiepingen</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {["1", "2", "3"].map((v) => (
                            <button key={v} type="button" onClick={() => toggleVerdieping(v)} className={`min-w-24 rounded-xl border px-4 py-2.5 text-sm font-semibold ${verdiepingen.includes(v) ? "border-[#6287ef] bg-[#eef3ff] text-[#3f66cb]" : "border-[#dde6f1] bg-white text-[#708399]"}`}>{v === "1" ? "Begane grond" : `${v}e verdieping`}</button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="mt-5 rounded-2xl bg-[#f5f8ff] px-4 py-3.5 text-sm text-[#617696]">
                    <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#5f84e8] text-xs font-bold text-white">i</span>
                    <strong>{verdiepingen.includes("3") ? "3e verdieping geselecteerd." : "Hoogte wordt vooraf meegenomen."}</strong> We gebruiken alleen veilige werkmethodes.
                  </div>

                  <div className="mt-6 space-y-1">
                    <button type="button" onClick={() => setTelescoop(!telescoop)} className="flex w-full items-center justify-between py-3 text-left">
                      <div><div className="text-sm font-bold text-[#385575]">Telescoopsteel nodig?</div><div className="text-xs text-[#8998aa]">Voor moeilijk bereikbare ramen</div></div>
                      <span className={`relative h-7 w-12 rounded-full transition ${telescoop ? "bg-[#5a79da]" : "bg-[#dfe6ef]"}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${telescoop ? "left-6" : "left-1"}`} /></span>
                    </button>
                    <button type="button" onClick={() => setKozijnen(!kozijnen)} className="flex w-full items-center justify-between py-3 text-left">
                      <div><div className="text-sm font-bold text-[#385575]">Kozijnen schoonmaken?</div><div className="text-xs text-[#8998aa]">Rondom de ramen meenemen</div></div>
                      <span className={`relative h-7 w-12 rounded-full transition ${kozijnen ? "bg-[#5a79da]" : "bg-[#dfe6ef]"}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${kozijnen ? "left-6" : "left-1"}`} /></span>
                    </button>
                    <button type="button" onClick={() => setBereikbaar(bereikbaar === "ja" ? "nee" : "ja")} className="flex w-full items-center justify-between py-3 text-left">
                      <div><div className="text-sm font-bold text-[#385575]">Extra lastig bereikbaar?</div><div className="text-xs text-[#8998aa]">Bijvoorbeeld boven een serre of schuin dak</div></div>
                      <span className={`relative h-7 w-12 rounded-full transition ${bereikbaar === "nee" ? "bg-[#5a79da]" : "bg-[#dfe6ef]"}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${bereikbaar === "nee" ? "left-6" : "left-1"}`} /></span>
                    </button>
                  </div>

                  <div className="mt-6 border-t border-[#edf2f7] pt-5">
                    <div className="text-sm font-bold text-[#385575]">Hoe vaak?</div>
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {[
                        ["eenmalig", "Eenmalig"], ["4weken", "4 weken"], ["8weken", "8 weken"], ["12weken", "12 weken"],
                      ].map(([id, label]) => (
                        <button key={id} type="button" onClick={() => setFrequentie(id)} className={`rounded-xl border px-3 py-2.5 text-xs font-bold ${frequentie === id ? "border-[#6287ef] bg-[#eef3ff] text-[#3f66cb]" : "border-[#dde6f1] text-[#708399]"}`}>{label}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="mt-8 flex items-center justify-between border-t border-[#edf2f7] pt-5">
                <a href="/boeken/glazenwassen" className="px-2 py-3 text-sm font-bold text-[#8090a3]">← Terug</a>
                <button type="button" disabled={!kanVerder} onClick={gaVerder} className={`min-w-44 rounded-xl px-7 py-3.5 text-sm font-extrabold text-white transition ${kanVerder ? "bg-[#5578dc] shadow-[0_8px_20px_rgba(73,103,190,.24)] hover:bg-[#466bd4]" : "cursor-not-allowed bg-[#ccd7e9]"}`}>Verder&nbsp; →</button>
              </div>
            </div>

            <aside className="relative hidden min-h-[650px] overflow-hidden bg-[#eef4fb] lg:block">
              <img src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=82" alt="Glazenwasser aan het werk" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#eef4fb]/80 via-transparent to-white/20" />
              <div className="absolute bottom-8 right-8 -rotate-6 text-right text-2xl font-medium italic text-[#667a96]">Schoon.<br />Veilig.<br />Professioneel.</div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
