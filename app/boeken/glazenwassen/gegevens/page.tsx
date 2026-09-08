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
    voornaam.trim() !== "" && achternaam.trim() !== "" && email.trim() !== "" && telefoon.trim() !== "" && postcode.trim() !== "" && huisnummer.trim() !== "" && straat.trim() !== "" && plaats.trim() !== "" && gewensteDatum !== "" && gewensteTijd !== "" && thuisNodig !== "";

  function gaVerder() {
    if (!kanVerder) return;
    localStorage.setItem("shinegoKlantGegevens", JSON.stringify({
      voornaam, achternaam, email, telefoon, postcode, huisnummer, straat, plaats, gewensteDatum, gewensteTijd, thuisNodig,
    }));
    window.location.href = "/boeken/glazenwassen/bevestigen";
  }

  const inputClass = "w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-blue-600";

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
          <a href="/" className="text-2xl font-bold text-blue-600">ShineGo</a>
          <a href="/boeken/glazenwassen/prijs" className="text-sm font-semibold text-gray-600 hover:text-blue-600 sm:text-base">← Terug</a>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-7 sm:mb-10">
          <div className="mb-3 flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-blue-600">Boekingsgegevens</span>
            <span className="text-sm text-gray-500">Bijna klaar</span>
          </div>
          <div className="h-2 rounded-full bg-gray-200"><div className="h-2 w-4/5 rounded-full bg-blue-600" /></div>
        </div>

        <div className="mb-7 sm:mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Jouw gegevens</h1>
          <p className="mt-3 text-base leading-7 text-gray-600 sm:text-lg">Vul je contact- en adresgegevens in zodat we de opdracht kunnen afronden.</p>
        </div>

        {prijs && (
          <div className="mb-5 flex flex-col gap-3 rounded-2xl bg-blue-600 p-5 text-white sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div><p className="text-sm text-blue-100">Jouw ShineGo-prijs</p><p className="mt-1 font-semibold">Glazenwassen buitenzijde</p></div>
            <div className="text-3xl font-bold">€{prijs.totaal.toFixed(2).replace(".", ",")}</div>
          </div>
        )}

        <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-7">
          <h2 className="text-xl font-bold text-gray-900">Contactgegevens</h2>
          <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-5">
            <div><label className="mb-2 block text-sm font-semibold text-gray-700">Voornaam</label><input type="text" value={voornaam} onChange={(e) => setVoornaam(e.target.value)} placeholder="Voornaam" autoComplete="given-name" className={inputClass} /></div>
            <div><label className="mb-2 block text-sm font-semibold text-gray-700">Achternaam</label><input type="text" value={achternaam} onChange={(e) => setAchternaam(e.target.value)} placeholder="Achternaam" autoComplete="family-name" className={inputClass} /></div>
            <div><label className="mb-2 block text-sm font-semibold text-gray-700">E-mailadres</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="naam@email.nl" autoComplete="email" className={inputClass} /></div>
            <div><label className="mb-2 block text-sm font-semibold text-gray-700">Telefoonnummer</label><input type="tel" value={telefoon} onChange={(e) => setTelefoon(e.target.value)} placeholder="06 12345678" autoComplete="tel" className={inputClass} /></div>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-gray-200 bg-white p-5 sm:mt-6 sm:p-7">
          <h2 className="text-xl font-bold text-gray-900">Adres van de klus</h2>
          <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-5">
            <div><label className="mb-2 block text-sm font-semibold text-gray-700">Postcode</label><input type="text" value={postcode} onChange={(e) => setPostcode(e.target.value)} placeholder="1234 AB" autoComplete="postal-code" className={`${inputClass} uppercase`} /></div>
            <div><label className="mb-2 block text-sm font-semibold text-gray-700">Huisnummer</label><input type="text" value={huisnummer} onChange={(e) => setHuisnummer(e.target.value)} placeholder="12" className={inputClass} /></div>
            <div><label className="mb-2 block text-sm font-semibold text-gray-700">Straat</label><input type="text" value={straat} onChange={(e) => setStraat(e.target.value)} placeholder="Straatnaam" autoComplete="address-line1" className={inputClass} /></div>
            <div><label className="mb-2 block text-sm font-semibold text-gray-700">Plaats</label><input type="text" value={plaats} onChange={(e) => setPlaats(e.target.value)} placeholder="Amsterdam" autoComplete="address-level2" className={inputClass} /></div>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-gray-200 bg-white p-5 sm:mt-6 sm:p-7">
          <h2 className="text-xl font-bold text-gray-900">Planning</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 sm:gap-5">
            <div><label className="mb-2 block text-sm font-semibold text-gray-700">Gewenste datum</label><input type="date" value={gewensteDatum} onChange={(e) => setGewenensteDatum(e.target.value)} className={inputClass} /></div>
            <div><label className="mb-2 block text-sm font-semibold text-gray-700">Gewenste tijd</label><select value={gewensteTijd} onChange={(e) => setGewensteTijd(e.target.value)} className={inputClass}><option value="">Kies een tijdvak</option><option value="08:00-10:00">08:00 - 10:00</option><option value="10:00-12:00">10:00 - 12:00</option><option value="12:00-14:00">12:00 - 14:00</option><option value="14:00-16:00">14:00 - 16:00</option><option value="16:00-18:00">16:00 - 18:00</option></select></div>
          </div>
          <div className="mt-4 sm:mt-5"><label className="mb-2 block text-sm font-semibold text-gray-700">Moet je thuis zijn?</label><select value={thuisNodig} onChange={(e) => setThuisNodig(e.target.value)} className={inputClass}><option value="">Kies een optie</option><option value="ja">Ja, ik ben thuis</option><option value="nee">Nee, ik hoef niet thuis te zijn</option></select></div>
        </div>

        <div className="mt-5 rounded-2xl bg-blue-50 p-5 sm:mt-6 sm:p-6">
          <p className="font-semibold text-blue-900">🔒 Je gegevens worden veilig verwerkt</p>
          <p className="mt-2 text-sm leading-relaxed text-blue-800">Deze gegevens gebruiken we alleen om de ShineGo-opdracht te verwerken en de professional naar het juiste adres te sturen.</p>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:pt-8">
          <a href="/boeken/glazenwassen/prijs" className="py-2 text-center font-semibold text-gray-600 hover:text-gray-900 sm:text-left">← Vorige</a>
          <button type="button" disabled={!kanVerder} onClick={gaVerder} className={`w-full rounded-xl px-6 py-4 text-base font-bold transition sm:w-auto sm:px-10 sm:text-lg ${kanVerder ? "bg-blue-600 text-white shadow-md hover:bg-blue-700" : "cursor-not-allowed bg-gray-200 text-gray-400"}`}>Verder →</button>
        </div>
      </section>
    </main>
  );
}
