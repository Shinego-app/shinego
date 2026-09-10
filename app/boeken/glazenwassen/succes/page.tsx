"use client";

import { useEffect, useState } from "react";

type Klant = { voornaam: string; achternaam: string; gewensteDatum: string; gewensteTijd: string; straat: string; huisnummer: string; postcode: string; plaats: string; };
type Klus = { woningtype: string; verdiepingen: string[]; ramen: number; telescoop: boolean; frequentie: string; };
type Prijs = { totaal: number; };

export default function SuccesPage() {
  const [klant, setKlant] = useState<Klant | null>(null);
  const [klus, setKlus] = useState<Klus | null>(null);
  const [prijs, setPrijs] = useState<Prijs | null>(null);
  const [bookingId, setBookingId] = useState("");

  useEffect(() => {
    const klantData = localStorage.getItem("shinegoKlantGegevens");
    const klusData = localStorage.getItem("shinegoGlazenwassen");
    const prijsData = localStorage.getItem("shinegoPrijs");
    if (klantData) setKlant(JSON.parse(klantData));
    if (klusData) setKlus(JSON.parse(klusData));
    if (prijsData) setPrijs(JSON.parse(prijsData));
    setBookingId(localStorage.getItem("shinegoLaatsteBoekingId") || "");
  }, []);

  const stappen = ["Keuze", "Details", "Prijs", "Gegevens", "Bevestigen"];

  return (
    <main className="min-h-screen bg-[#fbfdff] text-[#16355f]">
      <div className="mx-auto max-w-5xl px-5 py-7 sm:px-8 sm:py-10">
        <header className="flex items-center justify-between">
          <a href="/" className="text-[28px] font-extrabold tracking-tight text-[#123c70]">Shine<span className="text-[#4d7ef0]">Go</span><span className="ml-1 text-[#6e96f5]">✦</span></a>
          <a href="/" aria-label="Menu" className="flex h-10 w-10 items-center justify-center rounded-xl text-2xl text-[#6b83a2] hover:bg-[#f0f5ff]">≡</a>
        </header>

        <div className="mt-4 grid grid-cols-5 gap-1">
          {stappen.map((stap, index) => (
            <div key={stap} className="text-center">
              <div className="flex items-center">
                <span className={`h-px flex-1 ${index === 0 ? "bg-transparent" : "bg-[#b9c9ed]"}`} />
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${index === 4 ? "bg-[#4f78e8] text-white" : "bg-[#e9efff] text-[#4f78e8]"}`}>{index + 1}</span>
                <span className={`h-px flex-1 ${index === 4 ? "bg-transparent" : "bg-[#b9c9ed]"}`} />
              </div>
              <div className={`mt-1 text-[10px] sm:text-xs ${index === 4 ? "font-bold text-[#4f78e8]" : "text-[#7c91aa]"}`}>{stap}</div>
            </div>
          ))}
        </div>

        <section className="relative mt-7 overflow-hidden rounded-[30px] bg-white px-5 py-8 shadow-[0_18px_60px_rgba(45,77,120,0.10)] sm:px-9 sm:py-10">
          <div className="absolute bottom-0 right-0 hidden h-full w-[38%] lg:block">
            <img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80" alt="Heldere ramen" className="h-full w-full object-cover opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent" />
            <div className="absolute bottom-9 right-7 -rotate-6 text-right text-xl font-medium italic text-[#768196]">Samen voor<br />een schonere<br />omgeving ♡</div>
          </div>

          <div className="relative max-w-2xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf7e9] text-3xl text-[#68ae6f]">✓</div>
            <div className="mt-4 -rotate-3 text-right text-lg font-medium italic text-[#6f7e94] sm:text-xl">Bedankt<br />voor je<br />vertrouwen!</div>
            <h1 className="-mt-9 text-3xl font-extrabold tracking-tight text-[#18375f] sm:text-4xl">Boeking succesvol!</h1>
            <p className="mt-2 max-w-lg text-sm leading-6 text-[#778ba4]">Bedankt. Je betaling is gelukt en je ontvangt per e-mail een bevestiging van je boeking.</p>

            <div className="mt-7 grid max-w-xl gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
              {bookingId && <><span className="text-[#8796aa]">Boeking</span><strong className="text-[#29496f]">#{bookingId}</strong></>}
              {klant && <><span className="text-[#8796aa]">Adres</span><strong className="text-[#29496f]">{klant.straat} {klant.huisnummer}, {klant.plaats}</strong><span className="text-[#8796aa]">Datum</span><strong className="text-[#29496f]">{klant.gewensteDatum}</strong><span className="text-[#8796aa]">Tijd</span><strong className="text-[#29496f]">{klant.gewensteTijd}</strong></>}
              {klus && <><span className="text-[#8796aa]">Aantal ramen</span><strong className="text-[#29496f]">{klus.ramen || "-"}</strong><span className="text-[#8796aa]">Verdiepingen</span><strong className="text-[#29496f]">{klus.verdiepingen?.join(", ") || "-"}</strong><span className="text-[#8796aa]">Telescoopsteel</span><strong className="text-[#29496f]">{klus.telescoop ? "Ja" : "Nee"}</strong></>}
              {prijs && <><span className="mt-2 font-bold text-[#29496f]">Totaalbedrag</span><strong className="mt-2 text-xl font-extrabold text-[#29496f]">€ {prijs.totaal.toFixed(2).replace(".", ",")}</strong></>}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/" className="rounded-xl px-5 py-3 text-sm font-bold text-[#73859b]">Naar home</a>
              <a href="/" className="rounded-xl bg-[#5578dc] px-7 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(73,103,190,.24)]">Mijn boeking →</a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
