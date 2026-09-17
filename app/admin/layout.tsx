"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = "intercastbv@hotmail.com";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [toegang, setToegang] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setToegang(true);
      return;
    }

    let actief = true;

    async function controleerAdmin(session: Session | null) {
      if (!actief) return;

      if (!session?.user?.email) {
        await fetch("/api/admin/session", { method: "DELETE" });
        router.replace("/admin/login");
        return;
      }

      if (session.user.email.trim().toLowerCase() !== ADMIN_EMAIL) {
        await fetch("/api/admin/session", { method: "DELETE" });
        router.replace("/");
        return;
      }

      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        router.replace("/admin/login");
        return;
      }

      if (actief) setToegang(true);
    }

    supabase.auth.getSession().then(({ data }) => {
      void controleerAdmin(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void controleerAdmin(session);
    });

    return () => {
      actief = false;
      subscription.unsubscribe();
    };
  }, [isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;

  if (!toegang) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="text-sm font-medium text-gray-600">Beheerder controleren...</div>
      </main>
    );
  }

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
        </div>
      </div>
      {children}
    </>
  );
}
