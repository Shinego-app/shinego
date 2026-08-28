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
    const { data } = await supabase
      .from("boekingen")
      .select("*")
      .eq("id", opdrachtId)
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
    <main style={{ padding: "24px", maxWidth: "700px", margin: "0 auto" }}>
      <h1>Opdracht</h1>
      <p>Klant: {opdracht?.voornaam} {opdracht?.achternaam}</p>
      <p>Datum: {opdracht?.gewenste_datum || "Nog niet gepland"}</p>
      <p>Tijd: {opdracht?.gewenste_tijd || "Nog niet gepland"}</p>
      <p>Status: {opdracht?.status || "Onbekend"}</p>
    </main>
  );
}