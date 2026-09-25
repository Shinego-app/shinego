"use client";

import { useEffect, useMemo, useState } from "react";

type Prijs = { basisprijs: number; ramenPrijs: number; verdiepingToeslag: number; bereikToeslag: number; kozijnenToeslag: number; totaal: number; };

const maandNamen = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
const weekDagen = ["ma", "di", "wo", "do", "vr", "za", "zo"];

function datumNaarWaarde(datum: Date) {
  const jaar = datum.getFullYear();
  const maand = String(datum.getMonth() + 1).padStart(2, "0");
  const dag = String(datum.getDate()).padStart(2, "0");
  return `${jaar}-${maand}-${dag}`;
}

function waardeNaarDatum(waarde: string) {
  if (!waarde) return null;
  const [jaar, maand, dag] = waarde.split("-").map(Number);
  return new Date(jaar, maand - 1, dag);
}

function toonDatum(waarde: string) {
  const datum = waardeNaarDatum(waarde);
  if (!datum) return "Kies een datum";
  return `${datum.getDate()} ${maandNamen[datum.getMonth()]} ${datum.getFullYear()}`;
}

export default function GegevensPage() {
  const [prijs, setPrijs] = useState<Prijs | null>(null);
  const [voornaam, setVoornaam] = useState(""); const [achternaam, setAchternaam] = useState(""); const [email, setEmail] = useState(""); const [telefoon, setTelefoon] = useState("");
  const [postcode, setPostcode] = useState(""); const [huisnummer, setHuisnummer] = useState(""); const [toevoeging, setToevoeging] = useState(""); const [straat, setStraat] = useState(""); const [plaats, setPlaats] = useState("");
  const [gewensteDatum, setGewenensteDatum] = useState(""); const [gewensteTijd, setGewensteTijd] = useState(""); const [thuisNodig, setThuisNodig] = useState("");
  const [kalenderOpen, setKalenderOpen] = useState(false);
  const [zichtbareMaand, setZichtbareMaand] = useState(() => { const nu = new Date(); return new Date(nu.getFullYear(), nu.getMonth(), 1); });

  useEffect(() => {
    try {
      const opgeslagenPrijs = localStorage.getItem("shinegoPrijs");
      if (opgeslagenPrijs) setPrijs(JSON.parse(opgeslagenPrijs));

      const opgeslagenKlant = localStorage.getItem("shinegoKlantGegevens");
      if (opgeslagenKlant) {
        const klant = JSON.parse(opgeslagenKlant);
        setVoornaam(klant.voornaam || "");
        setAchternaam(klant.achternaam || "");
        setEmail(klant.email || "");
        setTelefoon(klant.telefoon || "");
        setPostcode(klant.postcode || "");
        setHuisnummer(klant.huisnummer || "");
        setToevoeging(klant.toevoeging || "");
        setStraat(klant.straat || "");
        setPlaats(klant.plaats || "");
        setGewenensteDatum(klant.gewensteDatum || "");
        setGewensteTijd(klant.gewensteTijd || "");
        setThuisNodig(klant.thuisNodig || "");
      }
    } catch (error) {
      console.error("Boekingsgegevens laden mislukt:", error);
    }
  }, []);

  useEffect(() => { async function haalAdresOp() { if (postcode.trim().length < 6 || huisnummer.trim() === "") return; try { const zoekterm = `${postcode} ${huisnummer}`; const response = await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${encodeURIComponent(zoekterm)}&fq=type:adres`); const data = await response.json(); const adres = data.response?.docs?.[0]; if (adres) { setStraat(adres.straatnaam || ""); setPlaats(adres.woonplaatsnaam || ""); } } catch (error) { console.error("Adres ophalen mislukt:", error); } } haalAdresOp(); }, [postcode, huisnummer]);

  const vandaag = useMemo(() => { const nu = new Date(); return new Date(nu.getFullYear(), nu.getMonth(), nu.getDate()); }, []);
  const minDatum = datumNaarWaarde(vandaag);

  const kalenderDagen = useMemo(() => {
    const jaar = zichtbareMaand.getFullYear();
    const maand = zichtbareMaand.getMonth();
    const eersteDag = new Date(jaar, maand, 1);
    const offset = (eersteDag.getDay() + 6) % 7;
    const start = new Date(jaar, maand, 1 - offset);
    return Array.from({ length: 42 }, (_, index) => {
      const datum = new Date(start);
      datum.setDate(start.getDate() + index);
      return datum;
    });
  }, [zichtbareMaand]);

  const kanVerder = voornaam.trim() !== "" && achternaam.trim() !== "" && email.trim() !== "" && telefoon.trim() !== "" && postcode.trim() !== "" && huisnummer.trim() !== "" && straat.trim() !== "" && plaats.trim() !== "" && gewensteDatum !== "" && gewensteTijd !== "" && thuisNodig !== "";
  function gaVerder() { if (!kanVerder) return; localStorage.setItem("shinegoKlantGegevens", JSON.stringify({ voornaam, achternaam, email, telefoon, postcode, huisnummer, toevoeging, straat, plaats, gewensteDatum, gewensteTijd, thuisNodig })); window.location.href = "/boeken/glazenwassen/bevestigen"; }
  const inputClass = "w-full rounded-xl border border-[#cfe3f4] bg-white px-3 py-2.5 text-sm font-semibold text-[#123c70] outline-none placeholder:text-[#9ab0c4] focus:border-[#1683f8]";
  const stappen = ["Keuze", "Details", "Prijs", "Gegevens", "Bevestigen"];

  return <main className="min-h-screen bg-gradient-to-b from-[#eaf6ff] to-[#f8fcff] text-[#123c70]">
    <div className="mx-auto max-w-5xl px-5 py-5 sm:px-8 sm:py-7">
      <header className="flex items-center justify-between"><a href="/" className="text-[29px] font-extrabold tracking-tight text-[#0d3f79]">Shine<span className="text-[#1683f8]">Go</span><span className="ml-1 text-[#1683f8]">✦</span></a><a href="/" aria-label="Menu" className="flex h-9 w-9 items-center justify-center text-2xl font-bold text-[#1683f8]">≡</a></header>
      <div className="mx-auto mt-3 grid max-w-3xl grid-cols-5 gap-1">{stappen.map((stap,index)=>{const actief=index===3;const klaar=index<3;return <div key={stap} className="text-center"><div className="flex items-center"><span className={`h-px flex-1 ${index===0?"bg-transparent":klaar||actief?"bg-[#7db9eb]":"bg-[#b9d8f4]"}`} /><span className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-extrabold ${actief?"border-[#1683f8] bg-[#1683f8] text-white":klaar?"border-[#9ccbf0] bg-[#eaf6ff] text-[#1683f8]":"border-[#a9cbea] bg-[#eef8ff] text-[#4b7197]"}`}>{index+1}</span><span className={`h-px flex-1 ${index===4?"bg-transparent":klaar?"bg-[#7db9eb]":"bg-[#b9d8f4]"}`} /></div><div className={`mt-1 text-[10px] sm:text-xs ${actief?"font-bold text-[#1683f8]":"text-[#52779b]"}`}>{stap}</div></div>})}</div>

      <section className="mt-5 rounded-[28px] border border-[#d5e9f8] bg-white/90 px-5 py-6 shadow-[0_18px_55px_rgba(40,93,140,.12)] sm:px-7 sm:py-7">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_.75fr] lg:gap-10">
          <div>
            <h1 className="text-[32px] font-extrabold leading-tight tracking-[-.035em] text-[#0b3d75] sm:text-[38px]">Jouw gegevens</h1>
            <p className="mt-1 text-sm font-medium text-[#537797] sm:text-base">Vul je gegevens in om de boeking te bevestigen.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-bold text-[#4f708f]">Voornaam<input value={voornaam} onChange={(e)=>setVoornaam(e.target.value)} className={`${inputClass} mt-1`} placeholder="Mohamed" /></label>
              <label className="text-xs font-bold text-[#4f708f]">Achternaam<input value={achternaam} onChange={(e)=>setAchternaam(e.target.value)} className={`${inputClass} mt-1`} placeholder="Jansen" /></label>
              <label className="text-xs font-bold text-[#4f708f] sm:col-span-2">E-mailadres<input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className={`${inputClass} mt-1`} placeholder="naam@email.nl" /></label>
              <label className="text-xs font-bold text-[#4f708f] sm:col-span-2">Telefoonnummer<input type="tel" value={telefoon} onChange={(e)=>setTelefoon(e.target.value)} className={`${inputClass} mt-1`} placeholder="06 12345678" /></label>
              <label className="text-xs font-bold text-[#4f708f]">Postcode<input value={postcode} onChange={(e)=>setPostcode(e.target.value)} className={`${inputClass} mt-1 uppercase`} placeholder="1234 AB" /></label>
              <label className="text-xs font-bold text-[#4f708f]">Huisnummer<input value={huisnummer} onChange={(e)=>setHuisnummer(e.target.value)} className={`${inputClass} mt-1`} placeholder="12" /></label>
              <label className="text-xs font-bold text-[#4f708f]">Toevoeging <span className="font-medium text-[#8aa0b5]">(optioneel)</span><input value={toevoeging} onChange={(e)=>setToevoeging(e.target.value)} className={`${inputClass} mt-1`} placeholder="A" /></label>
              <label className="text-xs font-bold text-[#4f708f]">Straat<input value={straat} onChange={(e)=>setStraat(e.target.value)} className={`${inputClass} mt-1`} placeholder="Straatnaam" /></label>
              <label className="text-xs font-bold text-[#4f708f]">Plaats<input value={plaats} onChange={(e)=>setPlaats(e.target.value)} className={`${inputClass} mt-1`} placeholder="Amsterdam" /></label>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="relative rounded-xl border border-[#cfe3f4] bg-[#f7fbff] p-3 text-xs font-bold text-[#4f708f]">
                <div>Gewenste datum</div>
                <input type="date" min={minDatum} value={gewensteDatum} onChange={(e)=>setGewenensteDatum(e.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold text-[#123c70] outline-none md:hidden" />
                <button type="button" onClick={()=>{ const gekozen = waardeNaarDatum(gewensteDatum); if (gekozen) setZichtbareMaand(new Date(gekozen.getFullYear(), gekozen.getMonth(), 1)); setKalenderOpen(!kalenderOpen); }} className="mt-2 hidden w-full items-center justify-between rounded-lg bg-white px-3 py-2.5 text-left text-sm font-semibold text-[#123c70] shadow-sm ring-1 ring-[#d5e9f8] transition hover:ring-[#8fc7ef] md:flex">
                  <span>{toonDatum(gewensteDatum)}</span><span className="text-[#1683f8]">▾</span>
                </button>
                {kalenderOpen && <div className="absolute left-0 top-full z-30 mt-2 hidden w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl border border-[#d5e9f8] bg-white p-4 shadow-[0_18px_55px_rgba(40,93,140,.18)] md:block">
                  <div className="flex items-center justify-between">
                    <button type="button" onClick={()=>setZichtbareMaand(new Date(zichtbareMaand.getFullYear(), zichtbareMaand.getMonth()-1, 1))} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef7ff] text-lg text-[#3971a4] hover:bg-[#e4f2ff]">‹</button>
                    <div className="text-sm font-extrabold text-[#123c70]">{maandNamen[zichtbareMaand.getMonth()]} {zichtbareMaand.getFullYear()}</div>
                    <button type="button" onClick={()=>setZichtbareMaand(new Date(zichtbareMaand.getFullYear(), zichtbareMaand.getMonth()+1, 1))} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef7ff] text-lg text-[#3971a4] hover:bg-[#e4f2ff]">›</button>
                  </div>
                  <div className="mt-4 grid grid-cols-7 gap-1 text-center">{weekDagen.map((dag)=><div key={dag} className="py-1 text-[11px] font-extrabold uppercase text-[#8aa0b5]">{dag}</div>)}</div>
                  <div className="mt-1 grid grid-cols-7 gap-1">{kalenderDagen.map((datum)=>{ const waarde=datumNaarWaarde(datum); const andereMaand=datum.getMonth()!==zichtbareMaand.getMonth(); const verleden=datum<vandaag; const gekozen=waarde===gewensteDatum; return <button key={waarde} type="button" disabled={verleden} onClick={()=>{setGewenensteDatum(waarde);setKalenderOpen(false);}} className={`flex h-9 items-center justify-center rounded-lg text-xs font-bold transition ${gekozen?"bg-[#1683f8] text-white":verleden?"cursor-not-allowed text-[#c1cfdb]":andereMaand?"text-[#9fb2c4] hover:bg-[#eef7ff]":"text-[#315f88] hover:bg-[#eaf6ff]"}`}>{datum.getDate()}</button>;})}</div>
                  <button type="button" onClick={()=>{setGewenensteDatum(datumNaarWaarde(vandaag));setZichtbareMaand(new Date(vandaag.getFullYear(),vandaag.getMonth(),1));setKalenderOpen(false);}} className="mt-3 w-full rounded-xl bg-[#eef7ff] py-2 text-xs font-extrabold text-[#3971a4] hover:bg-[#e4f2ff]">Vandaag</button>
                </div>}
              </div>
              <label className="rounded-xl border border-[#cfe3f4] bg-[#f7fbff] p-3 text-xs font-bold text-[#4f708f]">Gewenste tijd<select value={gewensteTijd} onChange={(e)=>setGewensteTijd(e.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold text-[#123c70] outline-none"><option value="">Kies tijdvak</option><option value="08:00-10:00">08:00 - 10:00</option><option value="10:00-12:00">10:00 - 12:00</option><option value="12:00-14:00">12:00 - 14:00</option><option value="14:00-16:00">14:00 - 16:00</option><option value="16:00-18:00">16:00 - 18:00</option></select></label>
            </div>
            <div className="mt-5"><div className="text-xs font-bold text-[#4f708f]">Moet je thuis zijn?</div><div className="mt-2 space-y-2 text-sm text-[#4f708f]"><label className="flex items-center gap-2"><input type="radio" name="thuis" checked={thuisNodig === "ja"} onChange={()=>setThuisNodig("ja")} /> Ja, ik ben aanwezig</label><label className="flex items-center gap-2"><input type="radio" name="thuis" checked={thuisNodig === "nee"} onChange={()=>setThuisNodig("nee")} /> Nee, dat is niet nodig</label></div></div>
          </div>
          <aside className="space-y-5 rounded-[24px] bg-gradient-to-b from-[#eef8ff] to-[#e4f3ff] p-5">
            <div className="flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl">🔒</span><div><strong className="block text-sm">Veilig en vertrouwd</strong><span className="text-xs text-[#6d89a4]">Je gegevens zijn beschermd</span></div></div>
            <div className="flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl">🌿</span><div><strong className="block text-sm">Goed voor het milieu</strong><span className="text-xs text-[#6d89a4]">Bewuste werkwijze</span></div></div>
            <div className="flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl">♡</span><div><strong className="block text-sm">Klanttevredenheid</strong><span className="text-xs text-[#6d89a4]">Persoonlijke service</span></div></div>
            {prijs && <div className="rounded-2xl bg-white p-5"><div className="text-xs font-bold uppercase tracking-wider text-[#6d89a4]">Totaalprijs</div><div className="mt-1 text-3xl font-extrabold text-[#0b3d75]">€ {prijs.totaal.toFixed(2).replace(".", ",")}</div></div>}
          </aside>
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-[#dcecf8] pt-4"><a href="/boeken/glazenwassen/prijs" className="px-2 py-3 text-sm font-bold text-[#537797]">← Terug</a><button type="button" disabled={!kanVerder} onClick={gaVerder} className={`min-w-44 rounded-xl px-7 py-3.5 text-sm font-extrabold text-white ${kanVerder?"bg-[#1683f8] shadow-[0_8px_20px_rgba(22,131,248,.24)]":"cursor-not-allowed bg-[#bfd3e5]"}`}>Verder →</button></div>
      </section>
    </div>
  </main>;
}
