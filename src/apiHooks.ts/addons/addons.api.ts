/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/utils/requestFunction";
import { useQuery } from "@tanstack/react-query";

import { OgAddOnsResponse } from "./addons.types";

//ENDPOINTS
const ENDPOINTS = {
  ADDONS: `/packages/addons/all`,
  ADDON_DETAILS: `/add-ons`,
  ADDONS_BY_PACKAGE: `/packages/addons/package`,
};

// 1. GET ALL PLANS
export const useGetAllAddons = (page: number = 1, limit: number = 15) => {
  return useQuery({
    queryKey: ["addons", page, limit],
    queryFn: async () => {
      const url = `${ENDPOINTS.ADDONS}`;
      const res = await request<OgAddOnsResponse>(url, "GET");
      return res.data;
    },
    select: (data) => {
      return {
        addons: data.data,
      };
    },
    staleTime: 3 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// 1. GET ALL PLANS
export const useGetPackageAddOns = (packageId: string) => {
  return useQuery({
    queryKey: ["addons", packageId],
    queryFn: async () => {
      const url = `${ENDPOINTS.ADDONS_BY_PACKAGE}/${packageId}`;
      const res = await request<OgAddOnsResponse>(url, "GET");
      return res.data;
    },
    select: (data) => {
      return {
        addons: data.data,
      };
    },
    staleTime: 3 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
