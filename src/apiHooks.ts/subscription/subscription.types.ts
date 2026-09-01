export interface UpgradePlanPayload {
  orgId: string;
  packageId: string;
  subscriptionId: string | null;
  billingCycle: "MONTHLY" | "YEARLY";
  priceId: string;
  addOnPriceIds: { priceId: string; quantity: number }[];
  paymentMethodId: string;
  reason?: string;
  billingDetails?: {
    country: string;
    city?: string;
    state?: string;
    postalCode?: string;
    address?: string;
  };
}

export interface BuyAddonPayloadType {
  orgId: string;
  subscriptionId: string | null;
  billingCycle: "MONTHLY" | "YEARLY";
  addons: { priceId: string; quantity: number }[];
  country: string;
  billing_city?: string;
  billing_state?: string;
  billing_postal_code?: string;
  billing_address?: string;
}

export interface UpgradePlanResponse {
  data: {
    subscription?: string;
    subscriptionId?: string;
    requiresAction?: boolean;
    clientSecret?: string | null;
    paymentStatus?: string | null;
    [key: string]: any;
  };
  message?: string;
  success: boolean;
}

export interface PaymentType {
  payment_method: {
    last4: string;
    brand: string;
  };
  amount: number;
  created_at: string;
  currency: string;
  id: string;
  organization_id: string;
  subtotal: string;
  total: string;
  tax_amount: string;
  billing_country: string;
  billing_city: string;
  billing_state: string;
  billing_postal_code: string;
  billing_address: string;
  paid_at: string;
  payment_method_id: string;
  provider_payload: {
    packageId: string;
    customerName: string;
    customerEmail: string;
    stripe_invoice_id: string;
    stripe_customer_id: string;
  };
  provider_transaction_id: string;
  status: string;
  subscription_id: string;
  user_id: string;
}

export interface previewAddonResponse {
  statusCode: number;
  data: previewAddonDataType;
  message: string;
  success: boolean;
}

export interface previewAddonDataType {
  chargeToday: string;
  renewalTotal: string;
  renewalDate: string;
  currency: string;
  breakdown: BreakdownType[];
}

interface BreakdownType {
  description: string;
  amount: number;
  period: {
    end: number;
    start: number;
  };
}

export interface BuyAddonResponse {
  data: {
    subscriptionId: string;
    addons: string[];
    addonExpiresAt: Date;
    requiresAction: boolean;
    clientSecret: string | null;
    message?: string;
    success: boolean;
  };
}

// --- Subscription billing policy (scheduled downgrade / frequency / add-ons) ---

export interface ScheduleDowngradePayload {
  orgId: string;
  subscriptionId: string;
  packageId: string;
  confirmIncompatibleRemoval?: boolean;
}

export interface ScheduleDowngradeData {
  subscriptionId: string;
  scheduledPackageId?: string;
  effectiveDate?: string;
  removedAddons?: { id: string; name: string }[];
  // present on 409 (confirmation required)
  requiresConfirmation?: boolean;
  incompatibleAddons?: { id: string; name: string }[];
}

export interface ChangeFrequencyPayload {
  orgId: string;
  subscriptionId: string;
  billingCycle: "MONTHLY" | "YEARLY";
}

export interface CancelAddonPayload {
  orgId: string;
  subscriptionId: string;
  addonId: string;
}

export interface CancelScheduledChangePayload {
  orgId: string;
  subscriptionId: string;
}

export interface SubscriptionStateAddon {
  id: string;
  name: string;
  quantity: number;
  status: "ACTIVE" | "CANCELLED" | "REMOVED_INCOMPATIBLE";
  cancellationRequested: boolean;
  cancellationEffectiveDate: string | null;
}

export interface SubscriptionState {
  subscriptionId: string;
  status: string;
  billingCycle: "MONTHLY" | "YEARLY";
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  cancellationEffectiveDate: string | null;
  planChangeScheduled: boolean;
  scheduledChangeType: "UPGRADE" | "DOWNGRADE" | null;
  downgradeScheduled: boolean;
  upgradeScheduled: boolean;
  scheduledPackage: { id: string; name: string } | null;
  downgradeEffectiveDate: string | null;
  planChangeEffectiveDate: string | null;
  frequencyChangeScheduled: boolean;
  scheduledBillingCycle: "MONTHLY" | "YEARLY" | null;
  frequencyChangeDate: string | null;
  addons: SubscriptionStateAddon[];
  pendingIncompatibleRemovals: { id: string; name: string }[];
}
