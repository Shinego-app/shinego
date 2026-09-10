"use client";

import { useEffect } from "react";

export default function GlazenwassenPage() {
  useEffect(() => {
    const type = new URLSearchParams(window.location.search).get("type");

    if (type) {
      window.location.replace(`/boeken/glazenwassen/details?type=${encodeURIComponent(type)}`);
      return;
    }

    window.location.replace("/#diensten");
  }, []);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eaf7ff_0%,#f8fcff_55%,#eef8ff_100%)]" />
  );
}
