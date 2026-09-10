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

  return <main className="min-h-screen bg-gradient-to-b from-[#eaf6ff] to-[#f8fcff] text-[#123c70]">
    <div className="mx-auto max-w-5xl px-5 py-5 sm:px-8 sm:py-7">
      <header className="flex items-center justify-between"><a href="/" className="text-[29px] font-extrabold tracking-tight text-[#0d3f79]">Shine<span className="text-[#1683f8]">Go</span><span className="ml-1 text-[#1683f8]">✦</span></a><a href="/" aria-label="Menu" className="flex h-9 w-9 items-center justify-center text-2xl font-bold text-[#1683f8]">≡</a></header>
      <div className="mx-auto mt-3 grid max-w-3xl grid-cols-5 gap-1">{stappen.map((stap,index)=><div key={stap} className="text-center"><div className="flex items-center"><span className={`h-px flex-1 ${index===0?"bg-transparent":"bg-[#7db9eb]"}`} /><span className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-extrabold ${index===4?"border-[#1683f8] bg-[#1683f8] text-white":"border-[#9ccbf0] bg-[#eaf6ff] text-[#1683f8]"}`}>{index+1}</span><span className={`h-px flex-1 ${index===4?"bg-transparent":"bg-[#7db9eb]"}`} /></div><div className={`mt-1 text-[10px] sm:text-xs ${index===4?"font-bold text-[#1683f8]":"text-[#52779b]"}`}>{stap}</div></div>)}</div>

      <section className="mt-5 overflow-hidden rounded-[28px] border border-[#d5e9f8] bg-white/90 shadow-[0_18px_55px_rgba(40,93,140,.12)]">
        <div className="grid lg:grid-cols-[1.15fr_.85fr]">
          <div className="px-5 py-7 sm:px-7 sm:py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dff7e9] text-3xl text-[#21a366]">✓</div>
            <h1 className="mt-4 text-[32px] font-extrabold leading-tight tracking-[-.035em] text-[#0b3d75] sm:text-[38px]">Boeking succesvol!</h1>
            <p className="mt-1 max-w-lg text-sm leading-6 text-[#537797]">Bedankt! Je boeking is ontvangen. Je ontvangt zo een bevestiging per e-mail.</p>

            <div className="mt-5 grid gap-y-2 rounded-2xl border border-[#d5e9f8] bg-[#f8fcff] p-4 text-sm sm:grid-cols-[auto_1fr] sm:gap-x-5">
              {bookingId && <><span className="text-[#6d89a4]">Boeking</span><strong>#{bookingId}</strong></>}
              {klant && <><span className="text-[#6d89a4]">Adres</span><strong>{klant.straat} {klant.huisnummer}, {klant.plaats}</strong><span className="text-[#6d89a4]">Datum</span><strong>{klant.gewensteDatum}</strong><span className="text-[#6d89a4]">Tijd</span><strong>{klant.gewensteTijd}</strong></>}
              {klus && <><span className="text-[#6d89a4]">Aantal ramen</span><strong>{klus.ramen || "-"}</strong><span className="text-[#6d89a4]">Verdiepingen</span><strong>{klus.verdiepingen?.join(", ") || "-"}</strong><span className="text-[#6d89a4]">Telescoopsteel</span><strong>{klus.telescoop ? "Ja" : "Nee"}</strong></>}
              {prijs && <><span className="mt-2 font-bold text-[#0b3d75]">Totaalbedrag</span><strong className="mt-2 text-xl font-extrabold text-[#0b3d75]">€ {prijs.totaal.toFixed(2).replace(".", ",")}</strong></>}
            </div>

            <div className="mt-6 flex flex-wrap gap-3"><a href="/" className="rounded-xl border border-[#cfe3f4] bg-white px-5 py-3 text-sm font-bold text-[#537797]">Naar home</a><a href="/" className="rounded-xl bg-[#1683f8] px-7 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(22,131,248,.24)]">Mijn boeking →</a></div>
          </div>

          <aside className="relative hidden min-h-[500px] overflow-hidden lg:block">
            <img src="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1000&q=82" alt="Moderne woning met grote schone ramen" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#dff2ff]/60 via-transparent to-[#eaf6ff]/10" />
            <div className="absolute right-7 top-8 -rotate-6 rounded-2xl bg-white/80 px-4 py-3 text-right text-xl font-medium italic leading-6 text-[#4f6f8d] shadow-sm backdrop-blur-sm">Bedankt<br />voor je<br />vertrouwen!</div>
            <div className="absolute bottom-8 right-7 -rotate-6 rounded-2xl bg-white/80 px-4 py-3 text-right text-lg font-medium italic leading-6 text-[#4f6f8d] shadow-sm backdrop-blur-sm">Samen voor<br />een schonere<br />omgeving ✨</div>
          </aside>
        </div>
      </section>
    </div>
  </main>;
}
