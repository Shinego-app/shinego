export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#eaf6ff] to-[#f8fcff] text-[#123c70]">
      <header className="border-b border-[#d7eaf8] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="/" className="text-[29px] font-extrabold tracking-tight text-[#0d3f79]">Shine<span className="text-[#1683f8]">Go</span><span className="ml-1 text-[#1683f8]">✦</span></a>
          <nav className="hidden items-center gap-7 md:flex"><a href="#diensten" className="text-sm font-semibold text-[#52779b]">Diensten</a><a href="#hoe" className="text-sm font-semibold text-[#52779b]">Hoe het werkt</a><a href="/prijzen" className="text-sm font-semibold text-[#52779b]">Prijzen</a><a href="/veelgestelde-vragen" className="text-sm font-semibold text-[#52779b]">Veelgestelde vragen</a></nav>
          <a href="/professional/login" className="rounded-xl border border-[#cfe3f4] bg-white px-4 py-2.5 text-sm font-bold text-[#315f88]">Inloggen</a>
        </div>
      </header>

      <section id="diensten" className="relative overflow-hidden px-4 pb-10 pt-6 sm:px-6 sm:pb-14 sm:pt-8">
        <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#d9efff] blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-[#dceaff] blur-3xl" />

        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-white bg-white shadow-[0_24px_70px_rgba(46,79,119,.14)]">
          <div className="grid lg:grid-cols-[.92fr_1.08fr]">
            <div className="relative z-20 order-2 px-6 pb-10 pt-9 sm:px-10 sm:py-12 lg:order-1 lg:flex lg:min-h-[560px] lg:flex-col lg:justify-center lg:px-12">
              <div className="inline-flex w-fit rounded-full bg-[#e7f4ff] px-4 py-2 text-xs font-bold text-[#1678d4] sm:text-sm">
                Professionele glazenwassers, wanneer jij het nodig hebt
              </div>

              <h1 className="mt-5 max-w-xl text-[42px] font-extrabold leading-[.98] tracking-[-.045em] text-[#112f58] sm:text-6xl">
                Schone ramen,
                <br />
                een helderder
                <br />
                <span className="text-[#1683f8]">Nederland</span>
              </h1>

              <p className="mt-5 max-w-lg text-[15px] leading-7 text-[#607b98] sm:text-lg sm:leading-8">
                Boek eenvoudig en snel een professionele glazenwasser bij jou in de buurt. Vaste prijzen en betrouwbare vakmensen.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href="/boeken/glazenwassen" className="rounded-xl bg-[#1683f8] px-7 py-4 text-center text-base font-extrabold text-white shadow-[0_10px_25px_rgba(22,131,248,.25)] transition hover:bg-[#0874df]">
                  Direct boeken →
                </a>
                <a href="#hoe" className="rounded-xl border border-[#78b9ee] bg-white px-7 py-4 text-center text-base font-extrabold text-[#1768b5]">
                  Hoe het werkt
                </a>
              </div>

              <div className="mt-9 grid grid-cols-3 gap-3 border-t border-[#dcecf8] pt-6">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f5ff] text-lg">🛡️</div>
                  <strong className="mt-3 block text-sm text-[#18375f]">Vaste prijzen</strong>
                  <span className="mt-1 block text-xs leading-5 text-[#7790a8]">Geen verrassingen</span>
                </div>
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eafaf1] text-lg">✓</div>
                  <strong className="mt-3 block text-sm text-[#18375f]">Betrouwbare professionals</strong>
                  <span className="mt-1 block text-xs leading-5 text-[#7790a8]">Geverifieerd door ShineGo</span>
                </div>
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf6ff] text-lg">☆</div>
                  <strong className="mt-3 block text-sm text-[#18375f]">Snel een afspraak</strong>
                  <span className="mt-1 block text-xs leading-5 text-[#7790a8]">Wanneer het jou uitkomt</span>
                </div>
              </div>
            </div>

            <div className="relative order-1 min-h-[390px] overflow-hidden bg-gradient-to-br from-[#cdeaff] via-[#e8f6ff] to-[#b8dcfa] sm:min-h-[470px] lg:order-2 lg:min-h-[560px]">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.15),rgba(255,255,255,.7))]" />
              <div className="absolute -right-12 top-10 h-[420px] w-[78%] rotate-[-4deg] rounded-[36px] border-[10px] border-white/70 bg-gradient-to-br from-[#7ec2ee] via-[#d7f0ff] to-white shadow-[0_30px_55px_rgba(31,86,134,.24)]" />
              <div className="absolute left-7 top-16 h-[190px] w-[205px] rotate-[-3deg] rounded-[26px] border-[7px] border-white bg-gradient-to-br from-[#59abe4] via-[#a8dcf5] to-[#effaff] shadow-[0_18px_40px_rgba(27,88,143,.22)] sm:left-10 sm:h-[220px] sm:w-[245px]" />
              <div className="absolute bottom-10 left-[18%] h-[210px] w-[250px] rotate-[2deg] rounded-[26px] border-[7px] border-white bg-gradient-to-br from-[#eef8ff] via-[#9bccec] to-[#ffffff] shadow-[0_20px_42px_rgba(32,83,130,.22)] sm:h-[235px] sm:w-[285px]" />

              <div className="absolute left-[32%] top-[44%] z-30 rounded-2xl bg-white/95 px-5 py-4 shadow-[0_14px_30px_rgba(28,74,116,.18)] backdrop-blur">
                <div className="text-sm font-extrabold text-[#18375f]">✓ Nieuwste Telewash-techniek</div>
                <div className="mt-1 text-xs text-[#718aa1]">Veilig, efficiënt en streeploos schoon</div>
              </div>

              <div className="absolute bottom-7 right-6 z-30 rounded-2xl bg-white/95 px-5 py-4 shadow-[0_14px_30px_rgba(28,74,116,.18)]">
                <div className="text-sm font-extrabold text-[#18375f]">✓ Voor woningen en bedrijfspanden</div>
                <div className="mt-1 text-xs text-[#718aa1]">Altijd een passende oplossing</div>
              </div>
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
