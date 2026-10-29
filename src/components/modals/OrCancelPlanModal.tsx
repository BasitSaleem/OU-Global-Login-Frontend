"use client";

import React, { useState } from "react";
import { Modal } from "@/components/modals/GenericModal";
import { Button } from "@/components/ui";
import { useOrCancelPlan } from "@/apiHooks.ts/orBilling/orBilling.api";
import { formatDate } from "@/utils/helpers";

interface OrCancelPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgId: string;
  planName: string;
  periodEnd: string | null;
  // A scheduled downgrade, which cancelling removes.
  scheduledPlanName?: string | null;
}

const OrCancelPlanModal: React.FC<OrCancelPlanModalProps> = ({
  isOpen,
  onClose,
  orgId,
  planName,
  periodEnd,
  scheduledPlanName,
}) => {
  const [reason, setReason] = useState("");
  const { mutateAsync: cancelPlan, isPending } = useOrCancelPlan(orgId);

  const handleCancel = async () => {
    try {
      await cancelPlan(reason.trim());
      setReason("");
      onClose();
    } catch {
      // The hook shows the error.
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <Modal.Header>
        <Modal.Title className="text-red-500">Cancel Owners Reach plan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <p className="text-text text-sm">
            Your {planName} plan stays active
            {periodEnd ? ` until ${formatDate(periodEnd)}` : " until the end of the billing period"} and
            will not renew. You will not be charged again. You can resume it any time before then.
            {scheduledPlanName && ` Cancelling also removes your scheduled change to ${scheduledPlanName}.`}
          </p>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text ml-1">
              Reason for cancellation <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
              placeholder="Please enter your reason here..."
              className="w-full min-h-[120px] p-3 mt-1 text-sm rounded-lg border bg-input-bg text-text focus:outline-none focus:ring-1 focus:ring-primary border-border resize-none"
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>
          Keep plan
        </Button>
        <Button onClick={handleCancel} variant="destructive" disabled={isPending || !reason.trim()}>
          {isPending ? "Cancelling..." : "Confirm cancellation"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrCancelPlanModal;
