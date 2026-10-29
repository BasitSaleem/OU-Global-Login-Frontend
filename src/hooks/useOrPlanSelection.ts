"use client";
import { useState } from "react";
import { useGetOrCatalog } from "@/apiHooks.ts/orCatalog/orCatalog.api";
import { useProductAvailability } from "@/apiHooks.ts/productAccess/productAccess.api";
import type {
  OrPlanIntent,
  OrPlan,
} from "@/apiHooks.ts/orCatalog/orCatalog.types";
import { currentOrSelection } from "@/utils/orCatalogSelection";
import { OR_ONBOARDING_ENABLED } from "@/config/or.config";

export function useOrPlanSelection(
  active: boolean,
  initial: OrPlanIntent | null = null,
) {
  const [intent, setIntent] = useState<OrPlanIntent | null>(initial);
  const access = useProductAvailability();
  const orAvailable = access.isAvailable("OR");
  const query = useGetOrCatalog(active && orAvailable);
  const selection = !query.isError
    ? currentOrSelection(query.data, intent)
    : null;
  const canSubmit =
    orAvailable &&
    OR_ONBOARDING_ENABLED &&
    !!selection &&
    !query.isFetching &&
    !query.isError;
  return {
    ...query,
    intent,
    selection,
    canSubmit,
    selectionEnabled: orAvailable,
    accessPending: access.isPending,
    accessError: access.isError,
    onboardingEnabled: OR_ONBOARDING_ENABLED,
    stale: !!intent && !!query.data && !selection && !query.isError,
    select: (plan: OrPlan) => {
      if (query.data && !query.isError && !query.isFetching)
        setIntent({
          itemId: plan.planId,
          itemVersion: plan.version,
          catalogVersion: query.data.catalogVersion,
        });
    },
    reset: () => setIntent(initial),
  };
}
export type OrPlanSelectionState = ReturnType<typeof useOrPlanSelection>;
