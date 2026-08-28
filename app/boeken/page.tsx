"use client";

import { useEffect } from "react";

export default function BoekenPage() {
  useEffect(() => {
    window.location.href = "/boeken/glazenwassen";
  }, []);

  return null;
}

  