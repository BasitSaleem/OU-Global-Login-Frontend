import React, { useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button, Input } from "@/components/ui";
import { toast } from "@/hooks/useToast";

interface AddPaymentCardFormProps {
  clientSecret: string; // from backend SetupIntent
  isFetchingSecret?: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onSave: (paymentMethod: any) => void;
}

const AddPaymentCardForm: React.FC<AddPaymentCardFormProps> = ({
  clientSecret,
  isFetchingSecret,
  isSubmitting,
  onClose,
  onSave,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billingAddress, setBillingAddress] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!cardHolderName.trim()) {
      newErrors.cardHolderName = "Card holder name is required.";
    }
    if (!billingAddress.trim()) {
      newErrors.billingAddress = "Billing address is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    if (!stripe || !elements) {
      setError("Stripe is not loaded yet.");
      setLoading(false);
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      setError("Card elements not found.");
      setLoading(false);
      return;
    }

    try {
      const { paymentMethod, error: pmError } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardNumberElement,
          billing_details: {
            address: {
              line1: billingAddress,
            },
            name: cardHolderName,
          },
        });

      if (pmError) {
        setError(pmError.message || "Failed to create payment method.");
        setLoading(false);
        return;
      }

      const { setupIntent, error: setupError } = await stripe.confirmCardSetup(
        clientSecret,
        {
          payment_method: paymentMethod.id,
        },
      );

      if (setupError) {
        console.error(
          "AddPaymentCardForm: Setup confirmation failed:",
          setupError,
        );
        toast.error(setupError.message || "Failed to confirm card setup.");
        setError(setupError.message || "Failed to confirm card setup.");
      } else if (setupIntent?.status === "succeeded") {
        onSave(paymentMethod.id);

        onClose();
      } else {
      }
    } catch (err: any) {
      console.error("AddPaymentCardForm: Unexpected error:", err);
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const elementOptions = {
    style: {
      base: {
        fontSize: "14px",
        color: "#000",
        "::placeholder": { color: "#999" },
      },
      invalid: { color: "#fa755a" },
    },
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-bg-secondary p-6 rounded-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 font-bold"
        >
          X
        </button>

        <h2 className="text-lg font-semibold mb-4">
          {isFetchingSecret ? "Loading..." : "Add New Card"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Card Holder Name"
            placeholder="John Doe"
            value={cardHolderName}
            onChange={(e) => setCardHolderName(e.target.value)}
            error={errors.cardHolderName}
            isRequired
            disabled={isFetchingSecret || loading}
          />

          <div
            className={`space-y-2 ${isFetchingSecret ? "opacity-50 pointer-events-none" : ""}`}
          >
            <label className="text-sm text-text ml-1">
              Card Number <span className="text-red-500 ml-1 mb-2">*</span>
            </label>
            <div className="flex h-10 w-full mt-1.5 text-text rounded-lg border bg-input-bg px-3 py-2 text-sm focus-within:ring-1 focus-within:ring-primary">
              <CardNumberElement className="w-full" options={elementOptions} />
            </div>
          </div>

          <div
            className={`grid grid-cols-2 gap-4 ${isFetchingSecret ? "opacity-50 pointer-events-none" : ""}`}
          >
            <div className="space-y-2">
              <label className="text-sm text-text ml-1">
                Expiry Date <span className="text-red-500 ml-1 mb-2">*</span>
              </label>
              <div className="flex h-10 w-full mt-1.5 text-text rounded-lg border bg-input-bg px-3 py-2 text-sm focus-within:ring-1 focus-within:ring-primary">
                <CardExpiryElement
                  className="w-full"
                  options={elementOptions}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-text ml-1">
                CVC/CVV <span className="text-red-500 ml-1 mb-2">*</span>
              </label>
              <div className="flex h-10 w-full mt-1.5 text-text rounded-lg border bg-input-bg px-3 py-2 text-sm focus-within:ring-1 focus-within:ring-primary">
                <CardCvcElement className="w-full" options={elementOptions} />
              </div>
            </div>
          </div>

          <Input
            label="Billing Address"
            placeholder="123 Main St, City, Country"
            value={billingAddress}
            onChange={(e) => setBillingAddress(e.target.value)}
            error={errors.billingAddress}
            isRequired
            disabled={isFetchingSecret || loading}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-4 mt-4">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isFetchingSecret || loading || isSubmitting}
            >
              {loading || isSubmitting ? "Saving..." : "Save Card"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentCardForm;
