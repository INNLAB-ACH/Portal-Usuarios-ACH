"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight, CalendarClock, HandCoins, MoreVertical, Wallet, X } from "lucide-react";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { StatCard } from "@/components/common/stat-card";
import { Button } from "@/components/ui/button";
import { PaymentWizard } from "@/components/payment/payment-wizard";
import { bills, loans, transactions } from "@/data/mock-data";
import { formatCurrency } from "@/lib/utils";
import { BankAccount } from "@/types/portal";
import { useHydrated } from "@/lib/use-hydrated";

type DashboardAutopayConfig = {
  accountId: string;
  accountAlias: string;
  day: number;
};

const ACCOUNTS_STORAGE_KEY = "ach-accounts-list";
const DASHBOARD_AUTOPAY_KEY = "ach-dashboard-autopay";

const fallbackAccounts: BankAccount[] = [
  {
    id: "AC-001",
    alias: "Principal nomina",
    bank: "Bancolombia",
    accountType: "Ahorros",
    accountNumber: "*******1289",
    country: "Colombia",
    isPrimary: true,
  },
];

export default function DashboardPage() {
  const isHydrated = useHydrated();
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [menuBillId, setMenuBillId] = useState<string | null>(null);
  const [detailBillId, setDetailBillId] = useState<string | null>(null);
  const [autopayBillId, setAutopayBillId] = useState<string | null>(null);
  const [autopayAccountId, setAutopayAccountId] = useState("");
  const [autopayDay, setAutopayDay] = useState(25);
  const [accounts] = useState<BankAccount[]>(() => {
    if (typeof window === "undefined") {
      return fallbackAccounts;
    }

    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BankAccount[]) : fallbackAccounts;
  });
  const [autopayConfig, setAutopayConfig] = useState<Record<string, DashboardAutopayConfig>>(() => {
    if (typeof window === "undefined") {
      return {};
    }

    const raw = localStorage.getItem(DASHBOARD_AUTOPAY_KEY);
    return raw ? (JSON.parse(raw) as Record<string, DashboardAutopayConfig>) : {};
  });
  const monthlyAmount = transactions.reduce((sum, item) => sum + item.amount, 0);
  const upcomingDebt = bills.filter((item) => item.kind === "requested").reduce((sum, item) => sum + item.amount, 0);
  const totalLoanQuota = loans.reduce((sum, item) => sum + item.approvedQuota, 0);
  const availableLoanQuota = loans.reduce((sum, item) => sum + (item.approvedQuota - item.usedQuota), 0);
  const pendingPayments = useMemo(() => bills.filter((item) => item.dueDate >= "2026-04-21").slice(0, 4), []);
  const selectedBill = bills.find((item) => item.id === selectedBillId);
  const detailBill = pendingPayments.find((item) => item.id === detailBillId) ?? null;
  const autopayBill = pendingPayments.find((item) => item.id === autopayBillId) ?? null;

  if (!isHydrated) {
    return <div className="flex min-h-[220px] items-center justify-center">Cargando inicio...</div>;
  }

  const openAutopayModal = (billId: string) => {
    const config = autopayConfig[billId];
    const primary = accounts.find((account) => account.isPrimary) ?? accounts[0];
    setAutopayBillId(billId);
    setAutopayAccountId(config?.accountId ?? primary?.id ?? "");
    setAutopayDay(config?.day ?? 25);
    setMenuBillId(null);
  };

  const saveAutopay = () => {
    if (!autopayBillId || !autopayAccountId) {
      return;
    }

    const account = accounts.find((item) => item.id === autopayAccountId);
    const next = {
      ...autopayConfig,
      [autopayBillId]: {
        accountId: autopayAccountId,
        accountAlias: account?.alias ?? "Cuenta seleccionada",
        day: autopayDay,
      },
    };

    setAutopayConfig(next);
    localStorage.setItem(DASHBOARD_AUTOPAY_KEY, JSON.stringify(next));
    setAutopayBillId(null);
  };

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Monto transado mes" value={formatCurrency(monthlyAmount)} helper="Acumulado abril 2026" icon={<ArrowLeftRight className="size-5" />} />
        <StatCard label="Próximos pagos" value={formatCurrency(upcomingDebt)} helper="Vencen en los proximos 10 dias" icon={<CalendarClock className="size-5" />} />
        <StatCard label="Cupo total prestamos" value={formatCurrency(totalLoanQuota)} helper="Tiendas vinculadas" icon={<HandCoins className="size-5" />} />
        <StatCard label="Cupo disponible" value={formatCurrency(availableLoanQuota)} helper="Disponible para compras" icon={<Wallet className="size-5" />} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <RecentTransactions />
        <div className="glass-card p-4 md:p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold">Pagos pendientes</h2>
            <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">{pendingPayments.length} por pagar</span>
          </div>
          <div className="space-y-3">
            {pendingPayments.map((bill) => (
              <article key={bill.id} className="relative rounded-lg border border-border/80 bg-muted/40 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{bill.service} - {bill.provider}</p>
                  <button
                    type="button"
                    className="rounded-md p-1 text-muted-foreground hover:bg-background"
                    onClick={() => setMenuBillId((prev) => (prev === bill.id ? null : bill.id))}
                    aria-label="Opciones"
                  >
                    <MoreVertical className="size-4" />
                  </button>
                </div>

                {menuBillId === bill.id ? (
                  <div className="absolute right-3 top-9 z-10 w-44 rounded-md border border-border bg-white p-1 shadow-lg">
                    <button
                      type="button"
                      className="w-full rounded px-2 py-1.5 text-left text-xs hover:bg-muted"
                      onClick={() => {
                        setDetailBillId(bill.id);
                        setMenuBillId(null);
                      }}
                    >
                      Ver detalles
                    </button>
                    <button
                      type="button"
                      className="w-full rounded px-2 py-1.5 text-left text-xs hover:bg-muted"
                      onClick={() => openAutopayModal(bill.id)}
                    >
                      Programar autopago
                    </button>
                  </div>
                ) : null}

                <p className="mt-1 text-xs text-muted-foreground">Vence {bill.dueDate}</p>
                <div className="mt-3 flex items-center justify-between">
                  <strong className="text-primary">{formatCurrency(bill.amount)}</strong>
                  <Button size="sm" onClick={() => setSelectedBillId(bill.id)}>Pagar</Button>
                </div>
                {autopayConfig[bill.id] ? (
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Autopago: {autopayConfig[bill.id].accountAlias} (dia {autopayConfig[bill.id].day})
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      {selectedBill ? (
        <PaymentWizard
          title="Pago desde inicio"
          items={[
            {
              id: selectedBill.id,
              name: `${selectedBill.service} - ${selectedBill.provider}`,
              amount: selectedBill.amount,
            },
          ]}
          onClose={() => setSelectedBillId(null)}
        />
      ) : null}

      {detailBill ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/35 p-4">
          <div className="glass-card w-full max-w-md space-y-4 border border-primary/20 bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary">Detalle de pago pendiente</h3>
              <button type="button" className="rounded-md p-1 hover:bg-muted" onClick={() => setDetailBillId(null)}>
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Empresa:</span> <strong>{detailBill.provider}</strong></p>
              <p><span className="text-muted-foreground">Servicio:</span> {detailBill.service}</p>
              <p><span className="text-muted-foreground">Vencimiento:</span> {detailBill.dueDate}</p>
              <p><span className="text-muted-foreground">Monto:</span> <strong className="text-primary">{formatCurrency(detailBill.amount)}</strong></p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDetailBillId(null)}>Cerrar</Button>
              <Button
                onClick={() => {
                  openAutopayModal(detailBill.id);
                  setDetailBillId(null);
                }}
              >
                Programar autopago
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {autopayBill ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/35 p-4">
          <div className="glass-card w-full max-w-md space-y-4 border border-primary/20 bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary">Programar autopago</h3>
              <button type="button" className="rounded-md p-1 hover:bg-muted" onClick={() => setAutopayBillId(null)}>
                <X className="size-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">{autopayBill.provider} - {autopayBill.service}</p>

            <label className="block text-sm">
              Cuenta
              <select
                className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3"
                value={autopayAccountId}
                onChange={(event) => setAutopayAccountId(event.target.value)}
              >
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.alias} - {account.bank}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              Dia de cobro
              <input
                type="number"
                min={1}
                max={28}
                className="mt-1 h-10 w-full rounded-md border border-input px-3"
                value={autopayDay}
                onChange={(event) => setAutopayDay(Number(event.target.value))}
              />
            </label>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAutopayBillId(null)}>Cancelar</Button>
              <Button onClick={saveAutopay}>Guardar</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
