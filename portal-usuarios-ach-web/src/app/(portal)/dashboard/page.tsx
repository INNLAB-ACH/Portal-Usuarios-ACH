import { ArrowLeftRight, CalendarClock, HandCoins, Wallet } from "lucide-react";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { StatCard } from "@/components/common/stat-card";
import { bills, loans, transactions } from "@/data/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const monthlyAmount = transactions.reduce((sum, item) => sum + item.amount, 0);
  const upcomingDebt = bills.filter((item) => item.kind === "requested").reduce((sum, item) => sum + item.amount, 0);
  const totalLoanQuota = loans.reduce((sum, item) => sum + item.approvedQuota, 0);
  const availableLoanQuota = loans.reduce((sum, item) => sum + (item.approvedQuota - item.usedQuota), 0);

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
          <h2 className="text-base font-semibold">Deudas por categoria</h2>
          <div className="mt-4 space-y-3">
            {[
              { label: "Servicios publicos", value: 445700 },
              { label: "Planes de celular", value: 197000 },
              { label: "Internet y TV", value: 256000 },
            ].map((entry) => (
              <div key={entry.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{entry.label}</span>
                  <strong>{formatCurrency(entry.value)}</strong>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-secondary" style={{ width: `${Math.min(100, (entry.value / 445700) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
