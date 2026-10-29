"use client";
import { useQuery } from "@tanstack/react-query";
import { request } from "@/utils/requestFunction";
import type { ProductAvailabilityResponse } from "./productAccess.types";

const ENDPOINTS = {
  AVAILABILITY: "/og/products/availability",
};

export const PRODUCT_AVAILABILITY_QUERY_KEY = ["product-availability"] as const;

export async function getProductAvailability() {
  const res = await request<ProductAvailabilityResponse>(
    ENDPOINTS.AVAILABILITY,
    "GET",
  );
  return res.data.products;
}

// Which products this account may pick when creating an organization or adding
// a product. Staff manage it in Super Admin; the backend enforces the same rule.
export const useProductAvailability = () => {
  const query = useQuery({
    queryKey: PRODUCT_AVAILABILITY_QUERY_KEY,
    queryFn: getProductAvailability,
    staleTime: 60_000,
    refetchOnWindowFocus: true,
    retry: 1,
  });
  const available = new Set<string>(
    (query.data ?? []).filter((p) => p.available).map((p) => p.product),
  );
  return {
    ...query,
    isAvailable: (code: string) => available.has(code),
  };
};
export type ProductAvailabilityState = ReturnType<typeof useProductAvailability>;
