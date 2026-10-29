import type { Subscription } from "@/apiHooks.ts/organization/organization.types";

// Organization details list every product's subscriptions, newest first. The
// Owners Inventory screens read `subscriptions[0]`, so they must never see an
// Owners Reach row (which has its own billing tab).
export function withOiSubscriptions<T extends { subscriptions?: Subscription[] }>(
  organization: T,
): T;
export function withOiSubscriptions<T extends { subscriptions?: Subscription[] }>(
  organization: T | undefined,
): T | undefined;
export function withOiSubscriptions<T extends { subscriptions?: Subscription[] }>(
  organization: T | undefined,
) {
  if (!organization?.subscriptions) return organization;
  return {
    ...organization,
    subscriptions: organization.subscriptions.filter((s) => s.product !== "OR"),
  };
}
