"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Globe2, Plus, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountCountry, AccountType, BankAccount } from "@/types/portal";

const ACCOUNTS_STORAGE_KEY = "ach-accounts-list";

const initialAccounts: BankAccount[] = [
  {
    id: "AC-001",
    alias: "Principal nomina",
    bank: "Bancolombia",
    accountType: "Ahorros",
    accountNumber: "*******1289",
    country: "Colombia",
    isPrimary: true,
  },
  {
    id: "AC-002",
    alias: "Operaciones ACH",
    bank: "Davivienda",
    accountType: "Corriente",
    accountNumber: "*******7701",
    country: "Colombia",
    isPrimary: false,
  },
  {
    id: "AC-003",
    alias: "Cuenta internacional",
    bank: "BBVA Espana",
    accountType: "Ahorros",
    accountNumber: "ES91***********",
    country: "Espana",
    isPrimary: false,
  },
];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>(() => {
    if (typeof window === "undefined") {
      return initialAccounts;
    }

    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BankAccount[]) : initialAccounts;
  });
  const [alias, setAlias] = useState("");
  const [bank, setBank] = useState("");
  const [type, setType] = useState<AccountType>("Ahorros");
  const [number, setNumber] = useState("");
  const [country, setCountry] = useState<AccountCountry>("Colombia");
  const [customCountry, setCustomCountry] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);

  const totalInternational = useMemo(
    () => accounts.filter((account) => account.country !== "Colombia").length,
    [accounts],
  );

  const submitAccount = (event: FormEvent) => {
    event.preventDefault();

    if (!alias.trim() || !bank.trim() || !number.trim()) {
      return;
    }

    const newAccount: BankAccount = {
      id: `AC-${Math.floor(Math.random() * 900 + 1000)}`,
      alias: alias.trim(),
      bank: bank.trim(),
      accountType: type,
      accountNumber: number.trim(),
      country,
      customCountry: country === "Otro" ? customCountry.trim() : undefined,
      isPrimary,
    };

    setAccounts((prev) => [
      ...(isPrimary ? prev.map((item) => ({ ...item, isPrimary: false })) : prev),
      newAccount,
    ]);

    setAlias("");
    setBank("");
    setType("Ahorros");
    setNumber("");
    setCountry("Colombia");
    setCustomCountry("");
    setIsPrimary(false);
  };

  useEffect(() => {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  }, [accounts]);

  return (
    <div className="space-y-4">
      <section className="grid gap-4 md:grid-cols-3">
        <article className="glass-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Cuentas registradas</p>
          <p className="mt-2 text-3xl font-bold text-primary">{accounts.length}</p>
        </article>
        <article className="glass-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Cuentas internacionales</p>
          <p className="mt-2 text-3xl font-bold text-primary">{totalInternational}</p>
        </article>
        <article className="glass-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Tipos habilitados</p>
          <p className="mt-2 text-lg font-semibold">Ahorros, Corriente, Deposito de bajo monto</p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <article className="glass-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/80 px-4 py-3">
            <h2 className="font-semibold">Listado de cuentas y bancos</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
              <WalletCards className="size-3.5" /> Gestion activa
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted/45 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3">Alias</th>
                  <th className="px-4 py-3">Banco</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Numero</th>
                  <th className="px-4 py-3">Pais</th>
                  <th className="px-4 py-3">Marca</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id} className="border-t border-border/70">
                    <td className="px-4 py-3">{account.alias}</td>
                    <td className="px-4 py-3">{account.bank}</td>
                    <td className="px-4 py-3">{account.accountType}</td>
                    <td className="px-4 py-3">{account.accountNumber}</td>
                    <td className="px-4 py-3">{account.country === "Otro" ? account.customCountry : account.country}</td>
                    <td className="px-4 py-3">
                      {account.isPrimary ? (
                        <span className="rounded-full bg-secondary/15 px-2 py-1 text-xs text-secondary">Principal</span>
                      ) : (
                        <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">Secundaria</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <form onSubmit={submitAccount} className="glass-card space-y-3 p-4">
          <h2 className="font-semibold">Agregar cuenta</h2>

          <input
            className="h-10 w-full rounded-md border border-input px-3 text-sm"
            placeholder="Alias de la cuenta"
            value={alias}
            onChange={(event) => setAlias(event.target.value)}
          />

          <input
            className="h-10 w-full rounded-md border border-input px-3 text-sm"
            placeholder="Banco"
            value={bank}
            onChange={(event) => setBank(event.target.value)}
          />

          <div className="grid grid-cols-2 gap-2">
            <select
              className="h-10 rounded-md border border-input px-2 text-sm"
              value={type}
              onChange={(event) => setType(event.target.value as AccountType)}
            >
              <option>Ahorros</option>
              <option>Corriente</option>
              <option>Deposito de bajo monto</option>
            </select>

            <select
              className="h-10 rounded-md border border-input px-2 text-sm"
              value={country}
              onChange={(event) => setCountry(event.target.value as AccountCountry)}
            >
              <option>Colombia</option>
              <option>Espana</option>
              <option>Estados Unidos</option>
              <option>Mexico</option>
              <option>Otro</option>
            </select>
          </div>

          {country === "Otro" ? (
            <input
              className="h-10 w-full rounded-md border border-input px-3 text-sm"
              placeholder="Especifica el pais"
              value={customCountry}
              onChange={(event) => setCustomCountry(event.target.value)}
            />
          ) : null}

          <input
            className="h-10 w-full rounded-md border border-input px-3 text-sm"
            placeholder="Numero de cuenta"
            value={number}
            onChange={(event) => setNumber(event.target.value)}
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isPrimary}
              onChange={(event) => setIsPrimary(event.target.checked)}
            />
            Marcar como cuenta principal
          </label>

          <Button type="submit" className="w-full gap-2">
            <Plus className="size-4" /> Guardar cuenta
          </Button>

          <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Globe2 className="size-3.5" /> Soporta cuentas en Espana, Estados Unidos, Mexico y otros paises.
          </p>
        </form>
      </section>
    </div>
  );
}
