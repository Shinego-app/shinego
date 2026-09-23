import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "ZZP Glazenwasser FAQ | Opdrachten & Uitbetaling",
  description:
    "Veelgestelde vragen voor zzp-glazenwassers over opdrachten, osmosewater, telescoopsteel, veiligheid, Stripe-verificatie, vergoeding en uitbetaling via ShineGo.",
  keywords: [
    "zzp glazenwasser opdrachten",
    "opdrachten glazenwasser",
    "glazenwasser zzp",
    "osmosewater glazenwasser",
    "telescoopsteel glazenwasser",
    "glazenwasser uitbetaling",
    "Stripe glazenwasser",
  ],
  alternates: {
    canonical: "/professional/veelgestelde-vragen",
  },
  openGraph: {
    title: "Veelgestelde vragen voor zzp-glazenwassers | ShineGo",
    description:
      "Praktische antwoorden over opdrachten, werkmethoden, uitbetaling en werken als zelfstandig glazenwasser via ShineGo.",
    url: "https://www.shinego.nl/professional/veelgestelde-vragen",
    siteName: "ShineGo",
    locale: "nl_NL",
    type: "website",
  },
};

export default function ProfessionalFaqLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
