"use client";

import { FormEvent, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function ProfessionalPage() {
  const router = useRouter();
  const [bedrijfsnaam, setBedrijfsnaam] = useState("");
  const [voornaam, setVoornaam] = useState("");
  const [achternaam, setAchternaam] = useState("");
  const [email, setEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [geboortedatum, setGeboortedatum] = useState("");
  const [iban, setIban] = useState("");
  const [eigenaarBevestigd, setEigenaarBevestigd] = useState(false);
  const [priveAdresZelfde, setPriveAdresZelfde] = useState(true);
  const [priveStraat, setPriveStraat] = useState("");
  const [priveHuisnummer, setPriveHuisnummer] = useState("");
  const [priveToevoeging, setPriveToevoeging] = useState("");
  const [privePostcode, setPrivePostcode] = useState("");
  const [priveWoonplaats, setPriveWoonplaats] = useState("");
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

  function normaliseerGeboortedatum(value: string) {
    const match = value.trim().match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (!match) return null;
    const [, dag, maand, jaar] = match;
    const datum = new Date(`${jaar}-${maand}-${dag}T00:00:00Z`);
    if (
      Number.isNaN(datum.getTime()) ||
      datum.getUTCFullYear() !== Number(jaar) ||
      datum.getUTCMonth() + 1 !== Number(maand) ||
      datum.getUTCDate() !== Number(dag)
    ) {
      return null;
    }
    return `${jaar}-${maand}-${dag}`;
  }

  async function aanmelden(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMelding("");
    setSucces(false);

    if (
      !bedrijfsnaam.trim() ||
      !voornaam.trim() ||
      !achternaam.trim() ||
      !email.trim() ||
      !wachtwoord ||
      !telefoon.trim() ||
      !geboortedatum.trim() ||
      !iban.trim() ||
      !postcode.trim() ||
      !woonplaats.trim() ||
      !straat.trim() ||
      !huisnummer.trim() ||
      !kvkNummer.trim()
    ) {
      setMelding("Vul alle verplichte gegevens in.");
      return;
    }

    const schoonEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(schoonEmail)) {
      setMelding("Vul een geldig e-mailadres in.");
      return;
    }

    const schoonKvk = kvkNummer.replace(/\D/g, "");
    if (!/^\d{8}$/.test(schoonKvk)) {
      setMelding("Vul een geldig KVK-nummer van 8 cijfers in.");
      return;
    }

    const schoonBtw = btwNummer.replace(/[\s.\-]/g, "").toUpperCase();
    if (schoonBtw && !/^NL\d{9}B\d{2}$/.test(schoonBtw)) {
      setMelding("Vul een geldig Nederlands BTW-id in, bijvoorbeeld NL123456789B01.");
      return;
    }

    const schoonPostcode = postcode.replace(/\s/g, "").toUpperCase();
    if (!/^[1-9][0-9]{3}[A-Z]{2}$/.test(schoonPostcode)) {
      setMelding("Vul een geldige Nederlandse postcode in, bijvoorbeeld 1234 AB.");
      return;
    }

    const schoonTelefoon = telefoon.replace(/[\s().-]/g, "");
    if (!/^(?:\+31|0031|0)[1-9][0-9]{8}$/.test(schoonTelefoon)) {
      setMelding("Vul een geldig Nederlands telefoonnummer in.");
      return;
    }

    const stripeGeboortedatum = normaliseerGeboortedatum(geboortedatum);
    if (!stripeGeboortedatum) {
      setMelding("Vul je geboortedatum in als DD-MM-JJJJ.");
      return;
    }

    const schoonIban = iban.replace(/\s/g, "").toUpperCase();
    if (!/^NL\d{2}[A-Z]{4}\d{10}$/.test(schoonIban)) {
      setMelding("Vul een geldig Nederlands IBAN in.");
      return;
    }

    if (!eigenaarBevestigd) {
      setMelding("Bevestig dat je eigenaar/vennoot en bevoegd vertegenwoordiger bent.");
      return;
    }

    let schoonPrivePostcode = "";
    if (!priveAdresZelfde) {
      if (
        !priveStraat.trim() ||
        !priveHuisnummer.trim() ||
        !privePostcode.trim() ||
        !priveWoonplaats.trim()
      ) {
        setMelding("Vul je volledige woonadres in.");
        return;
      }
      schoonPrivePostcode = privePostcode.replace(/\s/g, "").toUpperCase();
      if (!/^[1-9][0-9]{3}[A-Z]{2}$/.test(schoonPrivePostcode)) {
        setMelding("Vul een geldige postcode voor je woonadres in.");
        return;
      }
    }

    if (wachtwoord.length < 8) {
      setMelding("Het wachtwoord moet minimaal 8 tekens bevatten.");
      return;
    }

    if (!voorwaarden) {
      setMelding("Accepteer eerst de voorwaarden.");
      return;
    }

    setBezig(true);
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: schoonEmail,
      password: wachtwoord,
      options: {
        data: {
          account_type: "professional",
          bedrijfsnaam: bedrijfsnaam.trim(),
          voornaam: voornaam.trim(),
          achternaam: achternaam.trim(),
          telefoon: telefoon.trim(),
          postcode: `${schoonPostcode.slice(0, 4)} ${schoonPostcode.slice(4)}`,
          woonplaats: woonplaats.trim(),
          straat: straat.trim(),
          huisnummer: huisnummer.trim(),
          toevoeging: toevoeging.trim() || null,
          kvk_nummer: schoonKvk,
          btw_nummer: schoonBtw,
          diensten: ["glazenwasser"],
          werkgebied_km: Number(werkgebiedKm),
          stripe_geboortedatum: stripeGeboortedatum,
          stripe_eigenaar_bevestigd: true,
          stripe_priveadres_zelfde: priveAdresZelfde,
          stripe_prive_straat: priveAdresZelfde ? null : priveStraat.trim(),
          stripe_prive_huisnummer: priveAdresZelfde ? null : priveHuisnummer.trim(),
          stripe_prive_toevoeging: priveAdresZelfde ? null : priveToevoeging.trim() || null,
          stripe_prive_postcode: priveAdresZelfde
            ? null
            : `${schoonPrivePostcode.slice(0, 4)} ${schoonPrivePostcode.slice(4)}`,
          stripe_prive_woonplaats: priveAdresZelfde ? null : priveWoonplaats.trim(),
          stripe_iban: schoonIban,
        },
      },
    });

    if (authError || !authData.user) {
      console.error("Supabase auth signUp error:", authError, authData);
      setBezig(false);
      setMelding(authError?.message || "Account kon niet worden aangemaakt.");
      return;
    }

    setBezig(false);
    setSucces(true);
    setMelding("Aanmelding ontvangen! Bevestig je e-mailadres om verder te gaan.");
    router.push("/professional/bevestigd");
  }

  const inputClass =
    "w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

  return (
    <main className="min-h-screen overflow-x-hidden bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <a href="/" className="text-2xl font-bold text-blue-600">ShineGo</a>
          <a href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">← Terug naar home</a>
        </div>
      </header>

      <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-10 text-center">
          <div className="mb-4 text-5xl">🧼</div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Word ShineGo Professional</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">Ontvang opdrachten in jouw werkgebied zonder te betalen voor losse leads.</p>
        </div>

        <form onSubmit={aanmelden} className="w-full rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-9">
          <h2 className="text-2xl font-bold text-gray-900">Aanmelden als professional</h2>
          <p className="mt-2 text-gray-600">Vul je gegevens één keer in. ShineGo gebruikt ze daarna voor de Stripe-verificatie en uitbetalingen.</p>

          <div className="mt-8 space-y-7">
            <div>
              <h3 className="mb-4 text-lg font-bold text-gray-900">Bedrijfsgegevens</h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2"><label className="mb-2 block font-medium text-gray-800">Bedrijfsnaam *</label><input value={bedrijfsnaam} onChange={(e) => setBedrijfsnaam(e.target.value)} className={inputClass} /></div>
                <div><label className="mb-2 block font-medium text-gray-800">KVK-nummer *</label><input value={kvkNummer} onChange={(e) => setKvkNummer(e.target.value)} inputMode="numeric" maxLength={8} className={inputClass} /></div>
                <div><label className="mb-2 block font-medium text-gray-800">BTW-nummer</label><input value={btwNummer} onChange={(e) => setBtwNummer(e.target.value.toUpperCase())} className={inputClass} /></div>
              </div>
            </div>

            <div className="border-t pt-7">
              <h3 className="mb-4 text-lg font-bold text-gray-900">Contactpersoon & verificatie</h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <div><label className="mb-2 block font-medium text-gray-800">Voornaam *</label><input value={voornaam} onChange={(e) => setVoornaam(e.target.value)} className={inputClass} /></div>
                <div><label className="mb-2 block font-medium text-gray-800">Achternaam *</label><input value={achternaam} onChange={(e) => setAchternaam(e.target.value)} className={inputClass} /></div>
                <div><label className="mb-2 block font-medium text-gray-800">E-mailadres *</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} /></div>
                <div><label className="mb-2 block font-medium text-gray-800">Wachtwoord *</label><input type="password" value={wachtwoord} onChange={(e) => setWachtwoord(e.target.value)} minLength={8} className={inputClass} /></div>
                <div><label className="mb-2 block font-medium text-gray-800">Telefoonnummer *</label><input type="tel" value={telefoon} onChange={(e) => setTelefoon(e.target.value)} placeholder="06 12345678" className={inputClass} /></div>
                <div><label className="mb-2 block font-medium text-gray-800">Geboortedatum *</label><input value={geboortedatum} onChange={(e) => setGeboortedatum(e.target.value)} placeholder="DD-MM-JJJJ" inputMode="numeric" maxLength={10} className={inputClass} /></div>
              </div>
              <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4"><input type="checkbox" checked={eigenaarBevestigd} onChange={(e) => setEigenaarBevestigd(e.target.checked)} className="mt-1 h-5 w-5" /><span className="text-sm text-gray-700">Ik ben eigenaar/vennoot en bevoegd vertegenwoordiger van dit bedrijf.</span></label>
            </div>

            <div className="border-t pt-7">
              <h3 className="mb-4 text-lg font-bold text-gray-900">Werkgebied en adres</h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <div><label className="mb-2 block font-medium text-gray-800">Postcode *</label><input value={postcode} onChange={(e) => setPostcode(e.target.value.toUpperCase())} className={inputClass} /></div>
                <div><label className="mb-2 block font-medium text-gray-800">Woonplaats *</label><input value={woonplaats} onChange={(e) => setWoonplaats(e.target.value)} className={inputClass} /></div>
                <div><label className="mb-2 block font-medium text-gray-800">Straat *</label><input value={straat} onChange={(e) => setStraat(e.target.value)} className={inputClass} /></div>
                <div><label className="mb-2 block font-medium text-gray-800">Huisnummer *</label><input value={huisnummer} onChange={(e) => setHuisnummer(e.target.value)} className={inputClass} /></div>
                <div><label className="mb-2 block font-medium text-gray-800">Toevoeging</label><input value={toevoeging} onChange={(e) => setToevoeging(e.target.value)} className={inputClass} /></div>
                <div><label className="mb-2 block font-medium text-gray-800">Maximale afstand</label><select value={werkgebiedKm} onChange={(e) => setWerkgebiedKm(e.target.value)} className={inputClass}><option value="10">10 km</option><option value="15">15 km</option><option value="25">25 km</option><option value="35">35 km</option><option value="50">50 km</option><option value="75">75 km</option><option value="100">100 km</option></select></div>
              </div>
              <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4"><input type="checkbox" checked={priveAdresZelfde} onChange={(e) => setPriveAdresZelfde(e.target.checked)} className="mt-1 h-5 w-5" /><span className="text-sm text-gray-700">Mijn woonadres voor verificatie is hetzelfde als bovenstaand adres.</span></label>
              {!priveAdresZelfde && <div className="mt-5 grid gap-5 sm:grid-cols-2"><input value={priveStraat} onChange={(e) => setPriveStraat(e.target.value)} placeholder="Woonadres straat" className={inputClass} /><input value={priveHuisnummer} onChange={(e) => setPriveHuisnummer(e.target.value)} placeholder="Huisnummer" className={inputClass} /><input value={priveToevoeging} onChange={(e) => setPriveToevoeging(e.target.value)} placeholder="Toevoeging" className={inputClass} /><input value={privePostcode} onChange={(e) => setPrivePostcode(e.target.value.toUpperCase())} placeholder="Postcode" className={inputClass} /><input value={priveWoonplaats} onChange={(e) => setPriveWoonplaats(e.target.value)} placeholder="Woonplaats" className={`${inputClass} sm:col-span-2`} /></div>}
            </div>

            <div className="border-t pt-7">
              <h3 className="mb-4 text-lg font-bold text-gray-900">Uitbetalingen</h3>
              <p className="mb-4 text-sm text-gray-600">Je IBAN wordt gebruikt om je uitbetalingsrekening bij Stripe te koppelen. Na de Stripe-koppeling verwijdert ShineGo het IBAN uit je tijdelijke registratiegegevens.</p>
              <label className="mb-2 block font-medium text-gray-800">IBAN *</label>
              <input value={iban} onChange={(e) => setIban(e.target.value.toUpperCase())} placeholder="NL00 BANK 0000 0000 00" autoComplete="off" spellCheck={false} className={inputClass} />
            </div>

            <label className="flex cursor-pointer items-start gap-3 border-t pt-7"><input type="checkbox" checked={voorwaarden} onChange={(e) => setVoorwaarden(e.target.checked)} className="mt-1 h-5 w-5" /><span className="text-sm text-gray-600">Ik verklaar dat de ingevulde gegevens correct zijn en ik accepteer de voorwaarden van ShineGo.</span></label>

            {melding && <div className={`rounded-xl p-4 text-sm font-medium ${succes ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{melding}</div>}

            <button type="submit" disabled={bezig} className="w-full rounded-xl bg-blue-600 px-6 py-4 text-lg font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400">{bezig ? "Aanmelding wordt opgeslagen..." : "Aanmelden als professional →"}</button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">Je profiel wordt eerst gecontroleerd voordat je opdrachten kunt ontvangen.</p>
      </section>
    </main>
  );
}
