/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/utils/requestFunction";
import { useQuery } from "@tanstack/react-query";

import { GetOrganizationInvoicesResponse } from "./invoice.types";

//ENDPOINTS
const ENDPOINTS = {
  GET_ORG_INVOICE: `/og/invoice/get-organization-invoices`,
};

export const useGetOrgInvoices = (id: string | undefined) => {
  return useQuery({
    queryKey: ["org-invoices", id],
    queryFn: async () => {
      const res = await request<GetOrganizationInvoicesResponse>(
        `${ENDPOINTS.GET_ORG_INVOICE}/${id}`,
        "GET",
      );
      return res.data;
    },
    enabled: !!id,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
