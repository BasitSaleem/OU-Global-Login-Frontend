/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/utils/requestFunction";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/useToast";
import { UpgradePlanPayload, UpgradePlanResponse } from "./subscription.types";

//ENDPOINTS
const ENDPOINTS = {
  UPGRADE_PLAN: `/og/subscription/upgrade`,
  BUY_PLAN: `/og/subscription/buy-new`,
  CANCEL_PLAN: `/og/subscription/cancel`,
  TAX: `/og/subscription/tax`,
  TEST_AUTO_SUBSCRIPTION: `/og/subscription/test-auto-renewal`,
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
      return res.data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate relevant queries so the UI reflects the new plan
      queryClient.invalidateQueries({
        queryKey: ["organization", variables.orgId],
      });
      //   queryClient.invalidateQueries({ queryKey: ["organizations"] });
      //   queryClient.invalidateQueries({ queryKey: ["plans"] });

      // toast.success(
      //   "Plan upgraded",
      //   "Your subscription has been updated successfully.",
      // );
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
      return res.data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate relevant queries so the UI reflects the new plan
      queryClient.invalidateQueries({
        queryKey: ["organization", variables.orgId],
      });
      //   queryClient.invalidateQueries({ queryKey: ["organizations"] });
      //   queryClient.invalidateQueries({ queryKey: ["plans"] });

      // toast.success("Plan bought", "Plan bought successfully");
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
      rate_type: "percentage";
      state: string;
      tax_type: "sales_tax";
    };
    taxability_reason: string;
    taxable_amount: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
}

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

// 3. CANCEL SUBSCRIPTION PLAN
export const useTestAutoSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { subscriptionId: string; orgId: string }) => {
      const res = await request<UpgradePlanResponse>(
        ENDPOINTS.TEST_AUTO_SUBSCRIPTION,
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
    },
    onError: (error: any) => {
      const message = (error as Error)?.message || "Failed to cancel plan";
      toast.error("Cancel failed", message);
    },
  });
};
