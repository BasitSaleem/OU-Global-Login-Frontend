"use client";

import React, { useState } from "react";
import { Modal } from "@/components/modals/GenericModal";
import { Button } from "@/components/ui";
import { useCancelSubscription } from "@/apiHooks.ts/subscription/subscription.api";
import { toast } from "@/hooks/useToast";

interface CancelSubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    subscriptionId: string;
    orgId: string;
}

const CancelSubscriptionModal: React.FC<CancelSubscriptionModalProps> = ({
    subscriptionId,
    onClose,
    isOpen,
    orgId,
}) => {
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
            onClose();
            setReason("");
        } catch (error) {
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={() => onClose()} size="md">
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
                    variant="primary"
                    onClick={() => onClose()}
                >
                    Keep Subscription
                </Button>
                <Button
                    onClick={handleCancelSubscription}
                    variant="destructive"
                    disabled={isPending || !reason.trim()}
                >
                    {isPending ? "Cancelling..." : "Confirm Cancellation"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CancelSubscriptionModal;
