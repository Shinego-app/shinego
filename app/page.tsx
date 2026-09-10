export default function Home() {
  const diensten = [
    ["✨", "Ramen buiten wassen", "Buitenzijde van je ramen", "/boeken/glazenwassen?type=buiten"],
    ["🧼", "Ramen binnen wassen", "Binnenzijde van je ramen", "/boeken/glazenwassen?type=binnen"],
    ["🪟", "Telescoopsteel", "Voor ramen op hoogte", "/boeken/glazenwassen?type=telewash"],
    ["🏢", "Winkel / bedrijfspand", "Glasbewassing voor bedrijven", "/boeken/glazenwassen?type=bedrijf"],
  ];

  const heroFoto =
    "https://images.unsplash.com/photo-1769780265587-037ee842c0b0?auto=format&fit=crop&fm=jpg&q=82&w=1800";

  return (
    <main className="min-h-screen bg-white text-[#0b2b5b]">
      <header className="sticky top-0 z-30 border-b border-[#e4f0fa] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <a href="/" className="shrink-0 text-2xl font-extrabold tracking-tight text-[#0b3d75]">
            Shine<span className="text-[#1683f8]">Go</span><span className="ml-0.5 text-[#4ab5ff]">✦</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#diensten" className="font-medium text-[#5c7188] transition hover:text-[#1683f8]">Diensten</a>
            <a href="#hoe-het-werkt" className="font-medium text-[#5c7188] transition hover:text-[#1683f8]">Hoe het werkt</a>
            <a href="/prijzen" className="font-medium text-[#5c7188] transition hover:text-[#1683f8]">Prijzen</a>
            <a href="/veelgestelde-vragen" className="font-medium text-[#5c7188] transition hover:text-[#1683f8]">Veelgestelde vragen</a>
          </nav>

          <a href="/professional/login" className="rounded-xl border border-[#c9e3fb] bg-white px-4 py-2.5 text-sm font-bold text-[#0b3d75] transition hover:border-[#1683f8] sm:px-5 sm:text-base">
            Inloggen
          </a>
        </div>
      </header>

      <section className="overflow-hidden bg-gradient-to-br from-[#eef8ff] via-[#f8fcff] to-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#cbe6fb] bg-white px-4 py-2 text-sm font-semibold text-[#2f638f] shadow-sm">
              <span className="text-[#1683f8]">✦</span>
              Glazenwasser nodig? ShineGo regelt het.
            </div>

            <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
              Schone ramen.
              <span className="block text-[#1683f8]">Snel geregeld.</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-[#5c7188]">
              Boek eenvoudig een glazenwasser, zie vooraf wat je betaalt en kies een moment dat jou uitkomt.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="/boeken" className="rounded-xl bg-[#1683f8] px-7 py-4 text-center text-lg font-extrabold text-white shadow-lg shadow-blue-200/60 transition hover:bg-[#0d6fd8]">
                Boek een glazenwasser →
              </a>
              <a href="#hoe-het-werkt" className="rounded-xl border border-[#c9e3fb] bg-white px-7 py-4 text-center text-lg font-bold text-[#0b3d75] transition hover:border-[#1683f8]">
                Hoe het werkt
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-[#486680]">
              <span><span className="mr-2 text-[#1683f8]">✓</span>Vaste prijs</span>
              <span><span className="mr-2 text-[#1683f8]">✓</span>Veilig betalen</span>
              <span><span className="mr-2 text-[#1683f8]">✓</span>Gecontroleerd</span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-white bg-white p-2 shadow-2xl shadow-blue-100/70">
              <img
                src={heroFoto}
                alt="Moderne woning met grote schone ramen"
                className="h-[430px] w-full rounded-[1.6rem] object-cover sm:h-[520px]"
              />
            </div>

            <div className="absolute -bottom-5 left-5 right-5 rounded-2xl border border-[#d9ebf9] bg-white/95 p-5 shadow-xl backdrop-blur sm:left-auto sm:right-6 sm:w-72">
              <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-[#1683f8]">Snel geregeld</p>
              <p className="mt-1 text-xl font-extrabold text-[#0b2b5b]">Helder resultaat, zonder gedoe.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="diensten" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-extrabold uppercase tracking-[0.14em] text-[#1683f8]">Onze diensten</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Wat wil je laten reinigen?</h2>
            <p className="mt-4 text-lg text-[#66809a]">Kies de glasbewassing die bij jouw situatie past.</p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {diensten.map(([icon, titel, tekst, href]) => (
              <a key={titel} href={href} className="group rounded-[1.5rem] border border-[#dcecf8] bg-[#f8fcff] p-6 transition hover:-translate-y-1 hover:border-[#a8d7f8] hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e7f5ff] text-2xl">{icon}</div>
                <h3 className="mt-5 font-extrabold text-[#0b2b5b] group-hover:text-[#1683f8]">{titel}</h3>
                <p className="mt-2 text-sm leading-6 text-[#66809a]">{tekst}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="hoe-het-werkt" className="bg-[#eef8ff]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="text-center">
            <p className="font-extrabold uppercase tracking-[0.14em] text-[#1683f8]">In drie stappen</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Zo werkt ShineGo</h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["1", "Kies je glasbewassing", "Geef aan wat er gedaan moet worden."],
              ["2", "Bekijk je prijs", "ShineGo berekent vooraf de prijs van de opdracht."],
              ["3", "Wij regelen de rest", "Een beschikbare glazenwasser kan jouw opdracht uitvoeren."],
            ].map(([nummer, titel, tekst]) => (
              <div key={nummer} className="rounded-[1.6rem] border border-[#d7eaf9] bg-white p-7 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#1683f8] text-lg font-extrabold text-white">{nummer}</div>
                <h3 className="mt-5 text-xl font-extrabold">{titel}</h3>
                <p className="mt-2 leading-7 text-[#66809a]">{tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="rounded-[2rem] border border-[#cfe7f8] bg-gradient-to-br from-[#eaf6ff] to-[#dff1ff] px-6 py-10 sm:px-10 sm:py-14 md:px-14">
            <p className="font-extrabold uppercase tracking-[0.14em] text-[#1683f8]">Voor zelfstandige glazenwassers</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">Meer opdrachten. Jij bepaalt wanneer.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#526f8c]">Ontvang opdrachten in jouw regio, kies zelf welke opdrachten je aanneemt en bepaal wanneer je werkt.</p>
            <a href="/professional" className="mt-7 inline-block rounded-xl bg-white px-6 py-4 font-extrabold text-[#0b3d75] shadow-sm transition hover:text-[#1683f8]">Gratis aanmelden als glazenwasser</a>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#d7eaf9] bg-[#eaf5ff] text-[#5d7893]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-9 text-sm sm:px-6 md:flex-row md:items-center md:justify-between">
          <div><span className="font-extrabold text-[#0b3d75]">Shine<span className="text-[#1683f8]">Go</span></span> © 2026</div>
          <div className="flex flex-wrap gap-x-5 gap-y-3 sm:gap-6">
            <a href="/prijzen" className="hover:text-[#1683f8]">Prijzen</a>
            <a href="/veelgestelde-vragen" className="hover:text-[#1683f8]">Veelgestelde vragen</a>
            <a href="/privacy" className="hover:text-[#1683f8]">Privacy</a>
            <a href="/cookies" className="hover:text-[#1683f8]">Cookies</a>
            <a href="/voorwaarden" className="hover:text-[#1683f8]">Voorwaarden</a>
            <a href="/contact" className="hover:text-[#1683f8]">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
