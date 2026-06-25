"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  CreditCard,
  HandCoins,
  Landmark,
  Store,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  defaultBankAccounts,
  ecommerceCartItems,
  extraLimitOptions,
  immediatePaymentOptions,
  instantLoanProviders,
  yellowBank,
} from "@/data/mock-data";
import {
  ACCOUNTS_STORAGE_KEY,
  clearEcommerceFlowContext,
  readEcommerceFlowContext,
} from "@/lib/ecommerce-flow";
import { formatCurrency } from "@/lib/utils";
import { BankAccount, ImmediatePaymentOption, ImmediatePaymentResult } from "@/types/portal";
import { useHydrated } from "@/lib/use-hydrated";

type Step = "selection" | "bank" | "result";

const fallbackAmount = ecommerceCartItems.reduce((sum, item) => sum + item.amount * item.quantity, 0);
const fallbackMerchant = "Relojeria eCommerce";

function optionIcon(optionId: ImmediatePaymentOption["id"]) {
  if (optionId === "pay-from-account") {
    return <Landmark className="size-5" />;
  }

  if (optionId === "approved-extension-limit") {
    return <Wallet className="size-5" />;
  }

  return <HandCoins className="size-5" />;
}

export default function InstantPaymentsPage() {
  const isHydrated = useHydrated();
  const [selectedOption, setSelectedOption] = useState<ImmediatePaymentOption["id"]>("pay-from-account");
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("selection");
  const [result, setResult] = useState<ImmediatePaymentResult | null>(null);

  const ecommerceContext = useMemo(() => readEcommerceFlowContext(), []);
  const amountToPay = ecommerceContext?.total ?? fallbackAmount;
  const merchantName = ecommerceContext?.merchantName ?? fallbackMerchant;

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

  const groupedAccounts = useMemo(() => {
    const grouped: Record<string, BankAccount[]> = {};

    accounts.forEach((account) => {
      if (!grouped[account.bank]) {
        grouped[account.bank] = [];
      }
      grouped[account.bank].push(account);
    });

    return grouped;
  }, [accounts]);

  const selectedAccount = accounts.find((account) => account.id === selectedAccountId) ?? null;
  const selectedAccountBalance = selectedAccount?.balance ?? 0;
  const hasEnoughBalance = selectedAccountBalance >= amountToPay;
  const canContinue = selectedOption === "pay-from-account" && Boolean(selectedAccount) && hasEnoughBalance;

  if (!isHydrated) {
    return <div className="flex min-h-[220px] items-center justify-center">Cargando pagos inmediatos...</div>;
  }

  if (step === "bank") {
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-amber-950/30 p-4">
        <section className="w-full max-w-md rounded-2xl border border-amber-500/80 bg-amber-300 px-4 py-5 shadow-xl md:px-5">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-900/80">Notificacion bancaria</p>
          <h1 className="mt-2 text-xl font-bold text-amber-950">{yellowBank.name}</h1>
          <p className="mt-2 text-sm text-amber-950/90">
            Deseas confirmar el pago solicitado por <strong>{merchantName}</strong>.
          </p>

          <div className="mt-4 space-y-2 rounded-xl border border-amber-800/25 bg-amber-100/80 p-3 text-sm text-amber-950">
            <p className="flex items-center justify-between">
              <span className="text-amber-900/70">Monto</span>
              <strong>{formatCurrency(amountToPay)}</strong>
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
              onClick={() => {
                setResult({
                  reference: `ACH-${Math.floor(Math.random() * 900000 + 100000)}`,
                  status: "cancelled",
                  processedAt: new Date().toISOString(),
                  amount: amountToPay,
                  merchantName,
                  bankName: yellowBank.name,
                  accountAlias: selectedAccount?.alias ?? "Sin cuenta",
                });
                setStep("result");
              }}
            >
              Cancelar
            </Button>
            <Button
              className="bg-amber-900 text-amber-50 hover:bg-amber-950"
              onClick={() => {
                setResult({
                  reference: `ACH-${Math.floor(Math.random() * 900000 + 100000)}`,
                  status: "approved",
                  processedAt: new Date().toISOString(),
                  amount: amountToPay,
                  merchantName,
                  bankName: yellowBank.name,
                  accountAlias: selectedAccount?.alias ?? "Sin cuenta",
                });
                clearEcommerceFlowContext();
                setStep("result");
              }}
            >
              Confirmar pago
            </Button>
          </div>
        </section>
      </div>
    );
  }

  if (step === "result" && result) {
    const approved = result.status === "approved";

    return (
      <section className="mx-auto max-w-3xl space-y-4">
        <article className="glass-card border border-primary/20 p-6 md:p-8">
          <div className="text-center">
            {approved ? (
              <CheckCircle2 className="mx-auto size-14 text-green-600" />
            ) : (
              <CircleAlert className="mx-auto size-14 text-amber-600" />
            )}
            <h1 className="mt-4 text-2xl font-bold text-primary">
              {approved ? "Pago confirmado con exito" : "Pago cancelado en banco"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {approved
                ? "Regresaste al PSE Hub con la confirmacion de tu transaccion."
                : "La operacion no fue aprobada. Puedes intentarlo de nuevo."}
            </p>
          </div>

          <div className="mt-5 space-y-2 rounded-xl border border-border/80 bg-muted/35 p-4 text-sm">
            <p className="flex items-center justify-between">
              <span className="text-muted-foreground">Referencia</span>
              <strong>{result.reference}</strong>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-muted-foreground">Comercio</span>
              <strong>{result.merchantName}</strong>
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
                setSelectedOption("pay-from-account");
                setStep("selection");
              }}
            >
              Nuevo intento
            </Button>
            <Button onClick={() => setStep("selection")}>Volver a pagos inmediatos</Button>
          </div>
        </article>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <section className="glass-card grid gap-3 p-4 md:grid-cols-2 md:p-5">
        <article className="rounded-xl border border-border/70 bg-white p-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Comercio que solicita el pago</p>
          <p className="mt-1 flex items-center gap-2 text-base font-semibold text-primary">
            <Store className="size-4" />
            {merchantName}
          </p>
        </article>
        <article className="rounded-xl border border-border/70 bg-white p-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Monto a pagar</p>
          <p className="mt-1 text-xl font-bold text-primary">{formatCurrency(amountToPay)}</p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="glass-card p-4 md:p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">PSE Hub</p>
          <h1 className="mt-2 text-2xl font-bold text-primary">Pagos instantaneos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Selecciona como deseas continuar la operacion iniciada desde el ecommerce.
          </p>

          <div className="mt-4 space-y-3">
            {immediatePaymentOptions.map((option) => {
              const active = selectedOption === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                    active ? "border-primary bg-primary/5" : "border-border/80 bg-white hover:border-primary/30"
                  }`}
                  onClick={() => {
                    setSelectedOption(option.id);
                    if (option.id !== "pay-from-account") {
                      setSelectedAccountId(null);
                    }
                  }}
                >
                  <span className="flex items-start gap-3">
                    <span className="mt-0.5 text-primary">{optionIcon(option.id)}</span>
                    <span>
                      <span className="block text-sm font-semibold text-primary">{option.title}</span>
                      <span className="block text-xs text-muted-foreground">{option.description}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <Button className="mt-5 h-11 w-full gap-2" disabled={!canContinue} onClick={() => setStep("bank")}>
            <CreditCard className="size-4" />
            Realizar pago
          </Button>

          {selectedOption === "pay-from-account" && selectedAccount ? (
            <p className={`mt-3 text-xs ${hasEnoughBalance ? "text-green-700" : "text-red-700"}`}>
              {hasEnoughBalance
                ? "La cuenta seleccionada tiene saldo suficiente para continuar."
                : "La cuenta seleccionada no alcanza para cubrir el monto solicitado."}
            </p>
          ) : null}
        </article>

        <article className="glass-card p-4 md:p-5">
          {selectedOption === "pay-from-account" ? (
            <>
              <h2 className="text-base font-semibold text-primary">Pagar desde cuenta</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Tus bancos preferidos con cuentas disponibles registradas de cada banco.
              </p>

              <div className="mt-4 max-h-[380px] space-y-3 overflow-y-auto pr-1">
                {Object.entries(groupedAccounts).map(([bank, bankAccounts]) => (
                  <section key={bank} className="rounded-xl border border-border/70 bg-white p-3">
                    <p className="text-sm font-semibold text-primary">{bank}</p>
                    <div className="mt-2 space-y-2">
                      {bankAccounts.map((account) => {
                        const selected = selectedAccountId === account.id;
                        const balance = account.balance ?? 0;
                        const canCoverAmount = balance >= amountToPay;

                        return (
                          <button
                            key={account.id}
                            type="button"
                            onClick={() => setSelectedAccountId(account.id)}
                            className={`w-full rounded-lg border px-3 py-2 text-left text-xs transition ${
                              selected
                                ? "border-primary bg-primary/5"
                                : "border-border/70 hover:border-primary/40"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-semibold">{account.alias}</p>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                  canCoverAmount
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {canCoverAmount ? "Alcanza" : "No alcanza"}
                              </span>
                            </div>
                            <p className="text-muted-foreground">{account.accountType} · {account.accountNumber}</p>
                            <p className="mt-1 text-muted-foreground">
                              Saldo disponible: <strong className="text-foreground">{formatCurrency(balance)}</strong>
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </>
          ) : null}

          {selectedOption === "approved-extension-limit" ? (
            <>
              <h2 className="text-base font-semibold text-primary">Cupo adicional</h2>
              <p className="mt-1 text-sm text-muted-foreground">Selecciona una opcion de cupo extra disponible.</p>
              <div className="mt-4 space-y-3">
                {extraLimitOptions.map((option) => (
                  <article key={option.id} className="rounded-xl border border-cyan-900/20 bg-cyan-50 p-3 text-sm">
                    <p className="font-semibold text-primary">{option.name}</p>
                    <p className="mt-1 text-cyan-900/80">Disponible: <strong>{formatCurrency(option.availableLimit)}</strong></p>
                    <p className="text-cyan-900/80">Costo administrativo: {formatCurrency(option.fee)}</p>
                    <p className="text-cyan-900/80">{option.approvalTime}</p>
                  </article>
                ))}
              </div>
            </>
          ) : null}

          {selectedOption === "instant-loan-request" ? (
            <>
              <h2 className="text-base font-semibold text-primary">Prestamo instantaneo</h2>
              <p className="mt-1 text-sm text-muted-foreground">Proveedores disponibles para desembolso rapido.</p>
              <div className="mt-4 space-y-3">
                {instantLoanProviders.map((provider) => (
                  <article key={provider.id} className="rounded-xl border border-amber-900/20 bg-amber-50 p-3 text-sm">
                    <p className="font-semibold text-primary">{provider.name}</p>
                    <p className="mt-1 text-amber-900/80">Monto maximo: <strong>{formatCurrency(provider.maxAmount)}</strong></p>
                    <p className="text-amber-900/80">{provider.rateLabel}</p>
                    <p className="text-amber-900/80">{provider.payoutTime}</p>
                  </article>
                ))}
              </div>
            </>
          ) : null}
        </article>
      </section>
    </div>
  );
}
