/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/utils/requestFunction";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { GetOrganizationInvoicesResponse } from "./invoice.types";
import { toast } from "@/hooks/useToast";

//ENDPOINTS
const ENDPOINTS = {
  GET_ORG_INVOICE: `/og/invoice/get-organization-invoices`,
  RETRY_INVOICE_PAYMENT: `/og/invoice/retry-payment`,
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

export const retryInvoicePayment = async (invoiceId: string) => {
  const res = await request<any>(
    `${ENDPOINTS.RETRY_INVOICE_PAYMENT}/${invoiceId}`,
    "POST",
  );
  return res.data;
};

export const useRetryInvoicePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: retryInvoicePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["org-invoices"] });
    },
    onError: (error: any) => {
      console.log("Error while retrying payment", error);
      toast.error(
        "Payment retry failed.",
        error?.response?.data?.message || error?.message,
      );
    },
  });
};
