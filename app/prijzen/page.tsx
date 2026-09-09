export default function PrijzenPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="/" className="text-2xl font-extrabold tracking-tight text-slate-950">
            Shine<span className="text-sky-500">Go</span>
          </a>
          <a href="/boeken" className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 sm:px-5 sm:text-base">
            Boek een glazenwasser
          </a>
        </div>
      </header>

      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 text-white">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <p className="font-bold uppercase tracking-[0.14em] text-blue-100">Duidelijk vooraf</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Hoe onze prijzen werken</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-50">
            Bij ShineGo zie je vóór het betalen hoe je prijs is opgebouwd. Zo weet je waar je aan toe bent en kom je niet voor verrassingen te staan.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-5 md:grid-cols-2">
          {[
            ["1", "Basisprijs", "De basisprijs hangt af van het type glasbewassing dat je kiest, bijvoorbeeld buitenramen, binnenramen of telescoopsteel."],
            ["2", "Aantal ramen", "Voor woningen en appartementen telt het aantal ramen mee in de prijs. Je ziet dit bedrag apart terug in de prijsopbouw."],
            ["3", "Hoogte", "Voor ramen op hogere verdiepingen kan een toeslag gelden. De huidige toeslagen zijn €7,50 voor de 1e, €15 voor de 2e, €22,50 voor de 3e en €30 voor de 4e verdieping en hoger."],
            ["4", "Extra opties", "Kozijnen schoonmaken en moeilijk bereikbare ramen kunnen extra werk betekenen. Eventuele toeslagen worden vooraf zichtbaar gemaakt."],
          ].map(([nummer, titel, tekst]) => (
            <div key={titel} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-extrabold text-white">{nummer}</div>
              <h2 className="mt-5 text-xl font-extrabold">{titel}</h2>
              <p className="mt-3 leading-7 text-slate-600">{tekst}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
          <h2 className="text-2xl font-extrabold">Regelmatig laten schoonmaken?</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-300">
            Kies je voor een terugkerende opdracht, dan wordt de abonnementskorting automatisch in je prijs verwerkt: 10% bij elke 4 weken, 7% bij elke 8 weken en 5% bij elke 12 weken.
          </p>
        </div>

        <div className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold text-blue-950">Winkel of bedrijfspand</h2>
          <p className="mt-3 leading-7 text-blue-900">
            Zakelijke opdrachten worden geprijsd op basis van het glasoppervlak en of een telescoopsteel nodig is. Vanaf 500 m² maken we een offerte op maat, zodat grotere opdrachten eerlijk kunnen worden beoordeeld.
          </p>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold">Geen onverwachte extra kosten</h2>
          <p className="mt-3 leading-7 text-slate-600">
            Je krijgt vóór het boeken een duidelijke totaalprijs. Verandert de opdracht ter plaatse, dan worden extra werkzaamheden niet zomaar toegevoegd zonder jouw akkoord.
          </p>
        </div>

        <div className="mt-10 text-center">
          <a href="/boeken" className="inline-block w-full rounded-xl bg-blue-600 px-7 py-4 text-lg font-extrabold text-white shadow-lg transition hover:bg-blue-700 sm:w-auto">
            Bekijk jouw prijs →
          </a>
          <p className="mt-4 text-sm text-slate-500">Je ziet de volledige prijsopbouw voordat je betaalt.</p>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap gap-x-5 gap-y-3 px-4 py-8 text-sm text-slate-500 sm:px-6">
          <a href="/" className="hover:text-slate-900">Home</a>
          <a href="/veelgestelde-vragen" className="hover:text-slate-900">Veelgestelde vragen</a>
          <a href="/voorwaarden" className="hover:text-slate-900">Voorwaarden</a>
          <a href="/privacy" className="hover:text-slate-900">Privacy</a>
          <a href="/contact" className="hover:text-slate-900">Contact</a>
        </div>
      </footer>
    </main>
  );
}
