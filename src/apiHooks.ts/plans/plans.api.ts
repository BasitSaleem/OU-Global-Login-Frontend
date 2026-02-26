/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/utils/requestFunction";
import { useQuery } from "@tanstack/react-query";

import { OgPlansResponse } from "./plans.types";

//ENDPOINTS
const ENDPOINTS = {
  PLANS: `/packages/get-all-packages-with-out-pagination`,
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
  });
};
