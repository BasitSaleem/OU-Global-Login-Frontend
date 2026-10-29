"use client";
import { useQuery } from "@tanstack/react-query";
import { request } from "@/utils/requestFunction";
import { orCatalogSchema } from "./orCatalog.schema";

export const OR_CATALOG_QUERY_KEY = ["or-catalog-public"] as const;
export async function getOrCatalog() {
  const result = await request<unknown>(
    "/or/catalog?currency=USD&cycle=monthly",
    "GET",
  );
  return orCatalogSchema.parse(result);
}
export const useGetOrCatalog = (enabled: boolean) =>
  useQuery({
    queryKey: OR_CATALOG_QUERY_KEY,
    queryFn: getOrCatalog,
    // Callers pass false unless Owners Reach is available to this account.
    enabled,
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: true,
  });
