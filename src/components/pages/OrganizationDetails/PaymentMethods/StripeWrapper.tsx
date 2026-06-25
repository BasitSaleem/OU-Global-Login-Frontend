import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import AddPaymentCardForm from "@/components/pages/OrganizationDetails/PaymentMethods/PaymentCardForm";
import { useGetPaymentSecret } from "@/apiHooks.ts/paymentMethod/paymentMethod.api";
import ErrorMessage from "@/components/ErrorMessage";

// load your Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK || "");

interface StripeWrapperProps {
  mode?: "add" | "edit";
  onClose?: () => void;
  orgId: string;
}

const StripeWrapper: React.FC<StripeWrapperProps> = ({ onClose, orgId }) => {
  const { data, isPending, error } = useGetPaymentSecret(orgId);

  if (error) return <ErrorMessage message={error?.message} />;

  return (
    <Elements stripe={stripePromise}>
      <AddPaymentCardForm
        clientSecret={data?.clientSecret || ""}
        isFetchingSecret={isPending}
        onClose={() => {
          onClose?.();
        }}
      />
    </Elements>
  );
};

export default StripeWrapper;
