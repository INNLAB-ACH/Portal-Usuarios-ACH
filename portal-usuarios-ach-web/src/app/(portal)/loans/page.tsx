"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, Store } from "lucide-react";
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

  return (
    <div className="space-y-4">
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Cupo aprobado" value={formatCurrency(totals.approved)} />
        <StatCard label="Cupo usado" value={formatCurrency(totals.used)} />
        <StatCard label="Cupo disponible" value={formatCurrency(totals.available)} />
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
