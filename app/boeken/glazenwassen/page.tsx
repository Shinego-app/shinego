"use client";

import { useEffect,useState } from "react";

export default function GlazenwassenPage() {
  const [woningtype, setWoningtype] = useState("");
  const [verdiepingen, setVerdiepingen] = useState<string[]>([]);
  const [ramen, setRamen] = useState(0);
  const [telescoop, setTelescoop] = useState(false);
  const [type, setType] = useState("");
  const [frequentie, setFrequentie] = useState("eenmalig");
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const gekozenType = params.get("type") || "";
  setType(gekozenType);
}, []);
  const woningtypes = [
    {
      id: "tussenwoning",
      naam: "Tussenwoning",
      icoon: "🏠",
    },
    {
      id: "hoekwoning",
      naam: "Hoekwoning",
      icoon: "🏡",
    },
    {
      id: "vrijstaand",
      naam: "Vrijstaande woning",
      icoon: "🏘️",
    },
    {
      id: "appartement",
      naam: "Appartement",
      icoon: "🏢",
    },
    {
    id: "bedrijfspand",
    naam: "Winkel / bedrijfspand", 
    icoon: "🏢",
},


  ];

  const kanVerder =
    woningtype !== "" &&
    ( woningtype === "appartement" || verdiepingen.length > 0) &&
    ramen > 0;

  function gaVerder() {
    if (!kanVerder) return;

    const gegevens = {
      woningtype,
      verdiepingen,
      ramen,
      telescoop,
      type,
      frequentie,
    };
    
  
    localStorage.setItem(
      "shinegoGlazenwassen",
      JSON.stringify(gegevens)
    );

    window.location.href = `/boeken/glazenwassen/details?type=${type}`
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a
            href="/"
            className="text-2xl font-bold text-blue-600"
          >
            ShineGo
          </a>

          <a
            href="/boeken"
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
              Stap 2 van 4
            </span>

            <span className="text-sm text-gray-500">
              Gegevens van de woning
            </span>
          </div>

          <div className="h-2 rounded-full bg-gray-200">
            <div className="h-2 w-2/4 rounded-full bg-blue-600" />
          </div>
        </div>

        {/* TITEL */}
        <div className="mb-10">
          <div className="mb-4 text-5xl">
            🪟
          </div>

          <h1 className="text-4xl font-bold text-gray-900">
            Glazenwassen
          </h1>

          <p className="mt-3 text-lg text-gray-600">
            Vertel ons iets over de woning zodat ShineGo
            de opdracht kan berekenen.
          </p>
        </div>

        {/* WONINGTYPE */}
        <div className="rounded-3xl border border-gray-200 bg-white p-7">
          <h2 className="text-xl font-bold text-gray-900">
            1. kies jouw situatie
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {woningtypes.map((woning) => {
              const gekozen =
                woningtype === woning.id;

              return (
                <button
                  key={woning.id}
                  type="button"
                  onClick={() => {
                    setWoningtype(woning.id);
                  if (woning.id === "telescoop") {setVerdiepingen([])}}}
                  className={`rounded-2xl border-2 p-5 text-left transition ${
                    gekozen
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">
                      {woning.icoon}
                    </div>

                    <div className="font-bold text-gray-900">
                      {woning.naam}
                    </div>

                    {gekozen && (
                      <div className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-sm text-white">
                        ✓
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        {/* TELESCOOP */}
        {woningtype !== "" && (
        <div className="mt-6 rounded-3xl border border-gray-200 bg-white-7">
        <h2 className="px-6 text-xl font-bold text-gray-900">
         bereikbaarheid van het glas 
         </h2>
         <button type="button" onClick={()=> setTelescoop( !telescoop)} className={`mt-4 rounded-xl border-2 p-5 font-bold ${telescoop ?"border-blue-600 bg-blue50 text-blue-700" :"border-gray-200 bg-white text-gray-900"}`}>Telescoop nodig</button>
         </div>
        )}   
        {/* VERDIEPINGEN */}
        { woningtype !== "" &&(
        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-7">
          <h2 className="text-xl font-bold text-gray-900">
            2. Hoeveel verdiepingen?
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {["1", "2", "3"].map((aantal) => (
              <button
                key={aantal}
                type="button"
                onClick={() =>
                  setVerdiepingen((vorige) =>
                    vorige.includes(aantal)
                ? vorige.filter((v) => v !== aantal)
                : [...vorige, aantal]
                )}
                className={`rounded-2xl border-2 p-5 text-center font-bold transition ${
                  verdiepingen.includes(aantal)
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-700 hover:border-blue-300"
                }`}
              >
                {aantal}
                {aantal === "1"
                  ? " verdieping"
                  : " verdiepingen"}
              </button>
            ))}
          </div>
        </div>
        )}
        {/* RAMEN */}
        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-7">
          <h2 className="text-xl font-bold text-gray-900">
            3. Hoeveel ramen moeten worden gewassen?
          </h2>

          <p className="mt-2 text-gray-500">
            Tel alle ramen aan de buitenzijde die je wilt
            laten reinigen.
          </p>

          <div className="mt-7 flex items-center gap-6">
            <button
              type="button"
              onClick={() =>
                setRamen(Math.max(0, ramen - 1))
              }
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-2xl font-bold hover:border-blue-500"
            >
              −
            </button>

            <div className="min-w-20 text-center">
              <div className="text-4xl font-bold text-gray-900">
                {ramen}
              </div>

              <div className="text-sm text-gray-500">
                ramen
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setRamen(ramen + 1)
              }
              className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white hover:bg-blue-700"
            >
              +
            </button>
          </div>
        </div>

        {/* SAMENVATTING */}
        <div className="mt-6 rounded-2xl bg-blue-50 p-6">
          <h3 className="font-bold text-blue-900">
            Jouw opdracht
          </h3>

          <div className="mt-3 space-y-2 text-sm text-blue-900">
            <div className="flex justify-between">
              <span>Dienst</span>
              <strong>Glazenwassen buitenzijde</strong>
            </div>

            <div className="flex justify-between">
              <span>Woningtype</span>
              <strong>
                {woningtype
                  ? woningtypes.find(
                      (woning) =>
                        woning.id === woningtype
                    )?.naam
                  : "Nog kiezen"}
              </strong>
            </div>
            <div className="flex justify-between"><span>Telescoop</span><strong>{telescoop ? "ja" : "nee"}</strong></div>

            <div className="flex justify-between">
              <span>Verdiepingen</span>
              <strong>
                {verdiepingen.length > 0 ? verdiepingen.join(", ") :"Nog kiezen"}
              </strong>
            </div>

            <div className="flex justify-between">
              <span>Aantal ramen</span>
              <strong>{ramen}</strong>
            </div>
          </div>
        </div>

        {/* ONDERKANT */}
       <div className="mt-8">
  <h2 className="text-xl font-bold text-gray-900">
    Hoe vaak wil je de ramen laten wassen?
  </h2>

  <p className="mt-2 text-sm text-gray-600">
    Kies eenmalig of profiteer van korting bij periodieke glasbewassing.
  </p>

  <div className="mt-4 grid gap-3 sm:grid-cols-2">
    {[
      { id: "eenmalig", label: "Eenmalig", korting: "" },
      { id: "4weken", label: "Elke 4 weken", korting: "12% korting" },
      { id: "8weken", label: "Elke 8 weken", korting: "10% korting" },
      { id: "12weken", label: "Elke 12 weken", korting: "7% korting" },
    ].map((optie) => (
      <button
        key={optie.id}
        type="button"
        onClick={() => setFrequentie(optie.id)}
        className={`rounded-xl border p-4 text-left transition ${
          frequentie === optie.id
            ? "border-blue-600 bg-blue-50"
            : "border-gray-200 bg-white hover:border-blue-300"
        }`}
      >
        <div className="font-semibold text-gray-900">{optie.label}</div>
        {optie.korting && (
          <div className="mt-1 text-sm text-green-600">{optie.korting}</div>
        )}
      </button>
    ))}
  </div>
</div>
        <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-8">
          <a
            href="/boeken"
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