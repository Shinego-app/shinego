export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigatie */}
      <header className="border-b border-gray-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="text-2xl font-bold text-blue-600">
            ShineGo
          </div>

          <nav className="hidden gap-8 md:flex">
            <a href="#diensten" className="text-gray-700 hover:text-blue-600">
              Diensten
            </a>

            <a
              href="#hoe-het-werkt"
              className="text-gray-700 hover:text-blue-600"
            >
              Hoe het werkt
            </a>

            <a
              href="#professional"
              className="text-gray-700 hover:text-blue-600"
            >
              Voor professionals
            </a>
          </nav>

          <button className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
            Inloggen
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
          <div>
            <div className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              Snel geregeld. Vooraf een duidelijke prijs.
            </div>

            <h1 className="text-5xl font-bold leading-tight text-gray-900 md:text-6xl">
              Een vakman regelen
              <span className="text-blue-600"> zonder gedoe.</span>
            </h1>

            <p className="mt-6 max-w-xl text-xl leading-relaxed text-gray-600">
              Boek eenvoudig een betrouwbare professional voor jouw klus.
              Kies je dienst, ontvang direct een prijs en plan wanneer het jou
              uitkomt.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              {/* DEZE KNOP GAAT NU NAAR /boeken */}
              <a
                href="/boeken"
                className="rounded-xl bg-blue-600 px-7 py-4 text-center text-lg font-semibold text-white hover:bg-blue-700"
              >
                Boek een klus
              </a>

              <button className="rounded-xl border border-gray-300 bg-white px-7 py-4 text-lg font-semibold text-gray-800 hover:bg-gray-50">
                Word professional
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-gray-600">
              <span>✓ Vooraf vaste prijs</span>
              <span>✓ Betrouwbare professionals</span>
              <span>✓ Veilig betalen</span>
            </div>
          </div>

          {/* Boekingskaart */}
          <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900">
              Wat wil je laten doen?
            </h2>

            <p className="mt-2 text-gray-500">
              Kies een dienst om direct te beginnen.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <button className="rounded-2xl border border-gray-200 p-5 text-left transition hover:border-blue-500 hover:bg-blue-50">
                <div className="text-3xl">🪟</div>

                <div className="mt-3 font-semibold text-gray-900">
                  Glazenwassen
                </div>

                <div className="mt-1 text-sm text-gray-500">
                  Ramen buitenzijde
                </div>
              </button>

              <button className="rounded-2xl border border-gray-200 p-5 text-left transition hover:border-blue-500 hover:bg-blue-50">
                <div className="text-3xl">🎨</div>

                <div className="mt-3 font-semibold text-gray-900">
                  Schilderwerk
                </div>

                <div className="mt-1 text-sm text-gray-500">
                  Binnen en buiten
                </div>
              </button>

              <button className="rounded-2xl border border-gray-200 p-5 text-left transition hover:border-blue-500 hover:bg-blue-50">
                <div className="text-3xl">🧱</div>

                <div className="mt-3 font-semibold text-gray-900">
                  Stucwerk
                </div>

                <div className="mt-1 text-sm text-gray-500">
                  Per vierkante meter
                </div>
              </button>

              <button className="rounded-2xl border border-gray-200 p-5 text-left transition hover:border-blue-500 hover:bg-blue-50">
                <div className="text-3xl">🏠</div>

                <div className="mt-3 font-semibold text-gray-900">
                  Vloeren
                </div>

                <div className="mt-1 text-sm text-gray-500">
                  Leggen en afwerken
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Diensten */}
      <section id="diensten" className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900">
            Eén platform voor jouw klussen
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            ShineGo maakt het boeken van een vakman net zo eenvoudig als het
            bestellen van een taxi.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 p-7">
            <div className="text-4xl">💶</div>

            <h3 className="mt-5 text-xl font-bold text-gray-900">
              Direct een prijs
            </h3>

            <p className="mt-3 leading-relaxed text-gray-600">
              Geen eindeloze offertes. Vul de klusgegevens in en zie vooraf
              wat de klus kost.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 p-7">
            <div className="text-4xl">📅</div>

            <h3 className="mt-5 text-xl font-bold text-gray-900">
              Zelf inplannen
            </h3>

            <p className="mt-3 leading-relaxed text-gray-600">
              Kies eenvoudig een beschikbare datum en tijd die bij jouw
              planning past.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 p-7">
            <div className="text-4xl">✅</div>

            <h3 className="mt-5 text-xl font-bold text-gray-900">
              Gecontroleerde professionals
            </h3>

            <p className="mt-3 leading-relaxed text-gray-600">
              Professionals worden gecontroleerd voordat ze opdrachten via
              ShineGo kunnen uitvoeren.
            </p>
          </div>
        </div>
      </section>

      {/* Hoe het werkt */}
      <section id="hoe-het-werkt" className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              Zo werkt ShineGo
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                1
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Kies je klus
              </h3>

              <p className="mt-2 text-gray-600">
                Geef aan wat er gedaan moet worden.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                2
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Bekijk je prijs
              </h3>

              <p className="mt-2 text-gray-600">
                ShineGo berekent vooraf de prijs van de opdracht.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                3
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Wij regelen de rest
              </h3>

              <p className="mt-2 text-gray-600">
                Een beschikbare professional kan jouw opdracht uitvoeren.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Professionals */}
      <section id="professional" className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl bg-gray-900 px-8 py-14 text-white md:px-14">
          <div className="max-w-3xl">
            <p className="font-semibold text-blue-400">
              Voor zelfstandige professionals
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              Meer opdrachten. Geen betaalde leads.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-gray-300">
              Ontvang echte opdrachten in jouw regio. Bekijk de klus, verdien
              aan uitgevoerd werk en beheer je planning vanuit één plek.
            </p>

            <button className="mt-8 rounded-xl bg-white px-7 py-4 font-semibold text-gray-900 hover:bg-gray-100">
              Aanmelden als professional
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
          <div>© 2026 ShineGo</div>

          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900">
              Privacy
            </a>

            <a href="#" className="hover:text-gray-900">
              Voorwaarden
            </a>

            <a href="#" className="hover:text-gray-900">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}