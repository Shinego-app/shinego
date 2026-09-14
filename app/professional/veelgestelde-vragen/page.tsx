"use client";

import { useState } from "react";

const vragen = [
  {
    vraag: "Wat is osmosewater?",
    antwoord:
      "Osmosewater is sterk gezuiverd water waar een groot deel van opgeloste mineralen en zouten uit is verwijderd. Het wordt in de glasbewassing vaak gebruikt met een telescoopsteel, omdat schoon glas na het spoelen kan opdrogen zonder kalk- of mineraalresten. Je bepaalt als zelfstandig professional zelf of deze methode geschikt is voor de opdracht en bent zelf verantwoordelijk voor de kwaliteit van je water en materiaal.",
  },
  {
    vraag: "Moet ik osmosewater gebruiken?",
    antwoord:
      "Nee. ShineGo schrijft geen specifieke werkmethode of reinigingsmiddel voor. Jij bepaalt als zelfstandig professional welke methode en materialen passend en veilig zijn voor de opdracht.",
  },
  {
    vraag: "Wat is een telescoopsteel of water-fed pole?",
    antwoord:
      "Een telescoopsteel is een uitschuifbare steel waarmee ramen vanaf de grond kunnen worden bereikt. Bij een water-fed pole wordt water via de steel naar een borstel geleid. Of je deze methode gebruikt, bepaal je zelf op basis van de locatie, hoogte, bereikbaarheid en veiligheid.",
  },
  {
    vraag: "Wat moet ik doen bij ramen op de 3e verdieping?",
    antwoord:
      "De opdrachtinformatie vermeldt wanneer ramen op de 3e verdieping aanwezig zijn en wanneer telescoopwerk of extra bereikbaarheid is aangegeven. Beoordeel altijd zelf de situatie ter plaatse. Als je de opdracht niet verantwoord kunt uitvoeren, voer je de werkzaamheden niet uit en meld je dit via ShineGo.",
  },
  {
    vraag: "Mag ik een ladder, steiger of hoogwerker gebruiken?",
    antwoord:
      "ShineGo bepaalt niet welk arbeidsmiddel je gebruikt. Als zelfstandig ondernemer ben je zelf verantwoordelijk voor een passende en veilige werkwijze en voor het naleven van de regels die voor jouw werkzaamheden en arbeidsmiddelen gelden.",
  },
  {
    vraag: "Wat als de situatie ter plaatse onveilig is?",
    antwoord:
      "Voer de opdracht niet uit als je vindt dat deze niet veilig kan worden uitgevoerd. Leg de situatie zo duidelijk mogelijk vast en neem contact op met ShineGo zodat de opdracht administratief correct kan worden afgehandeld.",
  },
  {
    vraag: "Wat gebeurt er bij slecht weer?",
    antwoord:
      "Je beoordeelt zelf of de weersomstandigheden een verantwoorde uitvoering toelaten. Als uitstel nodig is, stem je dit met de klant en ShineGo af zodat de afspraak opnieuw kan worden gepland.",
  },
  {
    vraag: "Welke opdrachtinformatie krijg ik te zien?",
    antwoord:
      "Bij een toegewezen opdracht zie je onder andere de locatie, gewenste datum en tijd, woning- of pandtype, aantal ramen, verdiepingen, telescoopsteel, kozijnen, bereikbaarheid, frequentie en jouw vergoeding voor zover deze gegevens voor de boeking beschikbaar zijn.",
  },
  {
    vraag: "Wat als de klant extra werkzaamheden vraagt?",
    antwoord:
      "Voer geen betaalde extra werkzaamheden buiten de ShineGo-boeking om uit zonder dat deze eerst duidelijk zijn afgestemd. Neem bij een wezenlijke wijziging contact op met ShineGo zodat prijs en opdrachtgegevens correct kunnen worden aangepast.",
  },
  {
    vraag: "Wat als de klant niet thuis is of ik geen toegang krijg?",
    antwoord:
      "Controleer eerst of aanwezigheid volgens de opdracht nodig is. Als de opdracht niet kan worden uitgevoerd door ontbrekende toegang of afwezigheid van de klant, leg dit vast en meld het via ShineGo. De no-show- en annuleringsregels worden daarna toegepast.",
  },
  {
    vraag: "Kan ik zelf een opdracht annuleren?",
    antwoord:
      "Ja. Via de opdracht kun je annuleren en een reden opgeven. De opdracht wordt daarna weer beschikbaar gemaakt voor een andere professional. Annuleer zo vroeg mogelijk wanneer je weet dat je de opdracht niet kunt uitvoeren.",
  },
  {
    vraag: "Hoe werken periodieke opdrachten?",
    antwoord:
      "Klanten kunnen kiezen voor eenmalig of iedere 4, 8 of 12 weken. ShineGo probeert bij periodieke opdrachten waar mogelijk continuiteit te bieden, maar beschikbaarheid en planning blijven bepalend.",
  },
  {
    vraag: "Hoeveel ontvangt de professional?",
    antwoord:
      "Bij de standaard ShineGo-verdeling is 85% van het bedrag voor de professional en 15% platformcommissie voor ShineGo, tenzij voor een specifieke opdracht schriftelijk iets anders is afgesproken. Je ziet jouw vergoeding bij de opdracht.",
  },
  {
    vraag: "Wanneer word ik uitbetaald?",
    antwoord:
      "Na afronding wordt je vergoeding volgens het uitbetalingsschema verwerkt. Voor uitbetaling moet je Stripe-uitbetalingsaccount actief zijn en moeten eventuele controles van de betaalprovider zijn afgerond.",
  },
  {
    vraag: "Krijg ik een factuur of afrekening?",
    antwoord:
      "Na een uitgevoerde uitbetaling kan ShineGo een uitbetalingsafrekening versturen. Daarop staan onder andere het klantbedrag, de platformcommissie, jouw vergoeding en de bijbehorende opdrachtgegevens.",
  },
  {
    vraag: "Waarom vraagt Stripe om verificatie?",
    antwoord:
      "Stripe verwerkt de uitbetalingen en kan wettelijk of risicogestuurd aanvullende gegevens of identiteitscontroles vragen. ShineGo kan bekende bedrijfsgegevens aanleveren, maar kan verplichte controles van Stripe niet overslaan.",
  },
  {
    vraag: "Welke gegevens moet ik actueel houden?",
    antwoord:
      "Houd je bedrijfsnaam, contactgegevens, adres, KvK-nummer, btw-nummer en uitbetalingsgegevens actueel. Onjuiste gegevens kunnen opdrachten, communicatie of uitbetalingen vertragen.",
  },
  {
    vraag: "Ben ik werknemer van ShineGo?",
    antwoord:
      "Nee. Professionals voeren opdrachten uit als zelfstandig ondernemer. ShineGo bemiddelt tussen klant en professional en faciliteert onder andere boeking, betaling en administratie. Jij bepaalt zelf hoe je de werkzaamheden vakmatig en veilig uitvoert.",
  },
  {
    vraag: "Wie is verantwoordelijk voor schade tijdens de opdracht?",
    antwoord:
      "Als uitvoerende zelfstandig professional ben je verantwoordelijk voor je eigen handelen, materiaal en werkwijze. Meld schade of een incident direct bij de klant en bij ShineGo en volg je eigen verzekerings- en meldprocedure.",
  },
  {
    vraag: "Moet ik zelf materiaal en vervoer regelen?",
    antwoord:
      "Ja. Als zelfstandig professional zorg je zelf voor passend materiaal, gereedschap, reinigingsmiddelen, vervoer en overige middelen die je nodig hebt om een aangenomen opdracht uit te voeren.",
  },
];

export default function ProfessionalVeelgesteldeVragenPage() {
  const [openVraag, setOpenVraag] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-4xl">
        <a
          href="/professional/dashboard"
          className="inline-flex rounded-xl border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-900"
        >
          ← Terug naar dashboard
        </a>

        <section className="mt-5 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">ShineGo professionals</p>
          <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">Veelgestelde vragen</h1>
          <p className="mt-3 max-w-2xl leading-7 text-gray-600">
            Praktische informatie over opdrachten, osmosewater, telescoopwerk, veiligheid, betalingen en werken via ShineGo.
          </p>

          <div className="mt-8 space-y-3">
            {vragen.map((item, index) => {
              const open = openVraag === index;
              return (
                <div key={item.vraag} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  <button
                    type="button"
                    onClick={() => setOpenVraag(open ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                  >
                    <span className="font-bold text-gray-900">{item.vraag}</span>
                    <span className="text-2xl font-light text-blue-600">{open ? "−" : "+"}</span>
                  </button>
                  {open && (
                    <div className="border-t border-gray-100 px-5 pb-5 pt-4">
                      <p className="leading-7 text-gray-600">{item.antwoord}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl bg-blue-50 p-5 text-sm leading-6 text-blue-950">
            <strong>Belangrijk:</strong> ShineGo geeft geen werkinstructies voor de uitvoering van glasbewassing. Als zelfstandig professional beoordeel je zelf de situatie, kies je je werkmethode en hulpmiddelen en blijf je verantwoordelijk voor een veilige en vakmatige uitvoering.
          </div>

          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm leading-6 text-gray-700">
            <strong>Contact met ShineGo</strong><br />
            Voor vragen over je account, opdrachten of uitbetalingen: info@shinego.nl<br />
            ShineGo · KvK 57712913 · btw-id NL001205368B47
          </div>
        </section>
      </div>
    </main>
  );
}
