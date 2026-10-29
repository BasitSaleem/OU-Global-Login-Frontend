export type OrBillingCycle = "MONTHLY" | "YEARLY";

export interface OrBillingPlanSummary {
  planId: string;
  code: "starter" | "growth" | "scale";
  name: string;
  includedCredits: number;
  seats: number;
  concurrentRuns: number;
  // Active or paused campaigns the plan allows.
  maxPipelines: number;
  // Leads one pipeline run, and the workspace per UTC day, may request.
  leadsPerRun: number;
  leadsPerDay: number;
}

// A smaller plan that starts at the next renewal.
export interface OrScheduledPlanChange extends OrBillingPlanSummary {
  effectiveDate: string;
}

export interface OrBillingSubscription {
  id: string;
  status: "TRIAL" | "ACTIVE" | "PAST_DUE" | "CANCELLED" | "EXPIRED" | "INCOMPLETE";
  isTrial: boolean;
  billingCycle: OrBillingCycle;
  plan: OrBillingPlanSummary | null;
  scheduledChange: OrScheduledPlanChange | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  trialEndsAt: string | null;
  cancelAtPeriodEnd: boolean;
  cancellationEffectiveDate: string | null;
  // The organization's saved card the paid plan is charged to; null on trials.
  paymentMethodId?: string | null;
}

export interface OrBillingPlanOffer extends OrBillingPlanSummary {
  monthlyPriceMinor: number;
  // null when the plan is not sold yearly.
  yearlyPriceMinor: number | null;
}

export interface OrBillingPackOffer {
  packId: string;
  credits: number;
  priceMinor: number;
}

export interface OrBillingState {
  productId: string;
  subscription: OrBillingSubscription | null;
  offers: {
    catalogVersion: number;
    plans: OrBillingPlanOffer[];
    packs: OrBillingPackOffer[];
  } | null;
  canBuyCredits: boolean;
}

export interface OrPackLine {
  packId: string;
  quantity: number;
}

export interface OrBillingAddress {
  country: string;
  billing_address?: string;
  billing_city?: string;
  billing_state?: string;
  billing_postal_code?: string;
}

export interface OrBillingQuotePayload extends OrBillingAddress {
  planId?: string;
  billingCycle?: OrBillingCycle;
  packs: OrPackLine[];
}

export interface OrBillingQuote {
  proration: boolean;
  subtotalMinor: number;
  taxMinor: number;
  totalMinor: number;
}

export interface OrCheckoutPayload extends OrBillingAddress {
  planId: string;
  billingCycle: OrBillingCycle;
  packs: OrPackLine[];
  paymentMethodId: string;
}

export interface OrCreditsPayload extends OrBillingAddress {
  packs: OrPackLine[];
  paymentMethodId: string;
}

// What moving to a smaller plan at the next renewal changes.
export interface OrDowngradePreview {
  billingCycle: OrBillingCycle;
  effectiveDate: string | null;
  current: OrBillingPlanSummary & { priceMinor: number | null };
  target: OrBillingPlanSummary & { priceMinor: number | null };
  // Team members holding a seat, open invitations, and the smaller plan's seats.
  seats: { members: number; invitations: number; limit: number };
}

export interface OrPaymentResult {
  requiresAction: boolean;
  clientSecret: string | null;
  paymentStatus: string | null;
}
