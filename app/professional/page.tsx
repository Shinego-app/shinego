"use client";

import { FormEvent, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter} from "next/navigation";

export default function ProfessionalPage() {
  const router = useRouter();  
  const [bedrijfsnaam, setBedrijfsnaam] = useState("");
  const [voornaam, setVoornaam] = useState("");
  const [achternaam, setAchternaam] = useState("");
  const [email, setEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [postcode, setPostcode] = useState("");
  const [woonplaats, setWoonplaats] = useState("");
  const [straat, setStraat] = useState("");
  const [huisnummer, setHuisnummer] = useState("");
  const [toevoeging, setToevoeging] = useState("");
  const [kvkNummer, setKvkNummer] = useState("");
  const [btwNummer, setBtwNummer] = useState("");
  const [werkgebiedKm, setWerkgebiedKm] = useState("25");
  const [voorwaarden, setVoorwaarden] = useState(false);

  const [bezig, setBezig] = useState(false);
  const [melding, setMelding] = useState("");
  const [succes, setSucces] = useState(false);

  async function aanmelden(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMelding("");
    setSucces(false);

    if (
      !bedrijfsnaam.trim() ||
      !voornaam.trim() ||
      !achternaam.trim() ||
      !email.trim() ||
      !telefoon.trim() ||
      !postcode.trim() ||
      !woonplaats.trim() ||
      !kvkNummer.trim()
    ) {
      setMelding("Vul alle verplichte gegevens in.");
      return;
    }

    if (!voorwaarden) {
      setMelding("Accepteer eerst de voorwaarden.");
      return;
    }

    setBezig(true);
 const { data: authData, error: authError } = await supabase.auth.signUp({
  email: email.trim().toLowerCase(),
  password: wachtwoord,
  options: {
    data: {
     account_type: "professional",   
      bedrijfsnaam: bedrijfsnaam.trim(),
      voornaam: voornaam.trim(),
      achternaam: achternaam.trim(),
      telefoon: telefoon.trim(),
      postcode: postcode.trim().toUpperCase(),
      woonplaats: woonplaats.trim(),
      straat: straat.trim(),
      huisnummer: huisnummer.trim(),
      toevoeging: toevoeging.trim() || null,
      kvk_nummer: kvkNummer.trim(),
      btw_nummer: btwNummer.trim(),
      diensten: ["glazenwasser"],
      werkgebied_km: Number(werkgebiedKm),
    },
  },
});

if (authError || !authData.user) {
   console.error("Supabase auth signUp error:", authError, authData); 
  setBezig(false);
  setMelding(authError?.message || "Account kon niet worden aangemaakt.");
  return;
}

    
  const stripeResponse = await fetch("/api/stripe-connect", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    
    email: email.trim().toLowerCase(),
  }),
});

const stripeData = await stripeResponse.json();

if (!stripeResponse.ok || !stripeData.url) {
  setBezig(false);
  setMelding(stripeData.error || "Stripe Connect kon niet worden gestart.");
  return;
}

window.location.href = stripeData.url;
return;


    setBezig(false);

  

    setSucces(true);
    setMelding(
      "Aanmelding ontvangen! ShineGo controleert je gegevens voordat je actief wordt."
    );
    router.push("/professional/bevestigd");

    setBedrijfsnaam("");
    setVoornaam("");
    setAchternaam("");
    setEmail("");
    setTelefoon("");
    setPostcode("");
    setWoonplaats("");
    setKvkNummer("");
    setBtwNummer("");
    setWerkgebiedKm("25");
    setVoorwaarden(false);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <a
            href="/"
            className="text-2xl font-bold text-blue-600"
          >
            ShineGo
          </a>

          <a
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← Terug naar home
          </a>
        </div>
      </header>

      <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-10 text-center">
          <div className="mb-4 text-5xl">🧼</div>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Word ShineGo Professional
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Ontvang opdrachten in jouw werkgebied zonder te betalen voor
            losse leads.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border bg-white p-5 text-center shadow-sm">
            <div className="text-2xl">📍</div>
            <div className="mt-2 font-bold text-gray-900">
              Jouw werkgebied
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Kies zelf waar je wilt werken.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 text-center shadow-sm">
            <div className="text-2xl">💼</div>
            <div className="mt-2 font-bold text-gray-900">
              Echte opdrachten
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Geen betaalde losse leads.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 text-center shadow-sm">
            <div className="text-2xl">💶</div>
            <div className="mt-2 font-bold text-gray-900">
              Vooraf duidelijk
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Je ziet de opdracht vooraf.
            </p>
          </div>
        </div>

        <form
          onSubmit={aanmelden}
          className="w-full rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-9"
        >
          <h2 className="text-2xl font-bold text-gray-900">
            Aanmelden als professional
          </h2>

          <p className="mt-2 text-gray-600">
            Vul je bedrijfs- en contactgegevens in.
          </p>

          <div className="mt-8 space-y-7">
            <div>
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                Bedrijfsgegevens
              </h3>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block font-medium text-gray-800">
                    Bedrijfsnaam *
                  </label>

                  <input
                    type="text"
                    value={bedrijfsnaam}
                    onChange={(e) => setBedrijfsnaam(e.target.value)}
                    placeholder="Naam van je bedrijf"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-gray-800">
                    KVK-nummer *
                  </label>

                  <input
                    type="text"
                    value={kvkNummer}
                    onChange={(e) => setKvkNummer(e.target.value)}
                    placeholder="12345678"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-gray-800">
                    BTW-nummer
                  </label>

                  <input
                    type="text"
                    value={btwNummer}
                    onChange={(e) => setBtwNummer(e.target.value)}
                    placeholder="NL123456789B01"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-7">
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                Contactpersoon
              </h3>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block font-medium text-gray-800">
                    Voornaam *
                  </label>

                  <input
                    type="text"
                    value={voornaam}
                    onChange={(e) => setVoornaam(e.target.value)}
                    placeholder="Voornaam"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-gray-800">
                    Achternaam *
                  </label>

                  <input
                    type="text"
                    value={achternaam}
                    onChange={(e) => setAchternaam(e.target.value)}
                    placeholder="Achternaam"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-gray-800">
                    E-mailadres *
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="naam@bedrijf.nl"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
  <label className="mb-2 block font-medium">
    Wachtwoord
  </label>

  <input
    type="password"
    value={wachtwoord}
    onChange={(e) => setWachtwoord(e.target.value)}
    placeholder="Minimaal 8 tekens"
    minLength={8}
    required
    className="w-full rounded-xl border"
  />
</div>

                <div>
                  <label className="mb-2 block font-medium text-gray-800">
                    Telefoonnummer *
                  </label>

                  <input
                    type="tel"
                    value={telefoon}
                    onChange={(e) => setTelefoon(e.target.value)}
                    placeholder="06 12345678"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-7">
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                Werkgebied
              </h3>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block font-medium text-gray-800">
                    Postcode *
                  </label>

                  <input
                    type="text"
                    value={postcode}
                    onChange={(e) =>
                      setPostcode(e.target.value.toUpperCase())
                    }
                    placeholder="1234 AB"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-gray-800">
                    Woonplaats *
                  </label>

                  <input
                    type="text"
                    value={woonplaats}
                    onChange={(e) => setWoonplaats(e.target.value)}
                    placeholder="Amsterdam"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
<div>
  <label className="mb-2 block font-medium text-gray-800">
    Straat *
  </label>
  <input
    type="text"
    value={straat}
    onChange={(e) => setStraat(e.target.value)}
    placeholder="Straatnaam"
    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
  />
</div>

<div>
  <label className="mb-2 block font-medium text-gray-800">
    Huisnummer *
  </label>
  <input
    type="text"
    value={huisnummer}
    onChange={(e) => setHuisnummer(e.target.value)}
    placeholder="10"
    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
  />
</div>

<div>
  <label className="mb-2 block font-medium text-gray-800">
    Toevoeging
  </label>
  <input
    type="text"
    value={toevoeging}
    onChange={(e) => setToevoeging(e.target.value)}
    placeholder="Bijv. A"
    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
  />
</div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block font-medium text-gray-800">
                    Maximale afstand voor opdrachten
                  </label>

                  <select
                    value={werkgebiedKm}
                    onChange={(e) => setWerkgebiedKm(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="10">10 km</option>
                    <option value="15">15 km</option>
                    <option value="25">25 km</option>
                    <option value="35">35 km</option>
                    <option value="50">50 km</option>
                    <option value="75">75 km</option>
                    <option value="100">100 km</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t pt-7">
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                Diensten
              </h3>

              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="h-5 w-5" />

                  <div>
                    <div className="font-bold text-gray-900">
                      Glazenwassen
                    </div>

                    <div className="text-sm font-bold text-gray-900">
                      Telewash
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 border-t pt-7">
              <input
                type="checkbox"
                checked={voorwaarden}
                onChange={(e) => setVoorwaarden(e.target.checked)}
                className="mt-1 h-5 w-5"
              />

              <span className="text-sm text-gray-600">
                Ik verklaar dat de ingevulde gegevens correct zijn en ik
                accepteer de voorwaarden van ShineGo.
              </span>
            </label>

            {melding && (
              <div
                className={`rounded-xl p-4 text-sm font-medium ${
                  succes
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {melding}
              </div>
            )}

            <button
              type="submit"
              disabled={bezig}
              className="w-full rounded-xl bg-blue-600 px-6 py-4 text-lg font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {bezig
                ? "Aanmelding wordt opgeslagen..."
                : "Aanmelden als professional →"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Je profiel wordt eerst gecontroleerd voordat je opdrachten kunt
          ontvangen.
        </p>
      </section>
    </main>
  );
}