"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleCheck, CreditCard, ShieldCheck, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ecommerceCartItems } from "@/data/mock-data";
import { formatCurrency } from "@/lib/utils";
import { writeEcommerceFlowContext } from "@/lib/ecommerce-flow";

export default function HomePage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<"pse-hub" | null>(null);
  const total = useMemo(
    () => ecommerceCartItems.reduce((sum, item) => sum + item.amount * item.quantity, 0),
    [],
  );

  const goToHubLogin = () => {
    if (!selectedMethod) {
      return;
    }

    writeEcommerceFlowContext({
      entry: "ecommerce",
      selectedMethod,
      merchantName: "Relojeria eCommerce",
      total,
      cartItems: ecommerceCartItems,
      returnPath: "/instant-payments",
    });

    router.push("/hub-login");
  };

  return (
    <main className="relative min-h-screen p-4 md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(0,168,168,0.16),transparent_35%),radial-gradient(circle_at_88%_16%,rgba(0,48,135,0.16),transparent_30%)]" />

      <section className="relative mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="glass-card overflow-hidden">
          <header className="border-b border-border/70 px-5 py-4 md:px-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Ecommerce Demo</p>
            <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold text-primary md:text-3xl">
              <ShoppingCart className="size-6" />
              Carrito de compras
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">Tus relojes ya estan seleccionados y listos para finalizar el pago.</p>
          </header>

          <div className="space-y-3 p-5 md:p-6">
            {ecommerceCartItems.map((item) => (
              <article key={item.id} className="rounded-xl border border-border/80 bg-white px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-primary">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.brand} · {item.finish}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                  </div>
                  <strong className="text-base md:text-lg">{formatCurrency(item.amount * item.quantity)}</strong>
                </div>
              </article>
            ))}
          </div>
        </article>

        <aside className="glass-card h-fit p-5 md:p-6">
          <h2 className="text-lg font-semibold text-primary">Metodo de pago</h2>
          <p className="mt-1 text-sm text-muted-foreground">Selecciona una opcion para continuar al PSE Hub.</p>

          <button
            type="button"
            onClick={() => setSelectedMethod("pse-hub")}
            className={`mt-4 flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition ${
              selectedMethod === "pse-hub"
                ? "border-primary bg-primary/5"
                : "border-border/80 bg-white hover:border-primary/40"
            }`}
          >
            <span
              className={`mt-0.5 inline-flex size-5 items-center justify-center rounded-full border ${
                selectedMethod === "pse-hub" ? "border-primary bg-primary text-white" : "border-muted-foreground/40"
              }`}
            >
              {selectedMethod === "pse-hub" ? <CircleCheck className="size-3.5" /> : null}
            </span>
            <span>
              <span className="block text-sm font-semibold text-primary">PSE Hub</span>
              <span className="block text-xs text-muted-foreground">Canal unificado para pagos inmediatos y transacciones.</span>
            </span>
          </button>

          <div className="mt-6 space-y-2 rounded-xl border border-border/70 bg-white p-4">
            <p className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(total)}</span>
            </p>
            <p className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Comision PSE Hub</span>
              <span>{formatCurrency(0)}</span>
            </p>
            <p className="flex items-center justify-between border-t border-border/70 pt-2 text-base font-bold text-primary">
              <span>Total a pagar</span>
              <span>{formatCurrency(total)}</span>
            </p>
          </div>

          <Button className="mt-5 h-11 w-full gap-2" disabled={!selectedMethod} onClick={goToHubLogin}>
            <CreditCard className="size-4" />
            Ir a pagar
          </Button>

          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5" />
            Flujo de demo seguro con autenticacion HUB antes de confirmar la transaccion.
          </p>
        </aside>
      </section>
    </main>
  );
}
