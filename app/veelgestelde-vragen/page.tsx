"use client";

import { useState } from "react";

const vragen = [
  {
    vraag: "Wat is Telewash?",
    antwoord:
      "Telewash is een professioneel wassysteem met een uitschuifbare telescoopsteel. Hiermee kunnen ramen op hoogte veilig vanaf de grond worden gereinigd, zonder dat daarvoor op grote hoogte met een ladder gewerkt hoeft te worden.",
  },
  {
    vraag: "Wanneer heb ik Telewash nodig?",
    antwoord:
      "Kies Telewash wanneer ramen niet normaal en veilig bereikbaar zijn, bijvoorbeeld bij hogere verdiepingen of ramen boven een aanbouw. Tijdens het boeken kun je aangeven dat Telewash nodig is.",
  },
  {
    vraag: "Tot welke hoogte kan een glazenwasser werken?",
    antwoord:
      "Veiligheid staat voorop. Ramen die niet veilig bereikbaar zijn met normale werkmethodes worden met Telewash gereinigd wanneer dit technisch mogelijk is. De professional beoordeelt ter plaatse altijd of de werkzaamheden veilig uitgevoerd kunnen worden.",
  },
  {
    vraag: "Worden de kozijnen ook schoongemaakt?",
    antwoord:
      "Je kunt tijdens het boeken aangeven of je de kozijnen wilt laten reinigen. Wanneer je deze optie kiest, wordt de toeslag automatisch meegenomen in de prijs.",
  },
  {
    vraag: "Moet ik thuis zijn?",
    antwoord:
      "Niet altijd. Als de professional de ramen veilig kan bereiken zonder dat toegang tot de woning nodig is, hoef je niet thuis te zijn. Tijdens het boeken kun je aangeven of aanwezigheid noodzakelijk is.",
  },
  {
    vraag: "Kan ik ook een winkel of bedrijfspand laten reinigen?",
    antwoord:
      "Ja. ShineGo is ook beschikbaar voor winkels en bedrijfspanden. Je geeft tijdens het boeken de benodigde informatie over het pand en de ramen door.",
  },
  {
    vraag: "Wanneer betaal ik?",
    antwoord:
      "Je betaalt vooraf veilig via ShineGo. De betaling wordt verwerkt via onze betaalpartner. De professional ontvangt zijn vergoeding pas nadat de opdracht volgens de afgesproken procedure is afgerond.",
  },
  {
    vraag: "Kan ik mijn boeking annuleren?",
    antwoord:
      "Ja. Een boeking kan worden geannuleerd. Afhankelijk van het moment van annuleren kunnen annuleringskosten gelden. Bij annulering door de professional kan de opdracht opnieuw beschikbaar worden gesteld.",
  },
  {
    vraag: "Wat gebeurt er als de glazenwasser niet veilig kan werken?",
    antwoord:
      "De professional hoeft werkzaamheden die niet veilig uitgevoerd kunnen worden niet uit te voeren. Veiligheid gaat altijd voor. ShineGo kan vervolgens beoordelen wat voor de betreffende boeking de passende vervolgstap is.",
  },
];

export default function VeelgesteldeVragenPage() {
  const [openVraag, setOpenVraag] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Hulp & informatie
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Veelgestelde vragen
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Alles wat je wilt weten over boeken, Telewash, veiligheid,
            betalingen en het laten reinigen van je ramen via ShineGo.
          </p>
        </div>

        <div className="space-y-3">
          {vragen.map((item, index) => {
            const isOpen = openVraag === index;

            return (
              <div
                key={item.vraag}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenVraag(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                >
                  <span className="font-semibold text-slate-900">
                    {item.vraag}
                  </span>

                  <span className="text-2xl font-light text-blue-600">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 px-5 pb-5 pt-4">
                    <p className="leading-7 text-slate-600">{item.antwoord}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl bg-slate-900 p-6 text-center text-white">
          <h2 className="text-xl font-bold">Klaar om je ramen te laten reinigen?</h2>
          <p className="mt-2 text-sm text-slate-300">
            Bereken eenvoudig je prijs en boek een professional via ShineGo.
          </p>

          <a
            href="/boeken/glazenwassen"
            className="mt-5 inline-flex rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Bekijk je prijs
          </a>
        </div>
      </div>
    </main>
  );
}