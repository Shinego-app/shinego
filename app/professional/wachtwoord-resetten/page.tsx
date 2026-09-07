"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function WachtwoordResettenPage() {
  const router = useRouter();
  const [wachtwoord, setWachtwoord] = useState("");
  const [bevestiging, setBevestiging] = useState("");
  const [bezig, setBezig] = useState(false);
  const [sessieKlaar, setSessieKlaar] = useState(false);
  const [melding, setMelding] = useState("Herstellink controleren...");

  useEffect(() => {
    let actief = true;

    async function controleerHerstelSessie() {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error("Recovery code error:", error);
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!actief) return;

      if (session) {
        setSessieKlaar(true);
        setMelding("");
      } else {
        setMelding(
          "Deze herstellink is ongeldig of verlopen. Vraag een nieuwe herstelmail aan."
        );
      }
    }

    controleerHerstelSessie();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!actief) return;
      if ((event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") && session) {
        setSessieKlaar(true);
        setMelding("");
      }
    });

    return () => {
      actief = false;
      subscription.unsubscribe();
    };
  }, []);

  async function nieuwWachtwoord(e: React.FormEvent) {
    e.preventDefault();
    setMelding("");

    if (wachtwoord.length < 8) {
      setMelding("Gebruik minimaal 8 tekens voor je nieuwe wachtwoord.");
      return;
    }

    if (wachtwoord !== bevestiging) {
      setMelding("De wachtwoorden zijn niet hetzelfde.");
      return;
    }

    setBezig(true);

    const { error } = await supabase.auth.updateUser({
      password: wachtwoord,
    });

    if (error) {
      console.error("Password update error:", error);
      setMelding("Het wachtwoord kon niet worden gewijzigd. Probeer het opnieuw.");
      setBezig(false);
      return;
    }

    await supabase.auth.signOut();
    router.push("/professional/login?reset=gelukt");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12 flex items-start justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900">Nieuw wachtwoord instellen</h1>

        {melding && <p className="mt-4 text-sm text-gray-700">{melding}</p>}

        {sessieKlaar && (
          <form onSubmit={nieuwWachtwoord}>
            <div className="mt-6">
              <label>Nieuw wachtwoord</label>
              <input
                type="password"
                value={wachtwoord}
                onChange={(e) => setWachtwoord(e.target.value)}
                required
                minLength={8}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="mt-4">
              <label>Herhaal nieuw wachtwoord</label>
              <input
                type="password"
                value={bevestiging}
                onChange={(e) => setBevestiging(e.target.value)}
                required
                minLength={8}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={bezig}
              className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {bezig ? "Opslaan..." : "Wachtwoord opslaan"}
            </button>
          </form>
        )}

        {!sessieKlaar && (
          <button
            type="button"
            onClick={() => router.push("/professional/wachtwoord-vergeten")}
            className="mt-6 w-full rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-900"
          >
            Nieuwe herstelmail aanvragen
          </button>
        )}
      </div>
    </main>
  );
}
