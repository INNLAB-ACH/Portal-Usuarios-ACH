"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, Store } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/common/stat-card";
import { PaymentWizard } from "@/components/payment/payment-wizard";
import { loans } from "@/data/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function LoansPage() {
  const [activeLoanId, setActiveLoanId] = useState<string | null>(null);
  const selectedLoan = loans.find((loan) => loan.id === activeLoanId) ?? null;

  const totals = useMemo(() => {
    const approved = loans.reduce((sum, loan) => sum + loan.approvedQuota, 0);
    const used = loans.reduce((sum, loan) => sum + loan.usedQuota, 0);
    return { approved, used, available: approved - used };
  }, []);

  const debtEvolution = [
    { month: "Nov", deuda: 8700000, pago: 620000 },
    { month: "Dic", deuda: 8350000, pago: 610000 },
    { month: "Ene", deuda: 7900000, pago: 580000 },
    { month: "Feb", deuda: 7400000, pago: 590000 },
    { month: "Mar", deuda: 6920000, pago: 610000 },
    { month: "Abr", deuda: 6500000, pago: 630000 },
  ];

  const debtByStore = loans.map((loan) => ({
    store: loan.store,
    deuda: loan.usedQuota,
  }));

  return (
    <div className="space-y-4">
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Cupo aprobado" value={formatCurrency(totals.approved)} />
        <StatCard label="Cupo usado" value={formatCurrency(totals.used)} />
        <StatCard label="Cupo disponible" value={formatCurrency(totals.available)} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <article className="glass-card p-4 md:p-5">
          <h2 className="text-base font-semibold">Deuda en el tiempo</h2>
          <p className="text-xs text-muted-foreground">Evolucion mensual de la deuda activa y pagos</p>
          <div className="mt-3 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={debtEvolution}>
                <defs>
                  <linearGradient id="debtGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#003087" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#003087" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#dbe2ea" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(value) => `${Math.round(value / 1000000)}M`} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
                <Area type="monotone" dataKey="deuda" stroke="#003087" strokeWidth={2} fill="url(#debtGradient)" />
                <Area type="monotone" dataKey="pago" stroke="#00a8a8" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="glass-card p-4 md:p-5">
          <h2 className="text-base font-semibold">Deuda por tienda</h2>
          <div className="mt-3 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={debtByStore}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dbe2ea" />
                <XAxis dataKey="store" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(value) => `${Math.round(value / 1000000)}M`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
                <Bar dataKey="deuda" fill="#005bbb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {loans.map((loan) => (
          <article key={loan.id} className="glass-card space-y-3 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary">{loan.store}</h2>
              <span className={`rounded-full px-2 py-1 text-xs ${loan.status === "Activo" ? "bg-green-100 text-green-700" : loan.status === "En Estudio" ? "bg-amber-100 text-amber-700" : "bg-slate-200 text-slate-700"}`}>
                {loan.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Prestamo {loan.id}</p>
            <p className="text-sm">Cupo aprobado: <strong>{formatCurrency(loan.approvedQuota)}</strong></p>
            <p className="text-sm">Cupo usado: <strong>{formatCurrency(loan.usedQuota)}</strong></p>

            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="gap-1">
                <Store className="size-4" /> Ver cupos en tienda
              </Button>
              <Button size="sm" className="gap-1" onClick={() => setActiveLoanId(loan.id)}>
                <BadgeCheck className="size-4" /> Autorizar pago
              </Button>
            </div>
          </article>
        ))}
      </section>

      <section className="glass-card p-4 md:p-5">
        <h2 className="text-base font-semibold">Deuda por categoria</h2>
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
      </section>

      {selectedLoan ? (
        <PaymentWizard
          title={`Autorizar pago - ${selectedLoan.store}`}
          items={[
            {
              id: selectedLoan.id,
              name: `Cuota prestamo ${selectedLoan.id}`,
              amount: selectedLoan.installmentValue || 180000,
            },
          ]}
          onClose={() => setActiveLoanId(null)}
        />
      ) : null}
    </div>
  );
}
