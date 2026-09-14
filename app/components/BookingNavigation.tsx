"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/#diensten", label: "Diensten" },
  { href: "/#hoe", label: "Hoe het werkt" },
  { href: "/prijzen", label: "Prijzen" },
  { href: "/veelgestelde-vragen", label: "Veelgestelde vragen" },
];

export default function BookingNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const actief = pathname.startsWith("/boeken/glazenwassen/");

  useEffect(() => {
    if (!actief) return;
    document.body.classList.add("shinego-booking-nav");
    return () => document.body.classList.remove("shinego-booking-nav");
  }, [actief]);

  if (!actief) return null;

  return (
    <>
      <style jsx global>{`
        body.shinego-booking-nav a[aria-label="Menu"] {
          display: none !important;
        }
      `}</style>

      <nav className="fixed right-5 top-5 z-40 hidden items-center gap-5 rounded-2xl border border-[#d5e9f8] bg-white/95 px-5 py-3 shadow-[0_10px_30px_rgba(46,79,119,.10)] backdrop-blur md:flex">
        {links.map((link) => (
          <a key={link.href} href={link.href} className="text-sm font-semibold text-[#52779b] transition hover:text-[#1683f8]">
            {link.label}
          </a>
        ))}
        <a href="/professional/login" className="rounded-xl border border-[#cfe3f4] bg-white px-4 py-2 text-sm font-bold text-[#315f88] transition hover:border-[#8cc7f2]">
          Inloggen
        </a>
      </nav>

      <div className="fixed right-5 top-4 z-50 md:hidden">
        <button
          type="button"
          aria-label="Menu openen"
          aria-expanded={open}
          onClick={() => setOpen((waarde) => !waarde)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d5e9f8] bg-white text-2xl font-bold text-[#1683f8] shadow-md"
        >
          {open ? "×" : "≡"}
        </button>
        {open && (
          <div className="mt-2 w-64 overflow-hidden rounded-2xl border border-[#d5e9f8] bg-white p-2 shadow-xl">
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#52779b] hover:bg-[#eef8ff] hover:text-[#1683f8]">
                {link.label}
              </a>
            ))}
            <a href="/professional/login" onClick={() => setOpen(false)} className="mt-1 block rounded-xl bg-[#1683f8] px-4 py-3 text-center text-sm font-bold text-white">
              Inloggen
            </a>
          </div>
        )}
      </div>
    </>
  );
}
