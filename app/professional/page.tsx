"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

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
  const [heeftAvb, setHeeftAvb] = useState<boolean | null>(null);
  const [werkgebiedKm, setWerkgebiedKm] = useState("25");
  const [telewash, setTelewash] = useState(false);
  const [bedrijfspanden, setBedrijfspanden] = useState(false);
  const [binnenramen, setBinnenramen] = useState(false);
  const [voorwaarden, setVoorwaarden] = useState(false);
  const [bezig, setBezig] = useState(false);
  const [melding, setMelding] = useState("");

  async function aanmelden(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMelding("");

    if (
      !bedrijfsnaam.trim() || !voornaam.trim() || !achternaam.trim() ||
      !email.trim() || !wachtwoord || !telefoon.trim() || !postcode.trim() ||
      !woonplaats.trim() || !straat.trim() || !huisnummer.trim() ||
      !kvkNummer.trim() || !btwNummer.trim()
    ) {
      setMelding("Vul alle verplichte gegevens in.");
      return;
    }

    if (heeftAvb === null) {
      setMelding("Geef aan of je momenteel een bedrijfsaansprakelijkheidsverzekering hebt.");
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
    if (!/^NL\d{9}B\d{2}$/.test(schoonBtw)) {
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

    if (wachtwoord.length < 8) {
      setMelding("Het wachtwoord moet minimaal 8 tekens bevatten.");
      return;
    }

    if (!voorwaarden) {
      setMelding("Bevestig de verklaring en accepteer de voorwaarden voor professionals.");
      return;
    }

    const diensten = [
      "glazenwasser",
      ...(telewash ? ["telewash"] : []),
      ...(bedrijfspanden ? ["bedrijf"] : []),
      ...(binnenramen ? ["binnen"] : []),
    ];

    setBezig(true);
    const { data, error } = await supabase.auth.signUp({
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
          avb_bevestigd: heeftAvb === true,
          controle_status: "handmatig_te_controleren",
          diensten,
          werkgebied_km: Number(werkgebiedKm),
        },
      },
    });

    if (error || !data.user) {
      setBezig(false);
      setMelding(error?.message || "Account kon niet worden aangemaakt.");
      return;
    }

    if (data.session?.access_token) {
      try {
        const profielResponse = await fetch("/api/professional-register", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${data.session.access_token}`,
          },
        });

        const profielData = await profielResponse.json();
        if (!profielResponse.ok) {
          setBezig(false);
          setMelding(
            profielData.error ||
              "Account is aangemaakt, maar het professionalprofiel kon niet worden opgeslagen."
          );
          return;
        }
      } catch {
        setBezig(false);
        setMelding("Account is aangemaakt, maar het professionalprofiel kon niet worden opgeslagen.");
        return;
      }
    }

    setBezig(false);
    router.push("/professional/bevestigd");
  }

  const inputClass = "w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

  return (
    <main className="min-h-screen bg-gray-50">
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
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">Eenvoudig aanmelden. Geen documenten uploaden.</p>
        </div>

        <form onSubmit={aanmelden} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-9">
          <h2 className="text-2xl font-bold text-gray-900">Aanmelden als professional</h2>
          <p className="mt-2 text-gray-600">ShineGo controleert je KVK- en btw-gegevens handmatig. Je verzekering kun je later vanuit je dashboard aanvullen; bankrekening en betaalverificatie regel je daar ook apart.</p>

          <div className="mt-8 space-y-7">
            <section>
              <h3 className="mb-4 text-lg font-bold text-gray-900">Bedrijfsgegevens</h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2"><label className="mb-2 block font-medium text-gray-800">Bedrijfsnaam *</label><input value={bedrijfsnaam} onChange={(e) => setBedrijfsnaam(e.target.value)} className={inputClass} /></div>
                <div><label className="mb-2 block font-medium text-gray-800">KVK-nummer *</label><input value={kvkNummer} onChange={(e) => setKvkNummer(e.target.value)} inputMode="numeric" maxLength={8} className={inputClass} /></div>
                <div><label className="mb-2 block font-medium text-gray-800">BTW-nummer *</label><input value={btwNummer} onChange={(e) => setBtwNummer(e.target.value.toUpperCase())} placeholder="NL123456789B01" className={inputClass} /></div>
              </div>
              <p className="mt-3 text-sm text-gray-600">Een KVK-uittreksel uploaden is niet nodig.</p>
            </section>

            <section className="border-t pt-7">
              <h3 className="mb-2 text-lg font-bold text-gray-900">Bedrijfsaansprakelijkheidsverzekering</h3>
              <p className="mb-4 text-sm text-gray-600">Een AVB is geen voorwaarde om je ShineGo-profiel te activeren. Geef alleen aan of je er momenteel een hebt. Eventuele verzekeringsgegevens kun je later vrijwillig in je dashboard aanvullen.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${heeftAvb === true ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"}`}>
                  <input type="radio" name="avb" checked={heeftAvb === true} onChange={() => setHeeftAvb(true)} className="h-5 w-5 accent-blue-600" />
                  <span className="font-semibold text-gray-900">Ja, ik heb een AVB</span>
                </label>
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${heeftAvb === false ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"}`}>
                  <input type="radio" name="avb" checked={heeftAvb === false} onChange={() => setHeeftAvb(false)} className="h-5 w-5 accent-blue-600" />
                  <span className="font-semibold text-gray-900">Nee, nog niet</span>
                </label>
              </div>
            </section>

            <section className="border-t pt-7">
              <h3 className="mb-4 text-lg font-bold text-gray-900">Contactpersoon</h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <div><label className="mb-2 block font-medium text-gray-800">Voornaam *</label><input value={voornaam} onChange={(e) => setVoornaam(e.target.value)} className={inputClass} /></div>
                <div><label className="mb-2 block font-medium text-gray-800">Achternaam *</label><input value={achternaam} onChange={(e) => setAchternaam(e.target.value)} className={inputClass} /></div>
                <div><label className="mb-2 block font-medium text-gray-800">E-mailadres *</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} /></div>
                <div><label className="mb-2 block font-medium text-gray-800">Wachtwoord *</label><input type="password" value={wachtwoord} onChange={(e) => setWachtwoord(e.target.value)} minLength={8} className={inputClass} /></div>
                <div className="sm:col-span-2"><label className="mb-2 block font-medium text-gray-800">Telefoonnummer *</label><input type="tel" value={telefoon} onChange={(e) => setTelefoon(e.target.value)} placeholder="06 12345678" className={inputClass} /></div>
              </div>
            </section>

            <section className="border-t pt-7">
              <h3 className="mb-4 text-lg font-bold text-gray-900">Werkgebied en adres</h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <div><label className="mb-2 block font-medium text-gray-800">Postcode *</label><input value={postcode} onChange={(e) => setPostcode(e.target.value.toUpperCase())} className={inputClass} /></div>
                <div><label className="mb-2 block font-medium text-gray-800">Woonplaats *</label><input value={woonplaats} onChange={(e) => setWoonplaats(e.target.value)} className={inputClass} /></div>
                <div><label className="mb-2 block font-medium text-gray-800">Straat *</label><input value={straat} onChange={(e) => setStraat(e.target.value)} className={inputClass} /></div>
                <div><label className="mb-2 block font-medium text-gray-800">Huisnummer *</label><input value={huisnummer} onChange={(e) => setHuisnummer(e.target.value)} className={inputClass} /></div>
                <div><label className="mb-2 block font-medium text-gray-800">Toevoeging</label><input value={toevoeging} onChange={(e) => setToevoeging(e.target.value)} className={inputClass} /></div>
                <div><label className="mb-2 block font-medium text-gray-800">Maximale afstand</label><select value={werkgebiedKm} onChange={(e) => setWerkgebiedKm(e.target.value)} className={inputClass}><option value="10">10 km</option><option value="15">15 km</option><option value="25">25 km</option><option value="35">35 km</option><option value="50">50 km</option><option value="75">75 km</option><option value="100">100 km</option></select></div>
              </div>
            </section>

            <section className="border-t pt-7">
              <h3 className="text-lg font-bold text-gray-900">Diensten en materiaal</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4"><strong className="text-sm text-gray-900">✓ Gewone glasbewassing</strong><p className="mt-1 text-xs text-gray-600">Altijd onderdeel van je profiel.</p></div>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4"><input type="checkbox" checked={telewash} onChange={(e) => setTelewash(e.target.checked)} className="mt-1 h-5 w-5" /><span><strong className="block text-sm text-gray-900">Telescoopsteel</strong><span className="mt-1 block text-xs text-gray-600">Ik beschik over geschikt materiaal.</span></span></label>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4"><input type="checkbox" checked={bedrijfspanden} onChange={(e) => setBedrijfspanden(e.target.checked)} className="mt-1 h-5 w-5" /><span><strong className="block text-sm text-gray-900">Winkel / bedrijfspand</strong></span></label>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4"><input type="checkbox" checked={binnenramen} onChange={(e) => setBinnenramen(e.target.checked)} className="mt-1 h-5 w-5" /><span><strong className="block text-sm text-gray-900">Binnenramen</strong></span></label>
              </div>
            </section>

            <label className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${voorwaarden ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"}`}>
              <input
                type="checkbox"
                checked={voorwaarden}
                onChange={(e) => setVoorwaarden(e.target.checked)}
                className="mt-0.5 h-6 w-6 shrink-0 cursor-pointer accent-blue-600"
              />
              <span className="text-sm leading-6 text-gray-700">Ik verklaar dat mijn gegevens correct zijn, accepteer de <a href="/professional/voorwaarden" target="_blank" rel="noreferrer" className="font-semibold text-blue-600 underline">voorwaarden voor professionals</a> en begrijp dat ik als zelfstandig ondernemer zelf verantwoordelijk ben voor mijn verzekeringen, mijn werkwijze en schade die volgens de wet aan mijn handelen of nalaten kan worden toegerekend.</span>
            </label>

            {melding && <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">{melding}</div>}

            <button type="submit" disabled={bezig} className="w-full rounded-xl bg-blue-600 px-6 py-4 text-lg font-bold text-white hover:bg-blue-700 disabled:bg-gray-400">{bezig ? "Aanmelding wordt opgeslagen..." : "Aanmelden als professional →"}</button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">Aanmelden en activeren kan zonder polisgegevens. ShineGo controleert KVK- en btw-gegevens; de professional blijft zelf verantwoordelijk voor passende verzekeringen en de uitvoering van opdrachten.</p>
      </section>
    </main>
  );
}
