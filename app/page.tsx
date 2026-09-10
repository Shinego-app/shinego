export default function Home() {
  const diensten = [
    ["🏡", "Woning", "Twee-onder-een-kap, rijtjeshuis, villa", "/boeken/glazenwassen?type=buiten"],
    ["🏢", "Appartement / flat", "Ideaal voor appartementen en flats", "/boeken/glazenwassen?type=buiten"],
    ["🏬", "Winkel / bedrijfspand", "Voor zakelijke panden", "/boeken/glazenwassen?type=bedrijf"],
    ["🪟", "Gevel / hoog glas", "Met telescoopsteel", "/boeken/glazenwassen?type=telewash"],
  ];

  const heroFoto =
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=88";

  return (
    <main className="min-h-screen bg-[#eef7ff] text-[#17375f]">
      <header className="border-b border-[#dceafa] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-7">
          <a href="/" className="text-[28px] font-extrabold tracking-tight text-[#123c70]">
            Shine<span className="text-[#4d7ef0]">Go</span><span className="ml-1 text-[#6e96f5]">✦</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#diensten" className="text-sm font-semibold text-[#6e8299] hover:text-[#4d7ef0]">Diensten</a>
            <a href="#hoe-het-werkt" className="text-sm font-semibold text-[#6e8299] hover:text-[#4d7ef0]">Hoe het werkt</a>
            <a href="/prijzen" className="text-sm font-semibold text-[#6e8299] hover:text-[#4d7ef0]">Prijzen</a>
            <a href="/veelgestelde-vragen" className="text-sm font-semibold text-[#6e8299] hover:text-[#4d7ef0]">Veelgestelde vragen</a>
          </nav>

          <a
            href="/professional/login"
            className="rounded-xl border border-[#d6e3f2] bg-white px-4 py-2.5 text-sm font-bold text-[#315074] shadow-sm transition hover:border-[#9bb6f6] hover:text-[#4d7ef0]"
          >
            Inloggen
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-28 top-10 h-80 w-80 rounded-full bg-[#d9efff] blur-3xl" />
        <div className="pointer-events-none absolute -right-28 top-0 h-96 w-96 rounded-full bg-[#dbe8ff] blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-5 py-8 sm:px-7 sm:py-12 lg:py-14">
          <div className="overflow-hidden rounded-[34px] border border-white bg-white shadow-[0_24px_70px_rgba(53,89,130,0.14)]">
            <div className="grid lg:grid-cols-[1.02fr_.98fr]">
              <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-14 lg:px-12 lg:py-16">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#dce8f5] bg-[#f7fbff] px-4 py-2 text-xs font-bold text-[#6b829c] shadow-sm sm:text-sm">
                  <span className="text-[#4d7ef0]">✦</span>
                  Glazenwasser nodig? ShineGo regelt het.
                </div>

                <h1 className="mt-6 max-w-xl text-[42px] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#17375f] sm:text-6xl lg:text-[64px]">
                  Schone ramen.
                  <span className="mt-1 block text-[#4d7ef0]">Snel geregeld.</span>
                </h1>

                <p className="mt-6 max-w-lg text-base leading-7 text-[#6f839b] sm:text-lg sm:leading-8">
                  Boek eenvoudig een glazenwasser, zie vooraf wat je betaalt en kies een moment dat jou uitkomt.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="/boeken"
                    className="rounded-xl bg-[#4f78e8] px-7 py-4 text-center text-base font-extrabold text-white shadow-[0_10px_24px_rgba(79,120,232,.28)] transition hover:bg-[#416ad8]"
                  >
                    Boek een glazenwasser →
                  </a>
                  <a
                    href="#hoe-het-werkt"
                    className="rounded-xl border border-[#d8e5f3] bg-white px-7 py-4 text-center text-base font-bold text-[#44617f] transition hover:border-[#9bb6f6] hover:text-[#4d7ef0]"
                  >
                    Hoe het werkt
                  </a>
                </div>

                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#698099]">
                  <span><span className="mr-2 text-[#4d7ef0]">✓</span>Vaste prijzen</span>
                  <span><span className="mr-2 text-[#4d7ef0]">✓</span>Veilig betalen</span>
                  <span><span className="mr-2 text-[#4d7ef0]">✓</span>Gecontroleerde professionals</span>
                </div>
              </div>

              <div className="relative min-h-[430px] overflow-hidden bg-[#eaf3fb] sm:min-h-[520px] lg:min-h-[590px]">
                <img src={heroFoto} alt="Moderne woning met schone ramen" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 rounded-[22px] border border-white/80 bg-white/95 p-5 shadow-xl backdrop-blur sm:left-auto sm:right-8 sm:w-72">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#4d7ef0]">Snel geregeld</p>
                  <p className="mt-2 text-xl font-extrabold leading-7 text-[#24476f]">Helder resultaat, zonder gedoe.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl border border-white bg-white/90 p-4 shadow-[0_8px_28px_rgba(68,99,135,.07)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef5ff] text-xl">🛡️</span>
              <div><strong className="block text-sm text-[#29496f]">Vaste prijzen</strong><span className="text-xs text-[#8293a8]">Geen verrassingen</span></div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white bg-white/90 p-4 shadow-[0_8px_28px_rgba(68,99,135,.07)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eefaf3] text-xl">✓</span>
              <div><strong className="block text-sm text-[#29496f]">Betrouwbare professionals</strong><span className="text-xs text-[#8293a8]">Gecontroleerd via ShineGo</span></div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white bg-white/90 p-4 shadow-[0_8px_28px_rgba(68,99,135,.07)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2f5ff] text-xl">☆</span>
              <div><strong className="block text-sm text-[#29496f]">Snel een afspraak</strong><span className="text-xs text-[#8293a8]">Wanneer het jou uitkomt</span></div>
            </div>
          </div>
        </div>
      </section>

      <section id="diensten" className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-7 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#4d7ef0]">Onze diensten</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#18375f] sm:text-4xl">Kies je glasbewassing</h2>
            <p className="mt-3 text-base text-[#778ba4]">Wat kunnen we voor je doen?</p>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {diensten.map(([icon, titel, tekst, href]) => (
              <a
                key={titel}
                href={href}
                className="group flex min-h-[122px] items-center gap-4 rounded-2xl border border-[#dbe5f2] bg-white p-5 shadow-[0_8px_24px_rgba(51,80,112,.05)] transition hover:-translate-y-0.5 hover:border-[#9bb6f6] hover:shadow-md"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#f2f6fb] text-4xl">{icon}</div>
                <div className="min-w-0">
                  <h3 className="text-lg font-extrabold text-[#1c3d69]">{titel}</h3>
                  <p className="mt-1 text-sm leading-5 text-[#7a8da5]">{tekst}</p>
                </div>
                <span className="ml-auto text-xl text-[#708bc2] transition group-hover:translate-x-1">›</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="hoe-het-werkt" className="bg-[#f2f8ff]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-7 sm:py-20">
          <div className="text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#4d7ef0]">Eenvoudig en duidelijk</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#18375f] sm:text-4xl">Zo werkt ShineGo</h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["1", "Kies je glasbewassing", "Geef aan wat er gedaan moet worden."],
              ["2", "Bekijk je vaste prijs", "Je ziet vooraf precies wat de opdracht kost."],
              ["3", "Wij regelen de rest", "Een passende professional voert de opdracht uit."],
            ].map(([nummer, titel, tekst]) => (
              <div key={nummer} className="rounded-[26px] border border-white bg-white p-7 shadow-[0_12px_35px_rgba(55,87,122,.07)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#4f78e8] text-sm font-extrabold text-white shadow-[0_6px_16px_rgba(73,103,190,.2)]">{nummer}</div>
                <h3 className="mt-5 text-xl font-extrabold text-[#29496f]">{titel}</h3>
                <p className="mt-2 leading-7 text-[#7a8da5]">{tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-7 sm:py-20">
          <div className="relative overflow-hidden rounded-[30px] border border-[#dfeaf6] bg-gradient-to-br from-[#f4f8ff] via-[#eef6ff] to-[#e9f4ff] px-6 py-10 shadow-[0_16px_45px_rgba(61,91,126,.08)] sm:px-10 sm:py-12 lg:px-12">
            <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full bg-white/70 blur-2xl" />
            <div className="relative">
              <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#4d7ef0]">Voor glazenwassers</p>
              <h2 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-[#18375f] sm:text-4xl">Meer opdrachten. Jij bepaalt wanneer.</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#6f839b] sm:text-lg">Ontvang opdrachten in jouw regio en kies zelf welke opdrachten je aanneemt.</p>
              <a href="/professional" className="mt-7 inline-block rounded-xl bg-[#4f78e8] px-6 py-4 font-extrabold text-white shadow-[0_8px_20px_rgba(73,103,190,.24)] transition hover:bg-[#416ad8]">Gratis aanmelden als glazenwasser →</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#dce8f5] bg-[#f3f8fd] text-[#6f8298]">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-9 text-sm sm:px-7 md:flex-row md:items-center md:justify-between">
          <div><span className="font-extrabold text-[#123c70]">Shine<span className="text-[#4d7ef0]">Go</span><span className="ml-0.5 text-[#6e96f5]">✦</span></span> © 2026</div>
          <div className="flex flex-wrap gap-x-5 gap-y-3 sm:gap-6">
            <a href="/prijzen" className="hover:text-[#4d7ef0]">Prijzen</a>
            <a href="/veelgestelde-vragen" className="hover:text-[#4d7ef0]">Veelgestelde vragen</a>
            <a href="/privacy" className="hover:text-[#4d7ef0]">Privacy</a>
            <a href="/cookies" className="hover:text-[#4d7ef0]">Cookies</a>
            <a href="/voorwaarden" className="hover:text-[#4d7ef0]">Voorwaarden</a>
            <a href="/contact" className="hover:text-[#4d7ef0]">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
