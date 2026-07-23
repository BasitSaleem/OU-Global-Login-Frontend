/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/utils/requestFunction";
import { useQuery } from "@tanstack/react-query";

export type OpTier = "STARTER" | "GROWTH" | "DOMINATION";

export interface OpPackage {
  id: string;
  tier: OpTier;
  name: string;
  monthly_price: string;
  yearly_price: string | null;
  currency: string;
  trial_days: number;
  level: number;
  is_active: boolean;
}

const ENDPOINTS = {
  OP_PACKAGES: `/op/packages`,
};

// Public read of the Owners Pulse tiers for the org-creation tier picker.
// Backend response: { data: { totalDocuments, data: OpPackage[] } }.
export const useGetOpPackages = () => {
  return useQuery({
    queryKey: ["op-packages-public"],
    queryFn: async () => {
      const res = await request<any>(ENDPOINTS.OP_PACKAGES, "GET");
      return res.data; // { totalDocuments, data: [] }
    },
    select: (data: any): OpPackage[] =>
      ((data?.data ?? []) as OpPackage[])
        .filter((p) => p.is_active)
        .sort((a, b) => (a.level ?? 0) - (b.level ?? 0)),
    staleTime: 3 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
