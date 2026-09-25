"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import BeschikbareOpdrachten from "./BeschikbareOpdrachten";

export default function ProfessionalDashboardPage() {
  const router = useRouter();
  const [laden, setLaden] = useState(true);
  const [professional, setProfessional] = useState<any>(null);
  const [opdrachten, setOpdrachten] = useState<any[]>([]);
  const [reviewGemiddelde, setReviewGemiddelde] = useState<number | null>(null);
  const [reviewAantal, setReviewAantal] = useState(0);
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
    avb_verzekeraar: "",
    avb_polisnummer: "",
    avb_bevestigd: false,
    werkgebied_km: "25",
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
      avb_verzekeraar: data?.avb_verzekeraar || "",
      avb_polisnummer: data?.avb_polisnummer || "",
      avb_bevestigd: data?.avb_bevestigd === true,
      werkgebied_km: String(data?.werkgebied_km || 25),
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
        router.replace("/professional/login");
        return;
      }

      let { data } = await supabase
        .from("professionals")
        .select("*")
        .eq("user_id", user.id)
        .single();

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

      if (!data) {
        router.replace("/professional");
        return;
      }

      setProfessional(data);
      vulProfielForm(data);

      if (data) {
        const { data: boekingenData } = await supabase
          .from("boekingen")
          .select("*")
          .eq("professional_id", data.id)
          .order("created_at", { ascending: false });
        setOpdrachten(boekingenData || []);

        if (token) {
          const reviewResponse = await fetch("/api/professional-reviews", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          });

          if (reviewResponse.ok) {
            const reviewResult = await reviewResponse.json();
            setReviewAantal(Number(reviewResult.aantal) || 0);
            setReviewGemiddelde(
              reviewResult.gemiddelde == null ? null : Number(reviewResult.gemiddelde)
            );
          } else {
            console.error("Beoordelingen laden mislukt:", await reviewResponse.text());
          }
        }
      }
      setLaden(false);
    }

    laadProfessional();
  }, [router]);

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

    setProfessional(result.professional);
    vulProfielForm(result.professional);
    setProfielBewerken(false);
    setProfielMelding("Gegevens opgeslagen. Je werkgebied wordt direct gebruikt voor nieuwe beschikbare opdrachten.");
  }

  async function startStripeConnect() {
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

  const geplandeOpdrachten = [...opdrachten]
    .filter((opdracht) =>
      ["toegewezen", "onderweg"].includes(String(opdracht.status || "")) &&
      Boolean(opdracht.gewenste_datum)
    )
    .sort((a, b) =>
      `${a.gewenste_datum || ""} ${a.gewenste_tijd || ""}`.localeCompare(
        `${b.gewenste_datum || ""} ${b.gewenste_tijd || ""}`
      )
    );

  if (laden) return <main style={{ padding: "24px" }}>Dashboard laden...</main>;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="min-w-0 text-2xl font-bold text-gray-900 [overflow-wrap:anywhere] sm:text-3xl">
          {professional?.bedrijfsnaam ? `Welkom, ${professional.bedrijfsnaam}` : "Mijn ShineGo"}
        </h1>
        <p className="mt-2 text-gray-600">Beheer hier je opdrachten, planning en verdiensten.</p>
        <button onClick={uitloggen} className="mt-4 rounded-xl border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-900">Uitloggen</button>

        <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold text-gray-900">Mijn beoordelingen</h2>
          {reviewAantal > 0 && reviewGemiddelde != null ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{reviewGemiddelde.toFixed(1).replace(".", ",")}</span>
              <span className="text-xl text-amber-400" aria-label={`${reviewGemiddelde.toFixed(1)} van 5 sterren`}>★★★★★</span>
              <span className="text-sm text-gray-600">({reviewAantal} {reviewAantal === 1 ? "review" : "reviews"})</span>
            </div>
          ) : (
            <p className="mt-2 text-gray-600">Nog geen beoordelingen ontvangen.</p>
          )}
        </section>

        <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Mijn gegevens</h2>
              <p className="mt-1 text-sm text-gray-600">Controleer en wijzig je bedrijfs-, contact-, werkgebied- en verzekeringsgegevens.</p>
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
              <p><strong>AVB:</strong> {professional?.avb_bevestigd ? "Aangegeven als actief" : "Nog niet aangegeven"}</p>
              <p><strong>Verzekeraar:</strong> {professional?.avb_verzekeraar || "Nog niet ingevuld"}</p>
              <p><strong>Polisnummer:</strong> {professional?.avb_polisnummer || "Nog niet ingevuld"}</p>
              <p className="sm:col-span-2 text-xs text-gray-500">AVB-gegevens zijn optioneel en blokkeren je account niet. Als zelfstandig ondernemer ben je zelf verantwoordelijk voor passende verzekeringen en voor schade die volgens de wet aan jouw handelen of nalaten kan worden toegerekend.</p>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[["Bedrijfsnaam", "bedrijfsnaam"],["Voornaam", "voornaam"],["Achternaam", "achternaam"],["Telefoonnummer", "telefoon"],["Postcode", "postcode"],["Woonplaats", "woonplaats"],["Straat", "straat"],["Huisnummer", "huisnummer"],["Toevoeging", "toevoeging"],["KVK-nummer", "kvk_nummer"],["BTW-nummer", "btw_nummer"]].map(([label, key]) => (
                <label key={key} className="block">
                  <span className="mb-1 block text-sm font-medium text-gray-800">{label}</span>
                  <input value={(profielForm as any)[key]} onChange={(e) => setProfielForm((prev) => ({ ...prev, [key]: e.target.value }))} className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
                </label>
              ))}

              <div className="sm:col-span-2 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={profielForm.avb_bevestigd}
                    onChange={(e) => setProfielForm((prev) => ({ ...prev, avb_bevestigd: e.target.checked }))}
                    className="mt-0.5 h-5 w-5 accent-blue-600"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Ik heb een actieve bedrijfsaansprakelijkheidsverzekering (AVB)</p>
                    <p className="mt-1 text-xs text-gray-600">Deze gegevens zijn optioneel. ShineGo gebruikt het ontbreken van verzekeraar of polisnummer niet als blokkade voor activering.</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-gray-800">Verzekeraar</span>
                    <input value={profielForm.avb_verzekeraar} onChange={(e) => setProfielForm((prev) => ({ ...prev, avb_verzekeraar: e.target.value }))} className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-gray-800">Polisnummer</span>
                    <input value={profielForm.avb_polisnummer} onChange={(e) => setProfielForm((prev) => ({ ...prev, avb_polisnummer: e.target.value }))} className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
                  </label>
                </div>
              </div>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-800">Werkgebied</span>
                <select value={profielForm.werkgebied_km} onChange={(e) => setProfielForm((prev) => ({ ...prev, werkgebied_km: e.target.value }))} className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100">
                  <option value="10">10 km</option><option value="15">15 km</option><option value="25">25 km</option><option value="35">35 km</option><option value="50">50 km</option><option value="75">75 km</option><option value="100">100 km</option>
                </select>
                <span className="mt-1 block text-xs text-gray-500">Nieuwe betaalde opdrachten binnen deze afstand worden automatisch bij Beschikbare opdrachten getoond als ze ook bij jouw diensten en materiaal passen.</span>
              </label>

              <div className="sm:col-span-2">
                <p className="mb-3 text-sm text-gray-500">E-mailadres wijzigen loopt apart via accountbeveiliging. Bankrekening en betaalverificatie beheer je uitsluitend via de aparte Stripe-uitbetalingsstap.</p>
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
            <div key={opdracht.id} onClick={() => router.push(`/professional/dashboard/opdracht/${opdracht.id}`)} className="mt-4 min-w-0 cursor-pointer rounded-xl border border-gray-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm">
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
          {geplandeOpdrachten.length === 0 ? (
            <p className="mt-2 text-gray-600">Nog geen afspraken gepland.</p>
          ) : (
            <div className="mt-4 grid gap-3">
              {geplandeOpdrachten.map((opdracht) => (
                <button
                  key={opdracht.id}
                  type="button"
                  onClick={() => router.push(`/professional/dashboard/opdracht/${opdracht.id}`)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-left hover:border-blue-300"
                >
                  <strong className="block text-gray-900">
                    {opdracht.gewenste_datum} · {opdracht.gewenste_tijd || "Tijd nog niet gepland"}
                  </strong>
                  <span className="mt-1 block text-sm text-gray-600">
                    {opdracht.plaats || "Locatie"} · status {String(opdracht.status || "-").replaceAll("_", " ")}
                  </span>
                </button>
              ))}
            </div>
          )}
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
