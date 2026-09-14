"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import BeschikbareOpdrachten from "./BeschikbareOpdrachten";

function toonGeboortedatum(value?: string | null) {
  if (!value) return "";
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return value;
  return `${match[3]}-${match[2]}-${match[1]}`;
}

function maskeerIban(value?: string | null) {
  if (!value) return "Niet ingevuld";
  const schoon = value.replace(/\s/g, "").toUpperCase();
  if (schoon.length < 8) return schoon;
  return `${schoon.slice(0, 4)} •••• •••• ${schoon.slice(-4)}`;
}

export default function ProfessionalDashboardPage() {
  const router = useRouter();
  const [laden, setLaden] = useState(true);
  const [professional, setProfessional] = useState<any>(null);
  const [opdrachten, setOpdrachten] = useState<any[]>([]);
  const [profielBewerken, setProfielBewerken] = useState(false);
  const [profielBezig, setProfielBezig] = useState(false);
  const [profielMelding, setProfielMelding] = useState("");
  const [profielForm, setProfielForm] = useState({
    bedrijfsnaam: "",
    voornaam: "",
    achternaam: "",
    telefoon: "",
    postcode: "",
    woonplaats: "",
    straat: "",
    huisnummer: "",
    toevoeging: "",
    kvk_nummer: "",
    btw_nummer: "",
    werkgebied_km: "25",
    geboortedatum: "",
    iban: "",
  });

  function vulProfielForm(data: any) {
    setProfielForm({
      bedrijfsnaam: data?.bedrijfsnaam || "",
      voornaam: data?.voornaam || "",
      achternaam: data?.achternaam || "",
      telefoon: data?.telefoon || "",
      postcode: data?.postcode || "",
      woonplaats: data?.woonplaats || "",
      straat: data?.straat || "",
      huisnummer: data?.huisnummer || "",
      toevoeging: data?.toevoeging || "",
      kvk_nummer: data?.kvk_nummer || "",
      btw_nummer: data?.btw_nummer || "",
      werkgebied_km: String(data?.werkgebied_km || 25),
      geboortedatum: toonGeboortedatum(data?.stripe_geboortedatum),
      iban: data?.stripe_iban || "",
    });
  }

  async function uitloggen() {
    await supabase.auth.signOut();
    router.push("/professional/login");
  }

  useEffect(() => {
    async function laadProfessional() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLaden(false);
        return;
      }

      let { data } = await supabase
        .from("professionals")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        data = {
          ...data,
          stripe_geboortedatum: user.user_metadata?.stripe_geboortedatum || null,
          stripe_iban: user.user_metadata?.stripe_iban || null,
        };
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (data?.stripe_account_id && token) {
        const statusResponse = await fetch("/api/stripe-connect/status", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (statusResponse.ok) {
          const status = await statusResponse.json();
          data = { ...data, uitbetalingen_actief: status.uitbetalingen_actief };
        }
      }

      if (new URLSearchParams(window.location.search).get("stripe") === "return") {
        window.history.replaceState({}, "", "/professional/dashboard");
      }

      setProfessional(data);
      if (data) vulProfielForm(data);

      if (data) {
        const { data: boekingenData } = await supabase
          .from("boekingen")
          .select("*")
          .eq("professional_id", data.id)
          .order("created_at", { ascending: false });
        setOpdrachten(boekingenData || []);
      }
      setLaden(false);
    }

    laadProfessional();
  }, []);

  async function profielOpslaan() {
    setProfielMelding("");
    setProfielBezig(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) {
      setProfielBezig(false);
      setProfielMelding("Je sessie is verlopen. Log opnieuw in.");
      return;
    }

    const response = await fetch("/api/professional-profiel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profielForm),
    });

    const result = await response.json();
    setProfielBezig(false);

    if (!response.ok || !result.professional) {
      setProfielMelding(result.error || "Gegevens konden niet worden opgeslagen.");
      return;
    }

    const bijgewerkt = {
      ...result.professional,
      stripe_geboortedatum: result.verificatie?.geboortedatum || null,
      stripe_iban: result.verificatie?.iban || null,
    };

    setProfessional(bijgewerkt);
    vulProfielForm(bijgewerkt);
    setProfielBewerken(false);
    setProfielMelding("Gegevens opgeslagen. Je werkgebied wordt direct gebruikt voor nieuwe beschikbare opdrachten.");
  }

  async function startStripeConnect() {
    if (!professional?.email) return;

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) {
      alert("Je sessie is verlopen. Log opnieuw in.");
      return;
    }

    const stripeResponse = await fetch("/api/stripe-connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const stripeData = await stripeResponse.json();
    if (!stripeResponse.ok || !stripeData.account_id) {
      alert(stripeData.error || "Stripe Connect fout");
      return;
    }

    router.push("/professional/dashboard/uitbetalingen");
  }

  if (laden) return <main style={{ padding: "24px" }}>Dashboard laden...</main>;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {professional?.bedrijfsnaam ? `Welkom, ${professional.bedrijfsnaam}` : "Mijn ShineGo"}
        </h1>
        <p className="mt-2 text-gray-600">Beheer hier je opdrachten, planning en verdiensten.</p>
        <button onClick={uitloggen} className="mt-4 rounded-xl border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-900">Uitloggen</button>

        <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Mijn gegevens</h2>
              <p className="mt-1 text-sm text-gray-600">Controleer en wijzig je bedrijfs-, contact-, werkgebied- en uitbetalingsgegevens.</p>
            </div>
            {!profielBewerken && (
              <button onClick={() => { setProfielMelding(""); setProfielBewerken(true); }} className="rounded-xl border border-blue-600 bg-white px-4 py-2 font-semibold text-blue-600">Gegevens wijzigen</button>
            )}
          </div>

          {!profielBewerken ? (
            <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              <p><strong>Bedrijfsnaam:</strong> {professional?.bedrijfsnaam || "-"}</p>
              <p><strong>Naam:</strong> {[professional?.voornaam, professional?.achternaam].filter(Boolean).join(" ") || "-"}</p>
              <p><strong>E-mail:</strong> {professional?.email || "-"}</p>
              <p><strong>Telefoon:</strong> {professional?.telefoon || "-"}</p>
              <p><strong>Adres:</strong> {[professional?.straat, professional?.huisnummer, professional?.toevoeging].filter(Boolean).join(" ") || "-"}</p>
              <p><strong>Postcode / plaats:</strong> {[professional?.postcode, professional?.woonplaats].filter(Boolean).join(" ") || "-"}</p>
              <p><strong>Werkgebied:</strong> {professional?.werkgebied_km ? `${professional.werkgebied_km} km rondom jouw adres` : "Niet ingesteld"}</p>
              <p><strong>KVK:</strong> {professional?.kvk_nummer || "-"}</p>
              <p><strong>BTW:</strong> {professional?.btw_nummer || "Niet ingevuld"}</p>
              <p><strong>Geboortedatum:</strong> {toonGeboortedatum(professional?.stripe_geboortedatum) || "Niet ingevuld"}</p>
              <p><strong>IBAN:</strong> {maskeerIban(professional?.stripe_iban)}</p>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[["Bedrijfsnaam", "bedrijfsnaam"],["Voornaam", "voornaam"],["Achternaam", "achternaam"],["Telefoonnummer", "telefoon"],["Postcode", "postcode"],["Woonplaats", "woonplaats"],["Straat", "straat"],["Huisnummer", "huisnummer"],["Toevoeging", "toevoeging"],["KVK-nummer", "kvk_nummer"],["BTW-nummer", "btw_nummer"]].map(([label, key]) => (
                <label key={key} className="block">
                  <span className="mb-1 block text-sm font-medium text-gray-800">{label}</span>
                  <input value={(profielForm as any)[key]} onChange={(e) => setProfielForm((prev) => ({ ...prev, [key]: e.target.value }))} className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
                </label>
              ))}

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-800">Werkgebied</span>
                <select
                  value={profielForm.werkgebied_km}
                  onChange={(e) => setProfielForm((prev) => ({ ...prev, werkgebied_km: e.target.value }))}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="10">10 km</option>
                  <option value="15">15 km</option>
                  <option value="25">25 km</option>
                  <option value="35">35 km</option>
                  <option value="50">50 km</option>
                  <option value="75">75 km</option>
                  <option value="100">100 km</option>
                </select>
                <span className="mt-1 block text-xs text-gray-500">Nieuwe betaalde opdrachten binnen deze afstand worden automatisch bij Beschikbare opdrachten getoond als ze ook bij jouw diensten en materiaal passen.</span>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-800">Geboortedatum</span>
                <input
                  value={profielForm.geboortedatum}
                  onChange={(e) => setProfielForm((prev) => ({ ...prev, geboortedatum: e.target.value }))}
                  placeholder="DD-MM-JJJJ"
                  inputMode="numeric"
                  maxLength={10}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-800">IBAN</span>
                <input
                  value={profielForm.iban}
                  onChange={(e) => setProfielForm((prev) => ({ ...prev, iban: e.target.value.toUpperCase() }))}
                  placeholder="NL00 BANK 0000 0000 00"
                  autoComplete="off"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <div className="sm:col-span-2">
                <p className="mb-3 text-sm text-gray-500">E-mailadres wijzigen loopt apart via accountbeveiliging en is hier daarom niet aanpasbaar. Je IBAN wordt buiten de bewerkmodus afgeschermd weergegeven.</p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button onClick={profielOpslaan} disabled={profielBezig} className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50">{profielBezig ? "Opslaan..." : "Wijzigingen opslaan"}</button>
                  <button onClick={() => { vulProfielForm(professional); setProfielBewerken(false); setProfielMelding(""); }} disabled={profielBezig} className="rounded-xl border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-900 disabled:opacity-50">Annuleren</button>
                </div>
              </div>
            </div>
          )}

          {profielMelding && <p className="mt-4 text-sm font-medium text-gray-700">{profielMelding}</p>}
        </section>

        <BeschikbareOpdrachten />

        <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <h2>Mijn opdrachten</h2>
          {opdrachten.length === 0 ? <p>Je hebt momenteel geen opdrachten.</p> : opdrachten.map((opdracht) => (
            <div key={opdracht.id} onClick={() => router.push(`/professional/dashboard/opdracht/${opdracht.id}`)} className="mt-4 cursor-pointer rounded-xl border border-gray-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm">
              <strong>{opdracht.voornaam} {opdracht.achternaam}</strong>
              <p>Datum: {opdracht.gewenste_datum || "Nog niet gepland"}</p>
              <p>Tijd: {opdracht.gewenste_tijd || "Nog niet gepland"}</p>
              <p>Status: {opdracht.status}</p>
              <p>Jouw vergoeding: {opdracht.professional_bedrag != null ? `€${Number(opdracht.professional_bedrag).toFixed(2).replace(".", ",")}` : "Nog niet berekend"}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold text-gray-900">Mijn planning</h2>
          <p className="mt-2 text-gray-600">Nog geen afspraken gepland.</p>
        </section>

        <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold text-gray-900">Verdiensten</h2>
          <p className="mt-2 text-gray-600">
            {professional?.uitbetalingen_actief
              ? "Uitbetalingen via Stripe zijn actief."
              : professional?.stripe_account_id
                ? "Je bankrekening is gekoppeld. Stripe controleert de uitbetalingsstatus."
                : "Stel je uitbetalingen in om je vergoeding te kunnen ontvangen."}
          </p>
          <button className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 sm:w-auto" onClick={startStripeConnect}>{professional?.uitbetalingen_actief ? "Stripe-gegevens beheren" : "Uitbetalingen instellen"}</button>
        </section>
      </div>
    </main>
  );
}
