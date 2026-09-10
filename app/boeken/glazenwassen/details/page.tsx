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
  const [woningtype, setWoningtype] = useState("");
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
    setWoningtype(data.woningtype || "");
    setRamen(data.ramen || 0);
    setVerdiepingen(data.verdiepingen?.length ? data.verdiepingen : data.woningtype === "appartement" ? [] : ["1"]);
    setGlasOppervlak(data.glasOppervlak || "");
    setTelescoop(Boolean(data.telescoop));
    setFrequentie(data.frequentie || "eenmalig");
  }, []);

  const bedrijf = gegevens?.woningtype === "bedrijfspand";
  const woning = gegevens?.type === "buiten" && gegevens?.woningtype !== "appartement";
  const kanVerder = Boolean(gegevens) && (!woning || woningtype !== "") && (bedrijf ? glasOppervlak !== "" : ramen > 0);

  function toggleVerdieping(verdieping: string) {
    setVerdiepingen((vorige) => vorige.includes(verdieping) ? vorige.filter((v) => v !== verdieping) : [...vorige, verdieping]);
  }

  function gaVerder() {
    if (!gegevens || !kanVerder) return;
    const bijgewerkt: Gegevens = { ...gegevens, woningtype: woning ? woningtype : gegevens.woningtype, ramen, verdiepingen, glasOppervlak, telescoop, frequentie };
    localStorage.setItem("shinegoGlazenwassen", JSON.stringify(bijgewerkt));
    localStorage.setItem("shinegoGlazenwassenDetails", JSON.stringify({ bereikbaar, kozijnen, opmerking: "" }));
    if (bedrijf && glasOppervlak === "500+") {
      window.location.href = "/contact?offerte=500plus";
      return;
    }
    window.location.href = "/boeken/glazenwassen/prijs";
  }

  const stappen = ["Keuze", "Details", "Prijs", "Gegevens", "Bevestigen"];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#eaf6ff] to-[#f8fcff] text-[#123c70]">
      <div className="mx-auto max-w-5xl px-5 py-5 sm:px-8 sm:py-7">
        <header className="flex items-center justify-between">
          <a href="/" className="text-[29px] font-extrabold tracking-tight text-[#0d3f79]">Shine<span className="text-[#1683f8]">Go</span><span className="ml-1 text-[#1683f8]">✦</span></a>
          <a href="/" aria-label="Menu" className="flex h-9 w-9 items-center justify-center text-2xl font-bold text-[#1683f8]">≡</a>
        </header>

        <div className="mx-auto mt-3 grid max-w-3xl grid-cols-5 gap-1">
          {stappen.map((stap, index) => {
            const actief = index === 1;
            const klaar = index < 1;
            return (
              <div key={stap} className="text-center">
                <div className="flex items-center">
                  <span className={`h-px flex-1 ${index === 0 ? "bg-transparent" : klaar || actief ? "bg-[#7db9eb]" : "bg-[#b9d8f4]"}`} />
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-extrabold ${actief ? "border-[#1683f8] bg-[#1683f8] text-white" : klaar ? "border-[#9ccbf0] bg-[#eaf6ff] text-[#1683f8]" : "border-[#a9cbea] bg-[#eef8ff] text-[#4b7197]"}`}>{index + 1}</span>
                  <span className={`h-px flex-1 ${index === 4 ? "bg-transparent" : klaar ? "bg-[#7db9eb]" : "bg-[#b9d8f4]"}`} />
                </div>
                <div className={`mt-1 text-[10px] sm:text-xs ${actief ? "font-bold text-[#1683f8]" : "text-[#52779b]"}`}>{stap}</div>
              </div>
            );
          })}
        </div>

        <section className="mt-5 overflow-hidden rounded-[28px] border border-[#d5e9f8] bg-white/90 shadow-[0_18px_55px_rgba(40,93,140,.12)]">
          <div className="grid lg:grid-cols-[1.15fr_.85fr]">
            <div className="px-5 py-6 sm:px-7 sm:py-7">
              <h1 className="text-[32px] font-extrabold leading-tight tracking-[-.035em] text-[#0b3d75] sm:text-[38px]">Jouw situatie</h1>
              <p className="mt-1 text-sm font-medium text-[#537797] sm:text-base">Geef aan wat van toepassing is.</p>

              {!gegevens ? <p className="mt-8 text-[#6d89a4]">Gegevens laden...</p> : <>
                {bedrijf ? (
                  <div className="mt-5">
                    <label className="text-sm font-extrabold text-[#123c70]">Hoeveel m² glas?</label>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {[["0-15","Tot 15 m²"],["16-30","16 - 30 m²"],["31-50","31 - 50 m²"],["51-100","51 - 100 m²"],["101-200","101 - 200 m²"],["201-500","201 - 500 m²"],["500+","Meer dan 500 m²"]].map(([waarde,label]) => (
                        <button key={waarde} type="button" onClick={() => setGlasOppervlak(waarde)} className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold ${glasOppervlak === waarde ? "border-[#1683f8] bg-[#eaf6ff] text-[#0f66b6]" : "border-[#cfe3f4] bg-white text-[#4f708f]"}`}>{label}</button>
                      ))}
                    </div>
                  </div>
                ) : <>
                  {woning && <div className="mt-5 border-b border-[#dcecf8] pb-4">
                    <div className="text-sm font-extrabold text-[#123c70]">Type woning</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {[["Rijtjeshuis","Rijtjeshuis"],["Twee-onder-een-kap","Twee-onder-een-kap"],["Vrijstaande woning","Vrijstaande woning"],["Villa","Villa"]].map(([waarde,label]) => (
                        <button key={waarde} type="button" onClick={() => setWoningtype(waarde)} className={`rounded-xl border px-4 py-2.5 text-sm font-semibold ${woningtype === waarde ? "border-[#1683f8] bg-[#eaf6ff] text-[#0f66b6]" : "border-[#cfe3f4] bg-white text-[#5f7e9c]"}`}>{label}</button>
                      ))}
                    </div>
                  </div>}

                  <div className="mt-4 flex items-center justify-between border-b border-[#dcecf8] pb-4">
                    <div><div className="text-sm font-extrabold text-[#123c70]">Aantal ramen</div><div className="mt-1 text-xs text-[#6d89a4]">Buitenzijde van de ramen</div></div>
                    <div className="flex items-center gap-4">
                      <button type="button" onClick={() => setRamen(Math.max(0, ramen - 1))} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef7ff] text-xl text-[#4b7197]">−</button>
                      <div className="min-w-8 text-center text-2xl font-extrabold text-[#0b3d75]">{ramen}</div>
                      <button type="button" onClick={() => setRamen(ramen + 1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef7ff] text-xl font-bold text-[#1683f8]">+</button>
                    </div>
                  </div>

                  <div className="border-b border-[#dcecf8] py-4">
                    <div className="text-sm font-extrabold text-[#123c70]">Verdiepingen</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {["1","2","3"].map((v) => <button key={v} type="button" onClick={() => toggleVerdieping(v)} className={`min-w-24 rounded-xl border px-4 py-2.5 text-sm font-semibold ${verdiepingen.includes(v) ? "border-[#1683f8] bg-[#1683f8] text-white" : "border-[#cfe3f4] bg-white text-[#5f7e9c]"}`}>{v === "1" ? "Begane grond" : v === "3" ? "3+" : "2"}</button>)}
                    </div>
                  </div>
                </>}

                <div className="mt-4 rounded-2xl bg-[#eaf6ff] px-4 py-3 text-sm text-[#477092]"><span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#1683f8] text-xs font-bold text-white">i</span><strong>{verdiepingen.includes("3") ? "3e verdieping" : "Hoogte wordt meegenomen"}</strong> — we gebruiken alleen veilige werkmethodes.</div>

                <div className="mt-4 space-y-1">
                  <button type="button" onClick={() => setTelescoop(!telescoop)} className="flex w-full items-center justify-between py-3 text-left"><div><div className="text-sm font-extrabold text-[#123c70]">Telescoopsteel nodig?</div><div className="text-xs text-[#6d89a4]">Voor moeilijk bereikbare ramen</div></div><span className={`relative h-7 w-12 rounded-full ${telescoop ? "bg-[#1683f8]" : "bg-[#d5e5f2]"}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow ${telescoop ? "left-6" : "left-1"}`} /></span></button>
                  <button type="button" onClick={() => setKozijnen(!kozijnen)} className="flex w-full items-center justify-between py-3 text-left"><div><div className="text-sm font-extrabold text-[#123c70]">Kozijnen schoonmaken?</div><div className="text-xs text-[#6d89a4]">Binnen- en/of buitenkozijnen</div></div><span className={`relative h-7 w-12 rounded-full ${kozijnen ? "bg-[#1683f8]" : "bg-[#d5e5f2]"}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow ${kozijnen ? "left-6" : "left-1"}`} /></span></button>
                  <button type="button" onClick={() => setBereikbaar(bereikbaar === "ja" ? "nee" : "ja")} className="flex w-full items-center justify-between py-3 text-left"><div><div className="text-sm font-extrabold text-[#123c70]">Extra lastig bereikbaar?</div><div className="text-xs text-[#6d89a4]">Bijvoorbeeld boven een serre of schuin dak</div></div><span className={`relative h-7 w-12 rounded-full ${bereikbaar === "nee" ? "bg-[#1683f8]" : "bg-[#d5e5f2]"}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow ${bereikbaar === "nee" ? "left-6" : "left-1"}`} /></span></button>
                </div>

                <div className="mt-4 border-t border-[#dcecf8] pt-4"><div className="text-sm font-extrabold text-[#123c70]">Hoe vaak?</div><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{[["eenmalig","Eenmalig"],["4weken","4 weken"],["8weken","8 weken"],["12weken","12 weken"]].map(([id,label]) => <button key={id} type="button" onClick={() => setFrequentie(id)} className={`rounded-xl border px-3 py-2.5 text-xs font-bold ${frequentie === id ? "border-[#1683f8] bg-[#eaf6ff] text-[#0f66b6]" : "border-[#cfe3f4] text-[#5f7e9c]"}`}>{label}</button>)}</div></div>
              </>}

              <div className="mt-6 flex items-center justify-between border-t border-[#dcecf8] pt-4"><a href="/boeken/glazenwassen" className="px-2 py-3 text-sm font-bold text-[#537797]">← Terug</a><button type="button" disabled={!kanVerder} onClick={gaVerder} className={`min-w-44 rounded-xl px-7 py-3.5 text-sm font-extrabold text-white ${kanVerder ? "bg-[#1683f8] shadow-[0_8px_20px_rgba(22,131,248,.24)]" : "cursor-not-allowed bg-[#bfd3e5]"}`}>Verder →</button></div>
            </div>

            <aside className="relative hidden min-h-[720px] overflow-hidden lg:block">
              <img src="/booking/details-worker.webp" alt="Professionele ShineGo glazenwasser met telescoopsteel" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#dff2ff]/35 via-transparent to-[#eaf6ff]/5" />
              <div className="absolute bottom-8 right-7 rounded-2xl bg-white/88 px-5 py-4 text-right shadow-[0_8px_24px_rgba(28,78,120,.14)] backdrop-blur-sm">
                <div className="text-sm font-extrabold text-[#123c70]">Professioneel · Betrouwbaar</div>
                <div className="mt-1 text-xs font-medium text-[#587995]">Streeploos resultaat</div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
