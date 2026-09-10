export default function Home() {
  const diensten = [
    {
      icon: "🏡",
      titel: "Woning",
      tekst: "Rijtjeshuis, twee-onder-een-kap, vrijstaande woning of villa",
      href: "/boeken/glazenwassen?type=woning",
    },
    {
      icon: "🏢",
      titel: "Appartement / flat",
      tekst: "Ideaal voor appartementen",
      href: "/boeken/glazenwassen?type=appartement",
    },
    {
      icon: "🏬",
      titel: "Winkel / bedrijfspand",
      tekst: "Voor zakelijke panden",
      href: "/boeken/glazenwassen?type=bedrijf",
    },
    {
      icon: "🪟",
      titel: "Gevel / hoog glas",
      tekst: "Telewash met telescoopsteel",
      href: "/boeken/glazenwassen?type=telewash",
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
          <a href="/professional/login" className="rounded-xl border border-[#d6e3f2] bg-white px-4 py-2.5 text-sm font-bold text-[#315074] shadow-sm transition hover:border-[#9db8f5]">Inloggen</a>
        </div>
      </header>

      <section className="relative overflow-hidden px-4 pb-10 pt-5 sm:px-6 sm:pb-14 sm:pt-8">
        <div className="pointer-events-none absolute -left-28 top-16 h-72 w-72 rounded-full bg-[#d8eeff] blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-6 h-80 w-80 rounded-full bg-[#dae6ff] blur-3xl" />
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-white bg-white shadow-[0_24px_70px_rgba(46,79,119,0.15)]">
          <div className="grid lg:grid-cols-[1.03fr_.97fr]">
            <div className="order-2 px-6 pb-9 pt-8 sm:px-10 sm:pb-12 lg:order-1 lg:flex lg:flex-col lg:justify-center lg:px-12 lg:py-16">
              <h1 className="max-w-xl text-[42px] font-extrabold leading-[0.98] tracking-[-0.045em] text-[#17375f] sm:text-6xl">Kies je glasbewassing</h1>
              <p className="mt-5 max-w-lg text-[15px] leading-7 text-[#71859d] sm:text-lg sm:leading-8">Wat kunnen we voor je doen?</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href="/boeken/glazenwassen" className="rounded-xl bg-[#5578dc] px-7 py-4 text-center text-base font-extrabold text-white shadow-[0_10px_25px_rgba(73,103,190,.28)] transition hover:bg-[#466bd4]">Kies je glasbewassing →</a>
              </div>
            </div>
            <div className="order-1 relative min-h-[300px] overflow-hidden bg-gradient-to-br from-[#f3f8ff] via-[#e8f3ff] to-[#dcecff] sm:min-h-[400px] lg:order-2 lg:min-h-[540px]">
              <div className="absolute inset-7 rounded-[28px] border border-white/80 bg-white/55 p-5 shadow-[0_18px_45px_rgba(69,101,145,.12)] backdrop-blur-sm sm:inset-10">
                <div className="grid h-full grid-cols-2 gap-4">
                  <div className="rounded-[22px] border border-white bg-gradient-to-b from-[#d9efff] to-[#f8fcff] shadow-inner" />
                  <div className="rounded-[22px] border border-white bg-gradient-to-b from-[#e3f4ff] to-[#ffffff] shadow-inner" />
                  <div className="rounded-[22px] border border-white bg-gradient-to-b from-[#eef7ff] to-[#dceeff] shadow-inner" />
                  <div className="rounded-[22px] border border-white bg-gradient-to-b from-[#d9ecff] to-[#f8fcff] shadow-inner" />
                </div>
                <div className="absolute inset-x-5 top-1/2 h-px bg-white/90" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto mt-4 grid max-w-6xl gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-white bg-white/90 p-4 shadow-[0_9px_28px_rgba(68,99,135,.07)]"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eef5ff] text-xl">🛡️</span><div><strong className="block text-sm text-[#29496f]">Vaste prijzen</strong><span className="text-xs text-[#8293a8]">Geen verrassingen</span></div></div>
          <div className="flex items-center gap-3 rounded-2xl border border-white bg-white/90 p-4 shadow-[0_9px_28px_rgba(68,99,135,.07)]"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eefaf3] text-xl">✓</span><div><strong className="block text-sm text-[#29496f]">Betrouwbare professionals</strong><span className="text-xs text-[#8293a8]">Geverifieerd door ShineGo</span></div></div>
          <div className="flex items-center gap-3 rounded-2xl border border-white bg-white/90 p-4 shadow-[0_9px_28px_rgba(68,99,135,.07)]"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f2f5ff] text-xl">☆</span><div><strong className="block text-sm text-[#29496f]">Snel een afspraak</strong><span className="text-xs text-[#8293a8]">Wanneer het jou uitkomt</span></div></div>
        </div>
      </section>

      <section id="diensten" className="bg-white px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl"><h2 className="text-3xl font-extrabold tracking-tight text-[#18375f] sm:text-4xl">Kies je glasbewassing</h2><p className="mt-3 text-base text-[#778ba4]">Wat kunnen we voor je doen?</p></div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {diensten.map((dienst) => (
              <a key={dienst.titel} href={dienst.href} className="group min-h-[150px] rounded-[24px] border border-[#dbe5f2] bg-white p-5 shadow-[0_10px_30px_rgba(51,80,112,.06)] transition hover:-translate-y-0.5 hover:border-[#a9bff3] hover:shadow-md sm:p-6">
                <div className="flex h-full items-center gap-4"><span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f2f6fb] text-3xl">{dienst.icon}</span><div><h3 className="text-lg font-extrabold text-[#1c3d69]">{dienst.titel}</h3><p className="mt-1 text-sm leading-5 text-[#7a8da5]">{dienst.tekst}</p></div><span className="ml-auto text-xl text-[#708bc2] transition group-hover:translate-x-1">›</span></div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="hoe-het-werkt" className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl"><div className="text-center"><div className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#4d7ef0]">Eenvoudig geregeld</div><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#18375f] sm:text-4xl">Zo werkt ShineGo</h2></div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[["1", "Kies je glasbewassing", "Geef aan wat er gedaan moet worden en wat bij jouw situatie past."],["2", "Bekijk je vaste prijs", "Je ziet vooraf duidelijk wat de opdracht kost voordat je betaalt."],["3", "Wij regelen de rest", "ShineGo koppelt je opdracht aan een beschikbare professional."]].map(([nummer, titel, tekst]) => (
              <div key={nummer} className="rounded-[25px] border border-white bg-white p-6 shadow-[0_12px_35px_rgba(55,87,122,.07)] sm:p-7"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5578dc] text-sm font-extrabold text-white shadow-[0_6px_16px_rgba(73,103,190,.2)]">{nummer}</div><h3 className="mt-5 text-xl font-extrabold text-[#29496f]">{titel}</h3><p className="mt-2 text-sm leading-6 text-[#7a8da5]">{tekst}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[30px] border border-[#dce7f5] bg-gradient-to-br from-[#f4f8ff] via-[#eef6ff] to-[#e8f3ff] shadow-[0_16px_45px_rgba(61,91,126,.08)]">
          <div className="grid md:grid-cols-[1.15fr_.85fr] md:items-center"><div className="px-6 py-9 sm:px-10 sm:py-12"><div className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#4d7ef0]">Voor glazenwassers</div><h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-[#18375f] sm:text-4xl">Meer opdrachten. Jij bepaalt wanneer.</h2><p className="mt-4 max-w-xl text-base leading-7 text-[#6f839b]">Ontvang opdrachten in jouw regio en kies zelf welke opdrachten je aanneemt.</p><a href="/professional" className="mt-7 inline-block rounded-xl bg-[#5578dc] px-6 py-4 font-extrabold text-white shadow-[0_8px_20px_rgba(73,103,190,.24)] transition hover:bg-[#466bd4]">Gratis aanmelden als glazenwasser →</a></div><div className="hidden min-h-[330px] p-8 md:block"><div className="relative h-full overflow-hidden rounded-[26px] border border-white bg-gradient-to-br from-[#edf7ff] to-[#dcecff] shadow-inner"><div className="absolute left-8 right-8 top-8 h-20 rounded-2xl border border-white/90 bg-white/65" /><div className="absolute bottom-8 left-8 right-8 top-32 grid grid-cols-2 gap-4"><div className="rounded-2xl border border-white bg-white/55" /><div className="rounded-2xl border border-white bg-white/70" /></div></div></div></div>
        </div>
      </section>

      <footer className="border-t border-[#dfeaf5] bg-[#f3f8fd] px-4 text-[#6f8298] sm:px-6"><div className="mx-auto flex max-w-6xl flex-col gap-5 py-9 text-sm md:flex-row md:items-center md:justify-between"><div><span className="font-extrabold text-[#123c70]">Shine<span className="text-[#4d7ef0]">Go</span><span className="ml-0.5 text-[#6e96f5]">✦</span></span> © 2026</div><div className="flex flex-wrap gap-x-5 gap-y-3"><a href="/prijzen" className="hover:text-[#4d7ef0]">Prijzen</a><a href="/veelgestelde-vragen" className="hover:text-[#4d7ef0]">Veelgestelde vragen</a><a href="/privacy" className="hover:text-[#4d7ef0]">Privacy</a><a href="/cookies" className="hover:text-[#4d7ef0]">Cookies</a><a href="/voorwaarden" className="hover:text-[#4d7ef0]">Voorwaarden</a><a href="/contact" className="hover:text-[#4d7ef0]">Contact</a></div></div></footer>
    </main>
  );
}
