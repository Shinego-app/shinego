"use client";

import { useState } from "react";

export default function BoekenPage() {
  const [dienst, setDienst] = useState("");

  const diensten = [
    {
      id: "glazenwassen",
      naam: "Glazenwassen",
      icoon: "🪟",
      omschrijving: "Ramen aan de buitenzijde laten reinigen",
    },
    {
      id: "schilderwerk",
      naam: "Schilderwerk",
      icoon: "🎨",
      omschrijving: "Binnen- en buitenschilderwerk",
    },
    {
      id: "stucwerk",
      naam: "Stucwerk",
      icoon: "🧱",
      omschrijving: "Wanden en plafonds laten stucen",
    },
    {
      id: "vloeren",
      naam: "Vloeren leggen",
      icoon: "🏠",
      omschrijving: "Laminaat, PVC en andere vloeren",
    },
  ];

  function gaVerder() {
    if (!dienst) return;

    window.location.href = `/boeken/${dienst}`;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="text-2xl font-bold text-blue-600">
            ShineGo
          </a>

          <a
            href="/"
            className="font-medium text-gray-600 hover:text-blue-600"
          >
            ← Terug
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-10">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-blue-600">
              Stap 1 van 4
            </span>

            <span className="text-sm text-gray-500">
              Kies een dienst
            </span>
          </div>

          <div className="h-2 rounded-full bg-gray-200">
            <div className="h-2 w-1/4 rounded-full bg-blue-600" />
          </div>
        </div>

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
            Wat wil je laten doen?
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Kies een dienst. Daarna stellen we een paar vragen om jouw klus
            verder samen te stellen.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {diensten.map((item) => {
            const gekozen = dienst === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setDienst(item.id)}
                className={`relative rounded-3xl border-2 bg-white p-7 text-left transition ${
                  gekozen
                    ? "border-blue-600 shadow-lg ring-4 ring-blue-100"
                    : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                }`}
              >
                <div
                  className={`absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                    gekozen
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300"
                  }`}
                >
                  {gekozen ? "✓" : ""}
                </div>

                <div className="text-5xl">{item.icoon}</div>

                <h2 className="mt-5 text-2xl font-bold text-gray-900">
                  {item.naam}
                </h2>

                <p className="mt-2 pr-8 text-gray-600">
                  {item.omschrijving}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-gray-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {dienst ? (
              <>
                <p className="text-sm text-gray-500">Je hebt gekozen:</p>

                <p className="font-bold text-gray-900">
                  {diensten.find((item) => item.id === dienst)?.naam}
                </p>
              </>
            ) : (
              <p className="text-gray-500">
                Kies hierboven eerst een dienst.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={gaVerder}
            disabled={!dienst}
            className={`rounded-xl px-10 py-4 text-lg font-bold transition ${
              dienst
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "cursor-not-allowed bg-gray-200 text-gray-400"
            }`}
          >
            Verder →
          </button>
        </div>
      </section>
    </main>
  );
}