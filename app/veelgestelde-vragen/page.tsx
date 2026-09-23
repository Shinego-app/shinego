import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glazenwasser FAQ | Kosten, Boeken & Telescoopsteel",
  description:
    "Veelgestelde vragen over glazenwassers, kosten, ramen laten wassen, telescoopsteel, binnen- en buitenreiniging, periodieke glasbewassing, betaling en annuleren via ShineGo.",
  keywords: [
    "glazenwasser kosten",
    "ramen laten wassen",
    "hoe vaak ramen wassen",
    "glazenwasser telescoopsteel",
    "glazenwasser binnen en buiten",
    "periodieke glasbewassing",
  ],
  alternates: {
    canonical: "/veelgestelde-vragen",
  },
  openGraph: {
    title: "Veelgestelde vragen over glazenwassers | ShineGo",
    description:
      "Antwoorden over kosten, ramen laten wassen, bereikbaarheid, telescoopsteel, periodieke afspraken, betaling en annuleren.",
    url: "https://www.shinego.nl/veelgestelde-vragen",
    siteName: "ShineGo",
    locale: "nl_NL",
    type: "website",
  },
};

const vragen = [
  {
    vraag: "Welke glasbewassing kan ik via ShineGo boeken?",
    antwoord:
      "Je kunt glasbewassing boeken voor woningen, appartementen, winkels en bedrijfspanden. Voor hogere of moeilijk bereikbare ramen kun je aangeven dat een telescoopsteel nodig is.",
  },
  {
    vraag: "Wat is een telescoopsteel?",
    antwoord:
      "Een telescoopsteel is een uitschuifbaar hulpmiddel waarmee een professional ramen op hoogte vanaf de grond kan reinigen. De professional bepaalt zelf welke werkmethode en hulpmiddelen voor de opdracht geschikt zijn.",
  },
  {
    vraag: "Wanneer heb ik een telescoopsteel nodig?",
    antwoord:
      "Tijdens het boeken kun je aangeven dat ramen hoog of lastig bereikbaar zijn. Bij ramen op de 3e verdieping wordt telescoopsteel automatisch verplicht en wordt de opdracht als extra lastig bereikbaar gemarkeerd.",
  },
  {
    vraag: "Tot welke hoogte kan ik via ShineGo boeken?",
    antwoord:
      "Via de standaard boekingsflow kun je ramen tot en met de 3e verdieping boeken. De professional beoordeelt de situatie ter plaatse en bepaalt zelfstandig of en op welke wijze de opdracht veilig kan worden uitgevoerd.",
  },
  {
    vraag: "Worden de ramen binnen of buiten schoongemaakt?",
    antwoord:
      "In de boekingsflow zie je welke glasbewassing je kiest. Standaard gaat het om de buitenzijde van de ramen. Waar binnenreiniging beschikbaar is, wordt dat duidelijk aangegeven.",
  },
  {
    vraag: "Worden de kozijnen ook schoongemaakt?",
    antwoord:
      "Je kunt tijdens het boeken aangeven of je de kozijnen wilt laten reinigen. Wanneer je deze optie kiest, wordt de toeslag automatisch meegenomen in de prijs.",
  },
  {
    vraag: "Wat betekent extra lastig bereikbaar?",
    antwoord:
      "Dit geldt bijvoorbeeld voor ramen boven een serre, schuin dak of een andere situatie waarbij extra bereik nodig is. Geef dit tijdens het boeken aan zodat de professional vooraf weet wat hij kan verwachten.",
  },
  {
    vraag: "Wat kost een glazenwasser en hoe wordt de prijs bepaald?",
    antwoord:
      "De prijs wordt vooraf berekend op basis van het type woning of pand, het aantal ramen of glasoppervlak, verdiepingen, bereikbaarheid en gekozen extra opties. Voor zeer grote zakelijke opdrachten kan een offerte nodig zijn.",
  },
  {
    vraag: "Hoe vaak kan ik mijn ramen laten wassen?",
    antwoord:
      "Ja. Naast een eenmalige afspraak kun je kiezen om de ramen iedere 4, 8 of 12 weken te laten wassen. De bijbehorende periodieke korting wordt direct in de boekingsflow verwerkt.",
  },
  {
    vraag: "Wanneer betaal ik?",
    antwoord:
      "Je betaalt vooraf via ShineGo. De betaling wordt veilig verwerkt via Stripe. De professional ontvangt zijn vergoeding volgens de uitbetalingsafspraken van ShineGo.",
  },
  {
    vraag: "Moet ik thuis zijn?",
    antwoord:
      "Niet altijd. Tijdens het boeken geef je aan of je aanwezig bent. Als voor de opdracht toegang tot de woning nodig is, moet die toegang wel mogelijk zijn op het afgesproken moment.",
  },
  {
    vraag: "Kan ik mijn boeking annuleren?",
    antwoord:
      "Ja. Een boeking kan worden geannuleerd. Afhankelijk van het moment van annuleren kunnen annuleringskosten gelden. Bij annulering binnen 24 uur of wanneer de professional voor niets komt, kan een vergoeding van toepassing zijn volgens het annuleringsbeleid.",
  },
  {
    vraag: "Wat gebeurt er als een professional annuleert?",
    antwoord:
      "Als een professional annuleert, wordt de opdracht weer beschikbaar gemaakt zodat ShineGo een andere professional kan zoeken. De klant betaalt daarvoor geen annuleringskosten.",
  },
  {
    vraag: "Zijn de glazenwassers werknemers van ShineGo?",
    antwoord:
      "Nee. ShineGo is een bemiddelingsplatform. De opdrachten worden uitgevoerd door zelfstandige professionals die via het platform werken.",
  },
  {
    vraag: "Wie bepaalt hoe de werkzaamheden worden uitgevoerd?",
    antwoord:
      "De professional voert de opdracht als zelfstandig ondernemer uit en bepaalt zelf de werkmethode en de benodigde hulpmiddelen. De professional is verantwoordelijk voor naleving van de voor zijn werkzaamheden geldende wet- en regelgeving. ShineGo faciliteert de boeking en de administratieve afhandeling.",
  },
  {
    vraag: "Wat als ik na de afspraak een probleem heb?",
    antwoord:
      "Neem dan zo snel mogelijk contact op met ShineGo en vermeld je boekingsgegevens. We bekijken samen met de professional wat er aan de hand is en hoe het kan worden opgelost.",
  },
];

export default function VeelgesteldeVragenPage() {
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: vragen.map((item) => ({
      "@type": "Question",
      name: item.vraag,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.antwoord,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#eaf6ff] to-[#f8fcff] text-[#123c70]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <header className="border-b border-[#d7eaf8] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="/" className="text-[29px] font-extrabold tracking-tight text-[#0d3f79]">
            Shine<span className="text-[#1683f8]">Go</span><span className="ml-1 text-[#1683f8]">✦</span>
          </a>
          <a href="/" className="rounded-xl border border-[#cfe3f4] bg-white px-4 py-2.5 text-sm font-bold text-[#315f88]">
            ← Terug naar home
          </a>
        </div>
      </header>

      <section className="px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#1683f8]">Hulp & uitleg</p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-[#0b3d75] sm:text-5xl">Veelgestelde vragen</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#6b86a0]">
              Alles wat je wilt weten over boeken, prijzen, bereikbaarheid, betaling en annuleren via ShineGo.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="/prijzen" className="rounded-full border border-[#cfe3f4] bg-white px-4 py-2 text-sm font-bold text-[#3971a4]">Glazenwasser kosten & prijzen</a>
            <a href="/glazenwasser-woning" className="rounded-full border border-[#cfe3f4] bg-white px-4 py-2 text-sm font-bold text-[#3971a4]">Glazenwasser voor woning</a>
            <a href="/glazenwasser-appartement" className="rounded-full border border-[#cfe3f4] bg-white px-4 py-2 text-sm font-bold text-[#3971a4]">Glazenwasser appartement</a>
            <a href="/glazenwasser-bedrijf" className="rounded-full border border-[#cfe3f4] bg-white px-4 py-2 text-sm font-bold text-[#3971a4]">Zakelijke glasbewassing</a>
            <a href="/telescoopsteel-glazenwasser" className="rounded-full border border-[#cfe3f4] bg-white px-4 py-2 text-sm font-bold text-[#3971a4]">Glas wassen met telescoopsteel</a>
          </div>

          <div className="mt-10 space-y-3">
            {vragen.map((item) => (
              <details key={item.vraag} className="group rounded-2xl border border-[#d5e9f8] bg-white shadow-[0_10px_28px_rgba(46,79,119,.07)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-left text-base font-extrabold text-[#123c70] sm:px-6">
                  <span>{item.vraag}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eaf6ff] text-xl font-bold text-[#1683f8] transition group-open:rotate-45">+</span>
                </summary>
                <div className="border-t border-[#e2eef7] px-5 py-5 text-sm leading-6 text-[#5f7e9c] sm:px-6 sm:text-base">
                  {item.antwoord}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-10 rounded-[26px] border border-[#cfe5f6] bg-[#eaf6ff] p-6 text-center sm:p-8">
            <h2 className="text-2xl font-extrabold text-[#0b3d75]">Staat je vraag er niet tussen?</h2>
            <p className="mt-2 text-sm leading-6 text-[#6685a1]">Neem contact op via info@shinego.nl of het contactformulier. We helpen je graag verder.</p>
            <a href="/contact" className="mt-5 inline-flex rounded-xl bg-[#1683f8] px-6 py-3 text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(22,131,248,.22)]">
              Contact opnemen →
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#d5e9f8] bg-white/90 px-5 py-8">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xl font-extrabold tracking-tight text-[#0d3f79]">Shine<span className="text-[#1683f8]">Go</span><span className="ml-1 text-[#1683f8]">✦</span></div>
            <p className="mt-1 text-sm text-[#7790a8]">Scherp in glaswerk</p>
            <p className="mt-2 text-xs leading-5 text-[#8aa0b5]">KvK 57712913 · btw-id NL001205368B47<br />info@shinego.nl</p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-[#52779b]">
            <a href="/privacy">Privacy</a>
            <a href="/voorwaarden">Algemene voorwaarden</a>
            <a href="/cookies">Cookies</a>
            <a href="/contact">Contact</a>
          </nav>
          <p className="text-xs text-[#8aa0b5]">© 2026 ShineGo</p>
        </div>
      </footer>
    </main>
  );
}
