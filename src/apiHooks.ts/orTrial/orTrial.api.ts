"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "@/utils/requestFunction";
import { toast } from "@/hooks/useToast";

export interface OrTrialEligibility {
  eligible: boolean;
  reason?: string;
}

export interface OrTrialActivation {
  activated: boolean;
  trial: {
    grantId: string;
    credits: number;
    startsAt: string;
    endsAt: string;
    days: number;
    catalogVersion: number;
  };
}

const ENDPOINTS = {
  eligibility: (orgId: string, productId: string) =>
    `/og/organization/${orgId}/product/${productId}/or-trial-eligibility`,
  activate: (orgId: string, productId: string) =>
    `/og/organization/${orgId}/product/${productId}/or-trial-activate`,
  provisionRetry: (orgId: string, productId: string) =>
    `/og/organization/${orgId}/product/${productId}/or-provisioning/retry`,
  provisionReactivate: (orgId: string, productId: string) =>
    `/og/organization/${orgId}/product/${productId}/or-provisioning/reactivate`,
};

export const useOrTrialEligibility = (
  orgId: string,
  productId: string,
  enabled = true,
) =>
  useQuery({
    queryKey: ["or-trial-eligibility", orgId, productId],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await request<any>(
        ENDPOINTS.eligibility(orgId, productId),
        "GET",
      );
      return res as OrTrialEligibility;
    },
    enabled: !!orgId && !!productId && enabled,
    retry: false,
    refetchOnWindowFocus: false,
  });

export const useOrTrialActivation = () =>
  useMutation({
    mutationFn: async ({
      orgId,
      productId,
    }: {
      orgId: string;
      productId: string;
    }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await request<any>(
        ENDPOINTS.activate(orgId, productId),
        "POST",
      );
      return res as OrTrialActivation;
    },
    onSuccess: (data) => {
      toast.success(
        "Trial activated",
        `You have ${data.trial.credits} credits for ${data.trial.days} days. They can take up to a minute to appear in Owners Reach.`,
      );
    },
    onError: (error: Error) => {
      toast.error(
        "Trial activation failed",
        error.message || "Please try again.",
      );
    },
  });

export const useOrProvisionRetry = () =>
  useMutation({
    mutationFn: async ({
      orgId,
      productId,
    }: {
      orgId: string;
      productId: string;
    }) => {
      const res = await request<any>(
        ENDPOINTS.provisionRetry(orgId, productId),
        "POST",
      );
      return res;
    },
  });

export const useOrProvisionReactivate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orgId,
      productId,
    }: {
      orgId: string;
      productId: string;
    }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await request<any>(
        ENDPOINTS.provisionReactivate(orgId, productId),
        "POST",
      );
      return res;
    },
    onSuccess: (_data, { orgId }) => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["organization", orgId] });
      queryClient.invalidateQueries({
        queryKey: ["organizationProducts", orgId],
      });
      toast.success(
        "Owners Reach restored",
        "Your previous Owners Reach setup is active again.",
      );
    },
    onError: (error: Error) => {
      toast.error("Restore failed", error.message || "Please try again.");
    },
  });
};
