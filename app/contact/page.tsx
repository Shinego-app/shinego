export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
        <a
          href="/"
          className="mb-8 inline-block font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Terug naar ShineGo
        </a>

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
            ShineGo
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Contact
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            Heb je een vraag over een boeking, betaling of opdracht? We helpen
            je graag verder.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="text-2xl">💬</div>
              <h2 className="mt-3 text-lg font-bold">
                Vraag over je boeking
              </h2>
              <p className="mt-2 leading-6 text-slate-600">
                Vermeld bij contact bij voorkeur je boekingsnummer. Zo kunnen
                we je sneller helpen.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="text-2xl">🧽</div>
              <h2 className="mt-3 text-lg font-bold">
                Ben je professional?
              </h2>
              <p className="mt-2 leading-6 text-slate-600">
                Voor vragen over opdrachten, je account of uitbetalingen kun je
                contact opnemen met ShineGo.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-slate-950 p-7 text-white">
            <h2 className="text-xl font-bold">Contact met ShineGo</h2>

            <p className="mt-3 leading-7 text-slate-300">
              Onze definitieve contactgegevens worden hier vóór de lancering
              vermeld.
            </p>

            <p className="mt-4 text-sm text-slate-400">
              Stuur nooit wachtwoorden, volledige betaalgegevens of andere
              gevoelige informatie mee.
            </p>
          </div>

          <div className="mt-8">
            <a
              href="/veelgestelde-vragen"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Bekijk ook de veelgestelde vragen →
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}