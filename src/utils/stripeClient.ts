import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Singleton Stripe.js instance. Safe to call anywhere (no <Elements> provider
 * required) because confirming an already-attached saved card during a 3DS
 * challenge does not need a mounted CardElement.
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK || "");
  }
  return stripePromise;
};

export interface PaymentActionResult {
  requiresAction?: boolean;
  clientSecret?: string | null;
  paymentStatus?: string | null;
}

/**
 * Completes a 3D Secure / SCA challenge when the backend reports the payment
 * needs additional action. Throws if authentication fails so callers can
 * surface the error and avoid treating the payment as successful.
 *
 * Returns `true` when a challenge was handled, `false` when none was required.
 */
export const confirm3DSIfNeeded = async (
  data: PaymentActionResult | null | undefined,
): Promise<boolean> => {
  if (!data?.requiresAction || !data?.clientSecret) {
    return false;
  }

  const stripe = await getStripe();
  if (!stripe) {
    throw new Error("Stripe failed to initialize");
  }

  const { error } = await stripe.confirmCardPayment(data.clientSecret);
  if (error) {
    throw new Error(error.message || "Payment authentication failed");
  }

  return true;
};
