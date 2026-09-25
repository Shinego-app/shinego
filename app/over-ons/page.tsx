import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Over ons | ShineGo",
  description:
    "Lees meer over ShineGo, het Nederlandse bemiddelingsplatform dat klanten en zelfstandige glazenwassers samenbrengt voor duidelijke en eenvoudig geregelde glasbewassing.",
  alternates: {
    canonical: "/over-ons",
  },
  openGraph: {
    title: "Over ShineGo",
    description:
      "ShineGo maakt het regelen van glasbewassing eenvoudiger voor klanten en zelfstandige glazenwassers.",
    url: "https://www.shinego.nl/over-ons",
    siteName: "ShineGo",
    locale: "nl_NL",
    type: "website",
  },
};

export default function OverOns() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#eaf6ff] to-[#f8fcff] text-[#123c70]">
      <header className="border-b border-[#d7eaf8] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="/" className="text-[29px] font-extrabold tracking-tight text-[#0d3f79]">
            Shine<span className="text-[#1683f8]">Go</span>
            <span className="ml-1 text-[#1683f8]">✦</span>
          </a>
          <nav className="flex items-center gap-5">
            <a href="/prijzen" className="hidden text-sm font-bold text-[#52779b] sm:block">
              Prijzen
            </a>
            <a href="/contact" className="rounded-xl border border-[#cfe3f4] bg-white px-4 py-2.5 text-sm font-bold text-[#315f88]">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <section className="px-4 pb-8 pt-8 sm:px-6 sm:pb-12 sm:pt-12">
        <div className="mx-auto max-w-[1180px] overflow-hidden rounded-[32px] border border-white bg-white p-6 shadow-[0_24px_70px_rgba(46,79,119,.14)] sm:p-10 lg:p-14">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full bg-[#e7f4ff] px-4 py-2 text-sm font-extrabold text-[#1678d4]">
              Over ShineGo
            </div>
            <h1 className="mt-5 text-[38px] font-extrabold leading-[1.03] tracking-[-.04em] text-[#112f58] sm:text-[58px]">
              Glasbewassing makkelijker geregeld.
            </h1>
            <p className="mt-6 text-base leading-7 text-[#607b98] sm:text-lg sm:leading-8">
              ShineGo is een Nederlands online bemiddelingsplatform dat klanten en zelfstandige
              glazenwassers samenbrengt. Ons doel is eenvoudig: het boeken, plannen en afhandelen
              van glasbewassing duidelijker en makkelijker maken voor beide kanten.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto grid max-w-[1180px] gap-5 md:grid-cols-2">
          <article className="rounded-[26px] border border-[#d5e9f8] bg-white p-6 shadow-[0_14px_36px_rgba(46,79,119,.08)] sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf6ff] text-2xl">🪟</div>
            <h2 className="mt-5 text-2xl font-extrabold text-[#0b3d75]">Voor klanten</h2>
            <p className="mt-3 text-sm leading-7 text-[#6685a1] sm:text-base">
              Via ShineGo geef je aan welke glasbewassing je nodig hebt, bekijk je de prijs en plan
              je een afspraak. Betalen gebeurt veilig online en de opdracht wordt gekoppeld aan een
              beschikbare zelfstandige professional.
            </p>
          </article>

          <article className="rounded-[26px] border border-[#d5e9f8] bg-white p-6 shadow-[0_14px_36px_rgba(46,79,119,.08)] sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf6ff] text-2xl">🧽</div>
            <h2 className="mt-5 text-2xl font-extrabold text-[#0b3d75]">Voor glazenwassers</h2>
            <p className="mt-3 text-sm leading-7 text-[#6685a1] sm:text-base">
              Zelfstandige glazenwassers kunnen via ShineGo opdrachten in hun werkgebied ontvangen
              en zelf bepalen welke opdrachten bij hun planning passen. Zo blijft de professional
              zelfstandig en is de administratie rond opdrachten overzichtelijk geregeld.
            </p>
          </article>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-[1180px] rounded-[30px] border border-[#cfe5f6] bg-gradient-to-br from-[#eef8ff] via-[#e8f5ff] to-[#dcefff] p-7 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#1683f8]">
                Waarom ShineGo
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0b3d75]">
                Minder gedoe, meer duidelijkheid
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6685a1] sm:text-base">
                Een glazenwasser vinden en een opdracht goed afspreken hoeft niet ingewikkeld te
                zijn. ShineGo brengt prijs, planning, betaling en communicatie zoveel mogelijk samen
                in één duidelijke online omgeving.
              </p>
            </div>

            <div className="grid gap-3">
              {[
                ["Duidelijk", "Vooraf weten wat je afspreekt en wat het kost."],
                ["Eenvoudig", "Boeken en opdrachten beheren zonder onnodige stappen."],
                ["Zelfstandig", "De glazenwasser voert de opdracht uit als zelfstandig professional."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl bg-white/90 p-5 shadow-sm">
                  <strong className="text-[#123c70]">{title}</strong>
                  <p className="mt-1 text-sm leading-6 text-[#6685a1]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-[900px] rounded-[28px] border border-[#d5e9f8] bg-white p-7 shadow-[0_12px_34px_rgba(46,79,119,.08)] sm:p-9">
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#1683f8]">
            Onze rol
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-[#0b3d75]">ShineGo bemiddelt</h2>
          <p className="mt-4 text-sm leading-7 text-[#6685a1] sm:text-base">
            ShineGo is het platform dat klant en zelfstandige glazenwasser bij elkaar brengt en de
            boeking ondersteunt. De glazenwasser voert de opdracht zelfstandig uit en is
            verantwoordelijk voor de uitvoering van het werk en het veilig uitvoeren daarvan.
          </p>
        </div>
      </section>

      <section className="px-4 pb-14 pt-6 sm:px-6 sm:pb-18">
        <div className="mx-auto max-w-[900px] text-center">
          <h2 className="text-3xl font-extrabold text-[#0b3d75]">Klaar om ShineGo te gebruiken?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#6685a1] sm:text-base">
            Boek glasbewassing of meld je aan als zelfstandige glazenwasser.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="/#diensten" className="rounded-xl bg-[#1683f8] px-7 py-4 text-center text-base font-extrabold text-white shadow-[0_10px_25px_rgba(22,131,248,.25)]">
              Glazenwasser boeken →
            </a>
            <a href="/glazenwasser-worden" className="rounded-xl border border-[#78b9ee] bg-white px-7 py-4 text-center text-base font-extrabold text-[#1768b5]">
              Glazenwasser worden
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#d5e9f8] bg-[#0d2f57] px-5 py-9 text-white">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-2xl font-extrabold tracking-tight">
              Shine<span className="text-[#49a6ff]">Go</span><span className="ml-1 text-[#49a6ff]">✦</span>
            </div>
            <p className="mt-2 text-sm text-[#b8cce1]">Scherp in glaswerk</p>
            <div className="mt-3 text-xs leading-5 text-[#9fb7cf]">
              <p>Handelsnaam: ShineGo</p>
              <p>KvK: 57712913 · btw-id: NL001205368B47</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-white/90">
            <a href="/contact" className="hover:text-[#7fc1ff]">Contact</a>
            <a href="/privacy" className="hover:text-[#7fc1ff]">Privacy</a>
            <a href="/voorwaarden" className="hover:text-[#7fc1ff]">Voorwaarden</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
