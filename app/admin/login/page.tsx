"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = "intercastbv@hotmail.com";

export default function AdminLoginPage() {
  const [bezig, setBezig] = useState(false);
  const [melding, setMelding] = useState("");

  async function stuurInloglink() {
    if (bezig) return;

    setBezig(true);
    setMelding("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: ADMIN_EMAIL,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
          shouldCreateUser: false,
        },
      });

      if (error) throw error;

      setMelding(`Veilige inloglink verzonden naar ${ADMIN_EMAIL}.`);
    } catch (error) {
      console.error("Admin inloglink fout:", error);
      setMelding("De inloglink kon niet worden verzonden. Controleer of dit beheeraccount in Supabase Authentication bestaat.");
    } finally {
      setBezig(false);
    }
  }

  return (
    <main className="flex min-h-screen items-start justify-center bg-gray-50 px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <div className="text-2xl font-bold text-blue-600">ShineGo</div>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">Beheerder inloggen</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          Alleen het bestaande ShineGo-beheeraccount krijgt toegang tot boekingen,
          professionals en betalingen.
        </p>

        {melding && (
          <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-medium text-blue-800">
            {melding}
          </div>
        )}

        <button
          type="button"
          onClick={stuurInloglink}
          disabled={bezig}
          className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {bezig ? "Inloglink versturen..." : "Stuur veilige inloglink"}
        </button>

        <a
          href="/"
          className="mt-5 block text-center text-sm font-semibold text-gray-600 hover:text-gray-900"
        >
          Terug naar website
        </a>
      </div>
    </main>
  );
}
