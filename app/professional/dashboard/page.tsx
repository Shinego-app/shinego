"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
export default function ProfessionalDashboardPage() {
 const router = useRouter();   
  const [laden, setLaden] = useState(true);
  const [professional, setProfessional] = useState<any>(null);
  const [opdrachten, setOpdrachten] = useState<any[]>([]);

  useEffect(() => {
  async function laadProfessional() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLaden(false);
      return;
    }

    const { data } = await supabase
      .from("professionals")
      .select("*")
      .eq("user_id", user.id)
      .single();

    setProfessional(data);
    console.log("PROFESSIONAL ID:", data?.id);
    if (data) {
  const { data: boekingenData, error: boekingenError } = await supabase
    .from("boekingen")
    .select("*")
    .eq("professional_id", data.id)
    .order("created_at", { ascending: false });
    console.error("BOEKINGEN ERROR:", boekingenError);
    console.log("BOEKINGEN DATA:", boekingenData);
  setOpdrachten(boekingenData || []);
}
    setLaden(false);
  }

  laadProfessional();
}, []);
async function startStripeConnect() {
  if (!professional?.email) {
    console.error("Professional heeft geen e-mailadres.");
    return;
  }

  const stripeResponse = await fetch("/api/stripe-connect", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
  email: professional.email.trim().toLowerCase(),
  professional_id: professional.id,
}),
  });

  const stripeData = await stripeResponse.json();

  if (!stripeResponse.ok || !stripeData.url) {
  alert(stripeData.error || "Stripe Connect fout");
  return;
}

  window.location.href = stripeData.url;
}
  if (laden) {
    return <main style={{ padding: "24px" }}>Dashboard laden...</main>;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
     <div className="mx-auto w-full max-w-5xl"> 
   <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">   
  {professional?.bedrijfsnaam
    ? `Welkom, ${professional.bedrijfsnaam}`
    : "Mijn ShineGo"}
</h1>
      <p className="mt-2 text-gray-600">Beheer hier je opdrachten, planning en verdiensten.</p>

    <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
  <h2>Mijn opdrachten</h2>

  {opdrachten.length === 0 ? (
    <p>Je hebt momenteel geen opdrachten.</p>
  ) : (
    opdrachten.map((opdracht) => (
      <div
        key={opdracht.id}
        onClick={() => router.push(`/professional/dashboard/opdracht/${opdracht.id}`)}
        className="mt-4 cursor-pointer rounded-xl border border-gray-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm"
      >
        <strong>
          {opdracht.voornaam} {opdracht.achternaam}
        </strong>

        <p>
          Datum: {opdracht.gewenste_datum || "Nog niet gepland"}
        </p>

        <p>
          Tijd: {opdracht.gewenste_tijd || "Nog niet gepland"}
        </p>

        <p>Status: {opdracht.status}</p>
        <p>Jouw vergoeding: {opdracht.professional_bedrag != null ? `€${Number(opdracht.professional_bedrag).toFixed(2).replace(".", ",")}` : "Nog niet berekend"}</p>
      </div>
    ))
  )}
</section>

      <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-bold text-gray-900">Mijn planning</h2>
        <p className="mt-2 text-gray-600">Nog geen afspraken gepland.</p>
      </section>

     <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm sm:p-6"> 
        <h2 className="text-xl font-bold text-gray-900">Verdiensten</h2>
        <p className="mt-2 text-gray-600">Beheer hier je uitbetalingen via Stripe.</p>
        <button
        className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
  onClick={startStripeConnect}
>
  Uitbetalingen instellen
</button>
      </section>
      </div>
    </main>
  );
}