export type TransactionType = "Transferencia" | "Pago" | "Recaudo" | "Débito Automático";

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

export type AccountType = "Ahorros" | "Corriente" | "Depósito de bajo monto";
export type AccountCountry = "Colombia" | "España" | "Estados Unidos" | "México" | "Otro";

export type BankAccount = {
  id: string;
  alias: string;
  bank: string;
  accountType: AccountType;
  accountNumber: string;
  country: AccountCountry;
  customCountry?: string;
  isPrimary: boolean;
  balance?: number;
};

export type EcommerceCartItem = {
  id: string;
  name: string;
  brand: string;
  finish: string;
  amount: number;
  quantity: number;
};

export type ImmediatePaymentOption = {
  id: "pay-from-account" | "approved-extension-limit" | "instant-loan-request";
  title: string;
  description: string;
};

export type EcommerceFlowContext = {
  entry: "ecommerce";
  selectedMethod: "pse-hub";
  merchantName: string;
  total: number;
  cartItems: EcommerceCartItem[];
  returnPath: "/instant-payments";
};

export type ImmediatePaymentResult = {
  reference: string;
  status: "approved" | "cancelled";
  processedAt: string;
  amount: number;
  merchantName: string;
  bankName: string;
  accountAlias: string;
};

export type ExtraLimitOption = {
  id: string;
  name: string;
  availableLimit: number;
  fee: number;
  approvalTime: string;
};

export type InstantLoanProvider = {
  id: string;
  name: string;
  maxAmount: number;
  rateLabel: string;
  payoutTime: string;
};

export type PSEGeoRule = {
  id: string;
  scope: "Ciudad" | "Pais" | "Zona";
  target: string;
  action: "Permitir" | "Bloquear";
  active: boolean;
  updatedAt: string;
};

export type PSETrustEntry = {
  id: string;
  category: "Entidad" | "Comercio";
  name: string;
  listType: "Whitelist" | "Blacklist";
  notes?: string;
  active: boolean;
};

export type PSEOperationWindow = {
  id: string;
  name: string;
  startHour: string;
  endHour: string;
  days: string[];
  blockOutsideSchedule: boolean;
  timezone: string;
  active: boolean;
};

export type PSELimitPolicy = {
  id: string;
  maxAmountPerTransaction: number;
  maxTransactionsPerDay: number;
  dailyAccumulatedCap: number;
  weeklyAccumulatedCap: number;
  active: boolean;
  updatedAt: string;
};

export type PSESafeZoneSummary = {
  activeRules: number;
  blockedRules: number;
  trustedEntities: number;
  trustedMerchants: number;
};
