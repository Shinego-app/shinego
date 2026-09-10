export default function PrijzenPage() {
  const onderdelen = [
    ["🏠", "1. Basisprijs", "De basisprijs is afhankelijk van het type woning en de gekozen glasbewassing."],
    ["📊", "2. Hoogtetoeslag", "Voor hogere verdiepingen rekenen we vooraf een duidelijke toeslag."],
    ["▦", "3. Kozijnen", "Wil je ook de kozijnen laten schoonmaken? Dan tonen we de extra kosten vooraf."],
    ["🧹", "4. Telescoopsteel", "Voor hoog of lastig bereikbaar glas kan een telescoopsteel nodig zijn."],
    ["%", "5. Abonnementskorting", "Kies periodiek en ontvang automatisch korting op je opdracht."],
  ];

  return (
    <main className="min-h-screen bg-[#fbfdff] text-[#16355f]">
      <div className="mx-auto max-w-5xl px-5 py-7 sm:px-8 sm:py-10">
        <header className="flex items-center justify-between">
          <a href="/" className="text-[28px] font-extrabold tracking-tight text-[#123c70]">Shine<span className="text-[#4d7ef0]">Go</span><span className="ml-1 text-[#6e96f5]">✦</span></a>
          <a href="/" aria-label="Menu" className="flex h-10 w-10 items-center justify-center rounded-xl text-2xl text-[#6b83a2] hover:bg-[#f0f5ff]">≡</a>
        </header>

        <section className="relative mt-7 overflow-hidden rounded-[30px] bg-white px-5 py-7 shadow-[0_18px_60px_rgba(45,77,120,0.10)] sm:px-9 sm:py-9">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:gap-12">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#18375f] sm:text-4xl">Hoe onze prijzen werken</h1>
              <p className="mt-2 text-sm text-[#778ba4] sm:text-base">Eenvoudig, transparant en eerlijk.</p>

              <div className="mt-7 space-y-5">
                {onderdelen.map(([icoon, titel, tekst]) => (
                  <div key={titel} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f2f5ff] text-xl text-[#5578dc]">{icoon}</span>
                    <div><h2 className="text-sm font-extrabold text-[#375575]">{titel}</h2><p className="mt-1 text-xs leading-5 text-[#8392a5]">{tekst}</p></div>
                  </div>
                ))}
              </div>

              <div className="mt-7 rounded-2xl bg-[#f5f8ff] px-5 py-4 text-xs leading-5 text-[#6d8097]">
                Periodieke korting: <strong>12%</strong> bij elke 4 weken, <strong>10%</strong> bij elke 8 weken en <strong>7%</strong> bij elke 12 weken.
              </div>

              <a href="/boeken/glazenwassen" className="mt-7 inline-flex rounded-xl border border-[#dde5f0] bg-white px-6 py-3 text-sm font-bold text-[#637993] shadow-sm">Bekijk alle prijzen →</a>
            </div>

            <aside className="relative min-h-[420px] overflow-hidden rounded-[26px] bg-[#eef4fb]">
              <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=82" alt="Moderne woning met grote ramen" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#eef4fb]/65 via-transparent to-transparent" />
              <div className="absolute bottom-8 right-7 -rotate-6 text-right text-2xl font-medium italic text-[#697a90]">Heldere<br />prijzen.<br />Blije klanten. 🙂</div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
