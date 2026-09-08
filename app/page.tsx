export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-30 border-b border-blue-900/20 bg-slate-950 text-white shadow-lg shadow-slate-950/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="text-2xl font-extrabold tracking-tight text-white">
            Shine<span className="text-sky-400">Go</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#diensten" className="font-medium text-slate-300 transition hover:text-white">Diensten</a>
            <a href="#hoe-het-werkt" className="font-medium text-slate-300 transition hover:text-white">Hoe het werkt</a>
            <a href="#professional" className="font-medium text-slate-300 transition hover:text-white">Voor glazenwassers</a>
          </nav>

          <a href="/professional/login" className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20">
            Inloggen
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 text-white">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-50 backdrop-blur">
              Glazenwasser nodig? ShineGo regelt het.
            </div>

            <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              Schone ramen.
              <span className="block text-cyan-100">Snel geregeld.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-blue-50 md:text-xl">
              Boek eenvoudig een glazenwasser, zie vooraf wat je betaalt en kies een moment dat jou uitkomt.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="/boeken" className="rounded-xl bg-white px-7 py-4 text-center text-lg font-extrabold text-blue-700 shadow-xl shadow-blue-950/20 transition hover:-translate-y-0.5 hover:bg-blue-50">
                Boek een glazenwasser
              </a>
              <a href="/professional" className="rounded-xl border border-white/30 bg-white/10 px-7 py-4 text-center text-lg font-semibold text-white backdrop-blur transition hover:bg-white/20">
                Word glazenwasser
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-blue-50">
              <span>✓ Vooraf vaste prijs</span>
              <span>✓ Gecontroleerde glazenwassers</span>
              <span>✓ Veilig betalen</span>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/30 bg-white p-7 text-slate-900 shadow-2xl shadow-blue-950/25">
            <div className="mb-1 text-sm font-extrabold uppercase tracking-[0.16em] text-blue-600">Snel boeken</div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">Wat wil je laten reinigen?</h2>
            <p className="mt-2 text-slate-500">Kies de glasbewassing die bij je past.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <a href="/boeken/glazenwassen?type=buiten" className="group rounded-2xl border border-blue-100 bg-blue-50 p-5 transition hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-100 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">✨</div>
                <div className="mt-4 font-extrabold text-slate-900 group-hover:text-blue-700">Ramen buiten wassen</div>
                <div className="mt-1 text-sm text-slate-600">Buitenzijde van je ramen</div>
              </a>

              <a href="/boeken/glazenwassen?type=binnen" className="group rounded-2xl border border-sky-100 bg-sky-50 p-5 transition hover:-translate-y-1 hover:border-sky-300 hover:bg-sky-100 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">🧼</div>
                <div className="mt-4 font-extrabold text-slate-900 group-hover:text-sky-700">Ramen binnen wassen</div>
                <div className="mt-1 text-sm text-slate-600">Binnenzijde van je ramen</div>
              </a>

              <a href="/boeken/glazenwassen?type=telewash" className="group rounded-2xl border border-cyan-100 bg-cyan-50 p-5 transition hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-100 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">🪟</div>
                <div className="mt-4 font-extrabold text-slate-900 group-hover:text-cyan-700">Telewash</div>
                <div className="mt-1 text-sm text-slate-600">Voor ramen op hoogte</div>
              </a>

              <a href="/boeken/glazenwassen?type=bedrijf" className="group rounded-2xl border border-indigo-100 bg-indigo-50 p-5 transition hover:-translate-y-1 hover:border-indigo-300 hover:bg-indigo-100 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">🏢</div>
                <div className="mt-4 font-extrabold text-slate-900 group-hover:text-indigo-700">Winkel / bedrijfspand</div>
                <div className="mt-1 text-sm text-slate-600">Glasbewassing voor bedrijven</div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="diensten" className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center">
            <p className="font-extrabold uppercase tracking-[0.14em] text-blue-600">Eenvoudig en duidelijk</p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">Glazenwasser eenvoudig geregeld</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">Van prijs tot planning: ShineGo maakt glasbewassing makkelijk.</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              ["💶", "Direct een prijs", "Geen eindeloze offertes. Vul je gegevens in en zie direct wat de glasbewassing kost."],
              ["📅", "Zelf inplannen", "Kies eenvoudig een beschikbare datum en tijd die bij jouw planning past."],
              ["✅", "Gecontroleerde glazenwassers", "Glazenwassers worden gecontroleerd voordat ze opdrachten via ShineGo kunnen uitvoeren."],
            ].map(([icon, title, text], index) => (
              <div key={title} className={`rounded-[2rem] p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-xl ${index === 0 ? "bg-blue-600 text-white" : index === 1 ? "bg-sky-100 text-slate-900" : "bg-slate-950 text-white"}`}>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 text-3xl shadow-sm">{icon}</div>
                <h3 className="mt-5 text-xl font-extrabold">{title}</h3>
                <p className={`mt-3 leading-7 ${index === 1 ? "text-slate-600" : "text-white/80"}`}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="hoe-het-werkt" className="bg-gradient-to-b from-sky-50 to-blue-50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center">
            <p className="font-extrabold uppercase tracking-[0.14em] text-blue-600">In drie stappen</p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">Zo werkt ShineGo</h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              ["1", "Kies je glasbewassing", "Geef aan wat er gedaan moet worden."],
              ["2", "Bekijk je prijs", "ShineGo berekent vooraf de prijs van de opdracht."],
              ["3", "Wij regelen de rest", "Een beschikbare glazenwasser kan jouw opdracht uitvoeren."],
            ].map(([number, title, text]) => (
              <div key={number} className="rounded-[2rem] border border-blue-100 bg-white p-8 text-center shadow-lg shadow-blue-100/50">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-2xl font-extrabold text-white shadow-lg shadow-blue-500/20">{number}</div>
                <h3 className="mt-5 text-xl font-extrabold text-slate-950">{title}</h3>
                <p className="mt-2 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="professional" className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 px-8 py-14 text-white shadow-2xl md:px-14 md:py-16">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
            <div className="relative max-w-3xl">
              <p className="font-extrabold uppercase tracking-[0.14em] text-sky-300">Voor zelfstandige glazenwassers</p>
              <h2 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">Meer opdrachten. Jij bepaalt wanneer.</h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Ontvang glasbewassingsopdrachten in jouw regio, kies zelf welke opdrachten je aanneemt en bepaal wanneer je werkt. Aanmelden bij ShineGo is gratis.
              </p>
              <a href="/professional" className="mt-8 inline-block rounded-xl bg-sky-400 px-7 py-4 font-extrabold text-slate-950 shadow-lg shadow-sky-950/20 transition hover:bg-sky-300">
                Gratis aanmelden als glazenwasser
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 text-sm md:flex-row md:items-center md:justify-between">
          <div><span className="font-extrabold text-white">Shine<span className="text-sky-400">Go</span></span> © 2026</div>
          <div className="flex flex-wrap gap-6">
            <a href="#" className="transition hover:text-white">Privacy</a>
            <a href="#" className="transition hover:text-white">Voorwaarden</a>
            <a href="#" className="transition hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
