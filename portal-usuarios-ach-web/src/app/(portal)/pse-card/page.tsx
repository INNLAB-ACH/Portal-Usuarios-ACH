"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, CircleAlert, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { defaultBankAccounts, yellowBank } from "@/data/mock-data";
import { ACCOUNTS_STORAGE_KEY } from "@/lib/ecommerce-flow";
import { formatCurrency } from "@/lib/utils";
import { BankAccount } from "@/types/portal";
import { useHydrated } from "@/lib/use-hydrated";

type Step = "form" | "bank" | "service" | "result";

type PseCardResult = {
  reference: string;
  amount: number;
  virtualCardNumber: string;
  accountAlias: string;
  bankName: string;
};

export default function PseCardPage() {
  const router = useRouter();
  const isHydrated = useHydrated();
  const [step, setStep] = useState<Step>("form");
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);
  const [result, setResult] = useState<PseCardResult | null>(null);

  const accounts = useMemo<BankAccount[]>(() => {
    const withFallbackBalance = (source: BankAccount[]) =>
      source.map((account) => {
        const fallback = defaultBankAccounts.find((item) => item.id === account.id);

        return {
          ...account,
          balance: account.balance ?? fallback?.balance ?? 0,
        };
      });

    if (typeof window === "undefined") {
      return withFallbackBalance(defaultBankAccounts);
    }

    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    return raw
      ? withFallbackBalance(JSON.parse(raw) as BankAccount[])
      : withFallbackBalance(defaultBankAccounts);
  }, []);

  const selectedAccount = accounts.find((account) => account.id === selectedAccountId) ?? null;
  const hasEnoughBalance = (selectedAccount?.balance ?? 0) >= amount;
  const canContinue = Boolean(selectedAccount && amount > 0 && hasEnoughBalance);

  if (!isHydrated) {
    return <div className="flex min-h-[220px] items-center justify-center">Cargando Tarjeta PSE...</div>;
  }

  if (step === "bank") {
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-amber-950/30 p-4">
        <section className="w-full max-w-md rounded-2xl border border-amber-500/80 bg-amber-300 px-4 py-5 shadow-xl md:px-5">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-900/80">Notificación bancaria</p>
          <h1 className="mt-2 text-xl font-bold text-amber-950">{yellowBank.name}</h1>
          <p className="mt-2 text-sm text-amber-950/90">
            Deseas confirmar la recarga para generar tu tarjeta debito virtual PSE.
          </p>

          <div className="mt-4 space-y-2 rounded-xl border border-amber-800/25 bg-amber-100/80 p-3 text-sm text-amber-950">
            <p className="flex items-center justify-between">
              <span className="text-amber-900/70">Monto</span>
              <strong>{formatCurrency(amount)}</strong>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-amber-900/70">Cuenta</span>
              <strong>{selectedAccount?.alias ?? "Cuenta no disponible"}</strong>
            </p>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              className="border-amber-900/30 bg-amber-100 text-amber-950 hover:bg-amber-200"
              onClick={() => setStep("form")}
            >
              Cancelar
            </Button>
            <Button className="bg-amber-900 text-amber-50 hover:bg-amber-950" onClick={() => setStep("service")}>
              Confirmar banco
            </Button>
          </div>
        </section>
      </div>
    );
  }

  if (step === "service") {
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-cyan-950/30 p-4">
        <section className="w-full max-w-md rounded-2xl border border-cyan-500/70 bg-cyan-200 px-4 py-5 shadow-xl md:px-5">
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-900/80">Confirmación del servicio</p>
          <h1 className="mt-2 text-xl font-bold text-cyan-950">Tarjeta PSE</h1>
          <p className="mt-2 text-sm text-cyan-950/90">
            El banco aprobó la transacción. Confirma para emitir y recargar tu tarjeta virtual.
          </p>

          <div className="mt-4 space-y-2 rounded-xl border border-cyan-900/20 bg-cyan-50 p-3 text-sm text-cyan-950">
            <p className="flex items-center justify-between">
              <span className="text-cyan-900/70">Recarga inicial</span>
              <strong>{formatCurrency(amount)}</strong>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-cyan-900/70">Cuenta</span>
              <strong>{selectedAccount?.alias}</strong>
            </p>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              className="border-cyan-900/30 bg-cyan-50 text-cyan-950 hover:bg-cyan-100"
              onClick={() => setStep("form")}
            >
              Cancelar
            </Button>
            <Button
              className="bg-cyan-900 text-cyan-50 hover:bg-cyan-950"
              onClick={() => {
                const last4 = Math.floor(Math.random() * 9000 + 1000);
                setResult({
                  reference: `ACH-${Math.floor(Math.random() * 900000 + 100000)}`,
                  amount,
                  virtualCardNumber: `5589 **** **** ${last4}`,
                  accountAlias: selectedAccount?.alias ?? "Sin cuenta",
                  bankName: selectedAccount?.bank ?? "Sin banco",
                });
                setStep("result");
              }}
            >
              Confirmar tarjeta
            </Button>
          </div>
        </section>
      </div>
    );
  }

  if (step === "result" && result) {
    return (
      <section className="mx-auto max-w-3xl space-y-4">
        <article className="glass-card border border-primary/20 p-6 md:p-8">
          <div className="text-center">
            <CheckCircle2 className="mx-auto size-14 text-green-600" />
            <h1 className="mt-4 text-2xl font-bold text-primary">Tarjeta virtual generada</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Tu tarjeta debito virtual PSE quedo creada y recargada correctamente.
            </p>
          </div>

          <div className="mt-5 space-y-2 rounded-xl border border-border/80 bg-muted/35 p-4 text-sm">
            <p className="flex items-center justify-between">
              <span className="text-muted-foreground">Referencia</span>
              <strong>{result.reference}</strong>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-muted-foreground">Tarjeta virtual</span>
              <strong className="font-mono">{result.virtualCardNumber}</strong>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-muted-foreground">Recarga</span>
              <strong>{formatCurrency(result.amount)}</strong>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-muted-foreground">Banco</span>
              <strong>{result.bankName}</strong>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-muted-foreground">Cuenta</span>
              <strong>{result.accountAlias}</strong>
            </p>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setAmount(0);
                setSelectedAccountId(null);
                setStep("form");
              }}
            >
              Nueva tarjeta
            </Button>
            <Button onClick={() => router.push("/dashboard")}>Volver a inicio</Button>
          </div>
        </article>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <section className="glass-card grid gap-3 p-4 md:grid-cols-2 md:p-5">
        <article className="rounded-xl border border-border/70 bg-white p-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Servicio</p>
          <p className="mt-1 flex items-center gap-2 text-base font-semibold text-primary">
            <CreditCard className="size-4" />
            Tarjeta PSE
          </p>
        </article>
        <article className="rounded-xl border border-border/70 bg-white p-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Monto de recarga</p>
          <p className="mt-1 text-xl font-bold text-primary">{amount > 0 ? formatCurrency(amount) : "---"}</p>
        </article>
      </section>

      <section className="glass-card p-4 md:p-5">
        <h2 className="text-xl font-bold text-primary">Genera tu tarjeta debito virtual</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Define el monto de recarga y selecciona la cuenta de origen para continuar.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="recharge-amount" className="text-sm font-semibold text-primary">
              Monto de recarga
            </label>
            <input
              id="recharge-amount"
              type="number"
              min={0}
              value={amount || ""}
              onChange={(event) => setAmount(Math.max(0, Number(event.target.value) || 0))}
              placeholder="Ingresa el monto"
              className="mt-2 h-11 w-full rounded-lg border border-border/80 px-3 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-primary">Cuenta de origen</label>
            <div className="mt-2 max-h-52 space-y-2 overflow-y-auto">
              {accounts.map((account) => {
                const selected = selectedAccountId === account.id;
                return (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => setSelectedAccountId(account.id)}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-xs transition ${
                      selected ? "border-primary bg-primary/5" : "border-border/70 hover:border-primary/40"
                    }`}
                  >
                    <p className="font-semibold">{account.alias}</p>
                    <p className="text-muted-foreground">{account.bank}</p>
                    <p className="text-muted-foreground">Saldo disponible: {formatCurrency(account.balance ?? 0)}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <Button className="h-11 w-full" disabled={!canContinue} onClick={() => setStep("bank")}>
            Continuar
          </Button>

          {selectedAccountId && amount > 0 && !hasEnoughBalance ? (
            <p className="flex items-center gap-2 text-xs text-red-700">
              <CircleAlert className="size-3.5" />
              La cuenta seleccionada no tiene saldo suficiente para la recarga.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
