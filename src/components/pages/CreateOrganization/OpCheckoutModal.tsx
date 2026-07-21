"use client";
// DEPRECATED (2026-07): OP billing moved entirely to GHL; there is no in-app OP
// payment/checkout anymore. Kept for reference, not wired into the create flow.
import React, { useState } from "react";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Asterisk } from "lucide-react";
import { Modal } from "@/components/modals/GenericModal";
import { Button } from "@/components/ui";
import { toast } from "@/hooks/useToast";
import logger from "@/utils/logger";
import {
  getOpStripe,
  isOpStripeConfigured,
  confirm3DSOpIfNeeded,
} from "@/utils/opStripeClient";
import {
  useBuyOpServices,
  useOpPreview,
} from "@/apiHooks.ts/opSubscription/opSubscription.api";

interface OpCheckoutModalProps {
  orgId: string;
  serviceIds: string[];
  dominationUpgrade: boolean;
  onClose: () => void;
  onPaid: () => void;
}

const opStripePromise = getOpStripe();

const OpCheckoutModal: React.FC<OpCheckoutModalProps> = (props) => {
  // If the OP publishable key isn't configured, the workspace is already created
  // (free tier + provisioning); surface a clear message instead of a dead form.
  if (!isOpStripeConfigured()) {
    return (
      <Modal isOpen onClose={props.onClose}>
        <Modal.Header>
          <h2 className="text-lg font-semibold">Payment not available yet</h2>
        </Modal.Header>
        <Modal.Body>
          <p className="text-sm text-text-secondary">
            Your Owners Pulse workspace has been created and is being set up.
            Online payment for services isn&apos;t enabled yet — please try again
            once billing is configured.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end">
            <Button variant="primary" onClick={props.onClose}>
              Done
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <Elements stripe={opStripePromise}>
      <OpCheckoutForm {...props} />
    </Elements>
  );
};

const OpCheckoutForm: React.FC<OpCheckoutModalProps> = ({
  orgId,
  serviceIds,
  dominationUpgrade,
  onClose,
  onPaid,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const buy = useBuyOpServices();
  const { data: preview } = useOpPreview({ serviceIds, dominationUpgrade });

  const [cardName, setCardName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!cardName.trim()) {
      setError("Card holder name is required.");
      return;
    }
    if (!stripe || !elements) {
      setError("Payment form is still loading.");
      return;
    }
    const cardNumber = elements.getElement(CardNumberElement);
    if (!cardNumber) {
      setError("Card details are missing.");
      return;
    }

    setLoading(true);
    try {
      // The Elements instance is loaded with the OP publishable key, so this
      // payment method is created on the Owners Pulse Stripe account.
      const { paymentMethod, error: pmError } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardNumber,
          billing_details: { name: cardName },
        });
      if (pmError || !paymentMethod) {
        throw new Error(pmError?.message || "Couldn't read your card details.");
      }

      const result = await buy.mutateAsync({
        orgId,
        serviceIds,
        dominationUpgrade,
        paymentMethodId: paymentMethod.id,
      });

      // Complete a 3DS challenge on the OP account if required.
      await confirm3DSOpIfNeeded(result);

      toast.success(
        "Payment successful",
        "Your Owners Pulse services are being activated.",
      );
      onPaid();
    } catch (err: any) {
      logger.error("OP checkout failed:", err);
      setError(err?.message || "Payment failed. Please try again.");
      toast.error("Payment failed", err?.message || "Please try again.");
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
        <h2 className="text-lg font-semibold">Complete your purchase</h2>
      </Modal.Header>
      <form onSubmit={handlePay}>
        <Modal.Body>
          {/* Order summary */}
          <div className="rounded-xl border border-border bg-bg-secondary p-4 space-y-1.5 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Monthly</span>
              <span className="font-semibold text-text">
                ${preview?.monthly ?? 0}/mo
              </span>
            </div>
            {(preview?.setup ?? 0) > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">One-time setup</span>
                <span className="font-semibold text-text">
                  ${preview?.setup}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-base border-t border-border pt-2 mt-1">
              <span className="font-bold text-text">Charged today</span>
              <span className="font-bold text-text">
                ${preview?.monthly ?? 0}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="space-y-2">
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
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                disabled={loading}
                className="flex h-10 w-full mt-1.5 text-text rounded-lg border border-border bg-input-bg px-3 py-2 text-sm focus:outline-none disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-text ml-1">
                Card Number
                <Asterisk
                  className="inline mb-2"
                  width={10}
                  height={10}
                  color="red"
                />
              </label>
              <div className="flex items-center h-10 w-full mt-1.5 text-text rounded-lg border bg-input-bg px-3 py-2 text-sm">
                <CardNumberElement
                  className="w-full"
                  options={cardNumberOptions}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                <div className="flex h-10 w-full mt-1.5 text-text rounded-lg border bg-input-bg px-3 pt-2.5 text-sm">
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
                <div className="flex h-10 w-full mt-1.5 text-text rounded-lg border bg-input-bg px-3 pt-2.5 text-sm">
                  <CardCvcElement className="w-full" options={baseStyle} />
                </div>
              </div>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="secondary"
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !stripe}
              isLoading={loading}
            >
              {loading
                ? "Processing..."
                : `Pay $${preview?.monthly ?? 0}`}
            </Button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default OpCheckoutModal;
