/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/utils/requestFunction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/useToast";

export type GhlLocationStatus =
  | "PROVISIONING"
  | "ACTIVE"
  | "SUSPENDED"
  | "CANCELLED"
  | "FAILED";

export interface GhlLocationInfo {
  status: GhlLocationStatus;
  tier: "STARTER" | "GROWTH" | "DOMINATION" | null;
  ghlLocationId: string | null;
  ghlLocationName: string | null;
  provisioningError: string | null;
  membersCount: number;
}

const ENDPOINTS = {
  SSO: `/og/ghl/sso`,
  LOCATION: (orgId: string) => `/og/ghl/location/${orgId}`,
  RETRY: `/og/ghl/retry`,
};

// Launch Owners Pulse — POST { orgId } -> { redirectUrl }. On success the caller
// redirects the browser to the GHL white-label login (RP-initiated SSO).
export const useGhlSso = () => {
  return useMutation({
    mutationFn: async (payload: { orgId: string }) => {
      const res = await request<any>(ENDPOINTS.SSO, "POST", {}, payload);
      return res.data as { redirectUrl: string };
    },
    onError: (error: any) => {
      const message =
        (error as Error)?.message || "Please try again in a moment";
      toast.error("Couldn't open Owners Pulse", message);
    },
  });
};

// Retry GHL provisioning for a failed Owners Pulse product — POST { orgId }.
// The backend re-enqueues the (idempotent) onboarding job. On success we
// invalidate the org queries so the product flips back to "Processing…".
export const useRetryProvisioning = (orgId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await request<any>(ENDPOINTS.RETRY, "POST", {}, { orgId });
      return res.data as { jobId: string; status: string };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization", orgId] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["ghl-location", orgId] });
      toast.success(
        "Retrying setup",
        "We're setting up your Owners Pulse account again. This can take a moment.",
      );
    },
    onError: (error: any) => {
      const message =
        (error as Error)?.message || "Please try again in a moment";
      toast.error("Couldn't retry setup", message);
    },
  });
};

// OP location status/tier for rendering the org card launch state.
export const useGhlLocation = (orgId: string, enabled = true) => {
  return useQuery({
    queryKey: ["ghl-location", orgId],
    queryFn: async () => {
      const res = await request<any>(ENDPOINTS.LOCATION(orgId), "GET");
      return res.data as GhlLocationInfo;
    },
    enabled: !!orgId && enabled,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
