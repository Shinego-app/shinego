"use client";

import Link from "next/link";

export default function ProfessionalBevestigdPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            ShineGo
          </Link>
        </div>
      </header>

      <section className="mx-auto flex max-w-2xl flex-col items-center px-6 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
          ✓
        </div>

        <h1 className="mt-8 text-3xl font-bold text-gray-900">
          Aanmelding ontvangen!
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          Bedankt voor je aanmelding als ShineGo Professional.
        </p>

        <div className="mt-8 w-full rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">
            Wat gebeurt er nu?
          </h2>

          <div className="mt-5 space-y-4 text-gray-600">
            <p>
              1. ShineGo controleert je bedrijfs- en contactgegevens.
            </p>

            <p>
              2. Na goedkeuring wordt je profiel geactiveerd.
            </p>

            <p>
              3. Daarna kun je opdrachten ontvangen in jouw werkgebied.
            </p>
          </div>
        </div>

        <div className="mt-6 w-full rounded-2xl bg-blue-50 p-5 text-sm text-blue-900">
          Je ontvangt bericht zodra je aanmelding is gecontroleerd.
        </div>

        <Link
          href="/"
          className="mt-8 rounded-xl bg-blue-600 px-8 py-4 font-bold text-white transition hover:bg-blue-700"
        >
          Terug naar ShineGo
        </Link>
      </section>
    </main>
  );
}