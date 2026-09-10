export default function Home() {
  const diensten = [
    { icon: "🏡", titel: "Woning", tekst: "Rijtjeshuis, twee-onder-een-kap, vrijstaande woning of villa", href: "/boeken/glazenwassen?type=woning" },
    { icon: "🏢", titel: "Appartement / flat", tekst: "Ideaal voor appartementen", href: "/boeken/glazenwassen?type=appartement" },
    { icon: "🏬", titel: "Winkel / bedrijfspand", tekst: "Voor zakelijke panden", href: "/boeken/glazenwassen?type=bedrijf" },
    { icon: "🏙️", titel: "Gevel / hoog glas", tekst: "Telewash met telescoopsteel", href: "/boeken/glazenwassen?type=telewash" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#eaf6ff] to-[#f8fcff] text-[#123c70]">
      <header className="border-b border-[#d7eaf8] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="/" className="text-[29px] font-extrabold tracking-tight text-[#0d3f79]">Shine<span className="text-[#1683f8]">Go</span><span className="ml-1 text-[#1683f8]">✦</span></a>
          <nav className="hidden items-center gap-7 md:flex"><a href="#diensten" className="text-sm font-semibold text-[#52779b]">Diensten</a><a href="#hoe" className="text-sm font-semibold text-[#52779b]">Hoe het werkt</a><a href="/prijzen" className="text-sm font-semibold text-[#52779b]">Prijzen</a><a href="/veelgestelde-vragen" className="text-sm font-semibold text-[#52779b]">Veelgestelde vragen</a></nav>
          <a href="/professional/login" className="rounded-xl border border-[#cfe3f4] bg-white px-4 py-2.5 text-sm font-bold text-[#315f88]">Inloggen</a>
        </div>
      </header>

      <section id="diensten" className="px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-5xl rounded-[30px] border border-[#d5e9f8] bg-white/90 px-5 py-7 shadow-[0_18px_55px_rgba(40,93,140,.12)] sm:px-7 sm:py-8">
          <div className="relative">
            <div className="pointer-events-none absolute right-0 top-0 hidden h-36 w-52 bg-gradient-to-bl from-[#ccecff] via-[#e8f7ff] to-transparent sm:block" />
            <div className="relative">
              <h1 className="text-[36px] font-extrabold leading-tight tracking-[-.04em] text-[#0b3d75] sm:text-[46px]">Kies je glasbewassing</h1>
              <p className="mt-2 text-sm font-medium text-[#537797] sm:text-base">Wat kunnen we voor je doen?</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {diensten.map((dienst) => (
                  <a key={dienst.titel} href={dienst.href} className="group min-h-[126px] rounded-2xl border border-[#cfe3f4] bg-white p-4 text-left shadow-[0_6px_18px_rgba(53,105,148,.07)] transition hover:border-[#78b9ee]">
                    <div className="flex h-full items-center gap-4">
                      <span className="flex h-[72px] w-[86px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#dff3ff] to-[#f5fbff] text-[46px] shadow-inner">{dienst.icon}</span>
                      <div className="min-w-0 flex-1"><h2 className="text-base font-extrabold leading-5 text-[#123c70] sm:text-lg">{dienst.titel}</h2><p className="mt-1 text-xs leading-5 text-[#5f7e9c] sm:text-sm">{dienst.tekst}</p></div>
                      <span className="text-2xl font-light text-[#1683f8] transition group-hover:translate-x-1">›</span>
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-6 grid gap-3 border-t border-[#dcecf8] pt-5 sm:grid-cols-3">
                <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8f5ff] text-xl">🛡️</span><div><strong className="block text-sm">Vaste prijzen</strong><span className="text-xs text-[#6685a1]">Geen verrassingen</span></div></div>
                <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eafaf1] text-xl">🌿</span><div><strong className="block text-sm">Betrouwbare professionals</strong><span className="text-xs text-[#6685a1]">Geverifieerd door ShineGo</span></div></div>
                <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf6ff] text-xl">☆</span><div><strong className="block text-sm">Snel een afspraak</strong><span className="text-xs text-[#6685a1]">Wanneer het jou uitkomt</span></div></div>
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
