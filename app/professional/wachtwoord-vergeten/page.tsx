"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function WachtwoordVergetenPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [bezig, setBezig] = useState(false);
  const [melding, setMelding] = useState("");

  async function verstuurReset(e: React.FormEvent) {
    e.preventDefault();
    setBezig(true);
    setMelding("");

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${window.location.origin}/professional/wachtwoord-resetten`,
      }
    );

    if (error) {
      console.error("Password recovery error:", error);
      setMelding("De herstelmail kon niet worden verstuurd. Probeer het opnieuw.");
      setBezig(false);
      return;
    }

    setMelding(
      "Als dit e-mailadres bij ons bekend is, ontvang je een e-mail om je wachtwoord opnieuw in te stellen."
    );
    setBezig(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12 flex items-start justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900">Wachtwoord vergeten</h1>
        <p className="mt-2 text-gray-600">
          Vul het e-mailadres van je ShineGo-account in. We sturen je een herstelmail.
        </p>

        <form onSubmit={verstuurReset}>
          <div className="mt-6">
            <label>E-mailadres</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {melding && <p className="mt-4 text-sm text-gray-700">{melding}</p>}

          <button
            type="submit"
            disabled={bezig}
            className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {bezig ? "Versturen..." : "Herstelmail versturen"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/professional/login")}
            className="mt-4 w-full text-sm font-medium text-blue-600 hover:underline"
          >
            Terug naar inloggen
          </button>
        </form>
      </div>
    </main>
  );
}
