import { EcommerceFlowContext } from "@/types/portal";

export const ACCOUNTS_STORAGE_KEY = "ach-accounts-list";
export const ECOMMERCE_FLOW_STORAGE_KEY = "ach-ecommerce-flow";

export function readEcommerceFlowContext() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = sessionStorage.getItem(ECOMMERCE_FLOW_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as EcommerceFlowContext;
  } catch {
    return null;
  }
}

export function writeEcommerceFlowContext(context: EcommerceFlowContext) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(ECOMMERCE_FLOW_STORAGE_KEY, JSON.stringify(context));
}

export function clearEcommerceFlowContext() {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(ECOMMERCE_FLOW_STORAGE_KEY);
}
