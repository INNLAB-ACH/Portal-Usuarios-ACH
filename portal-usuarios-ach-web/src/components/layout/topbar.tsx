"use client";

import { useRouter, usePathname } from "next/navigation";
import { LogOut, Menu, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/app-providers";

const titles: Record<string, { heading: string; sub: string }> = {
  "/dashboard": { heading: "Inicio", sub: "Resumen consolidado de operaciones" },
  "/accounts": { heading: "Cuentas", sub: "Gestion de cuentas bancarias" },
  "/transactions": { heading: "Transacciones", sub: "Historial y pagos automaticos" },
  "/loans": { heading: "Prestamos", sub: "Creditos activos y ofertas" },
  "/bills": { heading: "Facturas", sub: "Facturas activas, futuras y pasadas" },
  "/security-social": { heading: "Seguridad Social", sub: "Planilla y afiliaciones" },
  "/settings": { heading: "Configuracion", sub: "Preferencias de la cuenta" },
};

type TopbarProps = {
  onToggleSidebar: () => void;
};

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border/80 bg-white/90 px-4 backdrop-blur md:px-6">
      <div>
        <div className="mb-1 flex items-center gap-2 md:hidden">
          <Button variant="outline" size="icon" onClick={onToggleSidebar} aria-label="Abrir menu">
            <Menu className="size-4" />
          </Button>
        </div>
        <h1 className="text-lg font-bold text-primary md:text-2xl">{titles[pathname]?.heading ?? "Portal"}</h1>
        <p className="text-xs text-muted-foreground md:text-sm">{titles[pathname]?.sub ?? "Monitoreo consolidado de operaciones ACH"}</p>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <span className="hidden items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary md:inline-flex">
          <UserCircle2 className="size-4" />
          {user?.fullName ?? "Usuario"}
        </span>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            logout();
            router.replace("/");
          }}
        >
          <LogOut className="size-4" />
          Salir
        </Button>
      </div>
    </header>
  );
}
