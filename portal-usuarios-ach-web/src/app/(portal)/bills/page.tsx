"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentWizard } from "@/components/payment/payment-wizard";
import { bills } from "@/data/mock-data";
import { formatCurrency } from "@/lib/utils";

type AutoPayConfig = {
  enabled: boolean;
  debitAccount: "Cuenta principal" | "Cuenta nomina";
  day: number;
};

const AUTOPAY_KEY = "ach-autopay-config";

export default function BillsPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [dueFrom, setDueFrom] = useState("");
  const [dueTo, setDueTo] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [autoPayOnly, setAutoPayOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openWizard, setOpenWizard] = useState(false);
  const [autoPay, setAutoPay] = useState<Record<string, AutoPayConfig>>(() => {
    if (typeof window === "undefined") {
      return {};
    }

    const raw = localStorage.getItem(AUTOPAY_KEY);
    return raw ? (JSON.parse(raw) as Record<string, AutoPayConfig>) : {};
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

      <section className="glass-card overflow-hidden">
        <div className="border-b border-border/80 px-4 py-3">
          <h2 className="font-semibold">Facturas futuras</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-muted/45 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">Servicio</th>
                <th className="px-4 py-3">Proveedor</th>
                <th className="px-4 py-3">Vence</th>
                <th className="px-4 py-3 text-right">Monto</th>
                <th className="px-4 py-3">Accion</th>
              </tr>
            </thead>
            <tbody>
              {futureBills.length > 0 ? (
                futureBills.map((bill) => {
                  const config = autoPay[bill.id];

                  return (
                    <tr key={bill.id} className="border-t border-border/70">
                      <td className="px-4 py-3">
                        <p>{bill.service}</p>
                        <p className="text-xs text-muted-foreground">{bill.id}</p>
                      </td>
                      <td className="px-4 py-3">{bill.provider}</td>
                      <td className="px-4 py-3">{bill.dueDate}</td>
                      <td className="px-4 py-3 text-right font-semibold text-primary">{formatCurrency(bill.amount)}</td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          variant={config?.enabled ? "outline" : "default"}
                          onClick={() => setAutoPayEnabled(bill.id, !config?.enabled)}
                        >
                          {config?.enabled ? "Autopago activo" : "Activar autopago"}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-14 text-center text-sm text-muted-foreground">
                    No hay facturas futuras para los filtros actuales.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="glass-card overflow-hidden">
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
    </div>
  );
}
