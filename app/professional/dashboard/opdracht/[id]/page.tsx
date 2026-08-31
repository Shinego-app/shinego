"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


export default function OpdrachtPage() {
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
if (laden) {
  return (
    <main style={{ padding: "24px" }}>
      Opdracht laden...
    </main>
  );
}
  return (
    <main style={{ padding: "24px", maxWidth: "700px", margin: "0 auto", backgroundColor: "#ffffff", minHeight: "100vh", color: "#111111" }}>
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
    </main>
  );
}