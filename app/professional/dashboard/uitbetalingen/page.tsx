"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

declare global {
  interface Window {
    StripeConnect?: {
      onLoad?: () => void;
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

export default function UitbetalingenPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [fout, setFout] = useState("");
  const [scriptKlaar, setScriptKlaar] = useState(false);
  const gestartRef = useRef(false);

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
    if (!scriptKlaar || gestartRef.current || !containerRef.current) return;
    gestartRef.current = true;

    async function startEmbeddedOnboarding() {
      try {
        const token = await haalTokenOp();
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
  }, [scriptKlaar, router]);

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
          <h1 className="text-2xl font-bold text-gray-900">Stripe-verificatie afronden</h1>
          <p className="mt-2 text-gray-600">
            Je bankrekening is gekoppeld. Stripe vraagt alleen nog de gegevens die op dit moment verplicht zijn om uitbetalingen vrij te geven. Gegevens die ShineGo al heeft aangeleverd hoef je niet opnieuw in te vullen als Stripe ze al heeft geaccepteerd.
          </p>

          {fout ? (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              {fout}
            </div>
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
