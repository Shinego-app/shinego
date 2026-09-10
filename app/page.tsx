export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#eaf6ff] to-[#f8fcff] text-[#123c70]">
      <header className="border-b border-[#d7eaf8] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="/" className="text-[29px] font-extrabold tracking-tight text-[#0d3f79]">Shine<span className="text-[#1683f8]">Go</span><span className="ml-1 text-[#1683f8]">✦</span></a>
          <nav className="hidden items-center gap-7 md:flex"><a href="#diensten" className="text-sm font-semibold text-[#52779b]">Diensten</a><a href="#hoe" className="text-sm font-semibold text-[#52779b]">Hoe het werkt</a><a href="/prijzen" className="text-sm font-semibold text-[#52779b]">Prijzen</a><a href="/veelgestelde-vragen" className="text-sm font-semibold text-[#52779b]">Veelgestelde vragen</a></nav>
          <a href="/professional/login" className="rounded-xl border border-[#cfe3f4] bg-white px-4 py-2.5 text-sm font-bold text-[#315f88]">Inloggen</a>
        </div>
      </header>

      <section id="diensten" className="relative overflow-hidden px-3 pb-10 pt-5 sm:px-5 sm:pb-14 sm:pt-7">
        <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#d9efff] blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-[#dceaff] blur-3xl" />

        <div className="relative mx-auto max-w-[1480px] overflow-hidden rounded-[32px] border border-white bg-white shadow-[0_24px_70px_rgba(46,79,119,.14)]">
          <div className="grid lg:grid-cols-[1.05fr_1.35fr]">
            <div className="relative z-20 order-2 px-6 pb-10 pt-9 sm:px-10 sm:py-12 lg:order-1 lg:flex lg:min-h-[650px] lg:flex-col lg:justify-center lg:px-14">
              <div className="inline-flex w-fit rounded-full bg-[#e7f4ff] px-4 py-2 text-xs font-bold text-[#1678d4] sm:text-sm">
                Professionele glazenwassers, wanneer jij het nodig hebt
              </div>

              <h1 className="mt-5 max-w-2xl text-[44px] font-extrabold leading-[.96] tracking-[-.045em] text-[#112f58] sm:text-[68px]">
                Schone ramen,
                <br />
                een helderder
                <br />
                <span className="text-[#1683f8]">Nederland</span>
              </h1>

              <p className="mt-6 max-w-xl text-[16px] leading-7 text-[#607b98] sm:text-[20px] sm:leading-8">
                Boek eenvoudig en snel een professionele glazenwasser bij jou in de buurt. Vaste prijzen en betrouwbare vakmensen.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="/boeken/glazenwassen" className="rounded-xl bg-[#1683f8] px-8 py-4 text-center text-base font-extrabold text-white shadow-[0_10px_25px_rgba(22,131,248,.25)] transition hover:bg-[#0874df]">
                  Direct boeken →
                </a>
                <a href="#hoe" className="rounded-xl border border-[#78b9ee] bg-white px-8 py-4 text-center text-base font-extrabold text-[#1768b5]">
                  Hoe het werkt
                </a>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-[#dcecf8] pt-7">
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f5ff] text-xl">🛡️</div>
                  <strong className="mt-3 block text-sm text-[#18375f]">Vaste prijzen</strong>
                  <span className="mt-1 block text-xs leading-5 text-[#7790a8]">Geen verrassingen</span>
                </div>
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eafaf1] text-xl">✓</div>
                  <strong className="mt-3 block text-sm text-[#18375f]">Betrouwbare professionals</strong>
                  <span className="mt-1 block text-xs leading-5 text-[#7790a8]">Geverifieerd door ShineGo</span>
                </div>
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf6ff] text-xl">☆</div>
                  <strong className="mt-3 block text-sm text-[#18375f]">Snel een afspraak</strong>
                  <span className="mt-1 block text-xs leading-5 text-[#7790a8]">Wanneer het jou uitkomt</span>
                </div>
              </div>
            </div>

            <div className="relative order-1 min-h-[430px] overflow-hidden bg-[#dff1ff] sm:min-h-[520px] lg:order-2 lg:min-h-[650px]">
              <img
                src="/shinego-hero.png"
                alt="ShineGo glazenwasser met telescoopsteel"
                className="absolute inset-0 h-full w-full scale-[1.42] object-cover object-right"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white/85 via-white/35 to-transparent sm:w-24 lg:w-28" />
            </div>
          </div>
        </div>
      </section>

      <section id="hoe" className="px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-5xl"><h2 className="text-center text-3xl font-extrabold tracking-tight text-[#0b3d75]">Zo werkt ShineGo</h2><div className="mt-6 grid gap-4 md:grid-cols-3">{[["1","Kies je glasbewassing","Geef aan wat er gedaan moet worden."],["2","Bekijk je vaste prijs","Je ziet vooraf duidelijk wat de opdracht kost."],["3","Wij regelen de rest","ShineGo koppelt een beschikbare professional."]].map(([nr,titel,tekst])=><div key={nr} className="rounded-2xl border border-[#d5e9f8] bg-white/90 p-5"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1683f8] font-extrabold text-white">{nr}</span><h3 className="mt-4 text-lg font-extrabold">{titel}</h3><p className="mt-2 text-sm leading-6 text-[#6685a1]">{tekst}</p></div>)}</div></div>
      </section>

      <section className="px-4 pb-10 sm:px-6"><div className="mx-auto max-w-5xl rounded-[26px] border border-[#d5e9f8] bg-gradient-to-r from-[#eef8ff] to-[#e4f3ff] p-6 sm:p-8"><div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center"><div><div className="text-sm font-extrabold uppercase tracking-[.14em] text-[#1683f8]">Voor glazenwassers</div><h2 className="mt-2 text-2xl font-extrabold text-[#0b3d75]">Meer opdrachten. Jij bepaalt wanneer.</h2><p className="mt-2 text-sm text-[#6685a1]">Ontvang opdrachten in jouw regio en kies zelf welke opdrachten je aanneemt.</p></div><a href="/professional" className="rounded-xl bg-[#1683f8] px-6 py-3.5 text-center text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(22,131,248,.24)]">Aanmelden als glazenwasser →</a></div></div></section>
    </main>
  );
}
