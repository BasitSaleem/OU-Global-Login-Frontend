import {
  InvoiceBreakdown,
  NormalizedLineItem,
} from "@/apiHooks.ts/invoice/invoice.types";

/**
 * Maps the authoritative backend breakdown (Stripe line items) into the rows +
 * summary the invoice UIs render. Returns null when there are no authoritative
 * line items, so callers fall back to the legacy client-side calculation.
 */
export interface InvoiceDisplayRow {
  name: string;
  type: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  proration: boolean;
}

export interface InvoiceDisplaySummary {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
}

export interface AuthoritativeInvoiceDisplay {
  rows: InvoiceDisplayRow[];
  summary: InvoiceDisplaySummary;
}

export const breakdownToDisplay = (
  breakdown?: InvoiceBreakdown | null,
): AuthoritativeInvoiceDisplay | null => {
  if (!breakdown?.lineItems || breakdown.lineItems.length === 0) return null;

  const rows: InvoiceDisplayRow[] = breakdown.lineItems.map(
    (li: NormalizedLineItem) => ({
      name: li.name || li.description || li.type,
      type: li.type,
      quantity: li.quantity ?? 1,
      unitPrice: li.unit_amount ?? 0,
      amount: li.amount ?? 0,
      proration: li.proration,
    }),
  );

  const subtotal =
    breakdown.subtotal ?? rows.reduce((s, r) => s + r.amount, 0);
  const tax = breakdown.tax ?? 0;
  const total = breakdown.total ?? subtotal + tax;
  const discount = Math.max(0, Number((subtotal + tax - total).toFixed(2)));

  return {
    rows,
    summary: {
      subtotal,
      discount,
      tax,
      total,
      currency: breakdown.currency || "USD",
    },
  };
};
