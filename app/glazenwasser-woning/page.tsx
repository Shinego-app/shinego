import type { Metadata } from "next";
import ServiceLandingPage from "../components/ServiceLandingPage";

export const metadata: Metadata = {
  title: "Glazenwasser voor Woning | Ramen Laten Wassen",
  description:
    "Glazenwasser voor je woning boeken? Laat de ramen van je rijtjeshuis, hoekwoning, twee-onder-een-kap of vrijstaande woning wassen via ShineGo.",
  alternates: { canonical: "/glazenwasser-woning" },
  openGraph: {
    title: "Glazenwasser voor je woning | ShineGo",
    description: "Boek eenvoudig een glazenwasser voor je woning en bekijk vooraf de prijs.",
    url: "https://www.shinego.nl/glazenwasser-woning",
    siteName: "ShineGo",
    locale: "nl_NL",
    type: "website",
  },
};

export default function Page() {
  return (
    <ServiceLandingPage
      eyebrow="Glazenwasser aan huis"
      title="Ramen laten wassen bij je woning"
      intro="Boek eenvoudig een professionele glazenwasser voor je woning. Geef het woningtype, aantal ramen en verdiepingen door en bekijk vooraf de prijs."
      ctaHref="/boeken/glazenwassen/details?type=woning"
      bullets={["Voor verschillende woningtypen", "Buiten of binnen + buiten", "Eenmalig of periodiek boeken"]}
      uitleg="Voor woningen kun je aangeven hoeveel ramen er aan de voor-, achter- en zijkant zijn. Je kiest welke verdiepingen moeten worden meegenomen en of je ook de binnenkant of kozijnen wilt laten reinigen."
    />
  );
}
