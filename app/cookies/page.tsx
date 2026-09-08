export default function CookiesPage() {
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
            Cookiebeleid
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Laatst bijgewerkt: 8 september 2026
          </p>

          <div className="mt-10 space-y-9 leading-7 text-slate-600">
            <section>
              <h2 className="text-xl font-bold text-slate-900">1. Wat zijn cookies?</h2>
              <p className="mt-2">
                Cookies zijn kleine gegevensbestanden die bij het gebruik van
                een website op je apparaat kunnen worden opgeslagen. Ook kan
                lokale opslag in de browser worden gebruikt om noodzakelijke
                voorkeuren te onthouden.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                2. Welke cookies gebruikt ShineGo?
              </h2>
              <p className="mt-2">
                ShineGo gebruikt momenteel alleen technologie die noodzakelijk
                is om de website en het platform veilig en goed te laten werken,
                bijvoorbeeld voor sessies, beveiliging en het onthouden van
                functionele voorkeuren.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                3. Geen marketing- of advertentiecookies
              </h2>
              <p className="mt-2">
                ShineGo gebruikt momenteel geen marketing- of
                advertentiecookies. Ook worden er op dit moment geen cookies
                geplaatst voor advertentieprofielen of gerichte advertenties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                4. Toestemming bij toekomstige uitbreiding
              </h2>
              <p className="mt-2">
                Als ShineGo later niet-noodzakelijke analytische, marketing- of
                advertentiecookies gaat gebruiken, vragen wij daarvoor vooraf
                toestemming wanneer dat wettelijk vereist is. Deze cookies
                worden dan niet geplaatst voordat toestemming is gegeven.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                5. Cookies beheren of verwijderen
              </h2>
              <p className="mt-2">
                Via de instellingen van je browser kun je cookies en lokale
                opslag bekijken en verwijderen. Het blokkeren van strikt
                noodzakelijke technologie kan ervoor zorgen dat delen van
                ShineGo niet goed werken.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">6. Wijzigingen</h2>
              <p className="mt-2">
                Dit cookiebeleid kan worden aangepast wanneer de website,
                gebruikte technologie of wet- en regelgeving verandert. De
                meest actuele versie wordt op de website gepubliceerd.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">7. Contact</h2>
              <p className="mt-2">
                Heb je vragen over het gebruik van cookies of lokale opslag?
                Neem dan contact op met ShineGo via onze contactmogelijkheden op
                de website.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
