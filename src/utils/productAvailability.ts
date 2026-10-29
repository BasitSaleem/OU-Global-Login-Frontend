import { PRODUCTS } from "@/constants";
import type { OgRemovedProduct } from "@/apiHooks.ts/organization/organization.types";

type IsAvailable = (code: string) => boolean;

// Create Organization cards: coming-soon products stay as locked cards, launched
// ones show only when this account may pick them. A product that is already
// selected (for example from a package link) stays visible so it can be removed.
export const creatableProducts = (
  isAvailable: IsAvailable,
  selected: string[] = [],
) =>
  PRODUCTS.filter(
    (p) => p.isDisabled || isAvailable(p.name) || selected.includes(p.name),
  );

// Products this account can add to an organization now. Restoring a removed
// Owners Reach is not a new purchase, so it does not need product access.
export const addableProducts = (
  isAvailable: IsAvailable,
  existing: string[],
  removedProducts: OgRemovedProduct[] = [],
) => {
  const removedOr = removedProducts.find((p) => p.product_name === "OR");
  return PRODUCTS.filter((p) => {
    if (p.isDisabled || existing.includes(p.name)) return false;
    if (p.name === "OR" && removedOr) return removedOr.canRestore;
    return isAvailable(p.name);
  }).map((p) => p.name);
};
