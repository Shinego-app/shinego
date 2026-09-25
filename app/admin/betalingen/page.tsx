"use client";

import { useEffect, useState } from "react";

type Boeking = {
  id: string | number;
  created_at?: string;
  voornaam?: string;
  achternaam?: string;
  email?: string;
  totaalprijs?: number;
  status?: string;
  betaald?: boolean;
  uitbetaald?: boolean;
  professional_id?: string | number | null;
  professional_bedrag?: number;
  annuleringskosten?: number;
  stripe_payment_id?: string | null;
  stripe_transfer_id?: string | null;
  stripe_refund_id?: string | null;
  terugbetaald?: boolean;
  terugbetaald_bedrag?: number;
  klant_niet_thuis?: boolean;
  vergoeding_goedgekeurd?: boolean;
};

function euro(value: unknown) {
  const n = Number(value || 0);
  return `€${n.toFixed(2).replace(".", ",")}`;
}

export default function AdminBetalingenPage() {
  const [boekingen, setBoekingen] = useState<Boeking[]>([]);
  const [laden, setLaden] = useState(true);
  const [bezigId, setBezigId] = useState<string | number | null>(null);
  const [melding, setMelding] = useState("");

  async function ladenBetalingen() {
    setLaden(true);
    setMelding("");
    try {
      const response = await fetch("/api/admin", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Betalingen konden niet worden geladen.");
      setBoekingen((data.boekingen || []).filter((boeking: Boeking) => boeking.betaald === true));
    } catch (error) {
      setMelding(error instanceof Error ? error.message : "Betalingen konden niet worden geladen.");
    } finally {
      setLaden(false);
    }
  }

  useEffect(() => {
    ladenBetalingen();
  }, []);

  async function uitbetalen(bookingId: string | number) {
    if (!window.confirm("Professional nu via Stripe uitbetalen?")) return;
    setBezigId(bookingId);
    setMelding("");
    try {
      const response = await fetch("/api/admin/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: bookingId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Uitbetaling mislukt.");
      setMelding(`Uitbetaling uitgevoerd${data.transfer_id ? ` (${data.transfer_id})` : ""}.`);
      await ladenBetalingen();
    } catch (error) {
      setMelding(error instanceof Error ? error.message : "Uitbetaling mislukt.");
    } finally {
      setBezigId(null);
    }
  }

  async function terugbetalen(boeking: Boeking) {
    const totaal = Number(boeking.totaalprijs || 0);
    const kosten = Math.max(0, Math.min(totaal, Number(boeking.annuleringskosten || 0)));
    const terug = Math.max(0, totaal - kosten);
    if (!window.confirm(`Klant ${euro(terug)} terugbetalen via Stripe? Annuleringskosten: ${euro(kosten)}.`)) return;

    setBezigId(boeking.id);
    setMelding("");
    try {
      const response = await fetch("/api/admin/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: boeking.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Terugbetaling mislukt.");
      setMelding(`Terugbetaling uitgevoerd: ${euro(data.terugbetaald_bedrag)}.`);
      await ladenBetalingen();
    } catch (error) {
      setMelding(error instanceof Error ? error.message : "Terugbetaling mislukt.");
    } finally {
      setBezigId(null);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-blue-600">ShineGo beheer</div>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">Betalingen</h1>
            <p className="mt-2 text-sm text-gray-600">Uitbetalingen worden wekelijks automatisch verwerkt. Gebruik handmatig uitbetalen alleen als noodoptie; klantterugbetalingen blijven handmatig controleerbaar.</p>
          </div>
          <a href="/admin" className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700">← Terug naar boekingen</a>
        </div>

        {melding && <div className="mb-5 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-medium text-blue-800">{melding}</div>}

        {laden ? (
          <div className="rounded-2xl border bg-white p-8 text-center text-gray-500">Betalingen laden...</div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-5 py-4">Boeking</th>
                  <th className="px-5 py-4">Klant</th>
                  <th className="px-5 py-4">Totaal</th>
                  <th className="px-5 py-4">Annuleringskosten</th>
                  <th className="px-5 py-4">Professional</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Acties</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {boekingen.length === 0 ? (
                  <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-500">Geen betaalde boekingen gevonden.</td></tr>
                ) : boekingen.map((boeking) => {
                  const kanUitbetalen = boeking.status === "afgerond" && !!boeking.professional_id && !boeking.uitbetaald;
                  const noShowWachtOpBewijs =
                    boeking.klant_niet_thuis === true &&
                    boeking.vergoeding_goedgekeurd !== true;
                  const kanTerugbetalen =
                    boeking.status === "geannuleerd" &&
                    !boeking.terugbetaald &&
                    !!boeking.stripe_payment_id &&
                    !noShowWachtOpBewijs;
                  const terugBedrag = Math.max(0, Number(boeking.totaalprijs || 0) - Number(boeking.annuleringskosten || 0));

                  return (
                    <tr key={boeking.id} className="align-top">
                      <td className="px-5 py-4 font-semibold text-gray-900">#{boeking.id}</td>
                      <td className="px-5 py-4 text-gray-700"><div>{`${boeking.voornaam || ""} ${boeking.achternaam || ""}`.trim() || "-"}</div><div className="text-xs text-gray-500">{boeking.email || "-"}</div></td>
                      <td className="px-5 py-4 font-semibold">{euro(boeking.totaalprijs)}</td>
                      <td className="px-5 py-4"><div>{euro(boeking.annuleringskosten)}</div>{boeking.status === "geannuleerd" && <div className="mt-1 text-xs text-gray-500">Terug: {euro(terugBedrag)}</div>}</td>
                      <td className="px-5 py-4"><div>{euro(boeking.professional_bedrag)}</div><div className="mt-1 text-xs text-gray-500">{boeking.uitbetaald ? "Uitbetaald" : boeking.professional_id ? "Nog niet uitbetaald" : "Niet toegewezen"}</div></td>
                      <td className="px-5 py-4"><div className="font-medium">{boeking.status || "-"}</div>{boeking.terugbetaald && <div className="mt-1 text-xs font-semibold text-green-700">Terugbetaald {euro(boeking.terugbetaald_bedrag)}</div>}</td>
                      <td className="px-5 py-4">
                        <div className="flex min-w-48 flex-col gap-2">
                          <button type="button" disabled={!kanUitbetalen || bezigId === boeking.id} onClick={() => uitbetalen(boeking.id)} className="rounded-lg bg-blue-600 px-3 py-2 font-semibold text-white disabled:bg-gray-300">Nu uitbetalen (nood)</button>
                          <button type="button" disabled={!kanTerugbetalen || terugBedrag <= 0 || bezigId === boeking.id} onClick={() => terugbetalen(boeking)} className="rounded-lg bg-green-600 px-3 py-2 font-semibold text-white disabled:bg-gray-300">Klant terugbetalen</button>
                          {noShowWachtOpBewijs && (
                            <span className="text-xs font-medium text-amber-700">
                              Keur eerst het no-showbewijs goed in Boekingen.
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
