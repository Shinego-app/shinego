export default function Home() {
  const diensten = [
    ["✨", "Ramen buiten wassen", "Buitenzijde van je ramen", "/boeken/glazenwassen?type=buiten"],
    ["🧼", "Ramen binnen wassen", "Binnenzijde van je ramen", "/boeken/glazenwassen?type=binnen"],
    ["🪟", "Telescoopsteel", "Voor ramen op hoogte", "/boeken/glazenwassen?type=telewash"],
    ["🏢", "Winkel / bedrijfspand", "Glasbewassing voor bedrijven", "/boeken/glazenwassen?type=bedrijf"],
  ];

  return (
    <main className="min-h-screen bg-[#f4f9ff] text-[#0b2b5b]">
      <header className="sticky top-0 z-30 border-b border-[#d7eaf9] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
          <a href="/" className="shrink-0 text-2xl font-extrabold tracking-tight text-[#0b3d75]">
            Shine<span className="text-[#1683f8]">Go</span><span className="ml-0.5 text-[#4ab5ff]">✦</span>
          </a>

          <nav className="hidden items-center gap-7 md:flex">
            <a href="#diensten" className="font-medium text-[#466482] transition hover:text-[#1683f8]">Diensten</a>
            <a href="#hoe-het-werkt" className="font-medium text-[#466482] transition hover:text-[#1683f8]">Hoe het werkt</a>
            <a href="/prijzen" className="font-medium text-[#466482] transition hover:text-[#1683f8]">Prijzen</a>
            <a href="/veelgestelde-vragen" className="font-medium text-[#466482] transition hover:text-[#1683f8]">Veelgestelde vragen</a>
          </nav>

          <a href="/professional/login" className="shrink-0 rounded-xl border border-[#b9dcf8] bg-white px-4 py-2.5 text-sm font-bold text-[#0b3d75] shadow-sm transition hover:border-[#1683f8] hover:text-[#1683f8] sm:px-5 sm:text-base">
            Inloggen
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-[#dcecf8] bg-gradient-to-br from-[#edf8ff] via-[#f7fbff] to-[#dff1ff]">
        <div className="absolute -left-24 top-14 h-72 w-72 rounded-full bg-[#bfe4ff]/45 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#cbeaff]/60 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-16 md:grid-cols-2 md:items-center md:gap-14 md:py-24">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c8e5fb] bg-white/80 px-4 py-2 text-sm font-semibold text-[#245d91] shadow-sm">
              <span className="text-[#1683f8]">✦</span> Glazenwasser nodig? ShineGo regelt het.
            </div>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.04] tracking-tight text-[#0b2b5b] sm:text-5xl md:text-6xl">
              Schone ramen.
              <span className="block text-[#1683f8]">Snel geregeld.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#526f8c] sm:text-lg sm:leading-8 md:text-xl">
              Boek eenvoudig een glazenwasser, zie vooraf wat je betaalt en kies een moment dat jou uitkomt.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="/boeken" className="rounded-xl bg-[#1683f8] px-6 py-3.5 text-center text-base font-extrabold text-white shadow-lg shadow-blue-200/70 transition hover:-translate-y-0.5 hover:bg-[#0d6fd8] sm:px-7 sm:py-4 sm:text-lg">
                Boek een glazenwasser →
              </a>
              <a href="#hoe-het-werkt" className="rounded-xl border border-[#b9dcf8] bg-white/80 px-6 py-3.5 text-center text-base font-bold text-[#0b3d75] transition hover:border-[#1683f8] hover:bg-white sm:px-7 sm:py-4 sm:text-lg">
                Hoe het werkt
              </a>
            </div>

            <div className="mt-7 grid gap-3 text-sm font-semibold text-[#365d83] sm:grid-cols-3">
              <div className="rounded-2xl bg-white/70 px-4 py-3"><span className="mr-2 text-[#1683f8]">✓</span>Vaste prijs</div>
              <div className="rounded-2xl bg-white/70 px-4 py-3"><span className="mr-2 text-[#1683f8]">✓</span>Veilig betalen</div>
              <div className="rounded-2xl bg-white/70 px-4 py-3"><span className="mr-2 text-[#1683f8]">✓</span>Gecontroleerd</div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#cfe7f8] bg-white/90 p-5 shadow-xl shadow-blue-100/60 backdrop-blur sm:p-7">
            <div className="mb-1 text-sm font-extrabold uppercase tracking-[0.16em] text-[#1683f8]">Snel boeken</div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#0b2b5b] sm:text-3xl">Wat wil je laten reinigen?</h2>
            <p className="mt-2 text-[#66809a]">Kies de glasbewassing die bij je past.</p>

            <div id="diensten" className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4">
              {diensten.map(([icon, titel, tekst, href]) => (
                <a key={titel} href={href} className="group rounded-2xl border border-[#d7eaf9] bg-[#f8fcff] p-5 transition hover:-translate-y-1 hover:border-[#91cffa] hover:bg-[#eef8ff] hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e7f5ff] text-2xl">{icon}</div>
                  <div className="mt-4 font-extrabold text-[#0b2b5b] group-hover:text-[#1683f8]">{titel}</div>
                  <div className="mt-1 text-sm text-[#66809a]">{tekst}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white/70">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="text-center">
            <p className="font-extrabold uppercase tracking-[0.14em] text-[#1683f8]">Eenvoudig en duidelijk</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0b2b5b] sm:text-4xl">Glazenwasser eenvoudig geregeld</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[#66809a]">Van prijs tot planning: ShineGo maakt glasbewassing rustig en overzichtelijk.</p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["💶", "Direct een prijs", "Vul je gegevens in en zie vooraf wat de glasbewassing kost."],
              ["📅", "Zelf inplannen", "Kies een datum en tijd die bij jouw planning past."],
              ["✅", "Betrouwbare glazenwassers", "Glazenwassers worden gecontroleerd voordat ze opdrachten uitvoeren."],
            ].map(([icon, title, text]) => (
              <div key={title} className="rounded-[1.75rem] border border-[#d7eaf9] bg-[#f8fcff] p-6 shadow-sm sm:p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e4f4ff] text-3xl">{icon}</div>
                <h3 className="mt-5 text-xl font-extrabold text-[#0b2b5b]">{title}</h3>
                <p className="mt-3 leading-7 text-[#66809a]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="hoe-het-werkt" className="bg-gradient-to-b from-[#eef8ff] to-[#f8fcff]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="text-center">
            <p className="font-extrabold uppercase tracking-[0.14em] text-[#1683f8]">In drie stappen</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0b2b5b] sm:text-4xl">Zo werkt ShineGo</h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["1", "Kies je glasbewassing", "Geef aan wat er gedaan moet worden."],
              ["2", "Bekijk je prijs", "ShineGo berekent vooraf de prijs van de opdracht."],
              ["3", "Wij regelen de rest", "Een beschikbare glazenwasser kan jouw opdracht uitvoeren."],
            ].map(([number, title, text]) => (
              <div key={number} className="rounded-[1.75rem] border border-[#d7eaf9] bg-white p-6 text-center shadow-sm sm:p-8">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1683f8] text-xl font-extrabold text-white shadow-md shadow-blue-200">{number}</div>
                <h3 className="mt-5 text-xl font-extrabold text-[#0b2b5b]">{title}</h3>
                <p className="mt-2 text-[#66809a]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="rounded-[2rem] border border-[#cfe7f8] bg-gradient-to-br from-[#e9f6ff] to-[#dff1ff] px-6 py-10 sm:px-10 sm:py-14 md:px-14">
            <p className="font-extrabold uppercase tracking-[0.14em] text-[#1683f8]">Voor zelfstandige glazenwassers</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-[#0b2b5b] sm:text-4xl">Meer opdrachten. Jij bepaalt wanneer.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#526f8c]">Ontvang opdrachten in jouw regio, kies zelf welke opdrachten je aanneemt en bepaal wanneer je werkt.</p>
            <a href="/professional" className="mt-7 inline-block w-full rounded-xl bg-white px-6 py-4 text-center font-extrabold text-[#0b3d75] shadow-sm transition hover:text-[#1683f8] sm:w-auto">Gratis aanmelden als glazenwasser</a>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#d7eaf9] bg-[#eaf5ff] text-[#5d7893]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-9 text-sm sm:px-6 md:flex-row md:items-center md:justify-between">
          <div><span className="font-extrabold text-[#0b3d75]">Shine<span className="text-[#1683f8]">Go</span></span> © 2026</div>
          <div className="flex flex-wrap gap-x-5 gap-y-3 sm:gap-6">
            <a href="/prijzen" className="transition hover:text-[#1683f8]">Prijzen</a>
            <a href="/veelgestelde-vragen" className="transition hover:text-[#1683f8]">Veelgestelde vragen</a>
            <a href="/privacy" className="transition hover:text-[#1683f8]">Privacy</a>
            <a href="/cookies" className="transition hover:text-[#1683f8]">Cookies</a>
            <a href="/voorwaarden" className="transition hover:text-[#1683f8]">Voorwaarden</a>
            <a href="/contact" className="transition hover:text-[#1683f8]">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
