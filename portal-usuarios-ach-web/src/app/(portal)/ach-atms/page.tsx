"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, CircleAlert, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { defaultBankAccounts, yellowBank } from "@/data/mock-data";
import { ACCOUNTS_STORAGE_KEY } from "@/lib/ecommerce-flow";
import { formatCurrency } from "@/lib/utils";
import { BankAccount } from "@/types/portal";
import { useHydrated } from "@/lib/use-hydrated";

type Step = "form" | "bank" | "service" | "result";

type AchAtmResult = {
  reference: string;
  amount: number;
  point: string;
  withdrawalCode: string;
  accountAlias: string;
  bankName: string;
};

const withdrawalPoints = [
  { id: "atm-d1", label: "D1" },
  { id: "atm-exito", label: "El Exito" },
  { id: "atm-carulla", label: "Carulla" },
];

export default function AchAtmsPage() {
  const router = useRouter();
  const isHydrated = useHydrated();
  const [step, setStep] = useState<Step>("form");
  const [selectedPointId, setSelectedPointId] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);
  const [result, setResult] = useState<AchAtmResult | null>(null);

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

  const selectedPoint = withdrawalPoints.find((point) => point.id === selectedPointId) ?? null;
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId) ?? null;
  const hasEnoughBalance = (selectedAccount?.balance ?? 0) >= amount;
  const canContinue = Boolean(selectedPoint && selectedAccount && amount > 0 && hasEnoughBalance);

  if (!isHydrated) {
    return <div className="flex min-h-[220px] items-center justify-center">Cargando cajeros ACH...</div>;
  }

  if (step === "bank") {
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-amber-950/30 p-4">
        <section className="w-full max-w-md rounded-2xl border border-amber-500/80 bg-amber-300 px-4 py-5 shadow-xl md:px-5">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-900/80">Notificacion bancaria</p>
          <h1 className="mt-2 text-xl font-bold text-amber-950">{yellowBank.name}</h1>
          <p className="mt-2 text-sm text-amber-950/90">
            Deseas confirmar el retiro en <strong>{selectedPoint?.label}</strong>.
          </p>

          <div className="mt-4 space-y-2 rounded-xl border border-amber-800/25 bg-amber-100/80 p-3 text-sm text-amber-950">
            <p className="flex items-center justify-between">
              <span className="text-amber-900/70">Monto</span>
              <strong>{formatCurrency(amount)}</strong>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-amber-900/70">Punto</span>
              <strong>{selectedPoint?.label}</strong>
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
      <div className="fixed inset-0 z-50 grid place-items-center bg-blue-950/30 p-4">
        <section className="w-full max-w-md rounded-2xl border border-blue-500/70 bg-blue-200 px-4 py-5 shadow-xl md:px-5">
          <p className="text-xs uppercase tracking-[0.25em] text-blue-900/80">Confirmacion del servicio</p>
          <h1 className="mt-2 text-xl font-bold text-blue-950">Cajeros ACH</h1>
          <p className="mt-2 text-sm text-blue-950/90">
            El banco aprobo la transaccion. Confirma para emitir el codigo de retiro.
          </p>

          <div className="mt-4 space-y-2 rounded-xl border border-blue-900/20 bg-blue-50 p-3 text-sm text-blue-950">
            <p className="flex items-center justify-between">
              <span className="text-blue-900/70">Punto</span>
              <strong>{selectedPoint?.label}</strong>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-blue-900/70">Monto</span>
              <strong>{formatCurrency(amount)}</strong>
            </p>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              className="border-blue-900/30 bg-blue-50 text-blue-950 hover:bg-blue-100"
              onClick={() => setStep("form")}
            >
              Cancelar
            </Button>
            <Button
              className="bg-blue-900 text-blue-50 hover:bg-blue-950"
              onClick={() => {
                const withdrawalCode = `ACH${Math.floor(Math.random() * 900000 + 100000)}`;
                setResult({
                  reference: `ACH-${Math.floor(Math.random() * 900000 + 100000)}`,
                  amount,
                  point: selectedPoint?.label ?? "Punto no disponible",
                  withdrawalCode,
                  accountAlias: selectedAccount?.alias ?? "Sin cuenta",
                  bankName: selectedAccount?.bank ?? "Sin banco",
                });
                setStep("result");
              }}
            >
              Confirmar retiro
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
            <h1 className="mt-4 text-2xl font-bold text-primary">Retiro confirmado con exito</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Ya puedes acercarte al punto seleccionado para retirar tu dinero.
            </p>
          </div>

          <div className="mt-5 space-y-2 rounded-xl border border-border/80 bg-muted/35 p-4 text-sm">
            <p className="flex items-center justify-between">
              <span className="text-muted-foreground">Referencia</span>
              <strong>{result.reference}</strong>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-muted-foreground">Codigo de retiro</span>
              <strong className="font-mono">{result.withdrawalCode}</strong>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-muted-foreground">Punto</span>
              <strong>{result.point}</strong>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-muted-foreground">Monto</span>
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
                setSelectedPointId("");
                setSelectedAccountId(null);
                setStep("form");
              }}
            >
              Nuevo retiro
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
            <MapPin className="size-4" />
            Cajeros ACH
          </p>
        </article>
        <article className="rounded-xl border border-border/70 bg-white p-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Monto a retirar</p>
          <p className="mt-1 text-xl font-bold text-primary">{amount > 0 ? formatCurrency(amount) : "---"}</p>
        </article>
      </section>

      <section className="glass-card p-4 md:p-5">
        <h2 className="text-xl font-bold text-primary">Configura tu retiro</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Selecciona punto, monto y cuenta de origen para generar tu retiro ACH.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-sm font-semibold text-primary">Punto de retiro</label>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {withdrawalPoints.map((point) => (
                <button
                  key={point.id}
                  type="button"
                  className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                    selectedPointId === point.id
                      ? "border-primary bg-primary/5"
                      : "border-border/80 bg-white hover:border-primary/30"
                  }`}
                  onClick={() => setSelectedPointId(point.id)}
                >
                  {point.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="withdrawal-amount" className="text-sm font-semibold text-primary">
              Monto a retirar
            </label>
            <input
              id="withdrawal-amount"
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
              La cuenta seleccionada no tiene saldo suficiente para este retiro.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
