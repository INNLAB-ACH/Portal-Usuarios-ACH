"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Download,
  Flame,
  MoreVertical,
  Search,
  Smartphone,
  Sparkles,
  Tv,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentWizard } from "@/components/payment/payment-wizard";
import { bills } from "@/data/mock-data";
import { formatCurrency } from "@/lib/utils";
import { BankAccount } from "@/types/portal";
import { useHydrated } from "@/lib/use-hydrated";

type AutoPayConfig = {
  enabled: boolean;
  debitAccount: "Cuenta principal" | "Cuenta nomina";
  day: number;
  accountId?: string;
  accountAlias?: string;
};

const AUTOPAY_KEY = "ach-autopay-config";
const ACCOUNTS_STORAGE_KEY = "ach-accounts-list";

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

export default function BillsPage() {
  const isHydrated = useHydrated();
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [dueFrom, setDueFrom] = useState("");
  const [dueTo, setDueTo] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [autoPayOnly, setAutoPayOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openWizard, setOpenWizard] = useState(false);
  const [menuBillId, setMenuBillId] = useState<string | null>(null);
  const [detailsBillId, setDetailsBillId] = useState<string | null>(null);
  const [autopayBillId, setAutopayBillId] = useState<string | null>(null);
  const [autopayAccountId, setAutopayAccountId] = useState("");
  const [autopayDay, setAutopayDay] = useState(25);
  const [autoPay, setAutoPay] = useState<Record<string, AutoPayConfig>>(() => {
    if (typeof window === "undefined") {
      return {};
    }

    const raw = localStorage.getItem(AUTOPAY_KEY);
    return raw ? (JSON.parse(raw) as Record<string, AutoPayConfig>) : {};
  });
  const [accounts] = useState<BankAccount[]>(() => {
    if (typeof window === "undefined") {
      return fallbackAccounts;
    }

    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BankAccount[]) : fallbackAccounts;
  });

  const pageSize = 5;
  const today = "2026-04-21";

  const filteredCurrentBills = useMemo(() => {
    return bills.filter((bill) => {
      const byCurrentDate = bill.dueDate >= today;
      const bySearch =
        !search.trim() ||
        bill.service.toLowerCase().includes(search.toLowerCase()) ||
        bill.provider.toLowerCase().includes(search.toLowerCase());
      const byFromDate = !dueFrom || bill.dueDate >= dueFrom;
      const byToDate = !dueTo || bill.dueDate <= dueTo;
      const byAmount = !maxAmount || bill.amount <= Number(maxAmount);
      const byAutoPay = !autoPayOnly || autoPay[bill.id]?.enabled;
      return byCurrentDate && bySearch && byFromDate && byToDate && byAmount && byAutoPay;
    });
  }, [autoPay, autoPayOnly, dueFrom, dueTo, maxAmount, search]);

  const futureBills = useMemo(
    () => filteredCurrentBills.filter((bill) => bill.kind === "pending"),
    [filteredCurrentBills],
  );

  const activeBills = useMemo(
    () => filteredCurrentBills.filter((bill) => bill.kind === "requested"),
    [filteredCurrentBills],
  );

  const pastBills = useMemo(() => bills.filter((bill) => bill.dueDate < today), [today]);

  const totalPages = Math.max(1, Math.ceil(activeBills.length / pageSize));
  const paginatedActive = activeBills.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    localStorage.setItem(AUTOPAY_KEY, JSON.stringify(autoPay));
  }, [autoPay]);

  const selectedBills = activeBills.filter((bill) => selected.includes(bill.id));
  const detailBill = futureBills.find((bill) => bill.id === detailsBillId) ?? null;
  const autopayBill = futureBills.find((bill) => bill.id === autopayBillId) ?? null;

  if (!isHydrated) {
    return <div className="flex min-h-[220px] items-center justify-center">Cargando facturas...</div>;
  }

  const toggleSelection = (billId: string) => {
    setSelected((prev) =>
      prev.includes(billId) ? prev.filter((item) => item !== billId) : [...prev, billId],
    );
  };

  const clearFilters = () => {
    setSearch("");
    setDueFrom("");
    setDueTo("");
    setMaxAmount("");
    setAutoPayOnly(false);
    setCurrentPage(1);
  };

  const setAutoPayEnabled = (billId: string, enabled: boolean) => {
    setAutoPay((prev) => ({
      ...prev,
      [billId]: {
        enabled,
        debitAccount: prev[billId]?.debitAccount ?? "Cuenta principal",
        day: prev[billId]?.day ?? 25,
      },
    }));
  };

  const setAutoPayAccount = (billId: string, account: AutoPayConfig["debitAccount"]) => {
    setAutoPay((prev) => ({
      ...prev,
      [billId]: {
        enabled: prev[billId]?.enabled ?? true,
        debitAccount: account,
        day: prev[billId]?.day ?? 25,
      },
    }));
  };

  const setAutoPayDay = (billId: string, day: number) => {
    setAutoPay((prev) => ({
      ...prev,
      [billId]: {
        enabled: prev[billId]?.enabled ?? true,
        debitAccount: prev[billId]?.debitAccount ?? "Cuenta principal",
        day,
      },
    }));
  };

  const serviceIcon = (service: string) => {
    const normalized = service.toLowerCase();
    if (normalized.includes("energia")) return Zap;
    if (normalized.includes("gas")) return Flame;
    if (normalized.includes("movil") || normalized.includes("celular")) return Smartphone;
    if (normalized.includes("internet")) return Wifi;
    if (normalized.includes("tv")) return Tv;
    return Building2;
  };

  const openAutoPayModal = (billId: string) => {
    const config = autoPay[billId];
    const primary = accounts.find((account) => account.isPrimary) ?? accounts[0];
    setAutopayBillId(billId);
    setAutopayAccountId(config?.accountId ?? primary?.id ?? "");
    setAutopayDay(config?.day ?? 25);
    setMenuBillId(null);
  };

  const saveAutoPayForFutureBill = () => {
    if (!autopayBillId || !autopayAccountId) {
      return;
    }

    const account = accounts.find((item) => item.id === autopayAccountId);

    setAutoPay((prev) => ({
      ...prev,
      [autopayBillId]: {
        enabled: true,
        debitAccount: account?.isPrimary ? "Cuenta principal" : "Cuenta nomina",
        day: autopayDay,
        accountId: autopayAccountId,
        accountAlias: account?.alias,
      },
    }));

    setAutopayBillId(null);
  };

  return (
    <div className="space-y-4">
      <section className="glass-card space-y-4 p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className="h-10 w-full rounded-lg border border-input bg-white pl-9 pr-3 text-sm"
              placeholder="Buscar servicio o proveedor"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
            />
          </label>
          <input
            type="date"
            className="h-10 rounded-lg border border-input bg-white px-3 text-sm"
            value={dueFrom}
            onChange={(event) => {
              setDueFrom(event.target.value);
              setCurrentPage(1);
            }}
          />
          <input
            type="date"
            className="h-10 rounded-lg border border-input bg-white px-3 text-sm"
            value={dueTo}
            onChange={(event) => {
              setDueTo(event.target.value);
              setCurrentPage(1);
            }}
          />
          <input
            type="number"
            min={0}
            className="h-10 rounded-lg border border-input bg-white px-3 text-sm"
            placeholder="Monto maximo"
            value={maxAmount}
            onChange={(event) => {
              setMaxAmount(event.target.value);
              setCurrentPage(1);
            }}
          />
          <label className="flex h-10 items-center gap-2 rounded-lg border border-input bg-white px-3 text-sm">
            <input
              type="checkbox"
              checked={autoPayOnly}
              onChange={(event) => {
                setAutoPayOnly(event.target.checked);
                setCurrentPage(1);
              }}
            />
            Solo autopago activo
          </label>
          <Button variant="outline" onClick={clearFilters}>Limpiar filtros</Button>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setSelected(paginatedActive.map((bill) => bill.id))}
              disabled={paginatedActive.length === 0}
            >
              Seleccionar activas
            </Button>
            <Button disabled={selected.length === 0} onClick={() => setOpenWizard(true)}>
              Pagar seleccionadas ({selected.length})
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <article className="glass-card overflow-hidden">
          <div className="border-b border-border/80 px-4 py-3">
            <h2 className="font-semibold">Facturas activas para pago</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted/45 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3" />
                  <th className="px-4 py-3">Servicio</th>
                  <th className="px-4 py-3">Proveedor</th>
                  <th className="px-4 py-3">Vence</th>
                  <th className="px-4 py-3 text-right">Monto</th>
                  <th className="px-4 py-3">Autopago</th>
                  <th className="px-4 py-3">Accion</th>
                </tr>
              </thead>
              <tbody>
                {paginatedActive.length > 0 ? (
                  paginatedActive.map((bill) => {
                    const isSelected = selected.includes(bill.id);
                    const config = autoPay[bill.id];

                    return (
                      <tr key={bill.id} className="border-t border-border/70 align-top">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelection(bill.id)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <p>{bill.service}</p>
                          <p className="text-xs text-muted-foreground">{bill.id}</p>
                        </td>
                        <td className="px-4 py-3">{bill.provider}</td>
                        <td className="px-4 py-3">{bill.dueDate}</td>
                        <td className="px-4 py-3 text-right font-semibold text-primary">{formatCurrency(bill.amount)}</td>
                        <td className="px-4 py-3">
                          <label className="mb-2 flex items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={Boolean(config?.enabled)}
                              onChange={(event) => setAutoPayEnabled(bill.id, event.target.checked)}
                            />
                            Autopago
                          </label>

                          {config?.enabled ? (
                            <div className="space-y-2 rounded-md border border-border/80 bg-muted/40 p-2 text-xs">
                              <select
                                value={config.debitAccount}
                                onChange={(event) =>
                                  setAutoPayAccount(
                                    bill.id,
                                    event.target.value as AutoPayConfig["debitAccount"],
                                  )
                                }
                                className="h-8 w-full rounded border border-input bg-white px-2"
                              >
                                <option>Cuenta principal</option>
                                <option>Cuenta nomina</option>
                              </select>
                              <input
                                type="number"
                                min={1}
                                max={28}
                                value={config.day}
                                onChange={(event) => setAutoPayDay(bill.id, Number(event.target.value))}
                                className="h-8 w-full rounded border border-input bg-white px-2"
                              />
                            </div>
                          ) : null}
                        </td>
                        <td className="px-4 py-3">
                          <Button size="sm" onClick={() => {
                            setSelected([bill.id]);
                            setOpenWizard(true);
                          }}>
                            Pagar
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-14 text-center text-sm text-muted-foreground">
                      No hay facturas activas para pago con los filtros actuales.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <footer className="flex items-center justify-between border-t border-border/70 px-4 py-3 text-sm">
            <p className="text-muted-foreground">{activeBills.length} facturas activas para pago</p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span>
                Pagina {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </footer>
        </article>

        <aside className="glass-card overflow-hidden">
          <div className="border-b border-border/80 px-4 py-3">
            <h2 className="font-semibold">Facturas futuras</h2>
            <p className="text-xs text-muted-foreground">Vista resumida</p>
          </div>
          <div className="max-h-[392px] space-y-3 overflow-y-auto p-3">
            {futureBills.length > 0 ? (
              futureBills.map((bill) => {
                const config = autoPay[bill.id];
                const Icon = serviceIcon(bill.service);

                return (
                  <article key={bill.id} className="relative min-h-[84px] rounded-lg border border-border/80 bg-muted/35 p-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-start gap-2">
                        <span className="rounded-md bg-primary/10 p-1.5 text-primary">
                          <Icon className="size-3.5" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold leading-tight">{bill.provider}</p>
                          <p className="truncate text-[11px] text-muted-foreground">{bill.service}</p>
                        </div>
                      </div>
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
                      <div className="absolute right-2 top-9 z-10 w-44 rounded-md border border-border bg-white p-1 shadow-lg">
                        <button
                          type="button"
                          className="w-full rounded px-2 py-1.5 text-left text-xs hover:bg-muted"
                          onClick={() => {
                            setDetailsBillId(bill.id);
                            setMenuBillId(null);
                          }}
                        >
                          Ver detalles
                        </button>
                        <button
                          type="button"
                          className="w-full rounded px-2 py-1.5 text-left text-xs hover:bg-muted"
                          onClick={() => openAutoPayModal(bill.id)}
                        >
                          {config?.enabled ? "Editar autopago" : "Activar autopago"}
                        </button>
                      </div>
                    ) : null}

                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Vence {bill.dueDate}</span>
                      <strong className="text-primary">{formatCurrency(bill.amount)}</strong>
                    </div>

                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {config?.enabled
                        ? `Autopago activo (${config.accountAlias ?? "Cuenta configurada"})`
                        : "Autopago no configurado"}
                    </p>
                  </article>
                );
              })
            ) : (
              <p className="p-2 text-center text-sm text-muted-foreground">
                No hay facturas futuras para los filtros actuales.
              </p>
            )}
          </div>
        </aside>
      </section>

      <section className="glass-card overflow-hidden">
        <div className="border-b border-border/80 px-4 py-3">
          <h2 className="font-semibold">Facturas pasadas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-muted/45 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">Servicio</th>
                <th className="px-4 py-3">Proveedor</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3 text-right">Monto</th>
                <th className="px-4 py-3">Comprobante</th>
              </tr>
            </thead>
            <tbody>
              {pastBills.length > 0 ? (
                pastBills.map((bill) => (
                  <tr key={bill.id} className="border-t border-border/70">
                    <td className="px-4 py-3">{bill.service}</td>
                    <td className="px-4 py-3">{bill.provider}</td>
                    <td className="px-4 py-3">{bill.dueDate}</td>
                    <td className="px-4 py-3 text-right font-semibold text-primary">{formatCurrency(bill.amount)}</td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="outline" className="gap-1">
                        <Download className="size-4" /> Descargar
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No hay facturas pasadas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="glass-card flex items-start gap-3 p-4 text-sm">
        <Sparkles className="mt-0.5 size-4 text-secondary" />
        <p className="text-muted-foreground">
          Facturas futuras: solo activacion de autopago. Facturas activas para pago: pago inmediato y configuracion de autopago.
        </p>
      </section>

      {openWizard ? (
        <PaymentWizard
          title="Pago de facturas"
          items={selectedBills.map((bill) => ({ id: bill.id, name: `${bill.service} - ${bill.provider}`, amount: bill.amount }))}
          onClose={() => {
            setOpenWizard(false);
            setSelected([]);
          }}
        />
      ) : null}

      {detailBill ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/35 p-4">
          <div className="glass-card w-full max-w-md space-y-4 border border-primary/20 bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary">Detalle de factura</h3>
              <button
                type="button"
                className="rounded-md p-1 hover:bg-muted"
                onClick={() => setDetailsBillId(null)}
                aria-label="Cerrar"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Empresa:</span> <strong>{detailBill.provider}</strong></p>
              <p><span className="text-muted-foreground">Servicio:</span> {detailBill.service}</p>
              <p><span className="text-muted-foreground">Referencia:</span> {detailBill.id}</p>
              <p><span className="text-muted-foreground">Vencimiento:</span> {detailBill.dueDate}</p>
              <p><span className="text-muted-foreground">Monto:</span> <strong className="text-primary">{formatCurrency(detailBill.amount)}</strong></p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDetailsBillId(null)}>Cerrar</Button>
              <Button
                onClick={() => {
                  openAutoPayModal(detailBill.id);
                  setDetailsBillId(null);
                }}
              >
                Activar autopago
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {autopayBill ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/35 p-4">
          <div className="glass-card w-full max-w-md space-y-4 border border-primary/20 bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary">Configurar autopago</h3>
              <button
                type="button"
                className="rounded-md p-1 hover:bg-muted"
                onClick={() => setAutopayBillId(null)}
                aria-label="Cerrar"
              >
                <X className="size-4" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground">
              {autopayBill.provider} - {autopayBill.service}
            </p>

            <label className="block text-sm">
              Cuenta para debito
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
              <Button onClick={saveAutoPayForFutureBill}>Guardar autopago</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
