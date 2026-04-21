"use client";

import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import Papa from "papaparse";
import { ChevronLeft, ChevronRight, Download, FileDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { transactions } from "@/data/mock-data";
import { Transaction } from "@/types/portal";
import { formatCurrency } from "@/lib/utils";

export default function TransactionsPage() {
  const [filter, setFilter] = useState<Transaction["type"] | "Todas">("Todas");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => {
    return transactions.filter((item) => {
      const byType = filter === "Todas" || item.type === filter;
      const bySearch =
        !search.trim() ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase());
      const byFromDate = !dateFrom || item.date >= dateFrom;
      const byToDate = !dateTo || item.date <= dateTo;
      const byMin = !minAmount || item.amount >= Number(minAmount);
      const byMax = !maxAmount || item.amount <= Number(maxAmount);

      return byType && bySearch && byFromDate && byToDate && byMin && byMax;
    });
  }, [dateFrom, dateTo, filter, maxAmount, minAmount, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const exportCsv = () => {
    const csv = Papa.unparse(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transacciones-ach.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Reporte de transacciones ACH", 14, 16);
    doc.setFontSize(10);

    filtered.slice(0, 18).forEach((transaction, index) => {
      const line = `${transaction.date} | ${transaction.type} | ${transaction.description} | ${formatCurrency(transaction.amount)}`;
      doc.text(line, 14, 28 + index * 8);
    });

    doc.save("transacciones-ach.pdf");
  };

  const clearFilters = () => {
    setFilter("Todas");
    setSearch("");
    setDateFrom("");
    setDateTo("");
    setMinAmount("");
    setMaxAmount("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <section className="glass-card space-y-4 p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className="h-10 w-full rounded-lg border border-input bg-white pl-9 pr-3 text-sm"
              placeholder="Buscar por ID o descripcion"
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
            value={dateFrom}
            onChange={(event) => {
              setDateFrom(event.target.value);
              setCurrentPage(1);
            }}
          />
          <input
            type="date"
            className="h-10 rounded-lg border border-input bg-white px-3 text-sm"
            value={dateTo}
            onChange={(event) => {
              setDateTo(event.target.value);
              setCurrentPage(1);
            }}
          />
          <input
            type="number"
            min={0}
            className="h-10 rounded-lg border border-input bg-white px-3 text-sm"
            placeholder="Monto minimo"
            value={minAmount}
            onChange={(event) => {
              setMinAmount(event.target.value);
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
          <Button variant="outline" onClick={clearFilters}>Limpiar filtros</Button>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {(["Todas", "Transferencia", "Pago", "Recaudo", "Debito Automatico"] as const).map((type) => (
              <Button
                key={type}
                variant={filter === type ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setFilter(type);
                  setCurrentPage(1);
                }}
              >
                {type}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCsv} className="gap-1">
              <Download className="size-4" /> CSV
            </Button>
            <Button size="sm" onClick={exportPdf} className="gap-1">
              <FileDown className="size-4" /> PDF
            </Button>
          </div>
        </div>
      </section>

      <section className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-muted/45 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Descripcion</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Monto</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length > 0 ? (
                paginated.map((transaction) => (
                  <tr key={transaction.id} className="border-t border-border/70">
                    <td className="px-4 py-3 font-medium">{transaction.id}</td>
                    <td className="px-4 py-3">{transaction.date}</td>
                    <td className="px-4 py-3">{transaction.description}</td>
                    <td className="px-4 py-3">{transaction.type}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs ${transaction.status === "Aprobada" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-primary">{formatCurrency(transaction.amount)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-14 text-center text-sm text-muted-foreground">
                    No hay transacciones para los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="flex items-center justify-between border-t border-border/70 px-4 py-3 text-sm">
          <p className="text-muted-foreground">
            Mostrando {paginated.length} de {filtered.length} registros
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-20 text-center">
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
    </div>
  );
}
