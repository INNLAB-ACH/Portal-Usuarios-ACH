"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, HandCoins, House, Landmark, ReceiptText, Settings, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: House },
  { href: "/accounts", label: "Cuentas", icon: Landmark },
  { href: "/transactions", label: "Transacciones", icon: CreditCard },
  { href: "/loans", label: "Prestamos", icon: HandCoins },
  { href: "/bills", label: "Facturas", icon: ReceiptText },
  { href: "/security-social", label: "Seguridad social", icon: ShieldCheck },
  { href: "/settings", label: "Configuracion", icon: Settings },
];

type SidebarProps = {
  mobileOpen: boolean;
  onNavigate: () => void;
};

export function Sidebar({ mobileOpen, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const activeItem = navItems.find((item) => item.href === pathname);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 w-72 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 md:static md:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="px-5 pb-5 pt-7">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-200">ACH Colombia</p>
        <p className="mt-2 text-xl font-bold">{activeItem?.label ?? "Portal Usuarios"}</p>
      </div>

      <nav className="space-y-1 px-3 pb-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground before:absolute before:inset-y-1 before:left-0 before:w-[3px] before:rounded-full before:bg-cyan-300"
                  : "text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
