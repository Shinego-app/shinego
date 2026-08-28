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
  const [gewensteDatum, setGewenensteDatum] =useState("");
  const [gewensteTijd, setGewensteTijd] = useState("");
  const [thuisNodig, setThuisNodig] = useState("");
  useEffect(() => {
    const opgeslagenPrijs = localStorage.getItem("shinegoPrijs");

    if (opgeslagenPrijs) {
      setPrijs(JSON.parse(opgeslagenPrijs));
    }
  }, []);
  useEffect(() => {
  async function haalAdresOp() {
    if (postcode.trim().length < 6 || huisnummer.trim() === "") return;

    try {
      const zoekterm = `${postcode} ${huisnummer}`;
      const response = await fetch(
        `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${encodeURIComponent(
          zoekterm
        )}&fq=type:adres`
      );

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
    voornaam.trim() !== "" &&
    achternaam.trim() !== "" &&
    email.trim() !== "" &&
    telefoon.trim() !== "" &&
    postcode.trim() !== "" &&
    huisnummer.trim() !== "" &&
    straat.trim() !== "" &&
    plaats.trim() !== "" &&
    gewensteDatum !== "" &&
    gewensteTijd !=="" &&
    thuisNodig !== "";
    
    function gaVerder() {
    if (!kanVerder) return;

    const klantGegevens = {
      voornaam,
      achternaam,
      email,
      telefoon,
      postcode,
      huisnummer,
      straat,
      plaats,
      gewensteDatum,
      gewensteTijd,
      thuisNodig,
    };

    localStorage.setItem(
      "shinegoKlantGegevens",
      JSON.stringify(klantGegevens)
    );

    window.location.href = "/boeken/glazenwassen/bevestigen";
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="text-2xl font-bold text-blue-600">
            ShineGo
          </a>

          <a
            href="/boeken/glazenwassen/prijs"
            className="font-medium text-gray-600 hover:text-blue-600"
          >
            ← Terug
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-12">
        {/* VOORTGANG */}
        <div className="mb-10">
          <div className="mb-3 flex justify-between">
            <span className="text-sm font-semibold text-blue-600">
              Boekingsgegevens
            </span>

            <span className="text-sm text-gray-500">
              Bijna klaar
            </span>
          </div>

          <div className="h-2 rounded-full bg-gray-200">
            <div className="h-2 w-4/5 rounded-full bg-blue-600" />
          </div>
        </div>

        {/* TITEL */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Jouw gegevens
          </h1>

          <p className="mt-3 text-lg text-gray-600">
            Vul je contact- en adresgegevens in zodat we de opdracht kunnen
            afronden.
          </p>
        </div>

        {/* PRIJS */}
        {prijs && (
          <div className="mb-6 flex items-center justify-between rounded-2xl bg-blue-600 p-6 text-white">
            <div>
              <p className="text-sm text-blue-100">
                Jouw ShineGo-prijs
              </p>

              <p className="mt-1 font-semibold">
                Glazenwassen buitenzijde
              </p>
            </div>

            <div className="text-3xl font-bold">
              €{prijs.totaal.toFixed(2).replace(".", ",")}
            </div>
          </div>
        )}

        {/* PERSOONLIJKE GEGEVENS */}
        <div className="rounded-3xl border border-gray-200 bg-white p-7">
          <h2 className="text-xl font-bold text-gray-900">
            Contactgegevens
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Voornaam
              </label>

              <input
                type="text"
                value={voornaam}
                onChange={(e) => setVoornaam(e.target.value)}
                placeholder="Voornaam"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Achternaam
              </label>

              <input
                type="text"
                value={achternaam}
                onChange={(e) => setAchternaam(e.target.value)}
                placeholder="Achternaam"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                E-mailadres
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="naam@email.nl"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Telefoonnummer
              </label>

              <input
                type="tel"
                value={telefoon}
                onChange={(e) => setTelefoon(e.target.value)}
                placeholder="06 12345678"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* ADRES */}
        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-7">
          <h2 className="text-xl font-bold text-gray-900">
            Adres van de klus
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Postcode
              </label>

              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="1234 AB"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 uppercase outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Huisnummer
              </label>

              <input
                type="text"
                value={huisnummer}
                onChange={(e) => setHuisnummer(e.target.value)}
                placeholder="12"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Straat
              </label>

              <input
                type="text"
                value={straat}
                onChange={(e) => setStraat(e.target.value)}
                placeholder="Straatnaam"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Plaats
              </label>

              <input
                type="text"
                value={plaats}
                onChange={(e) => setPlaats(e.target.value)}
                placeholder="Amsterdam"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
              />
            </div>
          </div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          gewenste datum
        </label>
        <input
        type="date"
        value={gewensteDatum}
        onChange={(e => setGewenensteDatum(e.target.value))}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
        />
        </div>
        <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
        Gewenste tijd
        </label>
        <select
        value={gewensteTijd}
        onChange={(e) => setGewensteTijd(e.target.value)}
        className="w-full rounded-xl border border border-gray-300 px-4 py-3 outline-none"
        >
        <option value="">kies een tijdvak</option>
        <option value="08:00-10:00">08:00 - 10:00</option>
        <option value="10:00-12:00">10:00 - 12:00</option>
        <option value="12:00-14:00">12:00 - 14:00</option>
        <option value="14:00-16:00">14:00 - 16:00</option>
        <option value="16:00-18:00">16:00 - 18:00</option>
          </select>
          </div>
          <div>|
          <label className="mb-2 block text-sm font-semibold text-gray-700">Moet je thuis zijn?</label>
          <select value={thuisNodig} onChange={(e) => setThuisNodig(e.target.value)}>

          ClassName="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
          
          
          
          <option value="">kies een optie</option>
          <option value="ja">ja ik ben thuis</option>
          <option value="nee">Nee, ik hoef niet thuis te zijn</option>
          </select></div>
          {/* VEILIGHEID */}
          <div className="mt-6 rounded-2xl bg-blue-50 p-6">
          <p className="font-semibold text-blue-900">
            🔒 Je gegevens worden veilig verwerkt
          </p>

          <p className="mt-2 text-sm leading-relaxed text-blue-800">
            Deze gegevens gebruiken we alleen om de ShineGo-opdracht te
            verwerken en de professional naar het juiste adres te sturen.
          </p>
        </div>

        {/* KNOPPEN */}
        <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-8">
          <a
            href="/boeken/glazenwassen/prijs"
            className="font-semibold text-gray-600 hover:text-gray-900"
          >
            ← Vorige
          </a>

          <button
            type="button"
            disabled={!kanVerder}
            onClick={gaVerder}
            className={`rounded-xl px-10 py-4 text-lg font-bold transition ${
              kanVerder
                ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                : "cursor-not-allowed bg-gray-200 text-gray-400"
            }`}
          >
            Verder →
          </button>
        </div>
      </section>
    </main>
  );
}