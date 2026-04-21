"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { useAuth } from "@/components/providers/app-providers";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isHydrated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isHydrated && !user) {
      router.replace("/");
    }
  }, [isHydrated, router, user]);

  if (!isHydrated || !user) {
    return <div className="flex min-h-screen items-center justify-center">Cargando portal...</div>;
  }

  return (
    <div className="relative flex min-h-screen flex-col md:flex-row">
      <Sidebar mobileOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} />
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-black/25 backdrop-blur-[1px] md:hidden"
          aria-label="Cerrar menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar onToggleSidebar={() => setMobileOpen((prev) => !prev)} />
        <main className="page-enter flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
