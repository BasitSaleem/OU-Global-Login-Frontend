/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/utils/requestFunction";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  GetOrganizationInvoicesResponse,
  GetUpcomingInvoiceResponse,
  InvoiceBreakdown,
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
  GET_INVOICE_BREAKDOWN: `/og/invoice/breakdown`,
};

// Authoritative invoice breakdown (Stripe line items). Used by the detail modal
// and PDF; falls back to the legacy client calc when lineItems is null.
export const fetchInvoiceBreakdown = async (
  invoiceId: string,
): Promise<InvoiceBreakdown> => {
  const res = await request<{ data: InvoiceBreakdown }>(
    `${ENDPOINTS.GET_INVOICE_BREAKDOWN}/${invoiceId}`,
    "GET",
  );
  return res.data;
};

export const useInvoiceBreakdown = (
  invoiceId: string | undefined,
  enabled: boolean,
) => {
  return useQuery({
    queryKey: ["invoice-breakdown", invoiceId],
    queryFn: () => fetchInvoiceBreakdown(invoiceId as string),
    enabled: !!invoiceId && enabled,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
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
