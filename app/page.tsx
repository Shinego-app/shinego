export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="text-2xl font-extrabold tracking-tight text-blue-600">
            ShineGo
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#diensten" className="font-medium text-slate-600 transition hover:text-blue-600">Diensten</a>
            <a href="#hoe-het-werkt" className="font-medium text-slate-600 transition hover:text-blue-600">Hoe het werkt</a>
            <a href="#professional" className="font-medium text-slate-600 transition hover:text-blue-600">Voor glazenwassers</a>
          </nav>

          <a href="/professional/login" className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800">
            Inloggen
          </a>
        </div>
      </header>

      <section className="overflow-hidden bg-gradient-to-b from-blue-50 via-sky-50/40 to-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
              Glazenwasser nodig? ShineGo regelt het.
            </div>

            <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.08] tracking-tight text-slate-950 md:text-6xl">
              Schone ramen,
              <span className="block text-blue-600">zonder gedoe.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 md:text-xl">
              Boek eenvoudig een glazenwasser, zie vooraf wat je betaalt en kies een moment dat jou uitkomt.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="/boeken" className="rounded-xl bg-blue-600 px-7 py-4 text-center text-lg font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
                Boek een glazenwasser
              </a>
              <a href="/professional" className="rounded-xl border border-slate-200 bg-white px-7 py-4 text-center text-lg font-semibold text-slate-800 shadow-sm transition hover:border-blue-200 hover:bg-blue-50">
                Word glazenwasser
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-600">
              <span>✓ Vooraf vaste prijs</span>
              <span>✓ Gecontroleerde glazenwassers</span>
              <span>✓ Veilig betalen</span>
            </div>
          </div>

          <div className="rounded-3xl border border-white bg-white/90 p-7 shadow-2xl shadow-slate-200/70 ring-1 ring-slate-100">
            <div className="mb-1 text-sm font-bold uppercase tracking-wider text-blue-600">Snel boeken</div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Wat wil je laten reinigen?</h2>
            <p className="mt-2 text-slate-500">Kies de glasbewassing die bij je past.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <a href="/boeken/glazenwassen?type=buiten" className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md">
                <div className="text-3xl">✨</div>
                <div className="mt-3 font-bold text-slate-900 group-hover:text-blue-700">Ramen buiten wassen</div>
                <div className="mt-1 text-sm text-slate-500">Buitenzijde van je ramen</div>
              </a>

              <a href="/boeken/glazenwassen?type=binnen" className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md">
                <div className="text-3xl">🧼</div>
                <div className="mt-3 font-bold text-slate-900 group-hover:text-blue-700">Ramen binnen wassen</div>
                <div className="mt-1 text-sm text-slate-500">Binnenzijde van je ramen</div>
              </a>

              <a href="/boeken/glazenwassen?type=telewash" className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md">
                <div className="text-3xl">🪟</div>
                <div className="mt-3 font-bold text-slate-900 group-hover:text-blue-700">Telewash</div>
                <div className="mt-1 text-sm text-slate-500">Voor ramen op hoogte</div>
              </a>

              <a href="/boeken/glazenwassen?type=bedrijf" className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md">
                <div className="text-3xl">🏢</div>
                <div className="mt-3 font-bold text-slate-900 group-hover:text-blue-700">Winkel / bedrijfspand</div>
                <div className="mt-1 text-sm text-slate-500">Glasbewassing voor bedrijven</div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="diensten" className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="font-bold text-blue-600">Eenvoudig en duidelijk</p>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">Glazenwasser eenvoudig geregeld</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">Van prijs tot planning: ShineGo maakt glasbewassing makkelijk.</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            ["💶", "Direct een prijs", "Geen eindeloze offertes. Vul je gegevens in en zie direct wat de glasbewassing kost."],
            ["📅", "Zelf inplannen", "Kies eenvoudig een beschikbare datum en tijd die bij jouw planning past."],
            ["✅", "Gecontroleerde glazenwassers", "Glazenwassers worden gecontroleerd voordat ze opdrachten via ShineGo kunnen uitvoeren."],
          ].map(([icon, title, text]) => (
            <div key={title} className="rounded-3xl border border-slate-100 bg-white p-8 shadow-lg shadow-slate-100 transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl">{icon}</div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">{title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="hoe-het-werkt" className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center">
            <p className="font-bold text-blue-600">In drie stappen</p>
            <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">Zo werkt ShineGo</h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              ["1", "Kies je glasbewassing", "Geef aan wat er gedaan moet worden."],
              ["2", "Bekijk je prijs", "ShineGo berekent vooraf de prijs van de opdracht."],
              ["3", "Wij regelen de rest", "Een beschikbare glazenwasser kan jouw opdracht uitvoeren."],
            ].map(([number, title, text]) => (
              <div key={number} className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-100">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-extrabold text-white shadow-lg shadow-blue-600/20">{number}</div>
                <h3 className="mt-5 text-xl font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="professional" className="mx-auto max-w-7xl px-6 py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-8 py-14 text-white shadow-2xl md:px-14 md:py-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="relative max-w-3xl">
            <p className="font-bold text-blue-400">Voor zelfstandige glazenwassers</p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">Meer opdrachten. Jij bepaalt wanneer.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Ontvang glasbewassingsopdrachten in jouw regio, kies zelf welke opdrachten je aanneemt en bepaal wanneer je werkt. Aanmelden bij ShineGo is gratis.
            </p>
            <a href="/professional" className="mt-8 inline-block rounded-xl bg-white px-7 py-4 font-bold text-slate-900 transition hover:bg-blue-50">
              Gratis aanmelden als glazenwasser
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div><span className="font-bold text-slate-800">ShineGo</span> © 2026</div>
          <div className="flex flex-wrap gap-6">
            <a href="#" className="transition hover:text-blue-600">Privacy</a>
            <a href="#" className="transition hover:text-blue-600">Voorwaarden</a>
            <a href="#" className="transition hover:text-blue-600">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
