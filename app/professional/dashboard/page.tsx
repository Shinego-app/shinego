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
    }),
  });

  const stripeData = await stripeResponse.json();

  if (!stripeResponse.ok || !stripeData.url) {
    console.error("Stripe Connect fout:", stripeData);
    return;
  }

  window.location.href = stripeData.url;
}
  if (laden) {
    return <main style={{ padding: "24px" }}>Dashboard laden...</main>;
  }

  return (
    <main style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>
  {professional?.bedrijfsnaam
    ? `Welkom, ${professional.bedrijfsnaam}`
    : "Mijn ShineGo"}
</h1>
      <p>Beheer hier je opdrachten, planning en verdiensten.</p>

      <section style={{ marginTop: "32px" }}>
  <h2>Mijn opdrachten</h2>

  {opdrachten.length === 0 ? (
    <p>Je hebt momenteel geen opdrachten.</p>
  ) : (
    opdrachten.map((opdracht) => (
      <div
        key={opdracht.id}
        onClick={() => router.push(`/professional/dashboard/opdracht/${opdracht.id}`)}
        style={{
          marginTop: "16px",
          padding: "16px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          cursor: "pointer",
        }}
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
      </div>
    ))
  )}
</section>

      <section style={{ marginTop: "32px" }}>
        <h2>Mijn planning</h2>
        <p>Nog geen afspraken geladen.</p>
      </section>

      <section style={{ marginTop: "32px" }}>
        <h2>Verdiensten</h2>
        <button
  onClick={startStripeConnect}
>
  Uitbetalingen instellen
</button>
      </section>
    </main>
  );
}