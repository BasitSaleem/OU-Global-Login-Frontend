/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/utils/requestFunction";
import { useQuery } from "@tanstack/react-query";

import { OgPlansResponse } from "./plans.types";

//ENDPOINTS
const ENDPOINTS = {
  PLANS: `/packages/get-all-packages-with-out-pagination`,
  PLAN_DETAILS: `/packages`,
};

// 1. GET ALL PLANS
export const useGetAllPlans = (page: number = 1, limit: number = 15) => {
  return useQuery({
    queryKey: ["plans", page, limit],
    queryFn: async () => {
      const url = `${ENDPOINTS.PLANS}`;
      const res = await request<OgPlansResponse>(url, "GET");
      return res.data;
    },
    select: (data) => ({
      plans: data.data,
    }),
    staleTime: 3 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// 1. GET PLAN DETAILS
export const useGetPlanDetails = (pkgId: string) => {
  return useQuery({
    queryKey: ["plans", pkgId],
    queryFn: async () => {
      const url = `${ENDPOINTS.PLAN_DETAILS}/${pkgId}`;
      const res = await request<OgPlansResponse>(url, "GET");
      return res.data;
    },
    select: (data) => ({
      plans: data.data,
    }),
    staleTime: 3 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
