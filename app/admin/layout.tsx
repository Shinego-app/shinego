"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) return <>{children}</>;

  return (
    <>
      <div className="border-b bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-end gap-3">
          <a
            href="/admin/betalingen"
            className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
          >
            Betalingen
          </a>
          <a
            href="/admin/professionals"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
          >
            Professionals beheren
          </a>
          <a
            href="/api/admin-auth/logout"
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Uitloggen
          </a>
        </div>
      </div>
      {children}
    </>
  );
}
