import type { Metadata } from "next";
import ServiceLandingPage from "../components/ServiceLandingPage";

export const metadata: Metadata = {
  title: "Glazenwassen Appartementencomplex & VvE",
  description:
    "Glazenwasser voor een appartementencomplex of VvE nodig? Regel periodieke of eenmalige glasbewassing voor gezamenlijke en buitenramen via ShineGo.",
  keywords: [
    "glazenwassen appartementencomplex",
    "glazenwasser appartementencomplex",
    "glazenwasser VvE",
    "VvE glasbewassing",
    "ramen wassen appartementencomplex",
    "periodieke glasbewassing appartementencomplex",
  ],
  alternates: {
    canonical: "/glazenwasser-appartementencomplex-vve",
  },
  openGraph: {
    title: "Glazenwassen Appartementencomplex & VvE",
    description:
      "Glasbewassing voor appartementencomplexen en VvE's: eenmalig of periodiek, met aandacht voor bereikbaarheid en omvang van het glaswerk.",
    url: "https://www.shinego.nl/glazenwasser-appartementencomplex-vve",
    siteName: "ShineGo",
    locale: "nl_NL",
    type: "website",
  },
};

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Glasbewassing voor appartementencomplexen en VvE's",
    serviceType: "Glasbewassing appartementencomplex",
    provider: {
      "@type": "Organization",
      name: "ShineGo",
      url: "https://www.shinego.nl/",
    },
    areaServed: {
      "@type": "Country",
      name: "Nederland",
    },
    description:
      "Bemiddeling voor eenmalige en periodieke glasbewassing van appartementencomplexen en VvE's.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ServiceLandingPage
        eyebrow="Voor VvE en appartementencomplex"
        title="Glazenwassen voor een appartementencomplex"
        intro="Voor een VvE, beheerder of appartementencomplex kan ShineGo helpen bij het vinden van een professionele glazenwasser. Geef de omvang, bereikbaarheid en gewenste frequentie door, zodat de opdracht passend kan worden beoordeeld."
        ctaHref="/contact?offerte=appartementencomplex"
        ctaLabel="Vraag informatie of een offerte →"
        bullets={[
          "Voor VvE's en appartementencomplexen",
          "Eenmalige of periodieke glasbewassing",
          "Ook voor hoger en lastig bereikbaar glas",
        ]}
        uitleg="Bij een appartementencomplex verschilt de opdracht per gebouw. Denk aan het aantal verdiepingen, de totale hoeveelheid glas, bereikbaarheid vanaf de grond en de vraag of alleen buitenramen of ook gezamenlijke binnenruimtes moeten worden meegenomen. Daarom beoordelen we grotere complexen eerst op basis van de situatie."
      />
    </>
  );
}
