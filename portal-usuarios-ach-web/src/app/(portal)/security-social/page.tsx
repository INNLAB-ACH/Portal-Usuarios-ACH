"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { socialSecurityEvents, socialSecurityInfo } from "@/data/mock-data";
import { BankAccount } from "@/types/portal";
import { formatCurrency } from "@/lib/utils";

type PrestaPilaRecord = {
  id: string;
  date: string;
  period: string;
  amount: number;
  status: "Aprobado" | "Rechazado";
};

const ACCOUNTS_STORAGE_KEY = "ach-accounts-list";
const PRESTA_PILA_STORAGE_KEY = "ach-presta-pila-history";

const periods = [
  "2026-04",
  "2026-03",
  "2026-02",
  "2026-01",
  "2025-12",
  "2025-11",
];

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

export default function SecuritySocialPage() {
  const [events, setEvents] = useState(socialSecurityEvents);
  const [novelty, setNovelty] = useState("");
  const [period, setPeriod] = useState(periods[0]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [salary, setSalary] = useState("2000000");
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [quickAlias, setQuickAlias] = useState("");
  const [quickBank, setQuickBank] = useState("");
  const [quickNumber, setQuickNumber] = useState("");
  const [accounts, setAccounts] = useState<BankAccount[]>(() => {
    if (typeof window === "undefined") {
      return fallbackAccounts;
    }

    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BankAccount[]) : fallbackAccounts;
  });
  const [prestaPilaHistory, setPrestaPilaHistory] = useState<PrestaPilaRecord[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const raw = localStorage.getItem(PRESTA_PILA_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PrestaPilaRecord[]) : [];
  });

  const salaryValue = Number(salary || "0");
  const ibc = salaryValue * 0.4;
  const health = ibc * 0.125;
  const pension = ibc * 0.16;
  const arl = ibc * 0.00522;
  const solidarity = salaryValue >= 5680000 ? ibc * 0.01 : 0;
  const totalPila = health + pension + arl + solidarity;

  const prestaPilaStudy = useMemo(() => {
    const capacity = salaryValue * 0.28;
    const ratio = capacity === 0 ? 1 : totalPila / capacity;
    const approved = ratio <= 0.9;

    return {
      approved,
      score: approved ? 792 : 612,
      ratio,
      suggestedAmount: Math.round(totalPila),
    };
  }, [salaryValue, totalPila]);

  const submitNovelty = (event: FormEvent) => {
    event.preventDefault();
    if (!novelty.trim()) {
      return;
    }

    setEvents((prev) => [
      {
        id: `N-${Math.floor(Math.random() * 900 + 1000)}`,
        date: new Date().toISOString().slice(0, 10),
        noveltyType: novelty,
        status: "Reportada",
      },
      ...prev,
    ]);

    setNovelty("");
  };

  const openPlanillaModal = () => {
    const primary = accounts.find((account) => account.isPrimary) ?? accounts[0];
    setSelectedAccountId(primary?.id ?? "");
    setShowPaymentModal(true);
  };

  const registerPrestaPilaUse = () => {
    const record: PrestaPilaRecord = {
      id: `PP-${Math.floor(Math.random() * 900 + 1000)}`,
      date: new Date().toISOString().slice(0, 10),
      period,
      amount: Math.round(totalPila),
      status: prestaPilaStudy.approved ? "Aprobado" : "Rechazado",
    };

    const next = [record, ...prestaPilaHistory];
    setPrestaPilaHistory(next);
    localStorage.setItem(PRESTA_PILA_STORAGE_KEY, JSON.stringify(next));
  };

  const processPlanillaPayment = () => {
    if (selectedAccountId === "new") {
      if (!quickAlias.trim() || !quickBank.trim() || !quickNumber.trim()) {
        return;
      }

      const newAccount: BankAccount = {
        id: `AC-${Math.floor(Math.random() * 900 + 1000)}`,
        alias: quickAlias.trim(),
        bank: quickBank.trim(),
        accountType: "Ahorros",
        accountNumber: quickNumber.trim(),
        country: "Colombia",
        isPrimary: false,
      };

      const nextAccounts = [...accounts, newAccount];
      setAccounts(nextAccounts);
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(nextAccounts));
      setSelectedAccountId(newAccount.id);
    }

    setEvents((prev) => [
      {
        id: `N-${Math.floor(Math.random() * 900 + 1000)}`,
        date: new Date().toISOString().slice(0, 10),
        noveltyType: `Planilla independiente ${period} generada`,
        status: "Procesada",
      },
      ...prev,
    ]);

    setShowPaymentModal(false);
    setQuickAlias("");
    setQuickBank("");
    setQuickNumber("");
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="space-y-4">
        <article className="glass-card space-y-3 p-4">
          <h2 className="text-lg font-semibold text-primary">Informacion afiliaciones</h2>
          <p className="text-sm">EPS: <strong>{socialSecurityInfo.eps}</strong></p>
          <p className="text-sm">Fondo de pensiones: <strong>{socialSecurityInfo.pensionFund}</strong></p>
          <p className="text-sm">ARL: <strong>{socialSecurityInfo.arl}</strong></p>
          <p className="text-sm">Caja de compensacion: <strong>{socialSecurityInfo.compensationFund}</strong></p>
        </article>

        <article className="glass-card space-y-3 p-4">
          <h2 className="text-lg font-semibold text-primary">Generar planilla</h2>
          <div className="flex items-center justify-between rounded-lg border border-border/80 bg-muted/40 px-3 py-2">
            <p className="text-xs text-muted-foreground">Powered by SOI ACH</p>
            <Image src="/soi-ach.svg" alt="Powered by SOI ACH" width={126} height={24} />
          </div>
          <div className="text-sm">
            <label className="mb-2 block text-xs text-muted-foreground">Periodo de liquidacion</label>
            <select
              className="h-10 w-full rounded-md border border-input bg-white px-3"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
            >
              {periods.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={openPlanillaModal}>Generar planilla de pago</Button>
        </article>

        <article className="glass-card space-y-3 p-4">
          <h2 className="text-lg font-semibold text-primary">Registro de uso Presta-PILA</h2>
          {prestaPilaHistory.length > 0 ? (
            <div className="space-y-2 text-sm">
              {prestaPilaHistory.slice(0, 5).map((record) => (
                <div key={record.id} className="rounded-lg border border-border/80 bg-muted/40 p-2">
                  <p className="font-medium">{record.id} - {record.period}</p>
                  <p className="text-xs text-muted-foreground">
                    {record.date} | {formatCurrency(record.amount)} | {record.status}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No hay usos registrados de Presta-PILA.</p>
          )}
        </article>
      </section>

      <section className="space-y-4">
        <article className="glass-card space-y-3 p-4">
          <h2 className="text-lg font-semibold text-primary">Reportar novedad individual</h2>
          <form className="flex gap-2" onSubmit={submitNovelty}>
            <input
              value={novelty}
              onChange={(event) => setNovelty(event.target.value)}
              className="h-10 flex-1 rounded-md border border-input px-3 text-sm"
              placeholder="Ej: incapacidad, ingreso, retiro"
            />
            <Button type="submit">Agregar</Button>
          </form>
        </article>

        <article className="glass-card overflow-hidden">
          <div className="border-b border-border/80 px-4 py-3">
            <h2 className="font-semibold">Historial de novedades</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted/45 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-t border-border/70">
                    <td className="px-4 py-3">{event.date}</td>
                    <td className="px-4 py-3">{event.noveltyType}</td>
                    <td className="px-4 py-3">{event.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      {showPaymentModal ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/35 p-4 backdrop-blur-[1px]">
          <div className="glass-card w-full max-w-3xl space-y-4 border border-primary/30 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary">Pago planilla independiente - {period}</h2>
              <Button variant="outline" onClick={() => setShowPaymentModal(false)}>Cerrar</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
              <section className="space-y-3 rounded-lg border border-border/80 p-3">
                <h3 className="font-semibold">Datos de liquidacion</h3>
                <label className="block text-sm">
                  Salario base
                  <input
                    type="number"
                    min={0}
                    className="mt-1 h-10 w-full rounded-md border border-input px-3"
                    value={salary}
                    onChange={(event) => setSalary(event.target.value)}
                  />
                </label>

                <div className="space-y-2 text-sm">
                  <p className="flex justify-between"><span>IBC (40%)</span><strong>{formatCurrency(ibc)}</strong></p>
                  <p className="flex justify-between"><span>Salud (12.5%)</span><strong>{formatCurrency(health)}</strong></p>
                  <p className="flex justify-between"><span>Pension (16%)</span><strong>{formatCurrency(pension)}</strong></p>
                  <p className="flex justify-between"><span>ARL (0.522%)</span><strong>{formatCurrency(arl)}</strong></p>
                  <p className="flex justify-between"><span>Fondo solidaridad</span><strong>{formatCurrency(solidarity)}</strong></p>
                  <p className="flex justify-between border-t border-border pt-2 text-base"><span>Total PILA</span><strong className="text-primary">{formatCurrency(totalPila)}</strong></p>
                </div>

                <label className="block text-sm">
                  Cuenta de pago
                  <select
                    className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3"
                    value={selectedAccountId}
                    onChange={(event) => setSelectedAccountId(event.target.value)}
                  >
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.alias} - {account.bank}
                      </option>
                    ))}
                    <option value="new">Agregar nueva cuenta (abreviado)</option>
                  </select>
                </label>

                {selectedAccountId === "new" ? (
                  <div className="grid gap-2 rounded-md border border-border/80 bg-muted/30 p-2">
                    <input
                      className="h-9 rounded border border-input bg-white px-2 text-sm"
                      placeholder="Alias"
                      value={quickAlias}
                      onChange={(event) => setQuickAlias(event.target.value)}
                    />
                    <input
                      className="h-9 rounded border border-input bg-white px-2 text-sm"
                      placeholder="Banco"
                      value={quickBank}
                      onChange={(event) => setQuickBank(event.target.value)}
                    />
                    <input
                      className="h-9 rounded border border-input bg-white px-2 text-sm"
                      placeholder="Numero"
                      value={quickNumber}
                      onChange={(event) => setQuickNumber(event.target.value)}
                    />
                  </div>
                ) : null}
              </section>

              <section className="space-y-3 rounded-lg border border-border/80 p-3">
                <h3 className="font-semibold">Presta-PILA</h3>
                <p className="text-sm text-muted-foreground">
                  Oferta de credito para financiar el pago de la planilla del periodo {period}.
                </p>

                <div className="space-y-2 rounded-md border border-border/80 bg-muted/40 p-3 text-sm">
                  <p className="flex justify-between"><span>Score estimado</span><strong>{prestaPilaStudy.score}</strong></p>
                  <p className="flex justify-between"><span>Relacion cuota/ingreso</span><strong>{(prestaPilaStudy.ratio * 100).toFixed(1)}%</strong></p>
                  <p className="flex justify-between"><span>Monto sugerido</span><strong>{formatCurrency(prestaPilaStudy.suggestedAmount)}</strong></p>
                  <p className="flex justify-between"><span>Estado del estudio</span>
                    <strong className={prestaPilaStudy.approved ? "text-green-700" : "text-red-700"}>
                      {prestaPilaStudy.approved ? "Aprobado" : "Rechazado"}
                    </strong>
                  </p>
                </div>

                <Button variant="outline" className="w-full" onClick={registerPrestaPilaUse}>
                  Registrar uso Presta-PILA
                </Button>

                <Button className="w-full" onClick={processPlanillaPayment}>
                  Confirmar pago planilla
                </Button>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
