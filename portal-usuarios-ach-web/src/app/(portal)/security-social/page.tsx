"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import jsPDF from "jspdf";
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

type PlanillaPaymentRecord = {
  id: string;
  date: string;
  period: string;
  paymentMethod: "cuenta-local" | "cuenta-internacional" | "pse" | "presta";
  paymentMethodLabel: string;
  total: number;
  health: number;
  pension: number;
  arl: number;
  solidarity: number;
};

type PaymentMode = "cuenta-local" | "cuenta-internacional" | "pse";

const ACCOUNTS_STORAGE_KEY = "ach-accounts-list";
const PRESTA_PILA_STORAGE_KEY = "ach-presta-pila-history";
const PLANILLA_PAYMENTS_STORAGE_KEY = "ach-planilla-payments";

const periods = [
  "2026-04",
  "2026-03",
  "2026-02",
  "2026-01",
  "2025-12",
  "2025-11",
];

const noveltyOptions = [
  "Ingreso",
  "Retiro",
  "Cambio salarial",
  "Incapacidad",
  "Licencia no remunerada",
  "Vacaciones",
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
  const [noveltyType, setNoveltyType] = useState(noveltyOptions[0]);
  const [noveltyDescriptor, setNoveltyDescriptor] = useState("");
  const [period, setPeriod] = useState(periods[0]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [salary, setSalary] = useState("2000000");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("cuenta-local");
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [pseKey, setPseKey] = useState("");
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
  const [planillaPayments, setPlanillaPayments] = useState<PlanillaPaymentRecord[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const raw = localStorage.getItem(PLANILLA_PAYMENTS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PlanillaPaymentRecord[]) : [];
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

  const localAccounts = useMemo(
    () => accounts.filter((account) => account.country === "Colombia"),
    [accounts],
  );

  const internationalAccounts = useMemo(
    () => accounts.filter((account) => account.country !== "Colombia"),
    [accounts],
  );

  const submitNovelty = (event: FormEvent) => {
    event.preventDefault();
    if (!noveltyType.trim()) {
      return;
    }

    const noveltyLabel = noveltyDescriptor.trim()
      ? `${noveltyType} - ${noveltyDescriptor.trim()}`
      : noveltyType;

    setEvents((prev) => [
      {
        id: `N-${Math.floor(Math.random() * 900 + 1000)}`,
        date: new Date().toISOString().slice(0, 10),
        noveltyType: noveltyLabel,
        status: "Reportada",
      },
      ...prev,
    ]);

    setNoveltyDescriptor("");
  };

  const openPlanillaModal = () => {
    const primaryLocal = accounts.find(
      (account) => account.country === "Colombia" && account.isPrimary,
    );
    const firstLocal = accounts.find((account) => account.country === "Colombia");
    setSelectedAccountId((primaryLocal ?? firstLocal)?.id ?? "new-local");
    setPaymentMode("cuenta-local");
    setPseKey("");
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

  const downloadPlanillaReceipt = (record: PlanillaPaymentRecord) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Comprobante de Pago PILA", 14, 18);
    doc.setFontSize(11);
    doc.text(`ID: ${record.id}`, 14, 30);
    doc.text(`Fecha: ${record.date}`, 14, 38);
    doc.text(`Periodo: ${record.period}`, 14, 46);
    doc.text(`Modalidad: ${record.paymentMethodLabel}`, 14, 54);
    doc.text(`Salud: ${formatCurrency(record.health)}`, 14, 68);
    doc.text(`Pension: ${formatCurrency(record.pension)}`, 14, 76);
    doc.text(`ARL: ${formatCurrency(record.arl)}`, 14, 84);
    doc.text(`Solidaridad: ${formatCurrency(record.solidarity)}`, 14, 92);
    doc.setFontSize(13);
    doc.text(`Total pagado: ${formatCurrency(record.total)}`, 14, 106);
    doc.save(`comprobante-planilla-${record.id}.pdf`);
  };

  const downloadNoveltySupport = (eventItem: (typeof events)[number]) => {
    const doc = new jsPDF();
    doc.setFontSize(15);
    doc.text("Soporte de novedad", 14, 18);
    doc.setFontSize(11);
    doc.text(`ID: ${eventItem.id}`, 14, 30);
    doc.text(`Fecha: ${eventItem.date}`, 14, 38);
    doc.text(`Novedad: ${eventItem.noveltyType}`, 14, 46);
    doc.text(`Estado: ${eventItem.status}`, 14, 54);
    doc.save(`soporte-novedad-${eventItem.id}.pdf`);
  };

  const processPlanillaPayment = () => {
    const isLocalMode = paymentMode === "cuenta-local";
    const isInternationalMode = paymentMode === "cuenta-internacional";
    const accountMode = isLocalMode || isInternationalMode;
    const newAccountValue = isLocalMode ? "new-local" : "new-international";

    if (accountMode && selectedAccountId === newAccountValue) {
      if (!quickAlias.trim() || !quickBank.trim() || !quickNumber.trim()) {
        return;
      }

      const newAccount: BankAccount = {
        id: `AC-${Math.floor(Math.random() * 900 + 1000)}`,
        alias: quickAlias.trim(),
        bank: quickBank.trim(),
        accountType: "Ahorros",
        accountNumber: quickNumber.trim(),
        country: isLocalMode ? "Colombia" : "Estados Unidos",
        isPrimary: false,
      };

      const nextAccounts = [...accounts, newAccount];
      setAccounts(nextAccounts);
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(nextAccounts));
      setSelectedAccountId(newAccount.id);
    }

    if (accountMode && !selectedAccountId) {
      return;
    }

    if (paymentMode === "pse" && !pseKey.trim()) {
      return;
    }

    const methodLabel =
      paymentMode === "cuenta-local"
        ? "Cuenta local"
        : paymentMode === "cuenta-internacional"
          ? "Cuenta internacional"
          : "Pagar con llave PSE";

    const paymentMethod =
      paymentMode === "cuenta-local"
        ? "cuenta-local"
        : paymentMode === "cuenta-internacional"
          ? "cuenta-internacional"
          : "pse";

    const paymentRecord: PlanillaPaymentRecord = {
      id: `PL-${Math.floor(Math.random() * 900 + 1000)}`,
      date: new Date().toISOString().slice(0, 10),
      period,
      paymentMethod,
      paymentMethodLabel: methodLabel,
      total: Math.round(totalPila),
      health: Math.round(health),
      pension: Math.round(pension),
      arl: Math.round(arl),
      solidarity: Math.round(solidarity),
    };

    const nextPayments = [paymentRecord, ...planillaPayments];
    setPlanillaPayments(nextPayments);
    localStorage.setItem(PLANILLA_PAYMENTS_STORAGE_KEY, JSON.stringify(nextPayments));

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
    setPaymentMode("cuenta-local");
    setPseKey("");
    setQuickAlias("");
    setQuickBank("");
    setQuickNumber("");
  };

  const payUsingPrestaPila = () => {
    if (!prestaPilaStudy.approved) {
      return;
    }

    registerPrestaPilaUse();

    const paymentRecord: PlanillaPaymentRecord = {
      id: `PL-${Math.floor(Math.random() * 900 + 1000)}`,
      date: new Date().toISOString().slice(0, 10),
      period,
      paymentMethod: "presta",
      paymentMethodLabel: "Pagar con Presta-Pila ACH",
      total: Math.round(totalPila),
      health: Math.round(health),
      pension: Math.round(pension),
      arl: Math.round(arl),
      solidarity: Math.round(solidarity),
    };

    const nextPayments = [paymentRecord, ...planillaPayments];
    setPlanillaPayments(nextPayments);
    localStorage.setItem(PLANILLA_PAYMENTS_STORAGE_KEY, JSON.stringify(nextPayments));

    setEvents((prev) => [
      {
        id: `N-${Math.floor(Math.random() * 900 + 1000)}`,
        date: new Date().toISOString().slice(0, 10),
        noveltyType: `Planilla independiente ${period} pagada con Presta-PILA`,
        status: "Procesada",
      },
      ...prev,
    ]);

    setShowPaymentModal(false);
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

        <article className="glass-card overflow-hidden">
          <div className="border-b border-border/80 px-4 py-3">
            <h2 className="font-semibold">Planillas pagadas</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted/45 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Periodo</th>
                  <th className="px-4 py-3">Modalidad</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3">Comprobante</th>
                </tr>
              </thead>
              <tbody>
                {planillaPayments.length > 0 ? (
                  planillaPayments.map((record) => (
                    <tr key={record.id} className="border-t border-border/70">
                      <td className="px-4 py-3">{record.date}</td>
                      <td className="px-4 py-3">{record.period}</td>
                      <td className="px-4 py-3">{record.paymentMethodLabel}</td>
                      <td className="px-4 py-3 text-right font-semibold text-primary">{formatCurrency(record.total)}</td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="outline" onClick={() => downloadPlanillaReceipt(record)}>
                          Descargar PDF
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      Aun no hay planillas pagadas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
            <select
              className="h-10 w-56 rounded-md border border-input px-3 text-sm"
              value={noveltyType}
              onChange={(event) => setNoveltyType(event.target.value)}
            >
              {noveltyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <input
              value={noveltyDescriptor}
              onChange={(event) => setNoveltyDescriptor(event.target.value)}
              className="h-10 flex-1 rounded-md border border-input px-3 text-sm"
              placeholder="Descriptor opcional"
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
                  <th className="px-4 py-3">Soporte</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-t border-border/70">
                    <td className="px-4 py-3">{event.date}</td>
                    <td className="px-4 py-3">{event.noveltyType}</td>
                    <td className="px-4 py-3">{event.status}</td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="outline" onClick={() => downloadNoveltySupport(event)}>
                        Descargar soporte
                      </Button>
                    </td>
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

                <div className="space-y-2 rounded-md border border-border/80 bg-muted/30 p-3 text-sm">
                  <p className="font-medium">Modalidad de pago</p>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment-mode"
                      checked={paymentMode === "cuenta-local"}
                      onChange={() => {
                        setPaymentMode("cuenta-local");
                        const account =
                          localAccounts.find((item) => item.isPrimary) ?? localAccounts[0];
                        setSelectedAccountId(account?.id ?? "new-local");
                      }}
                    />
                    Cuenta local
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment-mode"
                      checked={paymentMode === "cuenta-internacional"}
                      onChange={() => {
                        setPaymentMode("cuenta-internacional");
                        const account = internationalAccounts[0];
                        setSelectedAccountId(account?.id ?? "new-international");
                      }}
                    />
                    Cuenta internacional
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment-mode"
                      checked={paymentMode === "pse"}
                      onChange={() => setPaymentMode("pse")}
                    />
                    Pagar con llave PSE
                  </label>
                </div>

                {paymentMode === "cuenta-local" || paymentMode === "cuenta-internacional" ? (
                  <>
                    <label className="block text-sm">
                      Cuenta de pago
                      <select
                        className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3"
                        value={selectedAccountId}
                        onChange={(event) => setSelectedAccountId(event.target.value)}
                      >
                        {(paymentMode === "cuenta-local" ? localAccounts : internationalAccounts).map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.alias} - {account.bank}
                          </option>
                        ))}
                        <option value={paymentMode === "cuenta-local" ? "new-local" : "new-international"}>
                          Agregar nueva cuenta (abreviado)
                        </option>
                      </select>
                    </label>

                    {selectedAccountId === (paymentMode === "cuenta-local" ? "new-local" : "new-international") ? (
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
                  </>
                ) : null}

                {paymentMode === "pse" ? (
                  <label className="block text-sm">
                    Llave PSE
                    <input
                      className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3"
                      placeholder="Ej: 3150000000 o correo"
                      value={pseKey}
                      onChange={(event) => setPseKey(event.target.value)}
                    />
                  </label>
                ) : null}

                <Button className="w-full" onClick={processPlanillaPayment}>
                  Confirmar pago planilla
                </Button>
              </section>

              <section className="space-y-3 rounded-lg border border-[#ffbb55]/60 bg-[linear-gradient(160deg,#fff7e6_0%,#ffedd0_45%,#ffe4bf_100%)] p-3">
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

                <Button
                  className="w-full"
                  onClick={payUsingPrestaPila}
                  disabled={!prestaPilaStudy.approved}
                >
                  Pagar usando credito Presta-PILA
                </Button>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
