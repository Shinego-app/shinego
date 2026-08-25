"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Boeking = {
  id: string | number;
  created_at?: string;
  voornaam?: string;
  achternaam?: string;
  email?: string;
  telefoon?: string;
  postcode?: string;
  huisnummer?: string;
  straat?: string;
  plaats?: string;
  totaalprijs?: number;
  status?: string;
  annuleringsreden?: string;
  annuleringskosten?: number;
  betaald?: boolean;
  uitbetaald?: boolean;
  professional_vergoeding?: number;
  geannuleerd_door?: string;
  klant_niet_thuis?: boolean;
  vergoeding_goedgekeurd?: boolean;
  niet_thuis_bewijs?: string;
  professional_id?: string;
  geannuleerde_professional_id?: string;
  telescoop?: boolean;
  woningtype?: string;
  aantal_ramen?: number;
  verdiepingen?: string[];
  thuis_nodig?: string;
  gewenste_datum?: string;
  gewenste_tijd?: string;
  kozijnen_toeslag?: number
  bereikbaar?: string;
  kozijnen?: boolean;
};

type Professional = {
  id: string | number;
  created_at?: string;
  bedrijfsnaam?: string;
  voornaam?: string;
  achternaam?: string;
  email?: string;
  telefoon?: string;
  postcode?: string;
  woonplaats?: string;
  actief?: boolean;
  geverifieerd?: boolean;
};

export default function AdminPage() {
  const [boekingen, setBoekingen] = useState<Boeking[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [laden, setLaden] = useState(true);
  const [fout, setFout] = useState("");

  useEffect(() => {
    gegevensLaden();
  }, []);

 async function gegevensLaden() {
  setLaden(true);
  setFout("");

  try {
    const response = await fetch("/api/admin", {
      method: "GET",
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Gegevens konden niet worden geladen.");
    }

    setBoekingen(data.boekingen || []);
    setProfessionals(data.professionals || []);
  } catch (error) {
    console.error("Fout bij laden admin gegevens:", error);

    setFout(
      error instanceof Error
        ? error.message
        : "Gegevens konden niet worden geladen."
    );
  } finally {
    setLaden(false);
  }
}

  const actieveProfessionals = professionals.filter(
    (professional) => professional.actief === true
  ).length;

  const geverifieerdeProfessionals = professionals.filter(
    (professional) => professional.geverifieerd === true
  ).length;

  function datumTonen(datum?: string) {
    if (!datum) return "-";

    return new Date(datum).toLocaleString("nl-NL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function volledigeNaam(
    voornaam?: string,
    achternaam?: string
  ) {
    const naam = `${voornaam || ""} ${achternaam || ""}`.trim();

    return naam || "-";
  }
async function professionalKoppelen(
  booking_id: string | number,
  professional_id: string | number
) {
  setFout("");

  try {
    const response = await fetch("/api/admin", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        booking_id,
        professional_id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Professional kon niet aan de boeking worden gekoppeld."
      );
    }

    setTimeout(() => window.scrollTo(0, scrollY), 150);
await gegevensLaden();
requestAnimationFrame(() => window.scrollTo(0, scrollY));
  } catch (error) {
    console.error("Fout bij koppelen professional:", error);

    setFout(
      error instanceof Error
        ? error.message
        : "Professional kon niet aan de boeking worden gekoppeld."
    );
  }
}
async function bookingStatusBijwerken(
  booking_id: string | number,
  booking_status: string,
  annuleringsreden?: string,
  annuleringskosten?: number,
  
  geannuleerd_door?: string,
  klant_niet_thuis?: boolean,
  niet_thuis_bewijs?: string,
  geannuleerde_professional_id?: string,
  professional_vergoeding?: number,
  vergoeding_goedgekeurd?: boolean,
  uitbetaald?:boolean,
  uitbetaald_bedrag?: number,
) {
setFout("");
try {
 const response = await fetch("/api/admin", {   
 method: "PATCH",
 headers: {
 "Content-Type": "application/json",
 },
 body: JSON.stringify({
 booking_id,
 booking_status,
 annuleringsreden,
 annuleringskosten,
 professional_vergoeding,
 vergoeding_goedgekeurd,
 geannuleerd_door,
 klant_niet_thuis,
 niet_thuis_bewijs,
 geannuleerde_professional_id,
 uitbetaald,
 uitbetaald_bedrag,
 }),
 });
 if (!response.ok) {
  const data = await response.json();
  throw new Error(data.details || data.error || "Boekingstatus bijwerken mislukt");
}

await gegevensLaden();
} catch (error) {
  const melding = error instanceof Error ? error.message : "Boekingstatus bijwerken mislukt";
  console.error("Fout bij boekingstatus bijwerken:", error);
  setFout(melding);

 }
}       
  async function professionalBijwerken(
  id: string | number,
  geverifieerd: boolean,
  actief: boolean
) {
  setFout("");

  try {
    const response = await fetch("/api/admin", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        geverifieerd,
        actief,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Professional kon niet worden bijgewerkt."
      );
    }

    await gegevensLaden();
  } catch (error) {
    console.error("Fout bij bijwerken professional:", error);

    setFout(
      error instanceof Error
        ? error.message
        : "Professional kon niet worden bijgewerkt."
    );
  }
}
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              ShineGo
            </div>

            <div className="text-sm text-gray-500">
              Beheeromgeving
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={gegevensLaden}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Vernieuwen
            </button>

            <a
              href="/"
              className="text-sm font-semibold text-gray-600 hover:text-gray-900"
            >
              Naar website →
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ShineGo beheer
          </h1>

          <p className="mt-2 text-gray-600">
            Overzicht van boekingen en professionals.
          </p>
        </div>

        {fout && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {fout}
          </div>
        )}

        {laden ? (
          <div className="rounded-2xl border bg-white p-8 text-center text-gray-500 shadow-sm">
            Gegevens worden geladen...
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="text-sm font-medium text-gray-500">
                  Boekingen
                </div>

                <div className="mt-2 text-3xl font-bold text-gray-900">
                  {boekingen.length}
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="text-sm font-medium text-gray-500">
                  Professionals
                </div>

                <div className="mt-2 text-3xl font-bold text-gray-900">
                  {professionals.length}
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="text-sm font-medium text-gray-500">
                  Actief
                </div>

                <div className="mt-2 text-3xl font-bold text-green-600">
                  {actieveProfessionals}
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="text-sm font-medium text-gray-500">
                  Geverifieerd
                </div>

                <div className="mt-2 text-3xl font-bold text-blue-600">
                  {geverifieerdeProfessionals}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Recente boekingen
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Nieuwste boekingen staan bovenaan.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="px-5 py-4 font-semibold text-gray-700">
                        Datum
                      </th>

                      <th className="px-5 py-4 font-semibold text-gray-700">
                        Klant
                      </th>

                      <th className="px-5 py-4 font-semibold text-gray-700">
                        Contact
                      </th>

                      <th className="px-5 py-4 font-semibold text-gray-700">
                        Adres
                      </th>

                      <th className="px-5 py-4 font-semibold text-gray-700">
                        Prijs
                      </th>

                      <th className="px-5 py-4 font-semibold text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {boekingen.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-5 py-8 text-center text-gray-500"
                        >
                          Nog geen boekingen gevonden.
                        </td>
                      </tr>
                    ) : (
                      boekingen.slice(0, 20).map((boeking) => (
                        <tr
                          key={boeking.id}
                          className="hover:bg-gray-50"
                        >
                          <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                            {datumTonen(boeking.created_at)}
                            
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-900">
                            {volledigeNaam(
                              boeking.voornaam,
                              boeking.achternaam
                            )}
                          </td>

                          <td className="px-5 py-4 text-gray-600">
                            <div>{boeking.email || "-"}</div>
                            <div>{boeking.telefoon || "-"}</div>
                          </td>

                          <td className="px-5 py-4 text-gray-600">
                            <div>
                              {boeking.straat || "-"}{" "}
                              {boeking.huisnummer || ""}
                            </div>

                            <div>
                              {boeking.postcode || ""}{" "}
                              {boeking.plaats || ""}
                            </div>
                            <div>Woningtype: {boeking.woningtype || "-"}</div>
                            <div>Telescoop: {boeking.telescoop ? "ja" : "nee"}</div>
                          <div>Aantal ramen: {boeking.aantal_ramen ??"-"}</div>
                          <div>Verdiepingen: {boeking.verdiepingen?.length ? boeking.verdiepingen.join(",") : "-"}</div>
                          <div>Bereikbaarheid: {boeking.bereikbaar || "-"}</div>
                          <div>kozijnen schoonmaken: {boeking.kozijnen ? "ja" : "nee"}</div>
                          <div>Gewenste datum: {boeking.gewenste_datum || "-"}</div>
                          <div>Gewenste tijd: {boeking.gewenste_tijd || "-"}</div>
                          <div>Thuis nodig: {boeking.thuis_nodig || "-"}</div>
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-900">
                          
                            {typeof boeking.totaalprijs === "number"
                              ? `€${boeking.totaalprijs.toFixed(2).replace(".", ",")}`
                              : "-"}
                         <div>kozijnen toeslag:{boeking.kozijnen ? "ja" : "nee"}</div> 
                         <div>kozijnen toeslag prijs: €{boeking.kozijnen ? Number(boeking.kozijnen_toeslag ?? 0) .toFixed(2).replace(".", ",") : "0,00"}</div></td>

                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                              {boeking.status || "Nieuw"}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <button
                            type="button"
                            disabled={boeking.status === "geannuleerd"}
                           onClick={() => {
                            const afspraakMoment = new Date(`${boeking.gewenste_datum}T${boeking.gewenste_tijd}`);
                            const reden = window.prompt("Reden van annulering:");
                            if (reden === null) return;
                            const urenTotAfspraak = (afspraakMoment.getTime() - Date.now()) / (1000 * 60 * 60);
                           bookingStatusBijwerken(boeking.id, "geannuleerd", reden, urenTotAfspraak <= 24 ? Number(boeking.totaalprijs || 0) * 0.3 : 0,"shinego"); 
                           }}
                           className="w-36 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white disabled:-50"
                           >Annuleren</button>
                           <button
  type="button"
  disabled={boeking.status === "geannuleerd" || !boeking.professional_id}
  onClick={() => {
  const reden = window.prompt("Reden annulering door professional:");
  if (reden === null) return;
  bookingStatusBijwerken(boeking.id, "nieuw", reden, 0, "professional", false, undefined, boeking.professional_id);
}}
  className="w-36 rounded-lg bg-orange-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
>
  Professional annuleert
</button> 
 <button
  type="button"
  disabled={boeking.status === "geannuleerd" || !boeking.professional_id}
  onClick={() => {
    const bewijs = window.prompt("Bewijs dat de klant niet thuis was:");
    if (bewijs === null || bewijs.trim() === "") return;
 bookingStatusBijwerken(boeking.id, "geannuleerd", "Klant niet thuis", Number(boeking.totaalprijs || 0) * 0.30, "professional", true, bewijs, boeking.professional_id);
  }}
  className="w-36 rounded-lg bg-yellow-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
>
  Klant niet thuis
</button> 
{boeking.status === "toegewezen" && (
  <button
    type="button"
    onClick={() => bookingStatusBijwerken(boeking.id, "afgerond")}
    className="w-36 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white"
  >
    Afronden
  </button>
)}
{boeking.betaald === true && boeking.uitbetaald !== true && boeking.professional_id && boeking.status === "afgerond" && (
  <button
    type="button"
    onClick={async () => {
  try {
    const response = await fetch("/api/stripe-payout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        booking_id: boeking.id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Uitbetaling mislukt.");
    }

    await gegevensLaden();
  } catch (error) {
    const melding =
      error instanceof Error ? error.message : "Uitbetaling mislukt.";

    setFout(melding);
  }
}}
    className="mt-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
  >
    Uitbetalen
  </button>
)}
{boeking.klant_niet_thuis && boeking.niet_thuis_bewijs && !boeking.vergoeding_goedgekeurd && (
  <button
    type="button"
    onClick={() =>
      bookingStatusBijwerken(
        boeking.id,
        boeking.status || "geannuleerd",
        boeking.annuleringsreden,
        boeking.annuleringskosten,
        boeking.geannuleerd_door,
        boeking.klant_niet_thuis,
        boeking.niet_thuis_bewijs,
        boeking.geannuleerde_professional_id,
        boeking.professional_vergoeding,
        true
      )
    }
    className="w-36 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white"
  >
    Bewijs goedkeuren
  </button>
  
)}
  
                       
  </td>
                        <td className="px-5 py-4 text-gray-900">
                          {boeking.annuleringsreden && (
                          <div>Annuleringsreden: {boeking.annuleringsreden}</div>
                          )}
                         {boeking.annuleringskosten !== undefined && (
  <div>Annuleringskosten: €{Number(boeking.annuleringskosten).toFixed(2).replace(".", ",")}</div>
)}
<div>Betaald: {boeking.betaald ? "Ja" : "Nee"}</div>
  
   
  <select
    defaultValue={boeking.professional_id ||""}
    disabled={boeking.status === "geannuleerd"}
    onChange={(e) => {
      if (e.target.value) {
        professionalKoppelen(boeking.id, e.target.value);
      }
    }}
    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
  >
    <option value="">Kies professional</option>

    {professionals
      .filter(
        (professional) =>
        professional.actief === true && professional.id !== boeking.geannuleerde_professional_id
      )
      .map((professional) => (
        <option
          key={professional.id}
          value={professional.id}
        >
          {professional.bedrijfsnaam ||
            volledigeNaam(
              professional.voornaam,
              professional.achternaam
            )}
        </option>
      ))}
  </select>
</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-12">
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-gray-900">
                  Professionals
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Overzicht van aangemelde ShineGo professionals.
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="px-5 py-4 font-semibold text-gray-700">
                        Datum
                      </th>

                      <th className="px-5 py-4 font-semibold text-gray-700">
                        Bedrijf
                      </th>

                      <th className="px-5 py-4 font-semibold text-gray-700">
                        Naam
                      </th>

                      <th className="px-5 py-4 font-semibold text-gray-700">
                        Contact
                      </th>

                      <th className="px-5 py-4 font-semibold text-gray-700">
                        Werkgebied
                      </th>

                      <th className="px-5 py-4 font-semibold text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {professionals.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-5 py-8 text-center text-gray-500"
                        >
                          Nog geen professionals gevonden.
                        </td>
                      </tr>
                    ) : (
                      professionals.slice(0, 20).map((professional) => (
                        <tr
                          key={professional.id}
                          className="hover:bg-gray-50"
                        >
                          <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                            {datumTonen(professional.created_at)}
                          </td>

                          <td className="px-5 py-4 font-semibold text-gray-900">
                            {professional.bedrijfsnaam || "-"}
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                            {volledigeNaam(
                              professional.voornaam,
                              professional.achternaam
                            )}
                          </td>

                          <td className="px-5 py-4 text-gray-600">
                            <div>{professional.email || "-"}</div>
                            <div>{professional.telefoon || "-"}</div>
                          </td>

                          <td className="px-5 py-4 text-gray-600">
                            <div>{professional.postcode || "-"}</div>
                            <div>{professional.woonplaats || "-"}</div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-2">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  professional.geverifieerd
                                    ? "bg-green-50 text-green-700"
                                    : "bg-yellow-50 text-yellow-700"
                                }`}
                              >
                                {professional.geverifieerd
                                  ? "Geverifieerd"
                                  : "Controle nodig"}
                              </span>

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  professional.actief
                                    ? "bg-blue-50 text-blue-700"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {professional.actief
                                  ? "Actief"
                                  : "Niet actief"}
                              </span>
                              {(!professional.geverifieerd || !professional.actief) && (
  <button
    type="button"
    onClick={() =>
      professionalBijwerken(professional.id, true, true)
    }
    className="rounded-lg bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700"
  >
    Goedkeuren & activeren
  </button>
)}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}