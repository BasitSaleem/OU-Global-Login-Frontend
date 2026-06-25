/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/utils/requestFunction";
import { useQuery } from "@tanstack/react-query";
import { GetOgBillingInfoResponse } from "./billing.types";

//ENDPOINTS
const ENDPOINTS = {
  BILLING_INFO: `/og/billing-info`,
};

export const useGetBillingInfo = () => {
  return useQuery({
    queryKey: ["billing-info"],
    queryFn: async () => {
      const res = await request<GetOgBillingInfoResponse>(
        ENDPOINTS.BILLING_INFO,
        "GET",
      );
      return res.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};
