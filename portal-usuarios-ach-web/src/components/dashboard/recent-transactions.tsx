"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { transactions } from "@/data/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Transaction } from "@/types/portal";

export function RecentTransactions() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const downloadReceipt = (transaction: Transaction) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Comprobante de transaccion", 14, 18);
    doc.setFontSize(11);
    doc.text(`ID: ${transaction.id}`, 14, 32);
    doc.text(`Fecha: ${transaction.date}`, 14, 40);
    doc.text(`Tipo: ${transaction.type}`, 14, 48);
    doc.text(`Estado: ${transaction.status}`, 14, 56);
    doc.text(`Detalle: ${transaction.description}`, 14, 64);
    doc.setFontSize(13);
    doc.text(`Monto: ${formatCurrency(transaction.amount)}`, 14, 78);
    doc.save(`comprobante-${transaction.id}.pdf`);
  };

  return (
    <>
      <section className="glass-card overflow-hidden">
        <div className="border-b border-border/80 px-4 py-3 md:px-5">
          <h2 className="text-base font-semibold">Ultimas transacciones</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-muted/45 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Detalle</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3 text-right">Monto</th>
                <th className="px-4 py-3">Accion</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 6).map((transaction) => (
                <tr key={transaction.id} className="border-t border-border/70">
                  <td className="px-4 py-3">{transaction.date}</td>
                  <td className="px-4 py-3">{transaction.description}</td>
                  <td className="px-4 py-3">{transaction.type}</td>
                  <td className="px-4 py-3 text-right font-semibold text-primary">{formatCurrency(transaction.amount)}</td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="outline" onClick={() => setSelectedTransaction(transaction)}>
                      Ver detalle
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedTransaction ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/35 p-4">
          <div className="glass-card w-full max-w-md space-y-4 border border-primary/20 bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary">Detalle de transaccion</h3>
              <button
                type="button"
                className="rounded-md p-1 hover:bg-muted"
                onClick={() => setSelectedTransaction(null)}
                aria-label="Cerrar"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">ID:</span> <strong>{selectedTransaction.id}</strong></p>
              <p><span className="text-muted-foreground">Fecha:</span> {selectedTransaction.date}</p>
              <p><span className="text-muted-foreground">Tipo:</span> {selectedTransaction.type}</p>
              <p><span className="text-muted-foreground">Estado:</span> {selectedTransaction.status}</p>
              <p><span className="text-muted-foreground">Detalle:</span> {selectedTransaction.description}</p>
              <p><span className="text-muted-foreground">Monto:</span> <strong className="text-primary">{formatCurrency(selectedTransaction.amount)}</strong></p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedTransaction(null)}>Cerrar</Button>
              <Button onClick={() => downloadReceipt(selectedTransaction)}>Descargar comprobante</Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
