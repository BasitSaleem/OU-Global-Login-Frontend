import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import AddPaymentCardForm from "@/components/pages/OrganizationDetails/PaymentMethods/PaymentCardForm";
import {
  useCreatePaymentMethod,
  useGetPaymentSecret,
} from "@/apiHooks.ts/paymentMethod/paymentMethod.api";
import ErrorMessage from "@/components/ErrorMessage";
import { PaymentMethod } from "@/apiHooks.ts/paymentMethod/paymentMethod.types";

// load your Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK || "");

interface StripeWrapperProps {
  mode?: "add" | "edit";
  initialData?: PaymentMethod;
  onSave?: (paymentMethodId: string) => void;
  onClose?: () => void;
}

const StripeWrapper: React.FC<StripeWrapperProps> = ({ onClose }) => {
  const { data, isPending, error } = useGetPaymentSecret();
  const { mutateAsync: createPaymentMethod, isPending: isCreating } =
    useCreatePaymentMethod(onClose);

  const onSaveHandler = (pmId: string) => {
    createPaymentMethod(pmId);
  };

  if (error) return <ErrorMessage message={error?.message} />;

  return (
    <Elements stripe={stripePromise}>
      <AddPaymentCardForm
        clientSecret={data?.clientSecret || ""}
        isFetchingSecret={isPending}
        isSubmitting={isCreating}
        onClose={() => {
          onClose?.();
        }}
        onSave={onSaveHandler}
      />
    </Elements>
  );
};

export default StripeWrapper;
