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

    if (bezig) return;

    const schoonEmail = email.trim().toLowerCase();
    if (!schoonEmail || !wachtwoord) {
      setMelding("Vul je e-mailadres en wachtwoord in.");
      return;
    }

    setBezig(true);
    setMelding("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: schoonEmail,
        password: wachtwoord,
      });

      if (error) {
        console.error("Supabase login error:", error);

        const fout = error.message.toLowerCase();

        if (fout.includes("email not confirmed")) {
          setMelding("Bevestig eerst je e-mailadres via de e-mail van ShineGo en probeer daarna opnieuw.");
        } else if (
          fout.includes("invalid login credentials") ||
          fout.includes("invalid credentials")
        ) {
          setMelding("E-mailadres of wachtwoord is niet correct.");
        } else if (fout.includes("too many requests") || fout.includes("rate limit")) {
          setMelding("Te veel inlogpogingen. Wacht even en probeer het daarna opnieuw.");
        } else {
          setMelding("Inloggen lukt op dit moment niet. Probeer het opnieuw of gebruik ‘Wachtwoord vergeten?’. ");
        }
        return;
      }

      if (!data.session || !data.user) {
        setMelding("Inloggen is niet volledig afgerond. Probeer het opnieuw.");
        return;
      }

      router.replace("/professional/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Onverwachte login fout:", error);
      setMelding("Er kon geen verbinding worden gemaakt. Controleer je internetverbinding en probeer opnieuw.");
    } finally {
      setBezig(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12 flex items-start justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Inloggen als glazenwasser
        </h1>

        <form onSubmit={inloggen}>
          <div style={{ marginTop: "24px" }}>
            <label>E-mailadres</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
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
              autoComplete="current-password"
              required
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="button"
            onClick={() => router.push("/professional/wachtwoord-vergeten")}
            className="mt-3 text-sm font-medium text-blue-600 hover:underline"
          >
            Wachtwoord vergeten?
          </button>

          {melding && <p className="mt-4 text-sm font-medium text-gray-700">{melding}</p>}

          <button
            type="submit"
            disabled={bezig}
            className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {bezig ? "Inloggen..." : "Inloggen"}
          </button>
        </form>
      </div>
    </main>
  );
}
