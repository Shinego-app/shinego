import type { Metadata } from "next";
import ServiceLandingPage from "../components/ServiceLandingPage";

export const metadata: Metadata = {
  title: "Glazenwasser met Telescoopsteel | Hoog Glas Wassen",
  description:
    "Hoog of lastig bereikbaar glas laten wassen? Boek via ShineGo een glazenwasser voor glasbewassing met telescoopsteel.",
  alternates: { canonical: "/telescoopsteel-glazenwasser" },
  openGraph: {
    title: "Glazenwasser met telescoopsteel | ShineGo",
    description: "Voor hoog en lastig bereikbaar glas: boek glasbewassing met telescoopsteel via ShineGo.",
    url: "https://www.shinego.nl/telescoopsteel-glazenwasser",
    siteName: "ShineGo",
    locale: "nl_NL",
    type: "website",
  },
};

export default function Page() {
  return (
    <ServiceLandingPage
      eyebrow="Hoog en lastig bereikbaar glas"
      title="Glazenwassen met telescoopsteel"
      intro="Voor hoge ramen of glas dat vanaf de grond lastig bereikbaar is, kan een telescoopsteel worden gebruikt. Geef de situatie door en bereken direct je boekingsprijs."
      ctaHref="/boeken/glazenwassen/details?type=telewash"
      bullets={["Voor hoger en groot glas", "Vanaf de grond werken waar passend", "Direct prijs berekenen"]}
      uitleg="Een telescoopsteel kan worden ingezet wanneer ramen hoger zitten of de bereikbaarheid daarom vraagt. Tijdens het boeken geef je de verdiepingen, het aantal ramen en de situatie rond het glas door."
    />
  );
}
