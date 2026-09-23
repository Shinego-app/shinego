import type { Metadata } from "next";
import ServiceLandingPage from "../components/ServiceLandingPage";

export const metadata: Metadata = {
  title: "Glazenwasser Appartement | Ramen Laten Wassen",
  description:
    "Glazenwasser voor een appartement of flat nodig? Boek glasbewassing via ShineGo en geef verdieping, bereikbaarheid en aantal ramen door.",
  alternates: { canonical: "/glazenwasser-appartement" },
  openGraph: {
    title: "Glazenwasser voor appartement of flat | ShineGo",
    description: "Boek glasbewassing voor je appartement en bekijk vooraf de prijs.",
    url: "https://www.shinego.nl/glazenwasser-appartement",
    siteName: "ShineGo",
    locale: "nl_NL",
    type: "website",
  },
};

export default function Page() {
  return (
    <ServiceLandingPage
      eyebrow="Appartement en flat"
      title="Glazenwasser voor je appartement"
      intro="Laat de ramen van je appartement of flat professioneel reinigen. Geef aan op welke verdieping je woont en hoe de ramen bereikbaar zijn."
      ctaHref="/boeken/glazenwassen/details?type=appartement"
      bullets={["Verdieping en bereikbaarheid meenemen", "Buiten of binnen + buiten", "Duidelijke prijs vóór het boeken"]}
      uitleg="Bij een appartement is bereikbaarheid belangrijk. Tijdens het boeken geef je aan op welke verdieping de ramen zitten en of ze bijvoorbeeld via een balkon of vanaf buiten bereikbaar zijn. Zo kan de opdracht passend worden aangeboden."
    />
  );
}
