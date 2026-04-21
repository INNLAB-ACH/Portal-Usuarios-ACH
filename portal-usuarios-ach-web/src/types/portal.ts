export type TransactionType = "Transferencia" | "Pago" | "Recaudo" | "Debito Automatico";

export type Transaction = {
  id: string;
  date: string;
  description: string;
  type: TransactionType;
  amount: number;
  status: "Aprobada" | "Pendiente";
};

export type Loan = {
  id: string;
  store: string;
  approvedQuota: number;
  usedQuota: number;
  installmentValue: number;
  status: "Activo" | "En Estudio" | "Cerrado";
};

export type Bill = {
  id: string;
  service: string;
  provider: string;
  dueDate: string;
  amount: number;
  kind: "requested" | "pending";
};

export type SocialSecurityInfo = {
  eps: string;
  pensionFund: string;
  arl: string;
  compensationFund: string;
};

export type SocialSecurityEvent = {
  id: string;
  date: string;
  noveltyType: string;
  status: "Reportada" | "En Revision" | "Procesada";
};

export type AuthUser = {
  id: string;
  username: string;
  fullName: string;
};

export type AccountType = "Ahorros" | "Corriente" | "Deposito de bajo monto";
export type AccountCountry = "Colombia" | "Espana" | "Estados Unidos" | "Mexico" | "Otro";

export type BankAccount = {
  id: string;
  alias: string;
  bank: string;
  accountType: AccountType;
  accountNumber: string;
  country: AccountCountry;
  customCountry?: string;
  isPrimary: boolean;
};
