"use client";

import { useEffect, useState } from "react";

type Prijs = {
  basisprijs: number;
  ramenPrijs: number;
  verdiepingToeslag: number;
  bereikToeslag: number;
  kozijnenToeslag: number;
  totaal: number;
};

export default function GegevensPage() {
  const [prijs, setPrijs] = useState<Prijs | null>(null);
  const [voornaam, setVoornaam] = useState("");
  const [achternaam, setAchternaam] = useState("");
  const [email, setEmail] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [postcode, setPostcode] = useState("");
  const [huisnummer, setHuisnummer] = useState("");
  const [straat, setStraat] = useState("");
  const [plaats, setPlaats] = useState("");
  const [gewensteDatum, setGewenensteDatum] = useState("");
  const [gewensteTijd, setGewensteTijd] = useState("");
  const [thuisNodig, setThuisNodig] = useState("");

  useEffect(() => {
    const opgeslagenPrijs = localStorage.getItem("shinegoPrijs");
    if (opgeslagenPrijs) setPrijs(JSON.parse(opgeslagenPrijs));
  }, []);

  useEffect(() => {
    async function haalAdresOp() {
      if (postcode.trim().length < 6 || huisnummer.trim() === "") return;
      try {
        const zoekterm = `${postcode} ${huisnummer}`;
        const response = await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${encodeURIComponent(zoekterm)}&fq=type:adres`);
        const data = await response.json();
        const adres = data.response?.docs?.[0];
        if (adres) {
          setStraat(adres.straatnaam || "");
          setPlaats(adres.woonplaatsnaam || "");
        }
      } catch (error) {
        console.error("Adres ophalen mislukt:", error);
      }
    }
    haalAdresOp();
  }, [postcode, huisnummer]);

  const kanVerder = voornaam.trim() !== "" && achternaam.trim() !== "" && email.trim() !== "" && telefoon.trim() !== "" && postcode.trim() !== "" && huisnummer.trim() !== "" && straat.trim() !== "" && plaats.trim() !== "" && gewensteDatum !== "" && gewensteTijd !== "" && thuisNodig !== "";

  function gaVerder() {
    if (!kanVerder) return;
    localStorage.setItem("shinegoKlantGegevens", JSON.stringify({ voornaam, achternaam, email, telefoon, postcode, huisnummer, straat, plaats, gewensteDatum, gewensteTijd, thuisNodig }));
    window.location.href = "/boeken/glazenwassen/bevestigen";
  }

  const inputClass = "w-full rounded-xl border border-sky-200 bg-white px-4 py-3 text-base text-[#0b2b5b] outline-none focus:border-[#1683f8]";
  const stappen = ["Keuze", "Situatie", "Details", "Prijs", "Gegevens"];

  return (
    <main className="min-h-screen bg-[#eef8ff] text-[#0b2b5b]">
      <header className="border-b border-sky-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="/" className="text-2xl font-extrabold tracking-tight text-[#0b3d75]">Shine<span className="text-[#1683f8]">Go✦</span></a>
          <a href="/boeken/glazenwassen/prijs" className="rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-bold text-[#245d91]">← Terug</a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
        <div className="mb-7 rounded-3xl border border-sky-100 bg-white/75 px-4 py-4 shadow-sm sm:px-6">
          <div className="grid grid-cols-5 gap-1 sm:gap-3">
            {stappen.map((stap, index) => {
              const nummer = index + 1;
              const actief = nummer === 5;
              const klaar = nummer < 5;
              return (
                <div key={stap} className="text-center">
                  <div className="flex items-center">
                    <div className={`h-px flex-1 ${index === 0 ? "bg-transparent" : "bg-[#9fd1ff]"}`} />
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
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#bfe3ff]/45 blur-3xl" />
          <div className="relative grid gap-7 lg:grid-cols-[1.2fr_.8fr] lg:gap-10">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#1683f8]">Jouw gegevens</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Bijna klaar</h1>
              <p className="mt-3 text-base leading-7 text-[#5b7591]">Vul je contact-, adres- en planningsgegevens in. Daarna controleer je alles nog één keer.</p>

              <div className="mt-7 rounded-2xl border border-sky-100 bg-white/90 p-5 sm:p-6">
                <h2 className="text-xl font-extrabold">Contactgegevens</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div><label className="mb-2 block text-sm font-bold text-[#466482]">Voornaam</label><input type="text" value={voornaam} onChange={(e) => setVoornaam(e.target.value)} placeholder="Voornaam" autoComplete="given-name" className={inputClass} /></div>
                  <div><label className="mb-2 block text-sm font-bold text-[#466482]">Achternaam</label><input type="text" value={achternaam} onChange={(e) => setAchternaam(e.target.value)} placeholder="Achternaam" autoComplete="family-name" className={inputClass} /></div>
                  <div><label className="mb-2 block text-sm font-bold text-[#466482]">E-mailadres</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="naam@email.nl" autoComplete="email" className={inputClass} /></div>
                  <div><label className="mb-2 block text-sm font-bold text-[#466482]">Telefoonnummer</label><input type="tel" value={telefoon} onChange={(e) => setTelefoon(e.target.value)} placeholder="06 12345678" autoComplete="tel" className={inputClass} /></div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-sky-100 bg-white/90 p-5 sm:p-6">
                <h2 className="text-xl font-extrabold">Adres van de klus</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div><label className="mb-2 block text-sm font-bold text-[#466482]">Postcode</label><input type="text" value={postcode} onChange={(e) => setPostcode(e.target.value)} placeholder="1234 AB" autoComplete="postal-code" className={`${inputClass} uppercase`} /></div>
                  <div><label className="mb-2 block text-sm font-bold text-[#466482]">Huisnummer</label><input type="text" value={huisnummer} onChange={(e) => setHuisnummer(e.target.value)} placeholder="12" className={inputClass} /></div>
                  <div><label className="mb-2 block text-sm font-bold text-[#466482]">Straat</label><input type="text" value={straat} onChange={(e) => setStraat(e.target.value)} placeholder="Straatnaam" autoComplete="address-line1" className={inputClass} /></div>
                  <div><label className="mb-2 block text-sm font-bold text-[#466482]">Plaats</label><input type="text" value={plaats} onChange={(e) => setPlaats(e.target.value)} placeholder="Amsterdam" autoComplete="address-level2" className={inputClass} /></div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-sky-100 bg-white/90 p-5 sm:p-6">
                <h2 className="text-xl font-extrabold">Planning</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div><label className="mb-2 block text-sm font-bold text-[#466482]">Gewenste datum</label><input type="date" value={gewensteDatum} onChange={(e) => setGewenensteDatum(e.target.value)} className={inputClass} /></div>
                  <div><label className="mb-2 block text-sm font-bold text-[#466482]">Gewenste tijd</label><select value={gewensteTijd} onChange={(e) => setGewensteTijd(e.target.value)} className={inputClass}><option value="">Kies een tijdvak</option><option value="08:00-10:00">08:00 - 10:00</option><option value="10:00-12:00">10:00 - 12:00</option><option value="12:00-14:00">12:00 - 14:00</option><option value="14:00-16:00">14:00 - 16:00</option><option value="16:00-18:00">16:00 - 18:00</option></select></div>
                </div>
                <div className="mt-4"><label className="mb-2 block text-sm font-bold text-[#466482]">Moet je thuis zijn?</label><select value={thuisNodig} onChange={(e) => setThuisNodig(e.target.value)} className={inputClass}><option value="">Kies een optie</option><option value="ja">Ja, ik ben thuis</option><option value="nee">Nee, ik hoef niet thuis te zijn</option></select></div>
              </div>
            </div>

            <aside className="lg:pt-12">
              <div className="sticky top-24 space-y-4">
                {prijs && (
                  <div className="rounded-[1.75rem] border border-sky-100 bg-white/90 p-6 shadow-lg">
                    <div className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#1683f8]">Jouw prijs</div>
                    <div className="mt-2 text-4xl font-extrabold">€{prijs.totaal.toFixed(2).replace(".", ",")}</div>
                    <p className="mt-2 text-sm text-[#66809a]">De totaalprijs blijft zichtbaar terwijl je je gegevens invult.</p>
                  </div>
                )}
                <div className="rounded-[1.75rem] border border-sky-100 bg-[#eaf5ff] p-6">
                  <div className="flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">🔒</span><div><h2 className="font-extrabold">Veilig en vertrouwd</h2><p className="mt-1 text-sm leading-5 text-[#66809a]">Je gegevens worden alleen gebruikt om je ShineGo-opdracht te verwerken.</p></div></div>
                </div>
                <div className="rounded-[1.75rem] border border-sky-100 bg-white/90 p-6">
                  <div className="space-y-4 text-sm">
                    <div className="flex gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#eaf5ff]">✓</span><div><strong className="block">Duidelijke prijs</strong><span className="text-[#66809a]">Je weet vooraf wat je betaalt</span></div></div>
                    <div className="flex gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#eaf5ff]">📅</span><div><strong className="block">Zelf plannen</strong><span className="text-[#66809a]">Kies een moment dat past</span></div></div>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <div className="relative mt-8 flex flex-col-reverse gap-3 border-t border-sky-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <a href="/boeken/glazenwassen/prijs" className="rounded-xl border border-sky-200 bg-white px-6 py-3.5 text-center font-bold text-[#245d91]">← Terug</a>
            <button type="button" disabled={!kanVerder} onClick={gaVerder} className={`rounded-xl px-7 py-4 text-base font-extrabold transition ${kanVerder ? "bg-[#1683f8] text-white shadow-lg hover:bg-[#0d6fd8]" : "cursor-not-allowed bg-sky-100 text-[#9ab0c4]"}`}>Controleer boeking →</button>
          </div>
        </div>
      </section>
    </main>
  );
}
