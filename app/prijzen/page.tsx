import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glazenwasser Kosten & Prijzen | ShineGo",
  description:
    "Bekijk hoe de prijs voor glazenwassen wordt berekend. Lees meer over woningtype, aantal ramen, verdiepingen, kozijnen, telescoopsteel en periodieke korting bij ShineGo.",
  keywords: [
    "glazenwasser kosten",
    "glazenwasser prijzen",
    "kosten ramen wassen",
    "prijs glazenwasser",
    "ramen laten wassen kosten",
    "glazenwassen prijs",
  ],
  alternates: {
    canonical: "/prijzen",
  },
  openGraph: {
    title: "Glazenwasser Kosten & Prijzen | ShineGo",
    description:
      "Bekijk hoe de prijs voor glazenwassen wordt opgebouwd en welke keuzes invloed hebben op de boekingsprijs.",
    url: "https://www.shinego.nl/prijzen",
    siteName: "ShineGo",
    locale: "nl_NL",
    type: "website",
  },
};

export default function PrijzenPage() {
  const onderdelen = [
    ["1", "1. Basisprijs", "De boekingsprijs is afhankelijk van het type woning en het aantal ramen."],
    ["2", "2. Hoogtetoeslag", "Voor hogere verdiepingen wordt vooraf een duidelijke toeslag berekend."],
    ["3", "3. Kozijnen", "Als ook de kozijnen worden schoongemaakt, wordt daarvoor een toeslag meegenomen in de boekingsprijs."],
    ["4", "4. Telescoopsteel", "Voor hoog of lastig bereikbaar glas kan een telescoopsteel nodig zijn."],
    ["5", "5. Periodieke korting", "Bij een periodieke boeking wordt automatisch de gekozen korting toegepast."],
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#eaf6ff] to-[#f8fcff] text-[#123c70]">
      <div className="mx-auto max-w-5xl px-5 py-5 sm:px-8 sm:py-7">
        <header className="flex items-center justify-between"><a href="/" className="text-[29px] font-extrabold tracking-tight text-[#0d3f79]">Shine<span className="text-[#1683f8]">Go</span><span className="ml-1 text-[#1683f8]">✦</span></a><a href="/" aria-label="Menu" className="flex h-9 w-9 items-center justify-center text-2xl font-bold text-[#1683f8]">≡</a></header>
        <section className="mt-5 rounded-[28px] border border-[#d5e9f8] bg-white/90 px-5 py-7 shadow-[0_18px_55px_rgba(40,93,140,.12)] sm:px-8 sm:py-9">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-[32px] font-extrabold leading-tight tracking-[-.035em] text-[#0b3d75] sm:text-[38px]">Glazenwasser kosten en prijzen</h1>
            <p className="mt-1 text-sm font-medium text-[#537797] sm:text-base">Bekijk hoe de boekingsprijs voor glazenwassen wordt opgebouwd. Vooraf duidelijk wat de opdracht kost.</p>
            <div className="mt-6 space-y-4">
              {onderdelen.map(([nummer,titel,tekst]) => <div key={titel} className="flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf6ff] text-sm font-extrabold text-[#1683f8]">{nummer}</span><div><h2 className="text-sm font-extrabold text-[#123c70]">{titel}</h2><p className="mt-1 text-xs leading-5 text-[#5f7e9c]">{tekst}</p></div></div>)}
            </div>
            <div className="mt-6 rounded-2xl bg-[#eef8ff] px-4 py-3 text-xs leading-5 text-[#4f708f]">Periodieke korting: <strong>12%</strong> bij elke 4 weken, <strong>10%</strong> bij elke 8 weken en <strong>7%</strong> bij elke 12 weken.</div>
            <div className="mt-4 rounded-2xl border border-[#d5e9f8] bg-white px-4 py-3 text-xs leading-5 text-[#5f7e9c]">ShineGo bemiddelt tussen klant en zelfstandige professional. De professional voert de opdracht zelfstandig uit.</div>
            <a href="/#diensten" className="mt-5 inline-flex rounded-xl border border-[#cfe3f4] bg-white px-6 py-3 text-sm font-bold text-[#3971a4]">Bekijk diensten →</a>
          </div>
        </section>
      </div>
    </main>
  );
}
