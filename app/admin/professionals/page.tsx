"use client";

import { useEffect, useState } from "react";

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

export default function ProfessionalsBeheerPage() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [laden, setLaden] = useState(true);
  const [fout, setFout] = useState("");
  const [bezigId, setBezigId] = useState<string | number | null>(null);

  async function ladenProfessionals() {
    setLaden(true);
    setFout("");
    try {
      const response = await fetch("/api/admin", { method: "GET", cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Professionals konden niet worden geladen.");
      setProfessionals(data.professionals || []);
    } catch (error) {
      setFout(error instanceof Error ? error.message : "Professionals konden niet worden geladen.");
    } finally {
      setLaden(false);
    }
  }

  useEffect(() => {
    ladenProfessionals();
  }, []);

  async function statusBijwerken(professional: Professional, geverifieerd: boolean, actief: boolean) {
    setBezigId(professional.id);
    setFout("");
    try {
      const response = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: professional.id, geverifieerd, actief }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Status wijzigen mislukt.");
      await ladenProfessionals();
    } catch (error) {
      setFout(error instanceof Error ? error.message : "Status wijzigen mislukt.");
    } finally {
      setBezigId(null);
    }
  }

  async function professionalVerwijderen(professional: Professional) {
    const naam = professional.bedrijfsnaam || `${professional.voornaam || ""} ${professional.achternaam || ""}`.trim() || professional.email || "deze professional";
    const akkoord = window.confirm(`Weet je zeker dat je ${naam} wilt verwijderen? Dit kan alleen als er geen boekingshistorie is.`);
    if (!akkoord) return;

    setBezigId(professional.id);
    setFout("");
    try {
      const response = await fetch("/api/admin/professionals", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ professional_id: professional.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.details || data.error || "Verwijderen mislukt.");
      setProfessionals((huidig) => huidig.filter((item) => item.id !== professional.id));
    } catch (error) {
      setFout(error instanceof Error ? error.message : "Verwijderen mislukt.");
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
            <h1 className="mt-1 text-3xl font-bold text-gray-900">Professionals beheren</h1>
            <p className="mt-2 text-sm text-gray-600">Goedkeuren, activeren, deactiveren en veilig verwijderen op één pagina.</p>
          </div>
          <a href="/admin" className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">← Terug naar boekingen</a>
        </div>

        {fout && <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{fout}</div>}

        {laden ? (
          <div className="rounded-2xl border bg-white p-8 text-center text-gray-500 shadow-sm">Professionals worden geladen...</div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-5 py-4 font-semibold text-gray-700">Bedrijf</th>
                  <th className="px-5 py-4 font-semibold text-gray-700">Naam</th>
                  <th className="px-5 py-4 font-semibold text-gray-700">Contact</th>
                  <th className="px-5 py-4 font-semibold text-gray-700">Plaats</th>
                  <th className="px-5 py-4 font-semibold text-gray-700">Status</th>
                  <th className="px-5 py-4 font-semibold text-gray-700">Acties</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {professionals.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-500">Geen professionals gevonden.</td></tr>
                ) : professionals.map((professional) => (
                  <tr key={professional.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-semibold text-gray-900">{professional.bedrijfsnaam || "-"}</td>
                    <td className="px-5 py-4 text-gray-700">{`${professional.voornaam || ""} ${professional.achternaam || ""}`.trim() || "-"}</td>
                    <td className="px-5 py-4 text-gray-600"><div>{professional.email || "-"}</div><div>{professional.telefoon || "-"}</div></td>
                    <td className="px-5 py-4 text-gray-600">{professional.postcode || "-"} {professional.woonplaats || ""}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${professional.geverifieerd ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>{professional.geverifieerd ? "Geverifieerd" : "Controle nodig"}</span>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${professional.actief ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{professional.actief ? "Actief" : "Niet actief"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {(!professional.geverifieerd || !professional.actief) ? (
                          <button type="button" disabled={bezigId === professional.id} onClick={() => statusBijwerken(professional, true, true)} className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">Goedkeuren & activeren</button>
                        ) : (
                          <button type="button" disabled={bezigId === professional.id} onClick={() => statusBijwerken(professional, true, false)} className="rounded-lg bg-gray-700 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50">Deactiveren</button>
                        )}
                        <button type="button" disabled={bezigId === professional.id} onClick={() => professionalVerwijderen(professional)} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">{bezigId === professional.id ? "Bezig..." : "Verwijderen"}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
