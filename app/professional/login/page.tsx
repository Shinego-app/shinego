"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ProfessionalLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [bezig, setBezig] = useState(false);
  const [melding, setMelding] = useState("");

  async function inloggen(e: React.FormEvent) {
    e.preventDefault();
   
    setBezig(true);
    setMelding("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: wachtwoord,
    });
    

    if (error) {
       console.error("Supabase login error:", error); 
      setMelding("E-mailadres of wachtwoord is niet correct.");
      setBezig(false);
      return;
    }

    router.push("/professional/dashboard");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12 flex items-start justify-center">
       <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Inloggen als glazenwasser</h1>

      <form onSubmit={inloggen}>
        <div style={{ marginTop: "24px" }}>
          <label>E-mailadres</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
     className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"       
          />
        </div>

        <div style={{ marginTop: "16px" }}>
          <label>Wachtwoord</label>
          <input
            type="password"
            value={wachtwoord}
            onChange={(e) => setWachtwoord(e.target.value)}
            required
   className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"         
          />
        </div>

        {melding && (
          <p style={{ marginTop: "16px" }}>{melding}</p>
        )}

        <button
          type="submit"
          disabled={bezig}
    className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {bezig ? "Inloggen..." : "Inloggen"}
        </button>
      </form>
      </div>
    </main>
  );
}