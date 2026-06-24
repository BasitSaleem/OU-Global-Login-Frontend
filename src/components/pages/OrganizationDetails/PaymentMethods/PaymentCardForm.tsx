import React, { useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Asterisk } from "lucide-react";
import { Button } from "@/components/ui";
import { toast } from "@/hooks/useToast";
import { useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/modals/GenericModal";
import logger from "@/utils/logger";

interface AddPaymentCardFormProps {
  clientSecret: string; // from backend SetupIntent
  isFetchingSecret?: boolean;
  onClose: () => void;
}

const AddPaymentCardForm: React.FC<AddPaymentCardFormProps> = ({
  clientSecret,
  isFetchingSecret,
  onClose,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardHolderName, setCardHolderName] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!cardHolderName.trim()) {
      newErrors.cardHolderName = "Card holder name is required.";
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
        toast.error(
          "Failed to add card",
          setupError.message || "Failed to confirm card setup.",
        );
        setError(setupError.message || "Failed to confirm card setup.");
      } else if (setupIntent?.status === "succeeded") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
        onClose();
      }
    } catch (err: any) {
      logger.error("AddPaymentCardForm: Unexpected error:", err);
      setError(err.message || "Something went wrong");
      toast.error("Failed to add card", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const baseStyle = {
    style: {
      base: {
        fontSize: "14px",
        color: "#000",
        "::placeholder": { color: "#999" },
      },
      invalid: { color: "#fa755a" },
    },
  };

  const cardNumberOptions = {
    ...baseStyle,
    showIcon: true,
    iconStyle: "solid" as const,
    disableLink: true,
  };

  return (
    <Modal isOpen onClose={onClose}>
      <Modal.Header>
        <h2 className="text-lg font-semibold mb-4">
          {isFetchingSecret ? "Loading..." : "Add New Card"}
        </h2>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            <div
              className={`space-y-2 ${isFetchingSecret ? "opacity-50 pointer-events-none" : ""}`}
            >
              <label className="text-sm text-text ml-1">
                Card Holder Name
                <Asterisk
                  className="inline mb-2"
                  width={10}
                  height={10}
                  color="red"
                />
              </label>
              <input
                placeholder="John Doe"
                value={cardHolderName}
                // required
                onChange={(e) => setCardHolderName(e.target.value)}
                disabled={isFetchingSecret || loading}
                className={`flex h-10 w-full mt-1.5 text-text rounded-lg border border-border bg-input-bg px-3 py-2 text-sm focus:outline-none focus:border-border  disabled:cursor-not-allowed disabled:opacity-50 ${errors.cardHolderName ? "!border-red-500 !focus:ring-red-500 !focus:border-red-500 !focus:shadow-none" : ""}`}
              />
              {errors.cardHolderName && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.cardHolderName}
                </p>
              )}
            </div>
            {/* <input
              label="Card Holder Name"
              placeholder="John Doe"
              value={cardHolderName}
              required
              onChange={(e) => setCardHolderName(e.target.value)}
              error={errors.cardHolderName}
              isRequired
              disabled={isFetchingSecret || loading}
            /> */}

            <div
              className={`space-y-2 ${isFetchingSecret ? "opacity-50 pointer-events-none" : ""}`}
            >
              <label className="text-sm text-text ml-1">
                Card Number
                <Asterisk
                  className="inline mb-2"
                  width={10}
                  height={10}
                  color="red"
                />
              </label>
              <div className="flex items-center h-10 w-full mt-1.5 text-text rounded-lg border bg-input-bg px-3 py-2 text-sm focus-within:outline-none ">
                <CardNumberElement
                  className="w-full"
                  options={cardNumberOptions}
                />
              </div>
            </div>

            <div
              className={`grid grid-cols-2 gap-4 ${isFetchingSecret ? "opacity-50 pointer-events-none" : ""}`}
            >
              <div className="space-y-2">
                <label className="text-sm text-text ml-1">
                  Expiry Date
                  <Asterisk
                    className="inline mb-2"
                    width={10}
                    height={10}
                    color="red"
                  />
                </label>
                <div className="flex h-10 w-full mt-1.5 text-text rounded-lg border bg-input-bg px-3 pt-2.5 text-sm focus-within:outline-none ">
                  <CardExpiryElement className="w-full" options={baseStyle} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-text ml-1">
                  CVC
                  <Asterisk
                    className="inline mb-2"
                    width={10}
                    height={10}
                    color="red"
                  />
                </label>
                <div className="flex h-10 w-full mt-1.5 text-text rounded-lg border bg-input-bg px-3 pt-2.5 text-sm focus-within:outline-none focus-within:shadow-[0_0_0_4px_rgba(224,223,228,0.4)]">
                  <CardCvcElement className="w-full" options={baseStyle} />
                </div>
              </div>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="secondary"
              type="button"
              onClick={onClose}
              disabled={isFetchingSecret || loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isFetchingSecret || loading}
              isLoading={loading}
            >
              {loading ? "Saving..." : "Save Card"}
            </Button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default AddPaymentCardForm;
