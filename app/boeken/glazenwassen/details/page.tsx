"use client";

import { useEffect, useState } from "react";

type Reiniging = "buiten" | "binnen-buiten" | "binnen";

type Gegevens = {
  woningtype: string;
  verdiepingen: string[];
  ramen: number;
  ramenVoorkant?: number;
  ramenAchterkant?: number;
  ramenZijkant?: number;
  glasOppervlak: string;
  binnenGlasOppervlak?: string;
  telescoop: boolean;
  type: string;
  frequentie: string;
  appartementToegang?: "balkon" | "buiten";
  binnenkant?: boolean;
  alleenBinnen?: boolean;
  achterkant?: boolean;
  obstakelVoorRamen?: boolean;
};

const keuzes: Record<string, Gegevens> = {
  woning: { woningtype: "", verdiepingen: ["1"], ramen: 0, ramenVoorkant: 0, ramenAchterkant: 0, ramenZijkant: 0, glasOppervlak: "", telescoop: false, type: "buiten", frequentie: "eenmalig" },
  appartement: { woningtype: "appartement", verdiepingen: [], ramen: 0, ramenVoorkant: 0, ramenAchterkant: 0, ramenZijkant: 0, glasOppervlak: "", telescoop: false, type: "buiten", frequentie: "eenmalig", appartementToegang: undefined },
  bedrijf: { woningtype: "bedrijfspand", verdiepingen: ["1"], ramen: 0, glasOppervlak: "", binnenGlasOppervlak: "", telescoop: false, type: "bedrijf", frequentie: "eenmalig" },
  telewash: { woningtype: "tussenwoning", verdiepingen: ["1"], ramen: 0, ramenVoorkant: 0, ramenAchterkant: 0, ramenZijkant: 0, glasOppervlak: "", telescoop: true, type: "telewash", frequentie: "eenmalig" },
};

export default function DetailsPage() {
  const [gegevens, setGegevens] = useState<Gegevens | null>(null);
  const [woningtype, setWoningtype] = useState("");
  const [ramenVoorkant, setRamenVoorkant] = useState(0);
  const [ramenAchterkant, setRamenAchterkant] = useState(0);
  const [ramenZijkant, setRamenZijkant] = useState(0);
  const [verdiepingen, setVerdiepingen] = useState<string[]>(["1"]);
  const [glasOppervlak, setGlasOppervlak] = useState("");
  const [binnenGlasOppervlak, setBinnenGlasOppervlak] = useState("");
  const [telescoop, setTelescoop] = useState(false);
  const [kozijnen, setKozijnen] = useState(false);
  const [frequentie, setFrequentie] = useState("eenmalig");
  const [appartementToegang, setAppartementToegang] = useState<"balkon" | "buiten" | "">("");
  const [reiniging, setReiniging] = useState<Reiniging>("buiten");
  const [obstakelVoorRamen, setObstakelVoorRamen] = useState(false);

  const ramen = ramenVoorkant + ramenAchterkant + ramenZijkant;

  useEffect(() => {
    const type = new URLSearchParams(window.location.search).get("type") || "";
    const keuze = keuzes[type];
    const opgeslagen = localStorage.getItem("shinegoGlazenwassen");
    const data: Gegevens | null = keuze || (opgeslagen ? JSON.parse(opgeslagen) : null);
    if (!data) { window.location.href = "/#diensten"; return; }
    if (keuze) {
      localStorage.setItem("shinegoGlazenwassen", JSON.stringify(keuze));
      localStorage.removeItem("shinegoGlazenwassenDetails");
      localStorage.removeItem("shinegoPrijs");
      localStorage.removeItem("shinegoKlantGegevens");
      localStorage.removeItem("shinegoLaatsteBoekingId");
    }
    setGegevens(data);
    setWoningtype(data.woningtype || "");
    const heeftNieuweVerdeling = data.ramenVoorkant !== undefined || data.ramenAchterkant !== undefined || data.ramenZijkant !== undefined;
    setRamenVoorkant(heeftNieuweVerdeling ? data.ramenVoorkant || 0 : data.ramen || 0);
    setRamenAchterkant(heeftNieuweVerdeling ? data.ramenAchterkant || 0 : data.achterkant ? data.ramen || 0 : 0);
    setRamenZijkant(heeftNieuweVerdeling ? data.ramenZijkant || 0 : 0);
    setVerdiepingen(data.verdiepingen?.length ? data.verdiepingen : data.woningtype === "appartement" ? [] : ["1"]);
    setGlasOppervlak(data.glasOppervlak || "");
    setBinnenGlasOppervlak(data.binnenGlasOppervlak || "");
    setTelescoop(Boolean(data.telescoop) || Boolean(data.verdiepingen?.includes("4")) || Boolean(data.obstakelVoorRamen));
    if (data.type === "telewash") {
      setTelescoop(true);
      setKozijnen(true);
    }
    setFrequentie(data.frequentie || "eenmalig");
    setAppartementToegang(data.appartementToegang || "");
    setObstakelVoorRamen(Boolean(data.obstakelVoorRamen));
    if (data.alleenBinnen || data.type === "binnen") setReiniging("binnen");
    else if (data.binnenkant) setReiniging("binnen-buiten");
  }, []);

  const bedrijf = gegevens?.woningtype === "bedrijfspand";
  const appartement = gegevens?.woningtype === "appartement";
  const telewash = gegevens?.type === "telewash";
  const woning = gegevens?.type === "buiten" && !appartement;
  const alleenBinnen = reiniging === "binnen";
  const appartementBuiten = appartement && appartementToegang === "buiten" && !alleenBinnen;
  const appartementVerdieping = verdiepingen[0] || "";
  const appartementTelescoopVerplicht = appartementBuiten && ["2", "3", "4"].includes(appartementVerdieping);
  const derdeVerdiepingVerplicht = !alleenBinnen && verdiepingen.includes("4");
  const telescoopVerplicht = telewash || derdeVerdiepingVerplicht || appartementTelescoopVerplicht || (!alleenBinnen && obstakelVoorRamen);

  const kanVerder = Boolean(gegevens) &&
    (!woning || woningtype !== "") &&
    (bedrijf
      ? (alleenBinnen || glasOppervlak !== "") && (reiniging === "buiten" || binnenGlasOppervlak !== "")
      : appartement
        ? ramen > 0 && (alleenBinnen || (appartementToegang !== "" && (appartementToegang === "balkon" || verdiepingen.length === 1)))
        : ramen > 0 && (alleenBinnen || verdiepingen.length > 0));

  function kiesReiniging(keuze: Reiniging) {
    setReiniging(keuze);
    if (keuze === "binnen") {
      setTelescoop(false);
      return;
    }
    if (telewash || verdiepingen.includes("4") || appartementTelescoopVerplicht || obstakelVoorRamen) setTelescoop(true);
  }

  function kiesObstakel(waarde: boolean) {
    setObstakelVoorRamen(waarde);
    if (waarde && !alleenBinnen) {
      setTelescoop(true);
      return;
    }
    if (!waarde && !telewash && !derdeVerdiepingVerplicht && !appartementTelescoopVerplicht) setTelescoop(false);
  }

  function toggleVerdieping(v: string) {
    setVerdiepingen((vorige) => {
      const nieuw = vorige.includes(v) ? vorige.filter((x) => x !== v) : [...vorige, v];
      if (!alleenBinnen && v === "4" && !vorige.includes("4")) setTelescoop(true);
      if (!alleenBinnen && v === "4" && vorige.includes("4") && nieuw.length > 0 && !obstakelVoorRamen) setTelescoop(false);
      return nieuw;
    });
  }

  function kiesAppartementToegang(keuze: "balkon" | "buiten") {
    setAppartementToegang(keuze);
    setVerdiepingen([]);
    if (!alleenBinnen && !obstakelVoorRamen) setTelescoop(false);
  }

  function kiesAppartementVerdieping(v: string) {
    setVerdiepingen([v]);
    if (!alleenBinnen) setTelescoop(["2", "3", "4"].includes(v) || obstakelVoorRamen);
  }

  function raamTeller(label: string, aantal: number, setAantal: (waarde: number) => void) {
    return <div className="flex items-center justify-between rounded-xl border border-[#dcecf8] bg-[#fbfdff] px-4 py-3"><div className="text-sm font-bold text-[#123c70]">{label}</div><div className="flex items-center gap-3"><button type="button" onClick={()=>setAantal(Math.max(0,aantal-1))} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef7ff] text-lg text-[#4b7197]">−</button><div className="min-w-7 text-center text-xl font-extrabold text-[#0b3d75]">{aantal}</div><button type="button" onClick={()=>setAantal(aantal+1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef7ff] text-lg font-bold text-[#1683f8]">+</button></div></div>;
  }

  function gaVerder() {
    if (!gegevens || !kanVerder) return;
    const bijgewerkt: Gegevens = {
      ...gegevens,
      woningtype: woning ? woningtype : gegevens.woningtype,
      ramen,
      ramenVoorkant,
      ramenAchterkant,
      ramenZijkant,
      verdiepingen: appartement && appartementToegang === "balkon" ? [] : verdiepingen,
      glasOppervlak: bedrijf && alleenBinnen ? "" : glasOppervlak,
      binnenGlasOppervlak: bedrijf && reiniging !== "buiten" ? binnenGlasOppervlak : undefined,
      telescoop: alleenBinnen ? false : telescoop,
      frequentie,
      appartementToegang: appartement ? appartementToegang || undefined : undefined,
      binnenkant: reiniging === "binnen-buiten",
      alleenBinnen,
      achterkant: ramenAchterkant > 0,
      obstakelVoorRamen: alleenBinnen ? false : obstakelVoorRamen,
    };
    localStorage.setItem("shinegoGlazenwassen", JSON.stringify(bijgewerkt));
    localStorage.setItem("shinegoGlazenwassenDetails", JSON.stringify({ bereikbaar: "ja", kozijnen, opmerking: "" }));
    if (bedrijf && ((!alleenBinnen && glasOppervlak === "500+") || (reiniging !== "buiten" && binnenGlasOppervlak === "500+"))) { window.location.href = "/contact?offerte=500plus"; return; }
    window.location.href = "/boeken/glazenwassen/prijs";
  }

  const stappen = ["Keuze", "Details", "Prijs", "Gegevens", "Bevestigen"];

  return <main className="min-h-screen bg-[linear-gradient(180deg,#eaf7ff_0%,#f8fcff_55%,#eef8ff_100%)] text-[#123c70]">
    <div className="mx-auto w-full max-w-[1040px] px-5 pb-10 pt-5 sm:px-8 lg:px-6 lg:pb-14 lg:pt-7">
      <header className="flex items-center justify-between"><a href="/" className="text-[27px] font-extrabold tracking-[-.045em] text-[#0b3d74] lg:text-[39px]">Shine<span className="text-[#1687f7]">Go</span><span className="ml-[2px] align-top text-[14px] text-[#1687f7] lg:text-[19px]">✦</span></a><a href="/" aria-label="Menu" className="text-[22px] font-bold text-[#1687f7] lg:text-[30px]">≡</a></header>
      <div className="mx-auto mt-2 grid max-w-[860px] grid-cols-5 lg:mt-5">{stappen.map((stap,index)=>{const actief=index===1; const klaar=index<1; return <div key={stap} className="text-center"><div className="flex items-center"><span className={`h-px flex-1 ${index===0?"bg-transparent":klaar||actief?"bg-[#8fc2e8]":"bg-[#bad9ee]"}`}/><span className={`flex h-6 w-6 items-center justify-center rounded-full border text-[9px] font-bold lg:h-10 lg:w-10 lg:text-[13px] ${actief?"border-[#1687f7] bg-[#1687f7] text-white":klaar?"border-[#8fc2e8] bg-[#edf8ff] text-[#1687f7]":"border-[#a9cee8] bg-[#edf8ff] text-[#5f7f9a]"}`}>{index+1}</span><span className={`h-px flex-1 ${index===4?"bg-transparent":klaar?"bg-[#8fc2e8]":"bg-[#bad9ee]"}`}/></div><div className={`mt-1 text-[8px] lg:text-[12px] ${actief?"font-bold text-[#1687f7]":"text-[#6786a0]"}`}>{stap}</div></div>})}</div>
      <section className="mx-auto mt-5 max-w-[860px] rounded-[24px] border border-[#d5e9f8] bg-white/95 px-5 py-6 shadow-[0_12px_35px_rgba(44,95,135,.08)] sm:px-7 sm:py-7 lg:mt-7 lg:px-9 lg:py-8">
        <h1 className="text-[30px] font-extrabold leading-tight tracking-[-.035em] text-[#0b3d75] sm:text-[38px]">Jouw situatie</h1><p className="mt-1 text-sm font-medium text-[#537797] sm:text-base">Geef aan wat van toepassing is.</p>
        {!gegevens?<p className="mt-8 text-[#6d89a4]">Gegevens laden...</p>:<>
          {bedrijf?<div className="mt-6 space-y-5">
            <div className="border-b border-[#dcecf8] pb-5"><div className="text-sm font-extrabold text-[#123c70]">Wat wil je laten reinigen?</div><div className="mt-3 grid gap-2 sm:grid-cols-3">{[["buiten","Alleen buiten"],["binnen-buiten","Binnen + buiten"],["binnen","Alleen binnen"]].map(([waarde,label])=><button key={waarde} type="button" onClick={()=>kiesReiniging(waarde as Reiniging)} className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${reiniging===waarde?"border-[#1683f8] bg-[#eaf6ff] text-[#0f66b6]":"border-[#cfe3f4] bg-white text-[#5f7e9c]"}`}>{label}</button>)}</div></div>
            {!alleenBinnen&&<div><label className="text-sm font-extrabold text-[#123c70]">Hoeveel m² glas buiten?</label><div className="mt-3 grid gap-2 sm:grid-cols-2">{[["0-15","Tot 15 m²"],["16-30","16 - 30 m²"],["31-50","31 - 50 m²"],["51-100","51 - 100 m²"],["101-200","101 - 200 m²"],["201-500","201 - 500 m²"],["500+","Meer dan 500 m²"]].map(([waarde,label])=><button key={waarde} type="button" onClick={()=>setGlasOppervlak(waarde)} className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${glasOppervlak===waarde?"border-[#1683f8] bg-[#eaf6ff] text-[#0f66b6]":"border-[#cfe3f4] bg-white text-[#4f708f]"}`}>{label}</button>)}</div></div>}
            {reiniging!=="buiten"&&<div><label className="text-sm font-extrabold text-[#123c70]">Hoeveel m² glas binnen?</label><div className="mt-3 grid gap-2 sm:grid-cols-2">{[["0-15","Tot 15 m²"],["16-30","16 - 30 m²"],["31-50","31 - 50 m²"],["51-100","51 - 100 m²"],["101-200","101 - 200 m²"],["201-500","201 - 500 m²"],["500+","Meer dan 500 m²"]].map(([waarde,label])=><button key={waarde} type="button" onClick={()=>setBinnenGlasOppervlak(waarde)} className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${binnenGlasOppervlak===waarde?"border-[#1683f8] bg-[#eaf6ff] text-[#0f66b6]":"border-[#cfe3f4] bg-white text-[#4f708f]"}`}>{label}</button>)}</div><div className="mt-2 text-xs font-semibold text-[#537797]">De binnenzijde wordt apart berekend. Telescoopsteel telt alleen voor de buitenzijde.</div></div>}
          </div>:<>
            {woning&&<div className="mt-6 border-b border-[#dcecf8] pb-5"><div className="text-sm font-extrabold text-[#123c70]">Type woning</div><div className="mt-3 flex flex-wrap gap-2">{[["Rijtjeshuis","Rijtjeshuis"],["Twee-onder-een-kap","Twee-onder-een-kap"],["Vrijstaande woning","Vrijstaande woning"],["Villa","Villa"]].map(([waarde,label])=><button key={waarde} type="button" onClick={()=>setWoningtype(waarde)} className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${woningtype===waarde?"border-[#1683f8] bg-[#eaf6ff] text-[#0f66b6]":"border-[#cfe3f4] bg-white text-[#5f7e9c]"}`}>{label}</button>)}</div></div>}

            {!telewash&&<div className="mt-5 border-b border-[#dcecf8] pb-5"><div className="text-sm font-extrabold text-[#123c70]">Welke zijde wil je laten reinigen?</div><div className="mt-3 grid gap-2 sm:grid-cols-3">{[["buiten","Alleen buiten"],["binnen-buiten","Binnen + buiten"],["binnen","Alleen binnen"]].map(([waarde,label])=><button key={waarde} type="button" onClick={()=>kiesReiniging(waarde as Reiniging)} className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${reiniging===waarde?"border-[#1683f8] bg-[#eaf6ff] text-[#0f66b6]":"border-[#cfe3f4] bg-white text-[#5f7e9c]"}`}>{label}</button>)}</div>{alleenBinnen&&<div className="mt-2 text-xs font-semibold text-[#537797]">Bij alleen binnen geldt €15 starttoeslag. Hoogte en telescoopsteel tellen niet mee.</div>}</div>}

            {!alleenBinnen&&<div className="mt-5 border-b border-[#dcecf8] pb-5"><div className="text-sm font-extrabold text-[#123c70]">Zit er een serre, uitbouw of schuin dak vóór de ramen?</div><div className="mt-1 text-xs text-[#6d89a4]">Bij ja wordt telescoopsteel automatisch ingeschakeld.</div><div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={()=>kiesObstakel(false)} className={`rounded-xl border px-4 py-3 text-sm font-semibold ${!obstakelVoorRamen?"border-[#1683f8] bg-[#eaf6ff] text-[#0f66b6]":"border-[#cfe3f4] bg-white text-[#5f7e9c]"}`}>Nee</button><button type="button" onClick={()=>kiesObstakel(true)} className={`rounded-xl border px-4 py-3 text-sm font-semibold ${obstakelVoorRamen?"border-[#1683f8] bg-[#eaf6ff] text-[#0f66b6]":"border-[#cfe3f4] bg-white text-[#5f7e9c]"}`}>Ja</button></div></div>}

            {appartement&&!alleenBinnen&&<div className="mt-6 border-b border-[#dcecf8] pb-5"><div className="text-sm font-extrabold text-[#123c70]">Hoe zijn de ramen bereikbaar?</div><div className="mt-1 text-xs text-[#6d89a4]">Kies hoe de buitenzijde van de ramen wordt bereikt.</div><div className="mt-3 grid gap-2 sm:grid-cols-2"><button type="button" onClick={()=>kiesAppartementToegang("balkon")} className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${appartementToegang==="balkon"?"border-[#1683f8] bg-[#eaf6ff] text-[#0f66b6]":"border-[#cfe3f4] bg-white text-[#5f7e9c]"}`}>Vanaf balkon / galerij</button><button type="button" onClick={()=>kiesAppartementToegang("buiten")} className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${appartementToegang==="buiten"?"border-[#1683f8] bg-[#eaf6ff] text-[#0f66b6]":"border-[#cfe3f4] bg-white text-[#5f7e9c]"}`}>Van buitenaf reinigen</button></div></div>}

            <div className="mt-5 border-b border-[#dcecf8] pb-5"><div className="text-sm font-extrabold text-[#123c70]">Aantal ramen per zijde</div><div className="mt-1 text-xs text-[#6d89a4]">Vul per zijde in hoeveel ramen je wilt laten reinigen.</div><div className="mt-3 grid gap-2">{raamTeller("Voorkant", ramenVoorkant, setRamenVoorkant)}{raamTeller("Achterkant", ramenAchterkant, setRamenAchterkant)}{raamTeller("Zijkant", ramenZijkant, setRamenZijkant)}</div><div className="mt-3 flex items-center justify-between rounded-xl bg-[#eef7ff] px-4 py-3"><span className="text-sm font-bold text-[#4f708f]">Totaal aantal ramen</span><strong className="text-xl text-[#0b3d75]">{ramen}</strong></div></div>

            {appartementBuiten&&<div className="border-b border-[#dcecf8] py-5"><div className="text-sm font-extrabold text-[#123c70]">Op welke verdieping ligt het appartement?</div><div className="mt-1 text-xs text-[#6d89a4]">Kies één verdieping. Boven de 3e verdieping kan niet via de standaard boekingsflow.</div><div className="mt-3 flex flex-wrap gap-2">{[["1","Begane grond"],["2","1e verdieping"],["3","2e verdieping"],["4","3e verdieping"]].map(([waarde,label])=><button key={waarde} type="button" onClick={()=>kiesAppartementVerdieping(waarde)} className={`min-w-24 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${verdiepingen.includes(waarde)?"border-[#1683f8] bg-[#1683f8] text-white":"border-[#cfe3f4] bg-white text-[#5f7e9c]"}`}>{label}</button>)}</div>{appartementVerdieping&&["2","3","4"].includes(appartementVerdieping)&&<div className="mt-2 text-xs font-semibold text-[#537797]">Vanaf de 1e verdieping is telescoopsteel automatisch ingeschakeld.</div>}{appartementVerdieping==="4"&&<div className="mt-1 text-xs font-semibold text-[#537797]">Bij de 3e verdieping geldt een hoogtetoeslag van €15.</div>}</div>}

            {!appartement&&!alleenBinnen&&<div className="border-b border-[#dcecf8] py-5"><div className="text-sm font-extrabold text-[#123c70]">Verdiepingen met ramen</div><div className="mt-1 text-xs text-[#6d89a4]">Je kunt meerdere verdiepingen kiezen.</div><div className="mt-3 flex flex-wrap gap-2">{[["1","Begane grond"],["2","1e verdieping"],["3","2e verdieping"],["4","3e verdieping"]].map(([waarde,label])=><button key={waarde} type="button" onClick={()=>toggleVerdieping(waarde)} className={`min-w-24 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${verdiepingen.includes(waarde)?"border-[#1683f8] bg-[#1683f8] text-white":"border-[#cfe3f4] bg-white text-[#5f7e9c]"}`}>{label}</button>)}</div>{verdiepingen.includes("4")&&<div className="mt-2 text-xs font-semibold text-[#537797]">Bij ramen op de 3e verdieping is telescoopsteel automatisch ingeschakeld en geldt een hoogtetoeslag van €15.</div>}</div>}
          </>}
          <div className="mt-5 divide-y divide-[#e5f0f8] rounded-2xl border border-[#dcecf8] bg-[#fbfdff] px-4">
            {!alleenBinnen&&<button type="button" disabled={telescoopVerplicht} onClick={()=>setTelescoop(!telescoop)} className={`flex w-full items-center justify-between py-4 text-left ${telescoopVerplicht?"cursor-not-allowed":""}`}><div><div className="text-sm font-extrabold text-[#123c70]">Telescoopsteel nodig?</div><div className="text-xs text-[#6d89a4]">{obstakelVoorRamen?"Verplicht door serre, uitbouw of schuin dak":telewash?"Standaard bij Telewash":appartementTelescoopVerplicht?"Verplicht bij reinigen van buitenaf op deze verdieping":derdeVerdiepingVerplicht?"Verplicht bij de 3e verdieping":"Voor moeilijk bereikbare ramen"}</div></div><span className={`relative h-7 w-12 rounded-full ${telescoop?"bg-[#1683f8]":"bg-[#d5e5f2]"}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow ${telescoop?"left-6":"left-1"}`}/></span></button>}
            <button type="button" disabled={telewash} onClick={()=>setKozijnen(!kozijnen)} className={`flex w-full items-center justify-between py-4 text-left ${telewash?"cursor-not-allowed":""}`}><div><div className="text-sm font-extrabold text-[#123c70]">Kozijnen schoonmaken?</div><div className="text-xs text-[#6d89a4]">{telewash?"Automatisch geselecteerd bij Telewash":"Binnen- en/of buitenkozijnen"}</div></div><span className={`relative h-7 w-12 rounded-full ${kozijnen?"bg-[#1683f8]":"bg-[#d5e5f2]"}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow ${kozijnen?"left-6":"left-1"}`}/></span></button>
          </div>
          <div className="mt-5 border-t border-[#dcecf8] pt-5"><div className="text-sm font-extrabold text-[#123c70]">Hoe vaak?</div><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{[["eenmalig","Eenmalig"],["4weken","4 weken"],["8weken","8 weken"],["12weken","12 weken"]].map(([id,label])=><button key={id} type="button" onClick={()=>setFrequentie(id)} className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition ${frequentie===id?"border-[#1683f8] bg-[#eaf6ff] text-[#0f66b6]":"border-[#cfe3f4] bg-white text-[#5f7e9c]"}`}>{label}</button>)}</div></div>
        </>}
        <div className="mt-7 flex items-center justify-between border-t border-[#dcecf8] pt-5"><a href="/#diensten" className="px-2 py-3 text-sm font-bold text-[#537797]">← Terug</a><button type="button" disabled={!kanVerder} onClick={gaVerder} className={`min-w-44 rounded-xl px-7 py-3.5 text-sm font-extrabold text-white ${kanVerder?"bg-[#1683f8] shadow-[0_8px_20px_rgba(22,131,248,.18)]":"cursor-not-allowed bg-[#bfd3e5]"}`}>Verder →</button></div>
      </section>
    </div>
  </main>;
}