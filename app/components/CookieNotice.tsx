"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "shinego_cookie_notice_seen";

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const gezien = localStorage.getItem(STORAGE_KEY);
    if (!gezien) setVisible(true);
  }, []);

  function sluiten() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-[calc(.75rem+env(safe-area-inset-bottom))] z-50 mx-auto max-h-[calc(100dvh-1.5rem-env(safe-area-inset-bottom))] max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:inset-x-4 sm:bottom-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <p className="font-bold text-slate-950">Cookies bij ShineGo</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            ShineGo gebruikt alleen noodzakelijke cookies en lokale opslag om de
            website veilig en goed te laten werken. We gebruiken momenteel geen
            marketing- of advertentiecookies. Lees meer in ons{" "}
            <a
              href="/cookies"
              className="font-semibold text-blue-600 underline underline-offset-2 hover:text-blue-700"
            >
              cookiebeleid
            </a>
            .
          </p>
        </div>

        <button
          type="button"
          onClick={sluiten}
          className="w-full shrink-0 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700 sm:w-auto"
        >
          Begrepen
        </button>
      </div>
    </div>
  );
}
