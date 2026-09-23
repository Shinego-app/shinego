import type { Metadata } from "next";
import ServiceLandingPage from "../components/ServiceLandingPage";

export const metadata: Metadata = {
  title: "Glazenwasser Bedrijfspand | Zakelijke Glasbewassing",
  description:
    "Glazenwasser voor winkel of bedrijfspand boeken? Regel zakelijke glasbewassing via ShineGo voor ramen binnen, buiten of beide.",
  alternates: { canonical: "/glazenwasser-bedrijf" },
  openGraph: {
    title: "Glazenwasser voor winkel en bedrijfspand | ShineGo",
    description: "Boek zakelijke glasbewassing en bekijk vooraf hoe de prijs wordt opgebouwd.",
    url: "https://www.shinego.nl/glazenwasser-bedrijf",
    siteName: "ShineGo",
    locale: "nl_NL",
    type: "website",
  },
};

export default function Page() {
  return (
    <ServiceLandingPage
      eyebrow="Zakelijke glasbewassing"
      title="Glazenwasser voor winkel of bedrijfspand"
      intro="Een verzorgde uitstraling begint met schoon glas. Boek glasbewassing voor je winkel of bedrijfspand en geef het glasoppervlak en de gewenste reiniging door."
      ctaHref="/boeken/glazenwassen/details?type=bedrijf"
      bullets={["Voor winkels en bedrijfspanden", "Binnen, buiten of beide", "Prijs op basis van glasoppervlak"]}
      uitleg="Voor zakelijke opdrachten wordt onder meer gekeken naar het glasoppervlak, de gewenste reiniging en de bereikbaarheid. Voor zeer grote oppervlakken kan een offerte nodig zijn."
    />
  );
}
