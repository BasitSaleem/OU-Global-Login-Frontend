import type { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/utils/requestFunction";
import { OR_ONBOARDING_ENABLED } from "@/config/or.config";
import { getOrCatalog, OR_CATALOG_QUERY_KEY } from "../orCatalog/orCatalog.api";
import { orPlanSelectionSchema } from "../orCatalog/orCatalog.schema";
import { currentOrSelection } from "@/utils/orCatalogSelection";
import type { CreateOrganizationData } from "./organization.types";

// Revalidate before either creation request. Server authorization and pricing remain mandatory.
export async function prepareOrOrganizationSelection(
  data: CreateOrganizationData,
  client: QueryClient,
): Promise<CreateOrganizationData> {
  const { orSelection, ...base } = data;
  if (!data.product?.includes("OR")) return base;
  // Product access is checked by the server (PRODUCT_NOT_AVAILABLE).
  if (!OR_ONBOARDING_ENABLED) {
    throw new Error("Owners Reach activation is not available yet.");
  }
  const parsed = orPlanSelectionSchema.safeParse(orSelection);
  const catalog = await client.fetchQuery({
    queryKey: OR_CATALOG_QUERY_KEY,
    queryFn: getOrCatalog,
    staleTime: 0,
  });
  const current = parsed.success
    ? currentOrSelection(catalog, parsed.data)
    : null;
  if (!current)
    throw new ApiError(
      "Owners Reach plans have changed. Review the current plans and select one again.",
      409,
      {
        success: false,
        errors: [],
        code: "STALE_CATALOG",
        message: "Refresh Owners Reach plans and confirm your selection.",
      },
    );
  return { ...base, orSelection: current };
}
