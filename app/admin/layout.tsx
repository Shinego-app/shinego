import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="border-b bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl justify-end">
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
