export default function Home() {
  const diensten = [
    {
      icon: "🏡",
      titel: "Woning",
      tekst: "Voor rijtjeshuizen, hoekwoningen en vrijstaande woningen.",
      href: "/boeken/glazenwassen?type=buiten",
      foto: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=700&q=86",
    },
    {
      icon: "🏢",
      titel: "Appartement / flat",
      tekst: "Glasbewassing voor appartementen en flats.",
      href: "/boeken/glazenwassen?type=buiten",
      foto: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=700&q=86",
    },
    {
      icon: "🏬",
      titel: "Winkel / bedrijfspand",
      tekst: "Heldere ramen voor winkels en zakelijke panden.",
      href: "/boeken/glazenwassen?type=bedrijf",
      foto: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=86",
    },
    {
      icon: "🪟",
      titel: "Gevel / hoog glas",
      tekst: "Voor hoger en moeilijk bereikbaar glas met telescoopsteel.",
      href: "/boeken/glazenwassen?type=telewash",
      foto: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=700&q=86",
    },
  ];

  return (
    <main className="min-h-screen bg-[#edf6ff] text-[#18375f]">
      <header className="sticky top-0 z-50 border-b border-[#dce9f7] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-7">
          <a href="/" className="text-[29px] font-extrabold tracking-tight text-[#123c70]">
            Shine<span className="text-[#4d7ef0]">Go</span><span className="ml-1 text-[#6e96f5]">✦</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#diensten" className="text-sm font-semibold text-[#71859d] hover:text-[#4d7ef0]">Diensten</a>
            <a href="#hoe-het-werkt" className="text-sm font-semibold text-[#71859d] hover:text-[#4d7ef0]">Hoe het werkt</a>
            <a href="/prijzen" className="text-sm font-semibold text-[#71859d] hover:text-[#4d7ef0]">Prijzen</a>
            <a href="/veelgestelde-vragen" className="text-sm font-semibold text-[#71859d] hover:text-[#4d7ef0]">Veelgestelde vragen</a>
          </nav>

          <a
            href="/professional/login"
            className="rounded-xl border border-[#d6e3f2] bg-white px-4 py-2.5 text-sm font-bold text-[#315074] shadow-sm transition hover:border-[#9db8f5]"
          >
            Inloggen
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden px-4 pb-10 pt-5 sm:px-6 sm:pb-14 sm:pt-8">
        <div className="pointer-events-none absolute -left-28 top-16 h-72 w-72 rounded-full bg-[#d8eeff] blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-6 h-80 w-80 rounded-full bg-[#dae6ff] blur-3xl" />

        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-white bg-white shadow-[0_24px_70px_rgba(46,79,119,0.15)]">
          <div className="grid lg:grid-cols-[1.03fr_.97fr]">
            <div className="order-2 px-6 pb-9 pt-8 sm:px-10 sm:pb-12 lg:order-1 lg:flex lg:flex-col lg:justify-center lg:px-12 lg:py-16">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#dce8f5] bg-[#f8fbff] px-4 py-2 text-xs font-bold text-[#698099] sm:text-sm">
                <span className="text-[#4d7ef0]">✦</span>
                Glazenwasser nodig? ShineGo regelt het.
              </div>

              <h1 className="mt-5 max-w-xl text-[42px] font-extrabold leading-[0.98] tracking-[-0.045em] text-[#17375f] sm:text-6xl">
                Schone ramen.
                <span className="mt-2 block text-[#4d7ef0]">Snel geregeld.</span>
              </h1>

              <p className="mt-5 max-w-lg text-[15px] leading-7 text-[#71859d] sm:text-lg sm:leading-8">
                Kies je glasbewassing, bekijk vooraf je prijs en plan direct een moment dat jou uitkomt.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/boeken/glazenwassen"
                  className="rounded-xl bg-[#5578dc] px-7 py-4 text-center text-base font-extrabold text-white shadow-[0_10px_25px_rgba(73,103,190,.28)] transition hover:bg-[#466bd4]"
                >
                  Boek een glazenwasser →
                </a>
                <a
                  href="#hoe-het-werkt"
                  className="rounded-xl border border-[#dbe5f0] bg-white px-7 py-4 text-center text-base font-bold text-[#49637f] transition hover:border-[#9bb6f6]"
                >
                  Hoe het werkt
                </a>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-2 border-t border-[#edf2f7] pt-5">
                <div className="text-center sm:text-left">
                  <div className="text-lg font-extrabold text-[#29496f]">Vast</div>
                  <div className="mt-1 text-[11px] leading-4 text-[#8a99aa]">Vooraf je prijs</div>
                </div>
                <div className="border-x border-[#edf2f7] px-2 text-center sm:text-left">
                  <div className="text-lg font-extrabold text-[#29496f]">Veilig</div>
                  <div className="mt-1 text-[11px] leading-4 text-[#8a99aa]">Betalen via Stripe</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-lg font-extrabold text-[#29496f]">Snel</div>
                  <div className="mt-1 text-[11px] leading-4 text-[#8a99aa]">In enkele stappen</div>
                </div>
              </div>
            </div>

            <div className="order-1 relative min-h-[310px] overflow-hidden bg-[#eaf3fb] sm:min-h-[430px] lg:order-2 lg:min-h-[590px]">
              <img
                src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=90"
                alt="Moderne woning met grote schone ramen"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#17375f]/20 via-transparent to-white/10" />
              <div className="absolute bottom-5 left-5 right-5 rounded-[22px] border border-white/80 bg-white/94 p-4 shadow-xl backdrop-blur sm:bottom-7 sm:left-auto sm:right-7 sm:w-72 sm:p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eef4ff] text-lg">✓</span>
                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#4d7ef0]">ShineGo</div>
                    <div className="mt-1 text-[15px] font-extrabold leading-5 text-[#29496f]">Helder resultaat, zonder gedoe.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto mt-4 grid max-w-6xl gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-white bg-white/90 p-4 shadow-[0_9px_28px_rgba(68,99,135,.07)]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eef5ff] text-xl">🛡️</span>
            <div><strong className="block text-sm text-[#29496f]">Vaste prijzen</strong><span className="text-xs text-[#8293a8]">Geen verrassingen achteraf</span></div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white bg-white/90 p-4 shadow-[0_9px_28px_rgba(68,99,135,.07)]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eefaf3] text-xl">✓</span>
            <div><strong className="block text-sm text-[#29496f]">Betrouwbare professionals</strong><span className="text-xs text-[#8293a8]">Gecontroleerd via ShineGo</span></div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white bg-white/90 p-4 shadow-[0_9px_28px_rgba(68,99,135,.07)]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f2f5ff] text-xl">☆</span>
            <div><strong className="block text-sm text-[#29496f]">Snel een afspraak</strong><span className="text-xs text-[#8293a8]">Wanneer het jou uitkomt</span></div>
          </div>
        </div>
      </section>

      <section id="diensten" className="bg-white px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <div className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#4d7ef0]">Onze diensten</div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#18375f] sm:text-4xl">Kies je glasbewassing</h2>
            <p className="mt-3 text-base text-[#778ba4]">Wat kunnen we voor je doen?</p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {diensten.map((dienst) => (
              <a
                key={dienst.titel}
                href={dienst.href}
                className="group relative min-h-[150px] overflow-hidden rounded-[24px] border border-[#dbe5f2] bg-white shadow-[0_10px_30px_rgba(51,80,112,.06)] transition hover:-translate-y-0.5 hover:border-[#a9bff3] hover:shadow-md"
              >
                <div className="absolute bottom-0 right-0 top-0 w-[38%] overflow-hidden">
                  <img src={dienst.foto} alt="" className="h-full w-full object-cover opacity-90 transition duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/45 to-transparent" />
                </div>

                <div className="relative z-10 flex h-full max-w-[72%] items-center gap-4 p-5 sm:p-6">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f2f6fb] text-3xl">{dienst.icon}</span>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#1c3d69]">{dienst.titel}</h3>
                    <p className="mt-1 text-sm leading-5 text-[#7a8da5]">{dienst.tekst}</p>
                    <span className="mt-3 inline-block text-sm font-extrabold text-[#5578dc]">Kies deze →</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="hoe-het-werkt" className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <div className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#4d7ef0]">Eenvoudig geregeld</div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#18375f] sm:text-4xl">Zo werkt ShineGo</h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["1", "Kies je glasbewassing", "Geef aan wat er gedaan moet worden en wat bij jouw situatie past."],
              ["2", "Bekijk je vaste prijs", "Je ziet vooraf duidelijk wat de opdracht kost voordat je betaalt."],
              ["3", "Wij regelen de rest", "ShineGo koppelt je opdracht aan een beschikbare professional."],
            ].map(([nummer, titel, tekst]) => (
              <div key={nummer} className="rounded-[25px] border border-white bg-white p-6 shadow-[0_12px_35px_rgba(55,87,122,.07)] sm:p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5578dc] text-sm font-extrabold text-white shadow-[0_6px_16px_rgba(73,103,190,.2)]">{nummer}</div>
                <h3 className="mt-5 text-xl font-extrabold text-[#29496f]">{titel}</h3>
                <p className="mt-2 text-sm leading-6 text-[#7a8da5]">{tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[30px] border border-[#dce7f5] bg-gradient-to-br from-[#f4f8ff] via-[#eef6ff] to-[#e8f3ff] shadow-[0_16px_45px_rgba(61,91,126,.08)]">
          <div className="grid md:grid-cols-[1.15fr_.85fr] md:items-center">
            <div className="px-6 py-9 sm:px-10 sm:py-12">
              <div className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#4d7ef0]">Voor glazenwassers</div>
              <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-[#18375f] sm:text-4xl">Meer opdrachten. Jij bepaalt wanneer.</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-[#6f839b]">Ontvang opdrachten in jouw regio en kies zelf welke opdrachten je aanneemt.</p>
              <a href="/professional" className="mt-7 inline-block rounded-xl bg-[#5578dc] px-6 py-4 font-extrabold text-white shadow-[0_8px_20px_rgba(73,103,190,.24)] transition hover:bg-[#466bd4]">Gratis aanmelden als glazenwasser →</a>
            </div>
            <div className="relative hidden min-h-[330px] md:block">
              <img src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=88" alt="Professional aan het werk" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#eef6ff] via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#dfeaf5] bg-[#f3f8fd] px-4 text-[#6f8298] sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 py-9 text-sm md:flex-row md:items-center md:justify-between">
          <div>
            <span className="font-extrabold text-[#123c70]">Shine<span className="text-[#4d7ef0]">Go</span><span className="ml-0.5 text-[#6e96f5]">✦</span></span> © 2026
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-3">
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
