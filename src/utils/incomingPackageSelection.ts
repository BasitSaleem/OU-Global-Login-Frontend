import type { OrPlanIntent } from "@/apiHooks.ts/orCatalog/orCatalog.types";

export const INCOMING_PACKAGE_KEYS = [
  "pkgId",
  "product",
  "billingCycle",
  "op_pkgId",
  "op_billingCycle",
  "or_pkgId",
  "or_catalogVersion",
  "or_itemVersion",
] as const;
export const DEFAULT_OI_PLAN_ID = "d755fe7d-4372-426c-af33-e63b71a6521f";
export type StoredPackageSelection = Partial<
  Record<(typeof INCOMING_PACKAGE_KEYS)[number], string>
>;

export function readStoredPackageSelection(): StoredPackageSelection {
  try {
    return Object.fromEntries(
      INCOMING_PACKAGE_KEYS.map((key) => [
        key,
        localStorage.getItem(key) || "",
      ]),
    );
  } catch {
    return {};
  }
}
export function clearStoredPackageSelection() {
  try {
    INCOMING_PACKAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch {}
}
export function persistPackageQuery(query: URLSearchParams) {
  if (!INCOMING_PACKAGE_KEYS.some((key) => query.has(key))) return;
  // A fresh link is one intent; do not combine it with another product's old selection.
  clearStoredPackageSelection();
  try {
    for (const key of INCOMING_PACKAGE_KEYS) {
      const value = query.get(key);
      if (value) localStorage.setItem(key, value);
    }
  } catch {}
}
const version = (value: string | null | undefined) =>
  value && /^[1-9]\d*$/.test(value) && Number.isSafeInteger(Number(value))
    ? Number(value)
    : null;

export function resolveIncomingPackageSelection(
  query: URLSearchParams,
  stored: StoredPackageSelection,
) {
  const fromQuery = INCOMING_PACKAGE_KEYS.some((key) => query.has(key));
  const get = (key: (typeof INCOMING_PACKAGE_KEYS)[number]) =>
    fromQuery ? query.get(key) : stored[key] || null;
  // False when nothing asked for a product and OI below is only the default.
  const productRequested = !!(
    get("product") ||
    get("pkgId") ||
    get("op_pkgId") ||
    get("or_pkgId")
  );
  const rawProduct =
    get("product") || (get("or_pkgId") ? "OR" : get("op_pkgId") ? "OP" : "OI");
  const product = ["OI", "OP", "OR"].includes(rawProduct) ? rawProduct : "";
  const pkgId = product === "OI" ? get("pkgId") || DEFAULT_OI_PLAN_ID : null;
  const opPkgId = product === "OP" ? get("op_pkgId") : null;
  const orPkgId = product === "OR" ? get("or_pkgId") || get("pkgId") : null;
  const orIntent: OrPlanIntent | null = orPkgId
    ? {
        itemId: orPkgId,
        catalogVersion: version(get("or_catalogVersion")),
        itemVersion: version(get("or_itemVersion")),
      }
    : null;
  const billingCycle: "monthly" | "yearly" =
    product !== "OR" && get("billingCycle") === "yearly" ? "yearly" : "monthly";
  const opBillingCycle: "monthly" | "yearly" =
    get("op_billingCycle") === "yearly" ? "yearly" : "monthly";
  const hasDirectLink = !!(product === "OI"
    ? get("pkgId")
    : product === "OP"
      ? opPkgId
      : orPkgId);
  return {
    pkgId,
    product,
    productRequested,
    billingCycle,
    opPkgId,
    opBillingCycle,
    orIntent,
    queryPkgId: query.get("pkgId"),
    queryOpPkgId: query.get("op_pkgId"),
    queryOrPkgId: query.get("or_pkgId"),
    hasDirectLink,
  };
}
