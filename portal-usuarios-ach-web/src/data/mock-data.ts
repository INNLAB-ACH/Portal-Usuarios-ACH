import {
  Bill,
  EcommerceCartItem,
  ExtraLimitOption,
  ImmediatePaymentOption,
  InstantLoanProvider,
  Loan,
  PSEGeoRule,
  PSELimitPolicy,
  PSEOperationWindow,
  PSESafeZoneSummary,
  PSETrustEntry,
  SocialSecurityEvent,
  SocialSecurityInfo,
  Transaction,
  BankAccount,
} from "@/types/portal";

export const mockUsers = [
  { id: "u1", username: "demo", password: "1234", fullName: "Camila Torres" },
  { id: "u2", username: "achuser", password: "1234", fullName: "Santiago Rojas" },
];

export const transactions: Transaction[] = [
  { id: "T-1001", date: "2026-04-20", description: "Transferencia a Davivienda", type: "Transferencia", amount: 1850000, status: "Aprobada" },
  { id: "T-1002", date: "2026-04-19", description: "Pago factura energía", type: "Pago", amount: 214500, status: "Aprobada" },
  { id: "T-1003", date: "2026-04-18", description: "Recaudo comercio virtual", type: "Recaudo", amount: 420000, status: "Aprobada" },
  { id: "T-1004", date: "2026-04-17", description: "Débito automático internet", type: "Débito Automático", amount: 132000, status: "Aprobada" },
  { id: "T-1005", date: "2026-04-16", description: "Transferencia interna ACH", type: "Transferencia", amount: 610000, status: "Pendiente" },
  { id: "T-1006", date: "2026-04-16", description: "Pago plan móvil", type: "Pago", amount: 96000, status: "Aprobada" },
  { id: "T-1007", date: "2026-04-15", description: "Recaudo mensual", type: "Recaudo", amount: 760000, status: "Aprobada" },
  { id: "T-1008", date: "2026-04-14", description: "Transferencia banco aliado", type: "Transferencia", amount: 980000, status: "Aprobada" },
  { id: "T-1009", date: "2026-04-13", description: "Pago factura gas", type: "Pago", amount: 88000, status: "Aprobada" },
  { id: "T-1010", date: "2026-04-12", description: "Débito automático streaming", type: "Débito Automático", amount: 55900, status: "Aprobada" },
  { id: "T-1011", date: "2026-04-11", description: "Transferencia comercio", type: "Transferencia", amount: 1340000, status: "Aprobada" },
  { id: "T-1012", date: "2026-04-10", description: "Pago factura agua", type: "Pago", amount: 143200, status: "Aprobada" },
];

export const loans: Loan[] = [
  { id: "L-301", store: "Alkosto", approvedQuota: 9000000, usedQuota: 3200000, installmentValue: 540000, status: "Activo" },
  { id: "L-302", store: "Homecenter", approvedQuota: 6500000, usedQuota: 1500000, installmentValue: 310000, status: "Activo" },
  { id: "L-303", store: "Éxito", approvedQuota: 4000000, usedQuota: 0, installmentValue: 0, status: "En Estudio" },
  { id: "L-304", store: "Falabella", approvedQuota: 5500000, usedQuota: 2500000, installmentValue: 450000, status: "Activo" },
  { id: "L-305", store: "Ktronix", approvedQuota: 3000000, usedQuota: 3000000, installmentValue: 0, status: "Cerrado" },
];

export const bills: Bill[] = [
  { id: "B-701", service: "Energía", provider: "Enel", dueDate: "2026-04-10", amount: 214500, kind: "requested" },
  { id: "B-702", service: "Agua", provider: "Acueducto", dueDate: "2026-04-12", amount: 143200, kind: "requested" },
  { id: "B-703", service: "Gas", provider: "Vanti", dueDate: "2026-04-18", amount: 88000, kind: "requested" },
  { id: "B-704", service: "Plan Móvil", provider: "Movistar", dueDate: "2026-04-29", amount: 96000, kind: "requested" },
  { id: "B-705", service: "Internet", provider: "Claro", dueDate: "2026-05-01", amount: 132000, kind: "requested" },
  { id: "B-706", service: "Energía", provider: "Enel", dueDate: "2026-05-25", amount: 206100, kind: "pending" },
  { id: "B-707", service: "Agua", provider: "Acueducto", dueDate: "2026-05-26", amount: 135900, kind: "pending" },
  { id: "B-708", service: "Gas", provider: "Vanti", dueDate: "2026-05-27", amount: 94100, kind: "pending" },
  { id: "B-709", service: "Plan Móvil", provider: "Tigo", dueDate: "2026-05-29", amount: 101000, kind: "pending" },
  { id: "B-710", service: "TV", provider: "Claro", dueDate: "2026-06-03", amount: 124000, kind: "pending" },
];

export const socialSecurityInfo: SocialSecurityInfo = {
  eps: "Sura EPS",
  pensionFund: "Porvenir",
  arl: "ARL Sura",
  compensationFund: "Compensar",
};

export const socialSecurityEvents: SocialSecurityEvent[] = [
  { id: "N-901", date: "2026-04-16", noveltyType: "Ingreso", status: "Procesada" },
  { id: "N-902", date: "2026-04-10", noveltyType: "Cambio salarial", status: "Procesada" },
  { id: "N-903", date: "2026-04-03", noveltyType: "Licencia", status: "En Revision" },
  { id: "N-904", date: "2026-03-27", noveltyType: "Retiro", status: "Reportada" },
];

export const defaultBankAccounts: BankAccount[] = [
  {
    id: "AC-001",
    alias: "Principal nómina",
    bank: "Bancolombia",
    accountType: "Ahorros",
    accountNumber: "*******1289",
    country: "Colombia",
    isPrimary: true,
    balance: 5200000,
  },
  {
    id: "AC-002",
    alias: "Operaciones ACH",
    bank: "Davivienda",
    accountType: "Corriente",
    accountNumber: "*******7701",
    country: "Colombia",
    isPrimary: false,
    balance: 1450000,
  },
  {
    id: "AC-003",
    alias: "Cuenta internacional",
    bank: "BBVA España",
    accountType: "Ahorros",
    accountNumber: "ES91***********",
    country: "España",
    isPrimary: false,
    balance: 860000,
  },
];

export const ecommerceCartItems: EcommerceCartItem[] = [
  {
    id: "RW-1001",
    name: "Chrono Active X9",
    brand: "Aureum",
    finish: "Negro carbono",
    amount: 1460000,
    quantity: 1,
  },
  {
    id: "RW-1002",
    name: "Pulse Horizon S",
    brand: "Velaro",
    finish: "Acero mate",
    amount: 980000,
    quantity: 1,
  },
  {
    id: "RW-1003",
    name: "Urban Dive 42",
    brand: "Triton",
    finish: "Azul profundo",
    amount: 720000,
    quantity: 1,
  },
];

export const immediatePaymentOptions: ImmediatePaymentOption[] = [
  {
    id: "pay-from-account",
    title: "Pagar desde cuenta",
    description: "Tus bancos preferidos con cuentas disponibles registradas en ACH.",
  },
  {
    id: "approved-extension-limit",
    title: "Cupo aprobado de extensión",
    description: "Consulta el cupo disponible para financiar tu compra.",
  },
  {
    id: "instant-loan-request",
    title: "Solicitud de préstamo instantáneo",
    description: "Solicita un crédito rápido para completar el pago.",
  },
];

export const yellowBank = {
  id: "bank-yellow-001",
  name: "Banco Amarillo Simulado",
  theme: "#facc15",
};

export const extraLimitOptions: ExtraLimitOption[] = [
  {
    id: "EL-100",
    name: "Cupo extra flexible",
    availableLimit: 1500000,
    fee: 25000,
    approvalTime: "Aprobación inmediata",
  },
  {
    id: "EL-200",
    name: "Cupo extra premium",
    availableLimit: 3000000,
    fee: 43000,
    approvalTime: "Aprobación en 2 minutos",
  },
  {
    id: "EL-300",
    name: "Cupo extra compra protegida",
    availableLimit: 4500000,
    fee: 58000,
    approvalTime: "Aprobación en 5 minutos",
  },
];

export const instantLoanProviders: InstantLoanProvider[] = [
  {
    id: "LP-001",
    name: "CrediFlash",
    maxAmount: 6000000,
    rateLabel: "Desde 1.6% MV",
    payoutTime: "Desembolso en 10 minutos",
  },
  {
    id: "LP-002",
    name: "YaPrestamo",
    maxAmount: 4800000,
    rateLabel: "Desde 1.8% MV",
    payoutTime: "Desembolso en 15 minutos",
  },
];

export const pseSafeZoneSummary: PSESafeZoneSummary = {
  activeRules: 8,
  blockedRules: 3,
  trustedEntities: 5,
  trustedMerchants: 7,
};

export const pseGeoRules: PSEGeoRule[] = [
  {
    id: "GEO-001",
    scope: "Ciudad",
    target: "Bogota",
    action: "Permitir",
    active: true,
    updatedAt: "2026-07-01 08:45",
  },
  {
    id: "GEO-002",
    scope: "Pais",
    target: "Venezuela",
    action: "Bloquear",
    active: true,
    updatedAt: "2026-06-28 14:12",
  },
  {
    id: "GEO-003",
    scope: "Zona",
    target: "Zona franca norte",
    action: "Bloquear",
    active: false,
    updatedAt: "2026-06-19 10:22",
  },
];

export const pseTrustEntries: PSETrustEntry[] = [
  {
    id: "TR-001",
    category: "Entidad",
    name: "Bancolombia",
    listType: "Whitelist",
    notes: "Entidad principal de recaudo",
    active: true,
  },
  {
    id: "TR-002",
    category: "Comercio",
    name: "Mercado Virtual Centro",
    listType: "Whitelist",
    active: true,
  },
  {
    id: "TR-003",
    category: "Comercio",
    name: "Apuestas Rapidas 24",
    listType: "Blacklist",
    notes: "Intentos de cobro atipico",
    active: true,
  },
  {
    id: "TR-004",
    category: "Entidad",
    name: "Entidad no verificada 901",
    listType: "Blacklist",
    active: false,
  },
];

export const pseOperationWindows: PSEOperationWindow[] = [
  {
    id: "TW-001",
    name: "Horario laboral",
    startHour: "06:00",
    endHour: "20:00",
    days: ["Lun", "Mar", "Mie", "Jue", "Vie"],
    blockOutsideSchedule: true,
    timezone: "America/Bogota",
    active: true,
  },
  {
    id: "TW-002",
    name: "Fin de semana controlado",
    startHour: "08:00",
    endHour: "14:00",
    days: ["Sab"],
    blockOutsideSchedule: true,
    timezone: "America/Bogota",
    active: false,
  },
];

export const pseLimitPolicy: PSELimitPolicy = {
  id: "LP-001",
  maxAmountPerTransaction: 2500000,
  maxTransactionsPerDay: 8,
  dailyAccumulatedCap: 9000000,
  weeklyAccumulatedCap: 30000000,
  active: true,
  updatedAt: "2026-07-02 09:10",
};
