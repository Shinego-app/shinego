"use client";

import Script from "next/script";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

declare global {
  interface Window {
    StripeConnect?: {
      init: (options: {
        publishableKey: string;
        fetchClientSecret: () => Promise<string | undefined>;
        locale?: string;
      }) => {
        create: (name: string) => HTMLElement & {
          setOnExit?: (callback: () => void) => void;
          setCollectionOptions?: (options: {
            fields: "currently_due" | "eventually_due";
            futureRequirements?: "omit" | "include";
            requirements?: {
              exclude?: string[];
              only?: string[];
            };
          }) => void;
        };
      };
    };
  }
}

function isoNaarNl(datum: string) {
  const match = datum.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return datum;
  return `${match[3]}-${match[2]}-${match[1]}`;
}

function nlNaarIso(datum: string) {
  const match = datum.trim().match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) return null;

  const dag = Number(match[1]);
  const maand = Number(match[2]);
  const jaar = Number(match[3]);
  const testDatum = new Date(Date.UTC(jaar, maand - 1, dag));

  if (
    testDatum.getUTCFullYear() !== jaar ||
    testDatum.getUTCMonth() !== maand - 1 ||
    testDatum.getUTCDate() !== dag
  ) {
    return null;
  }

  return `${match[3]}-${match[2]}-${match[1]}`;
}

export default function UitbetalingenPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const gestartRef = useRef(false);

  const [fout, setFout] = useState("");
  const [scriptKlaar, setScriptKlaar] = useState(false);
  const [profielLaden, setProfielLaden] = useState(true);
  const [identiteitKlaar, setIdentiteitKlaar] = useState(false);
  const [opslaanBezig, setOpslaanBezig] = useState(false);
  const [geboortedatum, setGeboortedatum] = useState("");
  const [priveAdresZelfde, setPriveAdresZelfde] = useState(true);
  const [eigenaarBevestigd, setEigenaarBevestigd] = useState(false);
  const [priveStraat, setPriveStraat] = useState("");
  const [priveHuisnummer, setPriveHuisnummer] = useState("");
  const [priveToevoeging, setPriveToevoeging] = useState("");
  const [privePostcode, setPrivePostcode] = useState("");
  const [priveWoonplaats, setPriveWoonplaats] = useState("");

  async function haalTokenOp() {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    if (!token) {
      throw new Error("Je sessie is verlopen. Log opnieuw in.");
    }

    return token;
  }

  async function haalSessionOp(token?: string) {
    const authToken = token || (await haalTokenOp());

    const response = await fetch("/api/stripe-connect/session", {
      method: "POST",
      headers: { Authorization: `Bearer ${authToken}` },
    });

    const result = await response.json();
    if (!response.ok || !result.client_secret) {
      throw new Error(result.error || "Stripe onboarding kon niet worden geladen.");
    }

    return result as { client_secret: string; publishable_key: string };
  }

  useEffect(() => {
    async function laadIdentiteitsgegevens() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        setFout("Je sessie is verlopen. Log opnieuw in.");
        setProfielLaden(false);
        return;
      }

      const metadata = data.user.user_metadata || {};
      const datum = typeof metadata.stripe_geboortedatum === "string" ? metadata.stripe_geboortedatum : "";
      const eigenaar = metadata.stripe_eigenaar_bevestigd === true;
      const adresZelfde = metadata.stripe_priveadres_zelfde !== false;

      setGeboortedatum(datum ? isoNaarNl(datum) : "");
      setEigenaarBevestigd(eigenaar);
      setPriveAdresZelfde(adresZelfde);
      setPriveStraat(metadata.stripe_prive_straat || "");
      setPriveHuisnummer(metadata.stripe_prive_huisnummer || "");
      setPriveToevoeging(metadata.stripe_prive_toevoeging || "");
      setPrivePostcode(metadata.stripe_prive_postcode || "");
      setPriveWoonplaats(metadata.stripe_prive_woonplaats || "");

      setIdentiteitKlaar(Boolean(datum && eigenaar));
      setProfielLaden(false);
    }

    laadIdentiteitsgegevens();
  }, []);

  async function slaIdentiteitOp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFout("");

    const geboortedatumIso = nlNaarIso(geboortedatum);
    if (!geboortedatumIso) {
      setFout("Vul je geboortedatum in als DD-MM-JJJJ, bijvoorbeeld 07-04-1983.");
      return;
    }

    if (!eigenaarBevestigd) {
      setFout("Bevestig dat je eigenaar/vennoot en bevoegd vertegenwoordiger bent.");
      return;
    }

    if (
      !priveAdresZelfde &&
      (!priveStraat.trim() ||
        !priveHuisnummer.trim() ||
        !privePostcode.trim() ||
        !priveWoonplaats.trim())
    ) {
      setFout("Vul je volledige woonadres in.");
      return;
    }

    setOpslaanBezig(true);

    const { error } = await supabase.auth.updateUser({
      data: {
        stripe_geboortedatum: geboortedatumIso,
        stripe_eigenaar_bevestigd: true,
        stripe_priveadres_zelfde: priveAdresZelfde,
        stripe_prive_straat: priveAdresZelfde ? null : priveStraat.trim(),
        stripe_prive_huisnummer: priveAdresZelfde ? null : priveHuisnummer.trim(),
        stripe_prive_toevoeging: priveAdresZelfde ? null : priveToevoeging.trim() || null,
        stripe_prive_postcode: priveAdresZelfde ? null : privePostcode.trim().toUpperCase(),
        stripe_prive_woonplaats: priveAdresZelfde ? null : priveWoonplaats.trim(),
      },
    });

    setOpslaanBezig(false);

    if (error) {
      setFout(error.message || "Gegevens konden niet worden opgeslagen.");
      return;
    }

    gestartRef.current = false;
    setIdentiteitKlaar(true);
  }

  useEffect(() => {
    if (!scriptKlaar || !identiteitKlaar || gestartRef.current || !containerRef.current) return;
    gestartRef.current = true;

    async function startEmbeddedOnboarding() {
      try {
        const token = await haalTokenOp();

        const prefillResponse = await fetch("/api/stripe-connect", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        const prefillResult = await prefillResponse.json();
        if (!prefillResponse.ok) {
          throw new Error(prefillResult.error || "Stripe-gegevens konden niet worden voorbereid.");
        }

        const eersteSession = await haalSessionOp(token);

        if (!window.StripeConnect) {
          throw new Error("Stripe Connect kon niet worden geladen.");
        }

        let eersteClientSecret: string | undefined = eersteSession.client_secret;

        const stripeConnect = window.StripeConnect.init({
          publishableKey: eersteSession.publishable_key,
          locale: "nl-NL",
          fetchClientSecret: async () => {
            if (eersteClientSecret) {
              const secret = eersteClientSecret;
              eersteClientSecret = undefined;
              return secret;
            }

            const nieuweSession = await haalSessionOp();
            return nieuweSession.client_secret;
          },
        });

        const onboarding = stripeConnect.create("account-onboarding");

        onboarding.setCollectionOptions?.({
          fields: "currently_due",
          futureRequirements: "omit",
        });

        onboarding.setOnExit?.(() => {
          router.push("/professional/dashboard?stripe=return");
        });

        containerRef.current?.replaceChildren(onboarding);
      } catch (error) {
        setFout(
          error instanceof Error
            ? error.message
            : "Stripe onboarding kon niet worden geladen."
        );
      }
    }

    startEmbeddedOnboarding();
  }, [scriptKlaar, identiteitKlaar, router]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <Script
        src="https://connect-js.stripe.com/v1.0/connect.js"
        strategy="afterInteractive"
        onLoad={() => setScriptKlaar(true)}
        onError={() => setFout("Stripe Connect kon niet worden geladen.")}
      />

      <div className="mx-auto w-full max-w-3xl">
        <button
          onClick={() => router.push("/professional/dashboard")}
          className="mb-5 rounded-xl border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-900"
        >
          ← Terug naar dashboard
        </button>

        <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
          <h1 className="text-2xl font-bold text-gray-900">Uitbetalingen instellen</h1>
          <p className="mt-2 text-gray-600">
            ShineGo levert je gegevens vooraf aan Stripe. Je hoeft alleen gegevens aan te vullen die ShineGo nog niet heeft en daarna de verplichte Stripe-controle af te ronden.
          </p>

          {fout && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              {fout}
            </div>
          )}

          {profielLaden ? (
            <p className="mt-6 text-gray-600">Gegevens laden...</p>
          ) : !identiteitKlaar ? (
            <form onSubmit={slaIdentiteitOp} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block font-semibold text-gray-900">Geboortedatum *</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={geboortedatum}
                  onChange={(e) => setGeboortedatum(e.target.value)}
                  placeholder="DD-MM-JJJJ"
                  maxLength={10}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
                />
                <p className="mt-1 text-sm text-gray-500">Bijvoorbeeld: 07-04-1983</p>
              </div>

              <label className="flex items-start gap-3 rounded-xl border border-gray-200 p-4">
                <input
                  type="checkbox"
                  checked={eigenaarBevestigd}
                  onChange={(e) => setEigenaarBevestigd(e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm text-gray-700">
                  Ik ben eigenaar/vennoot en bevoegd vertegenwoordiger van dit bedrijf.
                </span>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-gray-200 p-4">
                <input
                  type="checkbox"
                  checked={priveAdresZelfde}
                  onChange={(e) => setPriveAdresZelfde(e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm text-gray-700">
                  Mijn woonadres is hetzelfde als het adres dat al bij ShineGo staat.
                </span>
              </label>

              {!priveAdresZelfde && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    value={priveStraat}
                    onChange={(e) => setPriveStraat(e.target.value)}
                    placeholder="Straat"
                    className="rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
                  />
                  <input
                    type="text"
                    value={priveHuisnummer}
                    onChange={(e) => setPriveHuisnummer(e.target.value)}
                    placeholder="Huisnummer"
                    className="rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
                  />
                  <input
                    type="text"
                    value={priveToevoeging}
                    onChange={(e) => setPriveToevoeging(e.target.value)}
                    placeholder="Toevoeging"
                    className="rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
                  />
                  <input
                    type="text"
                    value={privePostcode}
                    onChange={(e) => setPrivePostcode(e.target.value.toUpperCase())}
                    placeholder="Postcode"
                    className="rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
                  />
                  <input
                    type="text"
                    value={priveWoonplaats}
                    onChange={(e) => setPriveWoonplaats(e.target.value)}
                    placeholder="Woonplaats"
                    className="rounded-xl border border-gray-300 px-4 py-3 text-gray-900 sm:col-span-2"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={opslaanBezig}
                className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white disabled:opacity-50"
              >
                {opslaanBezig ? "Opslaan..." : "Verder naar Stripe"}
              </button>
            </form>
          ) : (
            <div className="mt-6">
              {!scriptKlaar && <p className="text-gray-600">Stripe-verificatie laden...</p>}
              <div ref={containerRef} />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
