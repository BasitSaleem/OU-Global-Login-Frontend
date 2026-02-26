export interface PaymentSecretRespons {
  data: {
    clientSecret: string;
  };
  message?: string;
  success: boolean;
}

export type PaymentProvider = "STRIPE" | "PAYPAL";
export type PaymentMethodType = "CARD" | "BANK";

export interface PaymentMethod {
  id: string;
  user_id: string;
  organization_id: string;
  provider: PaymentProvider;
  type: PaymentMethodType;
  provider_payment_method_id: string; // Stripe pm_xxx
  brand:
    | "VISA"
    | "MASTERCARD"
    | "AMEX"
    | "DISCOVER"
    | "JCB"
    | "DINERS"
    | "UNIONPAY"; // VISA, MASTERCARD etc
  last4: string;
  exp_month: number;
  exp_year: number;
  is_primary: boolean;
  metadata: Record<string, any> | null;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface GetPaymentMethodResponse {
  data: {
    paymentMethods: PaymentMethod[];
  };
  message?: string;
  success: boolean;
}

export interface CreatePaymentMethodData {
  organization_id: string;
  provider: PaymentProvider;
  type: PaymentMethodType;
  provider_payment_method_id: string;
  brand:
    | "VISA"
    | "MASTERCARD"
    | "AMEX"
    | "DISCOVER"
    | "JCB"
    | "DINERS"
    | "UNIONPAY";
  last4: string;
  exp_month: number;
  exp_year: number;
  is_primary: boolean;
  metadata: Record<string, any> | null;
}

export interface CreatePaymentMethodResponse {
  data: {
    paymentMethod: PaymentMethod;
  };
  message?: string;
  success: boolean;
}
