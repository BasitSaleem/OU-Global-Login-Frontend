"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import AddonCheckoutContent from "@/components/pages/Checkout/AddonCheckoutContent";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!);

function CheckoutAddOnPage() {
  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <Elements stripe={stripePromise}>
      <AddonCheckoutContent />
    </Elements>
  );
}

export default CheckoutAddOnPage;
