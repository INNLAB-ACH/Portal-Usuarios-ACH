import { transactions } from "@/data/mock-data";
import { formatCurrency } from "@/lib/utils";

export function RecentTransactions() {
  return (
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
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 6).map((transaction) => (
              <tr key={transaction.id} className="border-t border-border/70">
                <td className="px-4 py-3">{transaction.date}</td>
                <td className="px-4 py-3">{transaction.description}</td>
                <td className="px-4 py-3">{transaction.type}</td>
                <td className="px-4 py-3 text-right font-semibold text-primary">{formatCurrency(transaction.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
