"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight, CalendarClock, HandCoins, Wallet } from "lucide-react";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { StatCard } from "@/components/common/stat-card";
import { Button } from "@/components/ui/button";
import { PaymentWizard } from "@/components/payment/payment-wizard";
import { bills, loans, transactions } from "@/data/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const monthlyAmount = transactions.reduce((sum, item) => sum + item.amount, 0);
  const upcomingDebt = bills.filter((item) => item.kind === "requested").reduce((sum, item) => sum + item.amount, 0);
  const totalLoanQuota = loans.reduce((sum, item) => sum + item.approvedQuota, 0);
  const availableLoanQuota = loans.reduce((sum, item) => sum + (item.approvedQuota - item.usedQuota), 0);
  const pendingPayments = useMemo(() => bills.filter((item) => item.dueDate >= "2026-04-21").slice(0, 4), []);
  const selectedBill = bills.find((item) => item.id === selectedBillId);

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Monto transado mes" value={formatCurrency(monthlyAmount)} helper="Acumulado abril 2026" icon={<ArrowLeftRight className="size-5" />} />
        <StatCard label="Deudas proximas" value={formatCurrency(upcomingDebt)} helper="Vencen en los proximos 10 dias" icon={<CalendarClock className="size-5" />} />
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
              <article key={bill.id} className="rounded-lg border border-border/80 bg-muted/40 p-3">
                <p className="text-sm font-medium">{bill.service} - {bill.provider}</p>
                <p className="mt-1 text-xs text-muted-foreground">Vence {bill.dueDate}</p>
                <div className="mt-3 flex items-center justify-between">
                  <strong className="text-primary">{formatCurrency(bill.amount)}</strong>
                  <Button size="sm" onClick={() => setSelectedBillId(bill.id)}>Pagar</Button>
                </div>
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
    </div>
  );
}
