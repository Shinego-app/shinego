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

  const kanVerder =
    voornaam.trim() !== "" && achternaam.trim() !== "" && email.trim() !== "" && telefoon.trim() !== "" &&
    postcode.trim() !== "" && huisnummer.trim() !== "" && straat.trim() !== "" && plaats.trim() !== "" &&
    gewensteDatum !== "" && gewensteTijd !== "" && thuisNodig !== "";

  function gaVerder() {
    if (!kanVerder) return;
    localStorage.setItem("shinegoKlantGegevens", JSON.stringify({
      voornaam, achternaam, email, telefoon, postcode, huisnummer, straat, plaats, gewensteDatum, gewensteTijd, thuisNodig,
    }));
    window.location.href = "/boeken/glazenwassen/bevestigen";
  }

  const inputClass = "w-full border-0 border-b border-[#e2e8f1] bg-transparent px-0 py-2.5 text-sm font-semibold text-[#29496f] outline-none placeholder:text-[#a6b1bf] focus:border-[#6485df]";
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
            const actief = index === 3;
            const klaar = index < 3;
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

        <section className="mt-7 rounded-[30px] bg-white px-5 py-7 shadow-[0_18px_60px_rgba(45,77,120,0.10)] sm:px-9 sm:py-9">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_.75fr] lg:gap-14">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#18375f] sm:text-4xl">Jouw gegevens</h1>
              <p className="mt-2 text-sm text-[#778ba4] sm:text-base">Vul je gegevens in om de boeking te bevestigen.</p>

              <div className="mt-7 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                <div><label className="text-xs font-bold text-[#667b95]">Voornaam</label><input value={voornaam} onChange={(e) => setVoornaam(e.target.value)} className={inputClass} placeholder="Mohamed" autoComplete="given-name" /></div>
                <div><label className="text-xs font-bold text-[#667b95]">Achternaam</label><input value={achternaam} onChange={(e) => setAchternaam(e.target.value)} className={inputClass} placeholder="Jansen" autoComplete="family-name" /></div>
                <div><label className="text-xs font-bold text-[#667b95]">E-mailadres</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="naam@email.nl" autoComplete="email" /></div>
                <div><label className="text-xs font-bold text-[#667b95]">Telefoonnummer</label><input type="tel" value={telefoon} onChange={(e) => setTelefoon(e.target.value)} className={inputClass} placeholder="06 12345678" autoComplete="tel" /></div>
                <div><label className="text-xs font-bold text-[#667b95]">Postcode</label><input value={postcode} onChange={(e) => setPostcode(e.target.value)} className={`${inputClass} uppercase`} placeholder="1234 AB" autoComplete="postal-code" /></div>
                <div><label className="text-xs font-bold text-[#667b95]">Huisnummer</label><input value={huisnummer} onChange={(e) => setHuisnummer(e.target.value)} className={inputClass} placeholder="12" /></div>
                <div><label className="text-xs font-bold text-[#667b95]">Straat</label><input value={straat} onChange={(e) => setStraat(e.target.value)} className={inputClass} placeholder="Straatnaam" autoComplete="address-line1" /></div>
                <div><label className="text-xs font-bold text-[#667b95]">Plaats</label><input value={plaats} onChange={(e) => setPlaats(e.target.value)} className={inputClass} placeholder="Amsterdam" autoComplete="address-level2" /></div>
              </div>

              <div className="mt-7 border-t border-[#edf2f7] pt-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="rounded-2xl bg-[#f8fafc] p-4"><span className="block text-xs font-bold text-[#667b95]">Gewenste datum</span><input type="date" value={gewensteDatum} onChange={(e) => setGewenensteDatum(e.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold text-[#29496f] outline-none" /></label>
                  <label className="rounded-2xl bg-[#f8fafc] p-4"><span className="block text-xs font-bold text-[#667b95]">Gewenste tijd</span><select value={gewensteTijd} onChange={(e) => setGewensteTijd(e.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold text-[#29496f] outline-none"><option value="">Kies tijdvak</option><option value="08:00-10:00">08:00 - 10:00</option><option value="10:00-12:00">10:00 - 12:00</option><option value="12:00-14:00">12:00 - 14:00</option><option value="14:00-16:00">14:00 - 16:00</option><option value="16:00-18:00">16:00 - 18:00</option></select></label>
                </div>

                <div className="mt-5">
                  <div className="text-xs font-bold text-[#667b95]">Moet je thuis zijn?</div>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-[#536b86]">
                    <label className="flex cursor-pointer items-center gap-2"><input type="radio" name="thuis" checked={thuisNodig === "ja"} onChange={() => setThuisNodig("ja")} /> Ja, ik ben aanwezig</label>
                    <label className="flex cursor-pointer items-center gap-2"><input type="radio" name="thuis" checked={thuisNodig === "nee"} onChange={() => setThuisNodig("nee")} /> Nee, dat is niet nodig</label>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-6 pt-2">
              <div className="flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f4ff] text-xl">🔒</span><div><strong className="block text-sm text-[#375575]">Veilig en vertrouwd</strong><span className="text-xs leading-5 text-[#8998aa]">Je gegevens worden veilig verwerkt.</span></div></div>
              <div className="flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f1fbf4] text-xl">🍃</span><div><strong className="block text-sm text-[#375575]">Goed voor het milieu</strong><span className="text-xs leading-5 text-[#8998aa]">Professionele en bewuste werkwijze.</span></div></div>
              <div className="flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f4f6ff] text-xl">♡</span><div><strong className="block text-sm text-[#375575]">Klanttevredenheid</strong><span className="text-xs leading-5 text-[#8998aa]">Onze klanten beoordelen ons met vertrouwen.</span></div></div>
              {prijs && <div className="rounded-2xl bg-[#f4f7ff] p-5"><div className="text-xs font-bold uppercase tracking-wider text-[#7287a0]">Totaalprijs</div><div className="mt-1 text-3xl font-extrabold text-[#29496f]">€ {prijs.totaal.toFixed(2).replace(".", ",")}</div></div>}
            </aside>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-[#edf2f7] pt-5">
            <a href="/boeken/glazenwassen/prijs" className="px-2 py-3 text-sm font-bold text-[#8090a3]">← Terug</a>
            <button type="button" disabled={!kanVerder} onClick={gaVerder} className={`min-w-44 rounded-xl px-7 py-3.5 text-sm font-extrabold text-white transition ${kanVerder ? "bg-[#5578dc] shadow-[0_8px_20px_rgba(73,103,190,.24)] hover:bg-[#466bd4]" : "cursor-not-allowed bg-[#ccd7e9]"}`}>Verder →</button>
          </div>
        </section>
      </div>
    </main>
  );
}
