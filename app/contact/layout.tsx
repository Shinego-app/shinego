import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact over je glazenwasser of boeking",
  description:
    "Een vraag over glasbewassing, je boeking of een offerte? Neem contact op met ShineGo via het contactformulier.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact met ShineGo",
    description: "Stel je vraag over glasbewassing, een boeking of een offerte.",
    url: "https://www.shinego.nl/contact",
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
