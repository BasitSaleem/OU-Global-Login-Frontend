// Currency helpers shared by Stripe (USD) and local gateways (PayFast, PKR).

export interface CatalogPrice {
  id: string;
  provider: string;
  currency: string;
  billing_cycle: "MONTHLY" | "YEARLY";
  amount_minor: number;
  compare_at_minor: number | null;
  is_active: boolean;
}

/** "$ " for USD (unchanged look), "PKR " etc. for other currencies. */
export const currencyPrefix = (currency?: string | null): string =>
  !currency || currency.toUpperCase() === "USD" ? "$ " : `${currency.toUpperCase()} `;

export const formatMajor = (amount: number | string | null | undefined, currency?: string | null): string => {
  const n = Number(amount ?? 0);
  return `${currencyPrefix(currency)}${n.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatMinor = (minor: number | null | undefined, currency?: string | null): string =>
  formatMajor((minor ?? 0) / 100, currency);

/** Active catalog price (minor units) for a gateway + currency + cycle, or null. */
export function catalogPriceMinor(
  prices: CatalogPrice[] | undefined,
  provider: string,
  currency: string,
  cycle: "MONTHLY" | "YEARLY",
): number | null {
  const price = prices?.find(
    (p) => p.is_active && p.provider === provider && p.currency === currency && p.billing_cycle === cycle,
  );
  return price ? price.amount_minor : null;
}
