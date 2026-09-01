import React, { useState } from "react";
import { RefreshCw, X, Loader2 } from "lucide-react";
import { formatDate } from "@/utils/helpers";
import { ConfirmationModal } from "./ConfirmationModal";
import { useCancelAddon, useUndoCancelAddon } from "@/apiHooks.ts/subscription/subscription.api";
import { Button } from "@/components/ui";

export function ActiveAddonsSection({ addons, orgId, sub }: any) {
  const cancelAddon = useCancelAddon();
  const undoCancelAddon = useUndoCancelAddon();

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

  const closeModal = () => setModalConfig((prev) => ({ ...prev, isOpen: false }));

  const handleCancelAddon = (addonId: string, name: string) => {
    setModalConfig({
      isOpen: true,
      title: "Cancel Add-on",
      message: `Cancel the "${name}" add-on? You keep access until the end of the current billing period. No refund is issued.`,
      confirmText: "Cancel Add-on",
      isDestructive: true,
      onConfirm: () => {
        closeModal();
        cancelAddon.mutate({ orgId, subscriptionId: sub.id, addonId });
      }
    });
  };

  const handleUndoCancelAddon = (addonId: string) => {
    setModalConfig({
      isOpen: true,
      title: "Undo Cancellation",
      message: "Are you sure you want to undo the cancellation of this add-on? It will remain active.",
      confirmText: "Undo Cancellation",
      onConfirm: () => {
        closeModal();
        undoCancelAddon.mutate({ orgId, subscriptionId: sub.id, addonId });
      }
    });
  };

  return (
    <div className="pt-6 border-t mt-8">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Active Add-ons</h3>
        <p className="text-sm text-text-secondary mt-1">
          Manage your active subscription add-ons and extras.
        </p>
      </div>
      <div className="grid gap-3">
        {addons.map((a: any) => (
          <div
            key={a.id}
            className="flex flex-col sm:flex-row justify-between sm:items-center bg-bg-secondary border rounded-xl p-4 gap-4 transition-all hover:border-border/80"
          >
            <div>
              <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                {a.name}
                {a.quantity > 1 && (
                  <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                    Qty: {a.quantity}
                  </span>
                )}
              </span>
            </div>
            {a.cancellationRequested ? (
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto bg-primary/10 px-3 py-2 rounded-lg border border-primary/20">
                <span className="text-xs font-medium text-text-secondary">
                  Removing on {formatDate(a.cancellationEffectiveDate!)}
                </span>
                <Button
                  variant="outline"
                  onClick={() => handleUndoCancelAddon(a.id)}
                  disabled={undoCancelAddon.isPending}
                  isLoading={undoCancelAddon.isPending}
                  className="h-8! py-0! px-3! text-xs bg-background"
                  leftIcon={<RefreshCw size={14} className="mr-1.5" />}
                >
                  Undo
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => handleCancelAddon(a.id, a.name)}
                disabled={cancelAddon.isPending}
                isLoading={cancelAddon.isPending}
                className="shrink-0 h-9! py-0! border-red text-red hover:bg-red/10 bg-background"
                leftIcon={<X size={16} className="mr-1" />}
              >
                Cancel Add-on
              </Button>
            )}
          </div>
        ))}
      </div>

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
