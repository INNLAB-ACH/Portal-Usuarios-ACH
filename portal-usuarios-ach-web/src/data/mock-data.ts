import {
  Bill,
  Loan,
  SocialSecurityEvent,
  SocialSecurityInfo,
  Transaction,
} from "@/types/portal";

export const mockUsers = [
  { id: "u1", username: "demo", password: "1234", fullName: "Camila Torres" },
  { id: "u2", username: "achuser", password: "1234", fullName: "Santiago Rojas" },
];

export const transactions: Transaction[] = [
  { id: "T-1001", date: "2026-04-20", description: "Transferencia a Davivienda", type: "Transferencia", amount: 1850000, status: "Aprobada" },
  { id: "T-1002", date: "2026-04-19", description: "Pago factura energia", type: "Pago", amount: 214500, status: "Aprobada" },
  { id: "T-1003", date: "2026-04-18", description: "Recaudo comercio virtual", type: "Recaudo", amount: 420000, status: "Aprobada" },
  { id: "T-1004", date: "2026-04-17", description: "Debito automatico internet", type: "Debito Automatico", amount: 132000, status: "Aprobada" },
  { id: "T-1005", date: "2026-04-16", description: "Transferencia interna ACH", type: "Transferencia", amount: 610000, status: "Pendiente" },
  { id: "T-1006", date: "2026-04-16", description: "Pago plan movil", type: "Pago", amount: 96000, status: "Aprobada" },
  { id: "T-1007", date: "2026-04-15", description: "Recaudo mensual", type: "Recaudo", amount: 760000, status: "Aprobada" },
  { id: "T-1008", date: "2026-04-14", description: "Transferencia banco aliado", type: "Transferencia", amount: 980000, status: "Aprobada" },
  { id: "T-1009", date: "2026-04-13", description: "Pago factura gas", type: "Pago", amount: 88000, status: "Aprobada" },
  { id: "T-1010", date: "2026-04-12", description: "Debito automatico streaming", type: "Debito Automatico", amount: 55900, status: "Aprobada" },
  { id: "T-1011", date: "2026-04-11", description: "Transferencia comercio", type: "Transferencia", amount: 1340000, status: "Aprobada" },
  { id: "T-1012", date: "2026-04-10", description: "Pago factura agua", type: "Pago", amount: 143200, status: "Aprobada" },
];

export const loans: Loan[] = [
  { id: "L-301", store: "Alkosto", approvedQuota: 9000000, usedQuota: 3200000, installmentValue: 540000, status: "Activo" },
  { id: "L-302", store: "Homecenter", approvedQuota: 6500000, usedQuota: 1500000, installmentValue: 310000, status: "Activo" },
  { id: "L-303", store: "Exito", approvedQuota: 4000000, usedQuota: 0, installmentValue: 0, status: "En Estudio" },
  { id: "L-304", store: "Falabella", approvedQuota: 5500000, usedQuota: 2500000, installmentValue: 450000, status: "Activo" },
  { id: "L-305", store: "Ktronix", approvedQuota: 3000000, usedQuota: 3000000, installmentValue: 0, status: "Cerrado" },
];

export const bills: Bill[] = [
  { id: "B-701", service: "Energia", provider: "Enel", dueDate: "2026-04-10", amount: 214500, kind: "requested" },
  { id: "B-702", service: "Agua", provider: "Acueducto", dueDate: "2026-04-12", amount: 143200, kind: "requested" },
  { id: "B-703", service: "Gas", provider: "Vanti", dueDate: "2026-04-18", amount: 88000, kind: "requested" },
  { id: "B-704", service: "Plan Movil", provider: "Movistar", dueDate: "2026-04-29", amount: 96000, kind: "requested" },
  { id: "B-705", service: "Internet", provider: "Claro", dueDate: "2026-05-01", amount: 132000, kind: "requested" },
  { id: "B-706", service: "Energia", provider: "Enel", dueDate: "2026-05-25", amount: 206100, kind: "pending" },
  { id: "B-707", service: "Agua", provider: "Acueducto", dueDate: "2026-05-26", amount: 135900, kind: "pending" },
  { id: "B-708", service: "Gas", provider: "Vanti", dueDate: "2026-05-27", amount: 94100, kind: "pending" },
  { id: "B-709", service: "Plan Movil", provider: "Tigo", dueDate: "2026-05-29", amount: 101000, kind: "pending" },
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
