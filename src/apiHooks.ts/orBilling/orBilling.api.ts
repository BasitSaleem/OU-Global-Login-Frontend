"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "@/utils/requestFunction";
import { confirm3DSIfNeeded } from "@/utils/stripeClient";
import { toast } from "@/hooks/useToast";
import {
  OrBillingQuote,
  OrBillingQuotePayload,
  OrBillingState,
  OrCheckoutPayload,
  OrCreditsPayload,
  OrDowngradePreview,
  OrPaymentResult,
} from "./orBilling.types";

const ENDPOINTS = {
  state: (orgId: string) => `/og/or-billing/${orgId}`,
  quote: (orgId: string) => `/og/or-billing/${orgId}/quote`,
  checkout: (orgId: string) => `/og/or-billing/${orgId}/checkout`,
  credits: (orgId: string) => `/og/or-billing/${orgId}/credits`,
  cancel: (orgId: string) => `/og/or-billing/${orgId}/cancel`,
  resume: (orgId: string) => `/og/or-billing/${orgId}/resume`,
  downgradePreview: (orgId: string, planId: string) =>
    `/og/or-billing/${orgId}/downgrade/preview?planId=${encodeURIComponent(planId)}`,
  downgrade: (orgId: string) => `/og/or-billing/${orgId}/downgrade`,
  undoDowngrade: (orgId: string) => `/og/or-billing/${orgId}/downgrade/undo`,
};

export const orBillingQueryKey = (orgId: string) => ["or-billing", orgId] as const;

export const useOrBillingState = (orgId: string | undefined, enabled = true) =>
  useQuery({
    queryKey: orBillingQueryKey(orgId ?? ""),
    queryFn: () => request<OrBillingState>(ENDPOINTS.state(orgId!), "GET"),
    enabled: !!orgId && enabled,
    retry: false,
    refetchOnWindowFocus: true,
  });

export const useOrBillingQuote = (orgId: string) =>
  useMutation({
    mutationFn: (payload: OrBillingQuotePayload) =>
      request<OrBillingQuote>(ENDPOINTS.quote(orgId), "POST", {}, payload),
  });

function useRefreshOrBilling(orgId: string) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: orBillingQueryKey(orgId) });
    queryClient.invalidateQueries({ queryKey: ["org-invoices", orgId] });
    queryClient.invalidateQueries({ queryKey: ["organization", orgId] });
    queryClient.invalidateQueries({ queryKey: ["organizations"] });
  };
}

// The charge may need 3D Secure; resolve only once the payment is authenticated.
export const useOrCheckout = (orgId: string) => {
  const refresh = useRefreshOrBilling(orgId);
  return useMutation({
    mutationFn: async (payload: OrCheckoutPayload) => {
      const res = await request<OrPaymentResult & { subscriptionId: string }>(
        ENDPOINTS.checkout(orgId),
        "POST",
        {},
        payload,
      );
      await confirm3DSIfNeeded(res);
      return res;
    },
    onSuccess: refresh,
    onError: (error: Error) => toast.error("Payment failed", error.message),
  });
};

export const useOrBuyCredits = (orgId: string) => {
  const refresh = useRefreshOrBilling(orgId);
  return useMutation({
    mutationFn: async (payload: OrCreditsPayload) => {
      const res = await request<OrPaymentResult & { invoiceId: string }>(
        ENDPOINTS.credits(orgId),
        "POST",
        {},
        payload,
      );
      await confirm3DSIfNeeded(res);
      return res;
    },
    onSuccess: refresh,
    onError: (error: Error) => toast.error("Payment failed", error.message),
  });
};

export const useOrCancelPlan = (orgId: string) => {
  const refresh = useRefreshOrBilling(orgId);
  return useMutation({
    mutationFn: (reason: string) =>
      request<{ effectiveDate: string | null }>(ENDPOINTS.cancel(orgId), "POST", {}, { reason }),
    onSuccess: () => {
      refresh();
      toast.success("Cancellation scheduled", "Your plan stays active until the end of the billing period.");
    },
    onError: (error: Error) => toast.error("Cancellation failed", error.message),
  });
};

export const useOrResumePlan = (orgId: string) => {
  const refresh = useRefreshOrBilling(orgId);
  return useMutation({
    mutationFn: () => request(ENDPOINTS.resume(orgId), "POST", {}, {}),
    onSuccess: () => {
      refresh();
      toast.success("Plan resumed", "Your Owners Reach plan will renew as usual.");
    },
    onError: (error: Error) => toast.error("Could not resume", error.message),
  });
};

// Terms of a smaller plan against the current one, for the confirmation step.
export const useOrDowngradePreview = (orgId: string, planId: string | null) =>
  useQuery({
    queryKey: [...orBillingQueryKey(orgId), "downgrade", planId],
    queryFn: () => request<OrDowngradePreview>(ENDPOINTS.downgradePreview(orgId, planId!), "GET"),
    enabled: !!planId,
    retry: false,
  });

export const useOrDowngrade = (orgId: string) => {
  const refresh = useRefreshOrBilling(orgId);
  return useMutation({
    mutationFn: (planId: string) =>
      request<{ planId: string; effectiveDate: string }>(ENDPOINTS.downgrade(orgId), "POST", {}, { planId }),
    onSuccess: () => {
      refresh();
      toast.success("Plan change scheduled", "You keep your current plan until the end of the billing period.");
    },
    onError: (error: Error) => toast.error("Could not change plan", error.message),
  });
};

export const useOrUndoDowngrade = (orgId: string) => {
  const refresh = useRefreshOrBilling(orgId);
  return useMutation({
    mutationFn: () => request(ENDPOINTS.undoDowngrade(orgId), "POST", {}, {}),
    onSuccess: () => {
      refresh();
      toast.success("Plan change cancelled", "Your current Owners Reach plan will renew as usual.");
    },
    onError: (error: Error) => toast.error("Could not keep your plan", error.message),
  });
};
