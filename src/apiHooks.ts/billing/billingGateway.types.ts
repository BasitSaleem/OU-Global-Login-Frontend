// Gateway-neutral billing (backend /og/billing). Stripe and PayFast share
// these shapes so checkout UI code never depends on gateway details.

export type GatewayProvider = "STRIPE" | "PAYFAST";

export type CheckoutAction =
  | { type: "redirect"; url: string }
  | { type: "form_post"; action: string; fields: Record<string, string> }
  | {
      type: "stripe_confirm";
      clientSecret: string | null;
      requiresAction: boolean;
      paymentStatus: string | null;
    }
  | { type: "none" };

export interface PaymentMethodOption {
  id: string;
  label: string;
}

export interface BillingRenewalInfo {
  subscriptionId: string;
  provider: GatewayProvider;
  status: "ACTIVE" | "PAST_DUE" | "EXPIRED";
  currentPeriodEnd: string | null;
  graceEndsAt: string | null;
  graceDays: number;
  cancelAtPeriodEnd: boolean;
  canPayNow: boolean;
  opensAt: string | null;
}

export interface BillingOptions {
  provider: GatewayProvider;
  locked: boolean;
  reason: "LOCKED_TO_SUBSCRIPTION" | "COUNTRY_RULE" | "DEFAULT";
  country: string | null;
  displayName: string;
  currency: string;
  flow: "saved_card" | "redirect";
  methods: PaymentMethodOption[];
  requiresPhone: boolean;
  savedPhone: string | null;
  renewal: BillingRenewalInfo | null;
}

export interface QuoteLine {
  kind: "PACKAGE" | "ADDON" | "PRORATION_CREDIT";
  id: string | null;
  name: string;
  quantity: number;
  unit_minor: number;
  total_minor: number;
}

export interface PlatformQuote {
  provider: GatewayProvider;
  currency: string;
  purpose: "NEW_PLAN" | "UPGRADE";
  billingCycle: "MONTHLY" | "YEARLY";
  lines: QuoteLine[];
  periodTotalMinor: number;
  creditMinor: number;
  dueNowMinor: number;
  taxInclusive: boolean;
  period: { start: string; end: string };
}

export interface SelectionPayload {
  packageId: string;
  billingCycle: "MONTHLY" | "YEARLY";
  addOns: { addOnId: string; quantity: number }[];
  country?: string;
}

export interface StartCheckoutPayload extends Omit<SelectionPayload, "country"> {
  provider: GatewayProvider;
  paymentMethodId?: string | null;
  billing: {
    country: string;
    phone?: string | null;
    billing_city?: string;
    billing_state?: string;
    billing_postal_code?: string;
    billing_address?: string;
  };
}

export interface StartCheckoutResult {
  provider: GatewayProvider;
  checkoutId: string | null;
  action: CheckoutAction;
}

export interface CheckoutStatus {
  id: string;
  organizationId: string;
  provider: GatewayProvider;
  purpose: "NEW_PLAN" | "UPGRADE" | "RENEWAL" | "ADDON";
  status: "PENDING" | "PAID" | "FAILED" | "EXPIRED" | "CANCELLED" | "NEEDS_REVIEW";
  amountMinor: number | null;
  currency: string | null;
  packageName: string | null;
  billingCycle: string | null;
  subscriptionId: string | null;
  settledAt: string | null;
  failureMessage: string | null;
}
