import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZZP Glazenwasser Opdrachten | Meer Werk via ShineGo",
  description:
    "Ben je zzp-glazenwasser? Ontvang glazenwasopdrachten in jouw regio, kies zelf welke opdrachten je aanneemt en vul je agenda via ShineGo.",
  keywords: [
    "glazenwasser opdrachten",
    "zzp glazenwasser opdrachten",
    "werk voor glazenwassers",
    "glazenwasser worden",
    "extra opdrachten glazenwasser",
    "glazenwasser platform",
  ],
  alternates: {
    canonical: "/glazenwasser-worden",
  },
  openGraph: {
    title: "ZZP Glazenwasser Opdrachten | ShineGo",
    description:
      "Ontvang glazenwasopdrachten in jouw regio en kies zelf welke opdrachten je aanneemt.",
    url: "https://www.shinego.nl/glazenwasser-worden",
    siteName: "ShineGo",
    locale: "nl_NL",
    type: "website",
  },
};

const voordelen = [
  {
    titel: "Meer opdrachten in jouw regio",
    tekst: "Ontvang passende glazenwasopdrachten binnen jouw werkgebied en vul open plekken in je agenda aan.",
  },
  {
    titel: "Jij houdt de regie",
    tekst: "Je kiest zelf welke beschikbare opdrachten je aanneemt en plant je werk op een manier die bij jouw bedrijf past.",
  },
  {
    titel: "Duidelijke opdrachtinformatie",
    tekst: "Bekijk vooraf de belangrijkste gegevens van een opdracht, zodat je weet wat er van je wordt verwacht.",
  },
  {
    titel: "Wekelijkse uitbetaling",
    tekst: "Afgeronde opdrachten worden volgens de ShineGo-uitbetalingscyclus verwerkt.",
  },
];

const stappen = [
  {
    nummer: "1",
    titel: "Meld je bedrijf aan",
    tekst: "Vul je bedrijfs- en contactgegevens in. ShineGo controleert de opgegeven KVK- en btw-gegevens.",
  },
  {
    nummer: "2",
    titel: "Stel je werkgebied in",
    tekst: "Geef aan in welke straal je opdrachten wilt ontvangen en welke glasbewassingsdiensten je uitvoert.",
  },
  {
    nummer: "3",
    titel: "Kies passende opdrachten",
    tekst: "Bekijk beschikbare opdrachten in je dashboard en neem opdrachten aan die passen bij jouw planning.",
  },
];

export default function GlazenwasserWordenPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#eaf6ff] to-[#f8fcff] text-[#123c70]">
      <header className="border-b border-[#d7eaf8] bg-white/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <a
            href="/"
            className="text-[29px] font-extrabold tracking-tight text-[#0d3f79]"
          >
            Shine<span className="text-[#1683f8]">Go</span>
            <span className="ml-1 text-[#1683f8]">✦</span>
          </a>
          <a
            href="/professional/login"
            className="rounded-xl border border-[#cfe3f4] bg-white px-4 py-2.5 text-sm font-bold text-[#315f88]"
          >
            Inloggen professional
          </a>
        </div>
      </header>

      <section className="px-4 py-10 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-[1180px] gap-8 overflow-hidden rounded-[32px] border border-white bg-white p-7 shadow-[0_24px_70px_rgba(46,79,119,.14)] sm:p-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:p-14">
          <div>
            <div className="inline-flex rounded-full bg-[#e7f4ff] px-4 py-2 text-sm font-extrabold text-[#1678d4]">
              Voor zzp'ers en zelfstandige glazenwassers
            </div>
            <h1 className="mt-5 text-[40px] font-extrabold leading-[1.02] tracking-[-.04em] text-[#112f58] sm:text-[58px]">
              Meer glazenwasopdrachten.
              <br />
              <span className="text-[#1683f8]">Jij bepaalt wanneer.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#607b98] sm:text-lg sm:leading-8">
              ShineGo brengt klanten en zzp-glazenwassers bij elkaar. Ontvang
              glazenwasopdrachten in jouw regio, kies zelf wat bij je agenda past
              en bouw verder aan je bedrijf.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/professional"
                className="rounded-xl bg-[#1683f8] px-8 py-4 text-center text-base font-extrabold text-white shadow-[0_10px_25px_rgba(22,131,248,.25)] transition hover:bg-[#0874df]"
              >
                Aanmelden als glazenwasser →
              </a>
              <a
                href="/professional/veelgestelde-vragen"
                className="rounded-xl border border-[#78b9ee] bg-white px-8 py-4 text-center text-base font-extrabold text-[#1768b5]"
              >
                Veelgestelde vragen
              </a>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#d5e9f8] bg-gradient-to-br from-[#eef8ff] to-[#dcefff] p-6 sm:p-8">
            <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#1683f8]">
              ShineGo voor professionals
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-[#0b3d75]">
              Vul je agenda aan met opdrachten die bij je passen
            </h2>
            <div className="mt-6 space-y-3">
              {[
                "Opdrachten binnen jouw ingestelde werkgebied",
                "Zelf kiezen welke opdrachten je aanneemt",
                "Duidelijke opdrachtgegevens in je dashboard",
                "Wekelijkse uitbetaling van afgeronde opdrachten",
              ].map((punt) => (
                <div
                  key={punt}
                  className="flex gap-3 rounded-2xl bg-white/90 px-4 py-3 text-sm font-bold text-[#315f88] shadow-sm"
                >
                  <span className="text-[#1683f8]">✓</span>
                  <span>{punt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[1180px]">
          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#1683f8]">
              Waarom ShineGo
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0b3d75] sm:text-4xl">
              Extra opdrachten zonder zelf steeds nieuwe klanten te zoeken
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-sm leading-6 text-[#6b86a0] sm:text-base">
              ShineGo is gericht op glasbewassing. Zo blijft het platform
              overzichtelijk voor klanten én voor glazenwassers.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {voordelen.map((voordeel) => (
              <article
                key={voordeel.titel}
                className="rounded-[24px] border border-[#d5e9f8] bg-white p-6 shadow-[0_12px_34px_rgba(46,79,119,.08)]"
              >
                <h3 className="text-xl font-extrabold text-[#123c70]">
                  {voordeel.titel}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#6685a1] sm:text-base">
                  {voordeel.tekst}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[1180px] rounded-[30px] bg-[#0d2f57] p-7 text-white sm:p-10">
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#7fc1ff]">
            Zo werkt het
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
            Van aanmelden naar je eerste passende opdracht
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {stappen.map((stap) => (
              <article
                key={stap.nummer}
                className="rounded-[22px] border border-white/15 bg-white/10 p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1683f8] text-lg font-extrabold">
                  {stap.nummer}
                </span>
                <h3 className="mt-5 text-xl font-extrabold">{stap.titel}</h3>
                <p className="mt-3 text-sm leading-6 text-[#c6d8ea]">
                  {stap.tekst}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[900px]">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-[#0b3d75]">
            Veelgestelde vragen van glazenwassers
          </h2>
          <div className="mt-7 space-y-4">
            <article className="rounded-2xl border border-[#d5e9f8] bg-white p-6">
              <h3 className="font-extrabold text-[#123c70]">
                Kan ik zelf bepalen welke opdrachten ik aanneem?
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#6685a1]">
                Ja. Je bekijkt beschikbare opdrachten en kiest zelf welke
                opdrachten passen bij jouw planning en werkgebied.
              </p>
            </article>
            <article className="rounded-2xl border border-[#d5e9f8] bg-white p-6">
              <h3 className="font-extrabold text-[#123c70]">
                Voor wie is aanmelden bedoeld?
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#6685a1]">
                De aanmelding is bedoeld voor zelfstandige glazenwassers en
                glazenwassersbedrijven die professioneel opdrachten willen
                uitvoeren via ShineGo.
              </p>
            </article>
            <article className="rounded-2xl border border-[#d5e9f8] bg-white p-6">
              <h3 className="font-extrabold text-[#123c70]">
                Moet ik documenten uploaden bij het aanmelden?
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#6685a1]">
                Bij de eerste aanmelding hoef je geen KVK-uittreksel te
                uploaden. ShineGo controleert de opgegeven bedrijfsgegevens.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 pt-6 sm:px-6">
        <div className="mx-auto max-w-[1000px] rounded-[30px] border border-[#cfe5f6] bg-gradient-to-br from-[#eef8ff] to-[#dcefff] p-8 text-center shadow-[0_18px_50px_rgba(46,79,119,.10)] sm:p-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0b3d75]">
            Klaar om je aan te melden?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#6685a1] sm:text-base">
            Maak je ShineGo-profiel aan en stel daarna je werkgebied en
            voorkeuren in.
          </p>
          <a
            href="/professional"
            className="mt-6 inline-flex rounded-xl bg-[#1683f8] px-8 py-4 text-center text-base font-extrabold text-white shadow-[0_10px_25px_rgba(22,131,248,.25)]"
          >
            Nu aanmelden →
          </a>
        </div>
      </section>

      <footer className="border-t border-[#d5e9f8] bg-[#0d2f57] px-5 py-8 text-white">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-3 text-sm text-[#b8cce1] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 ShineGo. Alle rechten voorbehouden.</span>
          <div className="flex gap-5">
            <a href="/privacy" className="hover:text-white">
              Privacy
            </a>
            <a href="/voorwaarden" className="hover:text-white">
              Voorwaarden
            </a>
            <a href="/contact" className="hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
