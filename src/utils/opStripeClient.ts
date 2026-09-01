// DEPRECATED (2026-07): OP billing moved entirely to GHL; there is no in-app OP
// Stripe payment anymore. Kept for reference, not wired into the create flow.
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { PaymentActionResult } from "./stripeClient";

let opStripePromise: Promise<Stripe | null> | null = null;

/**
 * Singleton Stripe.js instance for the SEPARATE Owners Pulse Stripe account.
 * Payment methods for OP services must be created on this account (not the
 * platform account), so OP checkout loads Stripe with the OP publishable key.
 */
export const getOpStripe = (): Promise<Stripe | null> => {
  if (!opStripePromise) {
    opStripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_OP_PK || "",
    );
  }
  return opStripePromise;
};

export const isOpStripeConfigured = (): boolean =>
  Boolean(process.env.NEXT_PUBLIC_STRIPE_OP_PK);

/**
 * Complete a 3D Secure / SCA challenge for an OP payment on the OP account.
 * Returns true when a challenge was handled, false when none was required.
 */
export const confirm3DSOpIfNeeded = async (
  data: PaymentActionResult | null | undefined,
): Promise<boolean> => {
  if (!data?.requiresAction || !data?.clientSecret) {
    return false;
  }

  const stripe = await getOpStripe();
  if (!stripe) {
    throw new Error("Owners Pulse payments are not configured.");
  }

  const { error } = await stripe.confirmCardPayment(data.clientSecret);
  if (error) {
    throw new Error(error.message || "Payment authentication failed");
  }

  return true;
};
