"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, CalendarClock, Sparkles, Store, X } from "lucide-react";
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
  const [scheduleLoanId, setScheduleLoanId] = useState<string | null>(null);
  const [paymentDay, setPaymentDay] = useState(25);
  const [paymentAccount, setPaymentAccount] = useState<"Cuenta principal" | "Cuenta nomina">("Cuenta principal");
  const [scheduledPayments, setScheduledPayments] = useState<Record<string, { day: number; account: "Cuenta principal" | "Cuenta nomina" }>>({});
  const selectedLoan = loans.find((loan) => loan.id === activeLoanId) ?? null;
  const selectedLoanForSchedule = loans.find((loan) => loan.id === scheduleLoanId) ?? null;
  const activeLoans = loans.filter((loan) => loan.status === "Activo" && loan.usedQuota > 0);

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

  const creditOffers = [
    { id: "OF-01", store: "Exito", category: "Hogar", approved: 4200000, fee: "1.45% MV" },
    { id: "OF-02", store: "Falabella", category: "Tecnologia", approved: 5800000, fee: "1.35% MV" },
    { id: "OF-03", store: "Homecenter", category: "Remodelacion", approved: 3600000, fee: "1.55% MV" },
    { id: "OF-04", store: "Alkosto", category: "Electro", approved: 6900000, fee: "1.40% MV" },
  ];

  const openScheduleModal = (loanId: string) => {
    const existing = scheduledPayments[loanId];
    setScheduleLoanId(loanId);
    setPaymentDay(existing?.day ?? 25);
    setPaymentAccount(existing?.account ?? "Cuenta principal");
  };

  const saveScheduledPayment = () => {
    if (!scheduleLoanId) {
      return;
    }

    setScheduledPayments((prev) => ({
      ...prev,
      [scheduleLoanId]: {
        day: paymentDay,
        account: paymentAccount,
      },
    }));

    setScheduleLoanId(null);
  };

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

      <section className="grid gap-4 xl:grid-cols-[1.5fr_0.5fr]">
        <article className="glass-card overflow-hidden">
          <div className="border-b border-border/80 px-4 py-3">
            <h2 className="font-semibold">Creditos activos por pagar</h2>
            <p className="text-xs text-muted-foreground">Gestiona pago inmediato o programa la cuota mensual</p>
          </div>

          <div className="space-y-3 p-4">
            {activeLoans.length > 0 ? (
              activeLoans.map((loan) => (
                <article key={loan.id} className="rounded-lg border border-border/80 bg-muted/35 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-primary">{loan.store}</h3>
                      <p className="text-xs text-muted-foreground">Prestamo {loan.id}</p>
                    </div>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">Activo</span>
                  </div>

                  <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                    <p>Cupo aprobado: <strong>{formatCurrency(loan.approvedQuota)}</strong></p>
                    <p>Cupo usado: <strong>{formatCurrency(loan.usedQuota)}</strong></p>
                    <p>Cuota sugerida: <strong>{formatCurrency(loan.installmentValue || 180000)}</strong></p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Store className="size-4" /> Ver cupos en tienda
                    </Button>
                    <Button size="sm" className="gap-1" onClick={() => setActiveLoanId(loan.id)}>
                      <BadgeCheck className="size-4" /> Pagar ahora
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => openScheduleModal(loan.id)}>
                      <CalendarClock className="size-4" /> Programar pago
                    </Button>
                  </div>

                  {scheduledPayments[loan.id] ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Pago programado: dia {scheduledPayments[loan.id].day} - {scheduledPayments[loan.id].account}
                    </p>
                  ) : null}
                </article>
              ))
            ) : (
              <p className="rounded-lg border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
                No hay creditos activos por pagar en este momento.
              </p>
            )}
          </div>
        </article>

        <aside className="glass-card overflow-hidden">
          <div className="border-b border-border/80 px-4 py-3">
            <h2 className="font-semibold">Ofertas de credito</h2>
            <p className="text-xs text-muted-foreground">Tiendas y categorias destacadas</p>
          </div>

          <div className="space-y-2 p-3">
            {creditOffers.map((offer) => (
              <article key={offer.id} className="rounded-lg border border-border/80 bg-muted/35 p-2.5">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold leading-tight">{offer.store}</p>
                  <span className="rounded-full bg-secondary/15 px-2 py-0.5 text-[10px] text-secondary">{offer.category}</span>
                </div>
                <p className="text-xs text-muted-foreground">Cupo preaprobado</p>
                <p className="text-sm font-semibold text-primary">{formatCurrency(offer.approved)}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">Tasa desde {offer.fee}</p>
              </article>
            ))}
          </div>

          <div className="border-t border-border/70 bg-muted/25 px-3 py-2">
            <p className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Sparkles className="size-3.5 text-secondary" /> Oferta sujeta a evaluacion de riesgo.
            </p>
          </div>
        </aside>
      </section>

      {selectedLoan ? (
        <PaymentWizard
          title={`Pago de credito - ${selectedLoan.store}`}
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

      {selectedLoanForSchedule ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/35 p-4">
          <div className="glass-card w-full max-w-md space-y-4 border border-primary/20 bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary">Programar pago de credito</h3>
              <button
                type="button"
                className="rounded-md p-1 hover:bg-muted"
                onClick={() => setScheduleLoanId(null)}
                aria-label="Cerrar"
              >
                <X className="size-4" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground">
              {selectedLoanForSchedule.store} - Prestamo {selectedLoanForSchedule.id}
            </p>

            <label className="block text-sm">
              Cuenta de debito
              <select
                className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3"
                value={paymentAccount}
                onChange={(event) => setPaymentAccount(event.target.value as "Cuenta principal" | "Cuenta nomina")}
              >
                <option>Cuenta principal</option>
                <option>Cuenta nomina</option>
              </select>
            </label>

            <label className="block text-sm">
              Dia de cobro
              <input
                type="number"
                min={1}
                max={28}
                className="mt-1 h-10 w-full rounded-md border border-input px-3"
                value={paymentDay}
                onChange={(event) => setPaymentDay(Number(event.target.value))}
              />
            </label>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setScheduleLoanId(null)}>Cancelar</Button>
              <Button onClick={saveScheduledPayment}>Guardar programacion</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
