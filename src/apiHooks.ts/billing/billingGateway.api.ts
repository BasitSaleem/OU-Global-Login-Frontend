/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "@/utils/requestFunction";
import { toast } from "@/hooks/useToast";
import {
  BillingOptions,
  CheckoutStatus,
  PlatformQuote,
  SelectionPayload,
  StartCheckoutPayload,
  StartCheckoutResult,
} from "./billingGateway.types";

const ENDPOINTS = {
  OPTIONS: (orgId: string, country?: string | null) =>
    `/og/billing/${orgId}/options${country ? `?country=${encodeURIComponent(country)}` : ""}`,
  QUOTE: (orgId: string) => `/og/billing/${orgId}/quote`,
  CHECKOUT: (orgId: string) => `/og/billing/${orgId}/checkout`,
  RENEWAL: (orgId: string) => `/og/billing/${orgId}/renewal/checkout`,
  STATUS: (checkoutId: string) => `/og/billing/checkouts/${checkoutId}`,
  CANCEL: (orgId: string) => `/og/billing/${orgId}/cancel`,
  RESUME: (orgId: string) => `/og/billing/${orgId}/resume`,
};

/** Which gateway this org pays with for the given billing country. */
export const useBillingOptions = (orgId?: string, country?: string | null) =>
  useQuery({
    queryKey: ["billing-options", orgId, country ?? null],
    queryFn: async () => {
      const res = await request<{ data: BillingOptions }>(ENDPOINTS.OPTIONS(orgId!, country), "GET");
      return res.data;
    },
    enabled: !!orgId,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

/** Server-priced quote for platform gateways (PayFast). */
export const useBillingQuote = (orgId: string, payload: SelectionPayload | null, enabled: boolean) =>
  useQuery({
    queryKey: ["billing-quote", orgId, payload],
    queryFn: async () => {
      const res = await request<{ data: PlatformQuote }>(ENDPOINTS.QUOTE(orgId), "POST", {}, payload);
      return res.data;
    },
    enabled: enabled && !!payload,
    retry: false,
    refetchOnWindowFocus: false,
  });

export const useStartCheckout = (orgId: string) =>
  useMutation({
    mutationFn: async (payload: StartCheckoutPayload) => {
      const res = await request<{ data: StartCheckoutResult }>(ENDPOINTS.CHECKOUT(orgId), "POST", {}, payload);
      return res.data;
    },
    onError: (error: any) => toast.error("Payment could not start", error?.message || "Please try again"),
  });

export const useStartRenewal = (orgId: string) =>
  useMutation({
    mutationFn: async (payload: { phone?: string | null }) => {
      const res = await request<{ data: StartCheckoutResult }>(ENDPOINTS.RENEWAL(orgId), "POST", {}, payload);
      return res.data;
    },
    onError: (error: any) => toast.error("Payment could not start", error?.message || "Please try again"),
  });

/** Polls a platform checkout until it reaches a final state. */
export const useCheckoutStatus = (checkoutId?: string | null) =>
  useQuery({
    queryKey: ["checkout-status", checkoutId],
    queryFn: async () => {
      const res = await request<{ data: CheckoutStatus }>(ENDPOINTS.STATUS(checkoutId!), "GET");
      return res.data;
    },
    enabled: !!checkoutId,
    refetchInterval: (query) => (query.state.data?.status === "PENDING" ? 3000 : false),
    refetchOnWindowFocus: false,
  });

export const useCancelPlatformSubscription = (orgId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reason?: string) =>
      request(ENDPOINTS.CANCEL(orgId), "POST", {}, { reason: reason ?? null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization", orgId] });
      queryClient.invalidateQueries({ queryKey: ["billing-options", orgId] });
      toast.success("Cancellation scheduled", "Your plan stays active until the end of the paid period.");
    },
    onError: (error: any) => toast.error("Could not cancel", error?.message || "Please try again"),
  });
};

export const useResumePlatformSubscription = (orgId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => request(ENDPOINTS.RESUME(orgId), "POST", {}, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization", orgId] });
      queryClient.invalidateQueries({ queryKey: ["billing-options", orgId] });
      toast.success("Plan resumed", "Your plan will continue.");
    },
    onError: (error: any) => toast.error("Could not resume", error?.message || "Please try again"),
  });
};
