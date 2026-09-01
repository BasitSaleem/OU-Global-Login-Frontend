import React, { useState } from "react";
import { CalendarClock, RefreshCw, AlertTriangle, Repeat } from "lucide-react";

import { Button } from "@/components/ui";
import { formatDate } from "@/utils/helpers";
import { useCancelScheduledChange } from "@/apiHooks.ts/subscription/subscription.api";
import { ConfirmationModal } from "./ConfirmationModal";

export function ScheduledChangesBanners({ state, sub, orgId }: any) {
  const cancelScheduled = useCancelScheduledChange();

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string | React.ReactNode;
    confirmText: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    onConfirm: () => {},
  });

  const closeModal = () =>
    setModalConfig((prev) => ({ ...prev, isOpen: false }));

  const handleCancelScheduled = () => {
    setModalConfig({
      isOpen: true,
      title: "Undo Scheduled Change",
      message:
        "Are you sure you want to undo this scheduled change? Your subscription will remain on the current plan.",
      confirmText: "Undo Change",
      onConfirm: () => {
        closeModal();
        cancelScheduled.mutate({ orgId, subscriptionId: sub.id });
      },
    });
  };

  if (
    !state.planChangeScheduled &&
    !state.frequencyChangeScheduled &&
    state.pendingIncompatibleRemovals.length === 0
  ) {
    return null;
  }

  return (
    <div className="space-y-3">
      {state.planChangeScheduled && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-[#f59e0b]/20 p-2 rounded-lg">
              <CalendarClock className="text-[#f59e0b]" size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                Scheduled{" "}
                {state.scheduledChangeType === "UPGRADE"
                  ? "Upgrade"
                  : "Downgrade"}
              </h4>
              <p className="text-sm text-text-secondary mt-1">
                {state.scheduledChangeType === "UPGRADE"
                  ? "Upgrading"
                  : "Downgrading"}{" "}
                to{" "}
                <strong className="font-semibold text-foreground">
                  {state.scheduledPackage?.name ?? "another plan"}
                </strong>{" "}
                on{" "}
                <strong className="font-semibold text-foreground">
                  {formatDate(state.planChangeEffectiveDate!)}
                </strong>
                . Your current plan remains active until then.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            disabled={cancelScheduled.isPending}
            isLoading={cancelScheduled.isPending}
            onClick={handleCancelScheduled}
            className="shrink-0"
            leftIcon={<RefreshCw size={16} className="mr-1.5" />}
          >
            Undo Change
          </Button>
        </div>
      )}

      {state.frequencyChangeScheduled && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-[#f59e0b]/20 p-2 rounded-lg">
              <Repeat className="text-[#f59e0b]" size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                Scheduled Billing Cycle Change
              </h4>
              <p className="text-sm text-text-secondary mt-1">
                Your billing will switch to{" "}
                <strong className="font-semibold text-foreground">
                  {state.scheduledBillingCycle === "MONTHLY"
                    ? "Monthly"
                    : "Yearly"}
                </strong>{" "}
                on{" "}
                <strong className="font-semibold text-foreground">
                  {formatDate(state.frequencyChangeDate!)}
                </strong>
                .
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            disabled={cancelScheduled.isPending}
            isLoading={cancelScheduled.isPending}
            onClick={handleCancelScheduled}
            className="shrink-0"
            leftIcon={<RefreshCw size={16} className="mr-1.5" />}
          >
            Undo Change
          </Button>
        </div>
      )}

      {state.pendingIncompatibleRemovals.length > 0 && (
        <div className="flex items-start gap-3 bg-red/10 border border-red/20 rounded-xl p-4 shadow-sm">
          <div className="bg-red/20 p-2 rounded-lg shrink-0">
            <AlertTriangle className="text-red" size={18} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Incompatible Add-ons
            </h4>
            <p className="text-sm text-text-secondary mt-1">
              The following add-ons will be removed when your downgrade takes
              effect:{" "}
              <strong className="font-semibold text-foreground">
                {state.pendingIncompatibleRemovals
                  .map((a: any) => a.name)
                  .join(", ")}
              </strong>
              . No refund will be issued.
            </p>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        onConfirm={modalConfig.onConfirm}
        isDestructive={modalConfig.isDestructive}
      />
    </div>
  );
}
