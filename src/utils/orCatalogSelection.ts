import type {
  OrCatalog,
  OrPlanIntent,
  OrPlanSelection,
} from "@/apiHooks.ts/orCatalog/orCatalog.types";
import { orPlanSelectionSchema } from "@/apiHooks.ts/orCatalog/orCatalog.schema";

export function currentOrSelection(
  catalog: OrCatalog | undefined,
  intent: OrPlanIntent | null,
): OrPlanSelection | null {
  if (!catalog || !intent) return null;
  const parsed = orPlanSelectionSchema.safeParse({
    kind: "subscription",
    ...intent,
  });
  if (!parsed.success || parsed.data.catalogVersion !== catalog.catalogVersion)
    return null;
  const plan = catalog.plans.find((plan) => plan.planId === parsed.data.itemId);
  return plan && plan.version === parsed.data.itemVersion ? parsed.data : null;
}
