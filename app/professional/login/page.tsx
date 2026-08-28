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
      email: email.trim(),
      password: wachtwoord,
    });

    if (error) {
      setMelding("E-mailadres of wachtwoord is niet correct.");
      setBezig(false);
      return;
    }

    router.push("/professional/dashboard");
  }

  return (
    <main style={{ padding: "24px", maxWidth: "450px", margin: "40px auto" }}>
      <h1>Inloggen als glazenwasser</h1>

      <form onSubmit={inloggen}>
        <div style={{ marginTop: "24px" }}>
          <label>E-mailadres</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "12px", marginTop: "6px" }}
          />
        </div>

        <div style={{ marginTop: "16px" }}>
          <label>Wachtwoord</label>
          <input
            type="password"
            value={wachtwoord}
            onChange={(e) => setWachtwoord(e.target.value)}
            required
            style={{ width: "100%", padding: "12px", marginTop: "6px" }}
          />
        </div>

        {melding && (
          <p style={{ marginTop: "16px" }}>{melding}</p>
        )}

        <button
          type="submit"
          disabled={bezig}
          style={{ width: "100%", padding: "14px", marginTop: "24px" }}
        >
          {bezig ? "Inloggen..." : "Inloggen"}
        </button>
      </form>
    </main>
  );
}