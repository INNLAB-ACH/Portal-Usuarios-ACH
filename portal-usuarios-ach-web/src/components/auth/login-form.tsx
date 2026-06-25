"use client";

import { FormEvent, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/app-providers";
import { readEcommerceFlowContext } from "@/lib/ecommerce-flow";

export function LoginForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await login(username.trim(), password.trim());

    if (!result.ok) {
      setError(result.message ?? "No fue posible iniciar sesion");
      setLoading(false);
      return;
    }

    const returnTo = searchParams.get("returnTo");
    const ecommerceFlow = readEcommerceFlowContext();
    const fallbackRoute =
      ecommerceFlow?.entry === "ecommerce"
        ? ecommerceFlow.returnPath
        : pathname === "/hub-login"
          ? "/instant-payments"
          : "/dashboard";
    const targetRoute = returnTo?.startsWith("/") ? returnTo : fallbackRoute;

    router.replace(targetRoute);
  };

  return (
    <section className="glass-card relative w-full max-w-4xl overflow-hidden">
      <div className="grid min-h-[520px] md:grid-cols-[1.15fr_1fr]">
        <div className="hidden bg-[linear-gradient(155deg,#01265e_0%,#003087_45%,#00a8a8_100%)] p-10 text-white md:flex md:flex-col md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/90">Portal ACH Colombia</p>
            <h1 className="mt-6 max-w-md text-4xl font-bold leading-tight">Gestiona tus pagos y transacciones desde un sólo lugar</h1>
          </div>
          <p className="max-w-sm text-sm text-cyan-100/90">
            Prototipo financiero con panel consolidado de deudas, cupos activos, facturas solicitadas y seguridad social.
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col justify-center gap-6 p-8 md:p-10">
          <header>
            <h2 className="text-2xl font-bold text-primary">Ingreso de usuarios</h2>
            <p className="mt-2 text-sm text-muted-foreground">Usa demo / 1234 para iniciar.</p>
          </header>

          <label className="space-y-2 text-sm font-medium">
            Usuario
            <input
              className="h-11 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>

          <label className="space-y-2 text-sm font-medium">
            Contrasena
            <input
              type="password"
              className="h-11 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error ? <p className="rounded-md bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}

          <Button type="submit" className="h-11 gap-2" disabled={loading}>
            <LogIn className="size-4" />
            {loading ? "Ingresando..." : "Ingresar al portal"}
          </Button>
        </form>
      </div>
    </section>
  );
}
