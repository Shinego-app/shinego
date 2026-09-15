export default function Home() {
  const diensten = [
    { icon: "🏠", titel: "Woning", tekst: "Van rijtjeshuis tot villa", href: "/boeken/glazenwassen/details?type=woning" },
    { icon: "🏢", titel: "Appartement / flat", tekst: "Snel en vakkundig", href: "/boeken/glazenwassen/details?type=appartement" },
    { icon: "🏬", titel: "Winkel / bedrijfspand", tekst: "Een verzorgde uitstraling", href: "/boeken/glazenwassen/details?type=bedrijf" },
    { icon: "🏙️", titel: "Telewash – hoog & groot glas", tekst: "Met telescoopsteel voor hoge en grote glaspartijen", href: "/boeken/glazenwassen/details?type=telewash" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#eaf6ff] to-[#f8fcff] text-[#123c70]">
      <header className="border-b border-[#d7eaf8] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="/" className="text-[29px] font-extrabold tracking-tight text-[#0d3f79]">Shine<span className="text-[#1683f8]">Go</span><span className="ml-1 text-[#1683f8]">✦</span></a>
          <nav className="hidden items-center gap-7 md:flex"><a href="#diensten" className="text-sm font-semibold text-[#52779b]">Diensten</a><a href="#hoe" className="text-sm font-semibold text-[#52779b]">Hoe het werkt</a><a href="/prijzen" className="text-sm font-semibold text-[#52779b]">Prijzen</a><a href="/veelgestelde-vragen" className="text-sm font-semibold text-[#52779b]">Veelgestelde vragen</a></nav>
          <a href="/professional/login" className="rounded-xl border border-[#cfe3f4] bg-white px-4 py-2.5 text-sm font-bold text-[#315f88]">Inloggen</a>
        </div>
      </header>

      <section className="relative overflow-hidden px-3 pb-10 pt-5 sm:px-5 sm:pb-14 sm:pt-7">
        <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#d9efff] blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-[#dceaff] blur-3xl" />

        <div className="relative mx-auto max-w-[1480px] overflow-hidden rounded-[32px] border border-white bg-white shadow-[0_24px_70px_rgba(46,79,119,.14)]">
          <div className="grid lg:grid-cols-[1.2fr_1.2fr]">
            <div className="relative z-20 order-2 px-6 pb-10 pt-9 sm:px-10 sm:py-12 lg:order-1 lg:flex lg:min-h-[650px] lg:flex-col lg:justify-center lg:px-14">
              <div className="inline-flex w-fit rounded-full bg-[#e7f4ff] px-4 py-2 text-xs font-bold text-[#1678d4] sm:text-sm">Professionele glazenwassers, wanneer jij het nodig hebt</div>
              <h1 className="mt-5 max-w-2xl text-[44px] font-extrabold leading-[.96] tracking-[-.045em] text-[#112f58] sm:text-[68px]">Een glazenwasser,<br /><span className="text-[#1683f8]">zo geregeld.</span></h1>
              <p className="mt-6 max-w-xl text-[16px] leading-7 text-[#607b98] sm:text-[20px] sm:leading-8">Boek eenvoudig en snel een professionele glazenwasser bij jou in de buurt. Vaste prijzen en betrouwbare vakmensen.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#diensten" className="rounded-xl bg-[#1683f8] px-8 py-4 text-center text-base font-extrabold text-white shadow-[0_10px_25px_rgba(22,131,248,.25)] transition hover:bg-[#0874df]">Direct boeken →</a>
                <a href="#hoe" className="rounded-xl border border-[#78b9ee] bg-white px-8 py-4 text-center text-base font-extrabold text-[#1768b5]">Hoe het werkt</a>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-[#dcecf8] pt-7">
                <div><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f5ff] text-xl">🛡️</div><strong className="mt-3 block text-sm text-[#18375f]">Vaste prijzen</strong><span className="mt-1 block text-xs leading-5 text-[#7790a8]">Geen verrassingen</span></div>
                <div><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eafaf1] text-xl">✓</div><strong className="mt-3 block text-sm text-[#18375f]">Betrouwbare professionals</strong><span className="mt-1 block text-xs leading-5 text-[#7790a8]">Geverifieerd door ShineGo</span></div>
                <div><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf6ff] text-xl">☆</div><strong className="mt-3 block text-sm text-[#18375f]">Snel een afspraak</strong><span className="mt-1 block text-xs leading-5 text-[#7790a8]">Wanneer het jou uitkomt</span></div>
              </div>
            </div>
            <div className="relative order-1 min-h-[430px] overflow-hidden bg-[#dff1ff] sm:min-h-[520px] lg:order-2 lg:min-h-[650px]">
              <img src="/shinego-hero.png" alt="ShineGo glazenwasser met telescoopsteel" className="absolute inset-0 h-full w-full scale-[1.42] object-cover object-right" />
              <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white/85 via-white/35 to-transparent sm:w-24 lg:w-28" />
            </div>
          </div>
        </div>
      </section>

      <section id="diensten" className="px-4 pb-4 sm:px-6 sm:pb-8">
        <div className="mx-auto max-w-[1480px]">
          <div className="text-center"><p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#1683f8]">Kies wat bij jou past</p><h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#123c70] sm:text-3xl">Voor elke situatie een schone oplossing</h2></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {diensten.map((dienst) => (
              <a key={dienst.titel} href={dienst.href} className="group flex min-h-[118px] items-center gap-4 rounded-[22px] border border-[#d5e9f8] bg-white/95 p-4 shadow-[0_10px_30px_rgba(46,79,119,.08)] transition hover:-translate-y-0.5 hover:border-[#8cc7f2] hover:shadow-[0_14px_34px_rgba(46,79,119,.12)]">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eaf6ff] text-3xl shadow-inner">{dienst.icon}</span><div className="min-w-0 flex-1"><h3 className="text-base font-extrabold text-[#123c70]">{dienst.titel}</h3><p className="mt-1 text-sm leading-5 text-[#6b86a0]">{dienst.tekst}</p></div><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1683f8] text-lg font-bold text-white transition group-hover:translate-x-1">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="hoe" className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[1180px]">
          <div className="text-center"><p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#1683f8]">Eenvoudig geregeld</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0b3d75] sm:text-4xl">Zo werkt ShineGo</h2><p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#6b86a0] sm:text-base">Van keuze tot afspraak in drie duidelijke stappen.</p></div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="relative overflow-hidden rounded-[26px] border border-[#d5e9f8] bg-white p-6 shadow-[0_14px_36px_rgba(46,79,119,.08)]"><div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#edf7ff]" /><div className="relative"><div className="flex items-center justify-between"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1683f8] text-xl font-extrabold text-white shadow-[0_10px_22px_rgba(22,131,248,.22)]">1</span><span className="text-3xl">🪟</span></div><h3 className="mt-6 text-xl font-extrabold text-[#123c70]">Kies je glasbewassing</h3><p className="mt-3 text-sm leading-6 text-[#6685a1]">Geef aan om welk type woning of pand het gaat en wat er gedaan moet worden.</p></div></div>
            <div className="relative overflow-hidden rounded-[26px] border border-[#d5e9f8] bg-white p-6 shadow-[0_14px_36px_rgba(46,79,119,.08)]"><div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#edf7ff]" /><div className="relative"><div className="flex items-center justify-between"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1683f8] text-xl font-extrabold text-white shadow-[0_10px_22px_rgba(22,131,248,.22)]">2</span><span className="text-3xl">€</span></div><h3 className="mt-6 text-xl font-extrabold text-[#123c70]">Bekijk je vaste prijs</h3><p className="mt-3 text-sm leading-6 text-[#6685a1]">Je ziet vooraf duidelijk wat de opdracht kost. Geen verrassingen achteraf.</p></div></div>
            <div className="relative overflow-hidden rounded-[26px] border border-[#d5e9f8] bg-white p-6 shadow-[0_14px_36px_rgba(46,79,119,.08)]"><div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#edf7ff]" /><div className="relative"><div className="flex items-center justify-between"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1683f8] text-xl font-extrabold text-white shadow-[0_10px_22px_rgba(22,131,248,.22)]">3</span><span className="text-3xl">✓</span></div><h3 className="mt-6 text-xl font-extrabold text-[#123c70]">Wij regelen de rest</h3><p className="mt-3 text-sm leading-6 text-[#6685a1]">ShineGo koppelt een beschikbare professional en jij ontvangt de afspraakgegevens.</p></div></div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="mx-auto max-w-[1180px] overflow-hidden rounded-[30px] border border-[#cfe5f6] bg-gradient-to-br from-[#eef8ff] via-[#e8f5ff] to-[#dcefff] p-7 shadow-[0_18px_50px_rgba(46,79,119,.10)] sm:p-9">
          <div className="grid gap-7 md:grid-cols-[1fr_auto] md:items-center">
            <div><div className="text-sm font-extrabold uppercase tracking-[.16em] text-[#1683f8]">Voor glazenwassers</div><h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#0b3d75] sm:text-3xl">Meer opdrachten. Jij bepaalt wanneer.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[#6685a1] sm:text-base">Ontvang opdrachten in jouw regio en kies zelf welke opdrachten je aanneemt.</p><div className="mt-5 flex flex-wrap gap-3"><span className="rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-[#315f88] shadow-sm">✓ Opdrachten in jouw regio</span><span className="rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-[#315f88] shadow-sm">✓ Zelf kiezen</span><span className="rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-[#315f88] shadow-sm">✓ Wekelijkse uitbetaling</span></div></div>
            <div className="flex flex-col gap-3">
              <a href="/professional" className="rounded-2xl bg-[#1683f8] px-7 py-4 text-center text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(22,131,248,.28)] transition hover:bg-[#0874df] sm:text-base">Aanmelden als glazenwasser →</a>
              <a href="/professional/veelgestelde-vragen" className="rounded-2xl border border-[#78b9ee] bg-white px-7 py-4 text-center text-sm font-extrabold text-[#1768b5] transition hover:bg-[#f7fbff] sm:text-base">Veelgestelde vragen voor glazenwassers</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#d5e9f8] bg-[#0d2f57] px-5 py-10 text-white">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="text-2xl font-extrabold tracking-tight">Shine<span className="text-[#49a6ff]">Go</span><span className="ml-1 text-[#49a6ff]">✦</span></div>
              <p className="mt-2 text-sm text-[#b8cce1]">Scherp in glaswerk</p>
              <div className="mt-4 space-y-1 text-xs leading-5 text-[#9fb7cf]">
                <p>Handelsnaam: ShineGo</p>
                <p>KvK: 57712913</p>
                <p>btw-id: NL001205368B47</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-[.12em] text-[#7fc1ff]">Contact</h3>
              <div className="mt-4 space-y-3 text-sm font-semibold text-white/90">
                <a href="mailto:info@shinego.nl" className="block hover:text-[#7fc1ff]">✉ Klantenservice</a>
                <a href="/contact" className="block hover:text-[#7fc1ff]">💬 Contactformulier</a>
                <a href="/veelgestelde-vragen" className="block hover:text-[#7fc1ff]">? Veelgestelde vragen</a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-[.12em] text-[#7fc1ff]">Voor klanten</h3>
              <div className="mt-4 space-y-3 text-sm font-semibold text-white/90">
                <a href="/privacy" className="block hover:text-[#7fc1ff]">Privacybeleid</a>
                <a href="/voorwaarden" className="block hover:text-[#7fc1ff]">Algemene voorwaarden</a>
                <a href="/cookies" className="block hover:text-[#7fc1ff]">Cookiebeleid</a>
                <a href="/herroepen" className="block hover:text-[#7fc1ff]">Herroepen</a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-[.12em] text-[#7fc1ff]">Voor professionals</h3>
              <div className="mt-4 space-y-3 text-sm font-semibold text-white/90">
                <a href="/professional" className="block hover:text-[#7fc1ff]">Aanmelden als glazenwasser</a>
                <a href="/professional/login" className="block hover:text-[#7fc1ff]">Inloggen professional</a>
                <a href="/professional/veelgestelde-vragen" className="block hover:text-[#7fc1ff]">Veelgestelde vragen</a>
              </div>
            </div>
          </div>

          <div className="mt-9 border-t border-white/15 pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[#9fb7cf]">© 2026 ShineGo. Alle rechten voorbehouden.</p>
              <div className="flex flex-col items-start gap-1 sm:items-end">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9fb7cf]">Veilig betalen met</span>
                <div className="flex flex-wrap items-center gap-2.5">
                  <a href="https://ideal.nl/ideal-wero-branding" target="_blank" rel="noreferrer" className="flex h-10 items-center rounded-lg bg-white px-2.5 shadow-sm" aria-label="iDEAL | Wero">
                    <img src="https://www.e-captain.nl/images/ideal-wero-lockup-yellow-horizontal-rgb-half.png" alt="iDEAL | Wero" className="h-7 w-auto" />
                  </a>
                  <a href="https://stripe.com" target="_blank" rel="noreferrer" className="flex h-10 items-center rounded-lg bg-white px-2.5 shadow-sm" aria-label="Powered by Stripe">
                    <img src="https://images.stripeassets.com/fzn2n1nzq965/4M6d6BSWzlgsrJx8rdZb0I/733f37ef69b5ca1d3d33e127184f4ce4/Powered_by_Stripe.svg?q=80&w=1082" alt="Powered by Stripe" className="h-6 w-auto" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
