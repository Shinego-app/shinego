import type { Metadata } from "next";
import type { ReactNode } from "react";
import BookingNavigation from "@/app/components/BookingNavigation";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function BoekenLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BookingNavigation />
      {children}
    </>
  );
}
