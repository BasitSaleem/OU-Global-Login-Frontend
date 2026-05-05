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
    subscription: {
      id: string;
      status: string;
      payments: PaymentType[];
      [key: string]: any;
    };
  };
  message?: string;
  success: boolean;
}

export interface PaymentType {
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

interface previewAddonDataType {
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
