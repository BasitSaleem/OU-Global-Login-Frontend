/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/utils/requestFunction";
import { useMutation, useQuery } from "@tanstack/react-query";
import { OpTier } from "@/apiHooks.ts/opPackages/opPackages.api";

export interface OpService {
  id: string;
  name: string;
  description: string | null;
  monthly_price: string;
  yearly_price: string | null;
  setup_fee: string;
  currency: string;
  grants_tier: OpTier | null;
  is_bundle: boolean;
  is_active: boolean;
}

export interface OpPreview {
  // Resolved Owners Pulse tier for the selection (null when nothing resolves).
  resolvedTier: OpTier | null;
  isServiceOrder: boolean;
  isBundle: boolean;
  dominationUpsellAvailable: boolean;
  dominationUpgradeApplied: boolean;
  trialDays: number;
  currency: string;
  monthly: number;
  yearly: number;
  setup: number;
  services: {
    id: string;
    name: string;
    monthly_price: string;
    yearly_price: string | null;
    setup_fee: string;
    is_bundle: boolean;
  }[];
  // GHL bills OP; when the plan isn't fully mapped in GHL yet the workspace can
  // still be created. missingConfig lists what's not configured.
  ghlPlanConfigured: boolean;
  missingConfig: string[];
  // One-time setup-fee Stripe Payment Link for this exact selection. Null for
  // standalone packages and for combinations without a link configured yet.
  stripePaymentLink: string | null;
}

export interface OpSelection {
  serviceIds: string[];
  dominationUpgrade: boolean;
  standaloneTier?: OpTier | null;
}

const ENDPOINTS = {
  OP_SERVICES: `/op/services`,
  PREVIEW: `/og/op/preview`,
  BUY_SERVICES: `/og/op/buy-services`,
  VERIFY_INVOICE: `/og/op/verify-invoice`,
};

// Public read of the Owners Pulse services catalog for the selection UI.
export const useGetOpServices = () => {
  return useQuery({
    queryKey: ["op-services-public"],
    queryFn: async () => {
      const res = await request<any>(ENDPOINTS.OP_SERVICES, "GET");
      return res.data; // { totalDocuments, data: [] }
    },
    select: (data: any): OpService[] =>
      ((data?.data ?? []) as OpService[]).filter((s) => s.is_active),
    staleTime: 3 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Live order preview (resolved tier + charge-today / setup / monthly). Pure on
// the backend; recomputed whenever the selection changes.
export const useOpPreview = (selection: OpSelection) => {
  const hasSelection =
    (selection.serviceIds?.length ?? 0) > 0 || !!selection.standaloneTier;
  return useQuery({
    queryKey: [
      "op-preview",
      [...(selection.serviceIds ?? [])].sort().join(","),
      selection.dominationUpgrade,
      selection.standaloneTier ?? null,
    ],
    queryFn: async () => {
      const res = await request<any>(ENDPOINTS.PREVIEW, "POST", {}, selection);
      return res.data as OpPreview;
    },
    enabled: hasSelection,
    refetchOnWindowFocus: false,
  });
};

export interface BuyOpServicesPayload {
  orgId: string;
  serviceIds: string[];
  dominationUpgrade: boolean;
  paymentMethodId: string;
  billingCycle?: "Monthly" | "Yearly";
}

export interface BuyOpServicesResult {
  subscription: string;
  entitlementTier: OpTier | null;
  requiresAction: boolean;
  clientSecret: string | null;
  paymentStatus: string | null;
}

export interface VerifyOpInvoiceResult {
  verified: boolean;
  invoiceId: string;
  amountPaid: number;
  currency: string;
  number: string | null;
}

export interface VerifyOpInvoicePayload {
  invoiceId: string;
  // The EXACT combo currently selected — ties the invoice to this specific
  // selection (not just its price) so it can't later be reused for a
  // different, same-priced combo.
  serviceIds: string[];
  dominationUpgrade: boolean;
}

// Verify a Stripe (OP account) invoice id for the manually collected services
// setup fee. Gates the Create button in the org-creation services flow.
export const useVerifyOpInvoice = () => {
  return useMutation({
    mutationFn: async (payload: VerifyOpInvoicePayload) => {
      const res = await request<any>(
        ENDPOINTS.VERIFY_INVOICE,
        "POST",
        {},
        payload,
      );
      return res.data as VerifyOpInvoiceResult;
    },
  });
};

// Purchase services for an existing OP org (charged immediately on the OP
// account). Returns any 3DS action for the frontend to confirm.
export const useBuyOpServices = () => {
  return useMutation({
    mutationFn: async (payload: BuyOpServicesPayload) => {
      const res = await request<any>(
        ENDPOINTS.BUY_SERVICES,
        "POST",
        {},
        payload,
      );
      return res.data as BuyOpServicesResult;
    },
  });
};
