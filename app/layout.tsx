import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import CookieNotice from "./components/CookieNotice";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ShineGo | Glazenwasser eenvoudig geregeld",
    template: "%s | ShineGo",
  },
  description:
    "Boek eenvoudig een glazenwasser via ShineGo. Bekijk vooraf je prijs, kies een geschikt moment en betaal veilig online.",
  applicationName: "ShineGo",
  metadataBase: new URL("https://www.shinego.nl"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ShineGo | Glazenwasser eenvoudig geregeld",
    description:
      "Boek eenvoudig een glazenwasser, bekijk vooraf je prijs en betaal veilig online.",
    url: "https://www.shinego.nl",
    siteName: "ShineGo",
    locale: "nl_NL",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0f172a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="nl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <CookieNotice />
      </body>
    </html>
  );
}
