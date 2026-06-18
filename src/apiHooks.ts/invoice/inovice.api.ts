/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/utils/requestFunction";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  GetOrganizationInvoicesResponse,
  GetUpcomingInvoiceResponse,
} from "./invoice.types";
import { toast } from "@/hooks/useToast";
import { confirm3DSIfNeeded } from "@/utils/stripeClient";

export interface RetryInvoiceResult {
  requiresAction?: boolean;
  clientSecret?: string | null;
  paymentStatus?: string | null;
  success?: boolean;
  status?: string;
}

//ENDPOINTS
const ENDPOINTS = {
  GET_ORG_INVOICE: `/og/invoice/get-organization-invoices`,
  RETRY_INVOICE_PAYMENT: `/og/invoice/retry-payment`,
  GET_UPCOMING_INVOICE: `/og/invoice/upcoming`,
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

export const retryInvoicePayment = async (
  invoiceId: string,
): Promise<RetryInvoiceResult> => {
  const res = await request<{ data: RetryInvoiceResult }>(
    `${ENDPOINTS.RETRY_INVOICE_PAYMENT}/${invoiceId}`,
    "POST",
  );
  // Complete the 3DS/SCA challenge if the backend reports one is required.
  // Throws on auth failure so callers treat it as a failed payment.
  await confirm3DSIfNeeded(res.data);
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

export const useGetUpcomingInvoice = (
  id: string | undefined,
  status: string | undefined,
) => {
  console.log("Id is here ", id, status);
  return useQuery({
    queryKey: ["upcoming-invoice", id, status],
    queryFn: async () => {
      const res = await request<GetUpcomingInvoiceResponse>(
        `${ENDPOINTS.GET_UPCOMING_INVOICE}/${id}`,
        "GET",
      );
      return res.data;
    },
    enabled: !!id && status === "ACTIVE",
    retry: false,
    refetchOnWindowFocus: true,
  });
};
