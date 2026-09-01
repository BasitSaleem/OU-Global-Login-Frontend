import React, { useState, useMemo } from "react";
import {
  Repeat,
  ArrowUpCircle,
  CalendarClock,
  ArrowDownCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/useToast";
import { Button, Dropdown } from "@/components/ui";
import { ConfirmationModal } from "./ConfirmationModal";
import { ApiError } from "@/utils/requestFunction";
import {
  useScheduleDowngrade,
  useScheduleUpgrade,
  useChangeBillingFrequency,
} from "@/apiHooks.ts/subscription/subscription.api";
import { useGetAllPlans } from "@/apiHooks.ts/plans/plans.api";

export function ManagePlanSection({ state, sub, orgId }: any) {
  const router = useRouter();

  const { data: plansData } = useGetAllPlans();
  const scheduleDowngrade = useScheduleDowngrade();
  const scheduleUpgrade = useScheduleUpgrade();
  const changeFrequency = useChangeBillingFrequency();

  const [selectedDowngradeId, setSelectedDowngradeId] = useState("");
  const [selectedUpgradeId, setSelectedUpgradeId] = useState("");

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

  // Alternatives across ALL plan types, split by tier into upgrades / downgrades.
  const { upgradeOptions, downgradeOptions } = useMemo(() => {
    if (!plansData?.plans || !sub?.oiPackage)
      return { upgradeOptions: [], downgradeOptions: [] };
    const currentTier = sub.oiPackage?.tier_level;
    const others = plansData.plans.filter(
      (p) => p.is_active && p.id !== sub.oiPackage?.id,
    );
    return {
      upgradeOptions: others.filter((p) => p.tier_level > currentTier),
      downgradeOptions: others.filter((p) => p.tier_level < currentTier),
    };
  }, [plansData, sub?.oiPackage]);

  const [isNavigating, setIsNavigating] = useState(false);

  const goToUpgradeCheckout = (planId: string) => {
    setIsNavigating(true);
    const cycle = state?.billingCycle === "YEARLY" ? "yearly" : "monthly";
    router.push(
      `/organization-details/${orgId}/billing/checkout/${planId}?billingCycle=${cycle}`,
    );
  };

  const handleScheduleDowngrade = () => {
    if (!selectedDowngradeId) return;
    const payload = {
      orgId,
      subscriptionId: sub.id,
      packageId: selectedDowngradeId,
    };

    setModalConfig({
      isOpen: true,
      title: "Schedule Downgrade",
      message:
        "Are you sure you want to schedule this downgrade for your next billing cycle?",
      confirmText: "Schedule Downgrade",
      onConfirm: () => {
        closeModal();
        scheduleDowngrade.mutate(payload, {
          onSuccess: () => {
            toast.success(
              "Downgrade scheduled",
              "Your plan will change at the end of the current billing period.",
            );
            setSelectedDowngradeId("");
          },
          onError: (err: any) => {
            if (err instanceof ApiError && err.statusCode === 409) {
              const incompatible: { id: string; name: string }[] =
                err.response?.data?.incompatibleAddons ?? [];
              const names = incompatible.map((a) => a.name).join(", ");

              setModalConfig({
                isOpen: true,
                title: "Incompatible Add-ons",
                message: `The following add-ons are not compatible with the new plan and will be removed on the effective date (no refund):\n\n${names}\n\nDo you want to continue?`,
                confirmText: "Continue Downgrade",
                isDestructive: true,
                onConfirm: () => {
                  closeModal();
                  scheduleDowngrade.mutate(
                    {
                      ...payload,
                      confirmIncompatibleRemoval: true,
                    },
                    {
                      onSuccess: () => {
                        toast.success(
                          "Downgrade scheduled",
                          "Your plan will change at the end of the current billing period.",
                        );
                        setSelectedDowngradeId("");
                      },
                      onError: (e: any) => {
                        toast.error(
                          "Downgrade failed",
                          e?.message || "Please try again",
                        );
                      },
                    },
                  );
                },
              });
            } else {
              toast.error(
                "Downgrade failed",
                err?.message || "Please try again",
              );
            }
          },
        });
      },
    });
  };

  const handleScheduleUpgrade = () => {
    if (!selectedUpgradeId) return;
    setModalConfig({
      isOpen: true,
      title: "Schedule Upgrade",
      message:
        "Are you sure you want to schedule this upgrade for your next billing cycle?",
      confirmText: "Schedule Upgrade",
      onConfirm: () => {
        closeModal();
        scheduleUpgrade.mutate(
          { orgId, subscriptionId: sub.id, packageId: selectedUpgradeId },
          { onSuccess: () => setSelectedUpgradeId("") },
        );
      },
    });
  };

  const handleFrequencyChange = () => {
    const target = state.billingCycle === "MONTHLY" ? "YEARLY" : "MONTHLY";
    const isYearly = target === "YEARLY";

    setModalConfig({
      isOpen: true,
      title: "Change Billing Frequency",
      message: isYearly
        ? "Switch to yearly billing now? Unused time on your monthly plan will be credited."
        : "Switch to monthly billing? This takes effect at your next renewal date.",
      confirmText: "Confirm Change",
      onConfirm: () => {
        closeModal();
        changeFrequency.mutate({
          orgId,
          subscriptionId: sub.id,
          billingCycle: target,
        });
      },
    });
  };

  return (
    <div className="grid gap-4">
      {/* Billing frequency */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-bg-secondary border rounded-xl p-5 gap-4 transition-all hover:border-border/80 hover:shadow-sm">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Billing Frequency
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            Currently on{" "}
            <strong className="text-foreground font-medium">
              {state.billingCycle === "MONTHLY" ? "Monthly" : "Yearly"}
            </strong>{" "}
            billing.
          </p>
        </div>
        <Button
          variant="primary"
          disabled={changeFrequency.isPending}
          isLoading={changeFrequency.isPending}
          onClick={handleFrequencyChange}
          className="shrink-0 h-10! py-0!"
          leftIcon={<Repeat size={16} className="mr-1.5" />}
        >
          {state.billingCycle === "MONTHLY"
            ? "Switch to Yearly"
            : "Switch to Monthly"}
        </Button>
      </div>

      {/* Upgrade */}
      {upgradeOptions.length > 0 && (
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-bg-secondary border rounded-xl p-5 gap-4 transition-all hover:border-border/80 hover:shadow-sm">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Upgrade Plan
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              Switch to a higher tier plan immediately or schedule for the next
              cycle.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Dropdown
              options={upgradeOptions.map((p: any) => ({
                value: p.id,
                label: p.package_name,
              }))}
              value={selectedUpgradeId}
              onChange={(value) => setSelectedUpgradeId(value)}
              placeholder="Select a higher plan…"
              className="w-full sm:w-50 mt-0! bg-background [&_button]:mt-0!"
            />
            <div className="flex w-full sm:w-auto gap-2">
              <Button
                variant="primary"
                disabled={!selectedUpgradeId || isNavigating}
                isLoading={isNavigating}
                onClick={() => goToUpgradeCheckout(selectedUpgradeId)}
                className="flex-1 sm:flex-none h-10! py-0! rounded-lg"
                leftIcon={<ArrowUpCircle size={16} className="mr-1.5" />}
              >
                Now
              </Button>
              <Button
                variant="outline"
                disabled={!selectedUpgradeId || scheduleUpgrade.isPending || isNavigating}
                isLoading={scheduleUpgrade.isPending}
                onClick={handleScheduleUpgrade}
                className="flex-1 sm:flex-none bg-background h-10! py-0! rounded-lg"
                leftIcon={<CalendarClock size={16} className="mr-1.5" />}
              >
                Schedule
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Downgrade */}
      {downgradeOptions.length > 0 && (
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-bg-secondary border rounded-xl p-5 gap-4 transition-all hover:border-border/80 hover:shadow-sm">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Downgrade Plan
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              Schedule a change to a lower tier for your next billing cycle.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Dropdown
              options={downgradeOptions.map((p: any) => ({
                value: p.id,
                label: p.package_name,
              }))}
              value={selectedDowngradeId}
              onChange={(value) => setSelectedDowngradeId(value)}
              placeholder="Select a lower plan…"
              className="w-full sm:w-50 mt-0! bg-background [&_button]:mt-0!"
            />
            <Button
              variant="outline"
              disabled={!selectedDowngradeId || scheduleDowngrade.isPending}
              isLoading={scheduleDowngrade.isPending}
              onClick={handleScheduleDowngrade}
              className="w-full sm:w-auto bg-background h-10! py-0! rounded-lg"
              leftIcon={<ArrowDownCircle size={16} className="mr-1.5" />}
            >
              Schedule
            </Button>
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
