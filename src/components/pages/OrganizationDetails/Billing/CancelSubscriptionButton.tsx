"use client";

import React, { useState } from "react";
import { Modal } from "@/components/modals/GenericModal";
import { Button } from "@/components/ui";
import { useCancelSubscription } from "@/apiHooks.ts/subscription/subscribtion.api";
import { toast } from "@/hooks/useToast";

interface CancelSubscriptionButtonProps {
  subscriptionId: string;
  orgId: string;
}

const CancelSubscriptionButton: React.FC<CancelSubscriptionButtonProps> = ({
  subscriptionId,
  orgId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const { mutateAsync: cancelSubscription, isPending } =
    useCancelSubscription();

  const handleCancelSubscription = async () => {
    if (!reason.trim()) {
      toast.error(
        "Reason required",
        "Please provide a reason for cancelling your subscription.",
      );
      return;
    }

    try {
      await cancelSubscription({
        subscriptionId,
        orgId,
        reason: reason.trim(),
      });
      setIsOpen(false);
      setReason("");
    } catch (error) {
      // Error is handled by the mutation hook's onError
    }
  };

  return (
    <>
      <div
        className={`h-10 rounded-full px-4 py-1 flex items-center justify-center border-2 border-red-500 mt-1 cursor-pointer transition-opacity hover:opacity-90`}
        onClick={() => setIsOpen(true)}
      >
        <div className="text-red-500 text-sm font-semibold font-inter">
          Cancel Subscription
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="md">
        <Modal.Header>
          <Modal.Title className="text-red-500">
            Cancel Subscription
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <p className="text-text text-sm">
              We're sorry to see you go. Please tell us why you want to cancel
              your subscription. This information helps us improve our service.
            </p>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text ml-1">
                Reason for cancellation <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please enter your reason here..."
                className="w-full min-h-[120px] p-3 mt-1 text-sm rounded-lg border bg-input-bg text-text focus:outline-none focus:ring-1 focus:ring-primary border-border resize-none"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="basic"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-bg-secondary"
          >
            Keep Subscription
          </Button>
          <Button
            onClick={handleCancelSubscription}
            disabled={isPending || !reason.trim()}
            className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Cancelling..." : "Confirm Cancellation"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CancelSubscriptionButton;
