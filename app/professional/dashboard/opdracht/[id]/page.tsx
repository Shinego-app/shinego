"use client";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


export default function OpdrachtPage() {
    const router = useRouter();
    const params = useParams();
    const opdrachtId = params.id as string;
    const [opdracht, setOpdracht] = useState<any>(null);
    const [laden, setLaden] = useState(true);
    useEffect(() => {
        async function laadOpdracht() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                setLaden(false);
                return;
            }
            const { data: professional } = await supabase
                .from("professionals")
                .select("id")
                .eq("user_id", user.id)
                .single();

            if (!professional) {
                setLaden(false);
                return;
            }
            const { data } = await supabase
                .from("boekingen")
                .select("*")
                .eq("id", opdrachtId)
                .eq("professional_id", professional.id)
                .single();

            setOpdracht(data);
            setLaden(false);
        }
        
        laadOpdracht();
    }, [opdrachtId]);
    async function startOpdracht() {
        
        const { error } = await supabase
        .from("boekingen")
        .update({ status: "onderweg" })
        .eq("id", opdrachtId)
.eq("professional_id", opdracht.professional_id);
        if (!error) setOpdracht({ ...opdracht, status: "onderweg" });
}
async function afrondOpdracht() {
  const { error } = await supabase
    .from("boekingen")
    .update({ status: "afgerond" })
    .eq("id", opdrachtId)
    .eq("professional_id", opdracht.professional_id);

  if (error) {
    console.error("Afronden mislukt:", error);
    return;
  }

  const payoutResponse = await fetch("/api/stripe-payout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      booking_id: opdrachtId,
    }),
  });
const payoutData = await payoutResponse.json();

if (!payoutResponse.ok) {
  console.error("Uitbetaling mislukt:", payoutData);
  return;
}

setOpdracht({ ...opdracht, status: "afgerond" });
}
 
    if (laden) {
        return (
            <main style={{ padding: "24px" }}>
                Opdracht laden...
            </main>
        );
    }
    return (
        <main style={{ padding: "24px", backgroundColor: "#ffffff", minHeight: "100vh", color: "#111111" }}>
            <button onClick={() => router.push("/professional/dashboard")}>← Terug naar dashboard</button>
            <h1>Opdracht</h1>
            <p>Klant: {opdracht?.voornaam} {opdracht?.achternaam}</p>
            <p>Datum: {opdracht?.gewenste_datum || "Nog niet gepland"}</p>
            <p>Tijd: {opdracht?.gewenste_tijd || "Nog niet gepland"}</p>
            <p>Status: {opdracht?.status || "Onbekend"}</p>
            <p>Adres: {opdracht.straat} {opdracht.huisnummer}</p>
            <p>Plaats: {opdracht.plaats}</p>
            <p>Telefoon: {opdracht.telefoon}</p>
            <p>Woningtype: {opdracht.woningtype || "Niet opgegeven"}</p>
            <p>Aantal ramen: {opdracht.aantal_ramen || "Niet opgegeven"}</p>
            <p>Bereikbaarheid: {opdracht.bereikbaarheid || "Niet opgegeven"}</p>
            <p>Verdiepingen: {opdracht.verdiepingen?.join(", ") || "Niet opgegeven"}</p>
            <p>Jouw vergoeding: €{opdracht.professional_bedrag || "0,00"}</p>
            {opdracht.status === "toegewezen" && <button type="button" onClick={startOpdracht}>Opdracht starten</button>}
            {opdracht.status === "onderweg" && <button type="button" onClick={afrondOpdracht}>Opdracht afronden</button>}
            
            
            
        </main>
    );
}