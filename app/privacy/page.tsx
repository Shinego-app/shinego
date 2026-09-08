export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
        <a
          href="/"
          className="mb-8 inline-block font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Terug naar ShineGo
        </a>

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
            ShineGo
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Privacyverklaring
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Laatst bijgewerkt: 8 september 2026
          </p>

          <div className="mt-10 space-y-9 leading-7 text-slate-600">
            <section>
              <h2 className="text-xl font-bold text-slate-900">
                1. Over ShineGo
              </h2>
              <p className="mt-2">
                ShineGo is een online platform dat klanten en zelfstandige
                professionals met elkaar in contact brengt voor onder andere
                glasbewassing. Via het platform kunnen opdrachten worden
                geboekt, toegewezen, betaald en afgehandeld.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                2. Welke persoonsgegevens verwerken wij?
              </h2>
              <p className="mt-2">
                Afhankelijk van hoe je ShineGo gebruikt, kunnen wij gegevens
                verwerken zoals je naam, e-mailadres, telefoonnummer, adres- en
                locatiegegevens, boekingsgegevens en informatie over de
                aangevraagde dienst.
              </p>
              <p className="mt-2">
                Van professionals kunnen daarnaast zakelijke gegevens worden
                verwerkt, zoals bedrijfsnaam, KvK-nummer, btw-nummer,
                werkgebied en gegevens die nodig zijn voor verificatie en
                uitbetaling.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                3. Waarvoor gebruiken wij deze gegevens?
              </h2>
              <p className="mt-2">
                Wij gebruiken persoonsgegevens om boekingen uit te voeren,
                klanten en professionals met elkaar te verbinden, betalingen
                en uitbetalingen mogelijk te maken, facturen en
                serviceberichten te versturen, fraude en misbruik tegen te
                gaan en het platform veilig en goed werkend te houden.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                4. Betalingen
              </h2>
              <p className="mt-2">
                Betalingen en uitbetalingen worden verwerkt via Stripe. Voor
                het uitvoeren van betalingen en het verifiëren en uitbetalen
                van professionals kunnen persoonsgegevens rechtstreeks door
                Stripe worden verwerkt. ShineGo bewaart geen volledige
                betaalkaartgegevens.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                5. Dienstverleners
              </h2>
              <p className="mt-2">
                Voor de werking van het platform maakt ShineGo gebruik van
                externe dienstverleners, waaronder partijen voor hosting,
                databaseopslag, betalingen en het verzenden van e-mail. Met
                deze partijen worden alleen gegevens gedeeld voor zover dit
                noodzakelijk is voor hun dienstverlening.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                6. Bewaartermijnen
              </h2>
              <p className="mt-2">
                Wij bewaren persoonsgegevens niet langer dan noodzakelijk voor
                het doel waarvoor ze zijn verzameld, tenzij wij bepaalde
                gegevens langer moeten bewaren vanwege een wettelijke
                verplichting, bijvoorbeeld voor onze administratie.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                7. Beveiliging
              </h2>
              <p className="mt-2">
                ShineGo neemt passende technische en organisatorische
                maatregelen om persoonsgegevens te beschermen tegen verlies,
                onbevoegde toegang, misbruik en ongewenste openbaarmaking.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                8. Jouw privacyrechten
              </h2>
              <p className="mt-2">
                Je kunt, voor zover de wet dit toestaat, verzoeken om inzage,
                correctie of verwijdering van je persoonsgegevens. Ook kun je
                in bepaalde gevallen bezwaar maken tegen de verwerking,
                verzoeken om beperking van de verwerking of vragen om
                overdracht van je gegevens.
              </p>
              <p className="mt-2">
                Je hebt daarnaast het recht om een klacht in te dienen bij de
                Autoriteit Persoonsgegevens.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                9. Wijzigingen
              </h2>
              <p className="mt-2">
                Deze privacyverklaring kan worden aangepast wanneer onze
                dienstverlening of wet- en regelgeving verandert. De meest
                actuele versie wordt op de website gepubliceerd.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                10. Contact
              </h2>
              <p className="mt-2">
                Heb je vragen over deze privacyverklaring of over de verwerking
                van je persoonsgegevens? Neem dan contact op met ShineGo via
                onze contactmogelijkheden op de website.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}