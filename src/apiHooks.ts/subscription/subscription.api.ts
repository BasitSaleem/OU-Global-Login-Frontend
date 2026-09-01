/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/utils/requestFunction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/useToast";
import {
  BuyAddonPayloadType,
  BuyAddonResponse,
  UpgradePlanPayload,
  UpgradePlanResponse,
  previewAddonResponse,
  ScheduleDowngradePayload,
  ScheduleDowngradeData,
  ChangeFrequencyPayload,
  CancelAddonPayload,
  CancelScheduledChangePayload,
  SubscriptionState,
} from "./subscription.types";
import { confirm3DSIfNeeded } from "@/utils/stripeClient";

//ENDPOINTS
const ENDPOINTS = {
  UPGRADE_PLAN: `/og/subscription/upgrade`,
  BUY_PLAN: `/og/subscription/buy-new`,
  CANCEL_PLAN: `/og/subscription/cancel`,
  TAX: `/og/subscription/tax`,
  TEST_AUTO_SUBSCRIPTION: `/og/subscription/test-auto-renewal`,
  PREVIEW_ADDON: `/og/subscription/addon/preview`,
  BUY_ADDON: `/og/subscription/addon/buy`,
  DOWNGRADE: `/og/subscription/downgrade`,
  SCHEDULE_UPGRADE: `/og/subscription/upgrade/schedule`,
  CANCEL_SCHEDULED_CHANGE: `/og/subscription/downgrade/cancel`,
  CHANGE_FREQUENCY: `/og/subscription/frequency`,
  CANCEL_ADDON: `/og/subscription/addon/cancel`,
  UNDO_CANCEL_ADDON: `/og/subscription/addon/cancel/undo`,
  STATE: (orgId: string) => `/og/subscription/state?orgId=${orgId}`,
};

interface TaxPayload {
  packageId: string;
  billingCycle: "MONTHLY" | "YEARLY";
  addOnPriceIds: { priceId: string; quantity: number }[];
  country: string | null;
  billing_city: string | null;
  billing_state: string | null;
  billing_postal_code: string | null;
  billing_address: string | null;
}

// 1. UPGRADE / CHANGE SUBSCRIPTION PLAN
export const useUpgradePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpgradePlanPayload) => {
      const res = await request<UpgradePlanResponse>(
        ENDPOINTS.UPGRADE_PLAN,
        "POST",
        {},
        data,
      );
      // Handle 3DS/SCA before resolving so callers only proceed once the
      // payment is actually authenticated.
      await confirm3DSIfNeeded(res.data);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate relevant queries so the UI reflects the new plan
      queryClient.invalidateQueries({
        queryKey: ["organization", variables.orgId],
      });
    },
    onError: (error: any) => {
      const message = (error as Error)?.message || "Failed to upgrade plan";
      toast.error("Upgrade failed", message);
    },
  });
};

// 1. BUY NEW SUBSCRIPTION PLAN
export const useBuyNewPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpgradePlanPayload) => {
      const res = await request<UpgradePlanResponse>(
        ENDPOINTS.BUY_PLAN,
        "POST",
        {},
        data,
      );
      // Handle 3DS/SCA before resolving so callers only proceed once the
      // payment is actually authenticated.
      await confirm3DSIfNeeded(res.data);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate relevant queries so the UI reflects the new plan
      queryClient.invalidateQueries({
        queryKey: ["organization", variables.orgId],
      });
    },
    onError: (error: any) => {
      const message = (error as Error)?.message || "Failed to buy plan";
      toast.error("Buy failed", message);
    },
  });
};

// 3. CANCEL SUBSCRIPTION PLAN
export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<UpgradePlanPayload>) => {
      const res = await request<UpgradePlanResponse>(
        ENDPOINTS.CANCEL_PLAN,
        "POST",
        {},
        data,
      );
      return res.data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate relevant queries so the UI reflects the new plan
      queryClient.invalidateQueries({
        queryKey: ["organization", variables.orgId],
      });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      //   queryClient.invalidateQueries({ queryKey: ["plans"] });

      // toast.success("Plan cancelled", "Plan cancelled successfully");
    },
    onError: (error: any) => {
      const message = (error as Error)?.message || "Failed to cancel plan";
      toast.error("Cancel failed", message);
    },
  });
};

// 3. CANCEL SUBSCRIPTION PLAN
export const useGetStripeTax = () => {
  return useMutation({
    mutationFn: async (data: TaxPayload) => {
      const res = await request<TaxResponse>(
        ENDPOINTS.TAX,
        "POST",
        {},
        data, // send full object
      );
      return res.data;
    },
    onError: (error: any) => {
      toast.error("Tax calculation failed", error.message);
    },
  });
};

export interface PreviewAddonPayload {
  orgId: string;
  addons: { addonId: string; quantity: number }[];
}

export const usePreviewAddon = () => {
  return useMutation({
    mutationFn: async (data: PreviewAddonPayload) => {
      const res = await request<previewAddonResponse>(
        ENDPOINTS.PREVIEW_ADDON,
        "POST",
        {},
        data,
      );
      return res.data;
    },
    onError: (error: any) => {
      const message = (error as Error)?.message || "Failed to preview add-on";
      toast.error("Preview failed", message);
    },
  });
};

export const useBuyNewAddons = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BuyAddonPayloadType) => {
      const res = await request<BuyAddonResponse>(
        ENDPOINTS.BUY_ADDON,
        "POST",
        {},
        data,
      );

      // Handle 3DS/SCA before resolving so the success modal only shows
      // once the payment is actually authenticated.
      await confirm3DSIfNeeded(res.data);

      return res.data;
    },

    onSuccess: (_data, variables) => {
      // ✅ Only invalidate AFTER payment success
      queryClient.invalidateQueries({
        queryKey: ["organization", variables.orgId],
      });
      queryClient.invalidateQueries({ queryKey: ["addons"] });
    },

    onError: (error: any) => {
      const message = error?.message || "Failed to buy add-on";
      toast.error("Buy failed", message);
    },
  });
};

// --- Subscription billing policy hooks ---

const invalidateBilling = (queryClient: any, orgId: string) => {
  queryClient.invalidateQueries({ queryKey: ["organization", orgId] });
  queryClient.invalidateQueries({ queryKey: ["subscriptionState", orgId] });
};

// Schedule a plan downgrade (to end of billing period). On a 409 the API
// returns the incompatible add-ons; the caller re-submits with
// confirmIncompatibleRemoval=true. We surface that via the thrown ApiError.
export const useScheduleDowngrade = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ScheduleDowngradePayload) => {
      const res = await request<{ data: ScheduleDowngradeData }>(
        ENDPOINTS.DOWNGRADE,
        "POST",
        {},
        data,
      );
      return res.data;
    },
    onSuccess: (_data, variables) => {
      invalidateBilling(queryClient, variables.orgId);
    },
    // No toast here: the component decides (409 = confirmation, not an error).
  });
};

// Schedule a plan upgrade to the next cycle (deferred; no immediate charge).
export const useScheduleUpgrade = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ScheduleDowngradePayload) => {
      const res = await request<{ data: ScheduleDowngradeData }>(
        ENDPOINTS.SCHEDULE_UPGRADE,
        "POST",
        {},
        data,
      );
      return res.data;
    },
    onSuccess: (_data, variables) => {
      invalidateBilling(queryClient, variables.orgId);
      toast.success(
        "Upgrade scheduled",
        "Your plan will upgrade at the start of the next billing cycle.",
      );
    },
    onError: (error: any) => {
      toast.error(
        "Failed to schedule upgrade",
        (error as Error)?.message || "Please try again",
      );
    },
  });
};

export const useCancelScheduledChange = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CancelScheduledChangePayload) => {
      const res = await request<{ data: any }>(
        ENDPOINTS.CANCEL_SCHEDULED_CHANGE,
        "POST",
        {},
        data,
      );
      return res.data;
    },
    onSuccess: (_data, variables) => {
      invalidateBilling(queryClient, variables.orgId);
      toast.success("Change cancelled", "Your scheduled change was cancelled.");
    },
    onError: (error: any) => {
      toast.error(
        "Failed to cancel change",
        (error as Error)?.message || "Please try again",
      );
    },
  });
};

export const useChangeBillingFrequency = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ChangeFrequencyPayload) => {
      const res = await request<{ data: any }>(
        ENDPOINTS.CHANGE_FREQUENCY,
        "POST",
        {},
        data,
      );
      return res.data;
    },
    onSuccess: (data: any, variables) => {
      invalidateBilling(queryClient, variables.orgId);
      toast.success("Billing updated", data?.message || "Frequency updated.");
    },
    onError: (error: any) => {
      toast.error(
        "Failed to change frequency",
        (error as Error)?.message || "Please try again",
      );
    },
  });
};

export const useCancelAddon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CancelAddonPayload) => {
      const res = await request<{ data: any }>(
        ENDPOINTS.CANCEL_ADDON,
        "POST",
        {},
        data,
      );
      return res.data;
    },
    onSuccess: (_data, variables) => {
      invalidateBilling(queryClient, variables.orgId);
      queryClient.invalidateQueries({ queryKey: ["addons"] });
      toast.success(
        "Add-on cancellation scheduled",
        "It will be removed at the end of your billing period.",
      );
    },
    onError: (error: any) => {
      toast.error(
        "Failed to cancel add-on",
        (error as Error)?.message || "Please try again",
      );
    },
  });
};

export const useUndoCancelAddon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CancelAddonPayload) => {
      const res = await request<{ data: any }>(
        ENDPOINTS.UNDO_CANCEL_ADDON,
        "POST",
        {},
        data,
      );
      return res.data;
    },
    onSuccess: (_data, variables) => {
      invalidateBilling(queryClient, variables.orgId);
      queryClient.invalidateQueries({ queryKey: ["addons"] });
      toast.success("Add-on kept", "It will continue next cycle.");
    },
    onError: (error: any) => {
      toast.error(
        "Failed to undo",
        (error as Error)?.message || "Please try again",
      );
    },
  });
};

export const useSubscriptionState = (orgId: string | undefined) => {
  return useQuery({
    queryKey: ["subscriptionState", orgId],
    enabled: Boolean(orgId),
    queryFn: async () => {
      const res = await request<{ data: SubscriptionState | null }>(
        ENDPOINTS.STATE(orgId as string),
        "GET",
      );
      return res.data;
    },
  });
};

interface TaxResponse {
  data: TaxData;
}

export interface TaxData {
  breakdown: {
    amount: number;
    inclusive: boolean;
    tax_rate_details: {
      country: string;
      flat_amount: string | null;
      percentage_decimal: string;
      rate_type: string;
      state: string;
      tax_type: string;
    };
    taxability_reason: string;
    taxable_amount: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
}
