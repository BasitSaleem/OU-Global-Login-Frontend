"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CalendarClock,
  RefreshCw,
  ArrowDownCircle,
  ArrowUpCircle,
  Repeat,
  X,
  Loader2,
} from "lucide-react";

import { Button, Dropdown } from "@/components/ui";
import { OgOrganization } from "@/apiHooks.ts/organization/organization.types";
import {
  useSubscriptionState,
  useScheduleDowngrade,
  useScheduleUpgrade,
  useCancelScheduledChange,
  useChangeBillingFrequency,
  useCancelAddon,
  useUndoCancelAddon,
} from "@/apiHooks.ts/subscription/subscription.api";
import { useGetAllPlans } from "@/apiHooks.ts/plans/plans.api";
import { toast } from "@/hooks/useToast";
import { ApiError } from "@/utils/requestFunction";
import { formatDate } from "@/utils/helpers";

const SubscriptionPolicySection = ({
  organization,
}: {
  organization: OgOrganization;
}) => {
  const orgId = organization?.id;
  const sub = organization?.subscriptions?.[0];

  const { data: state, isLoading } = useSubscriptionState(orgId);
  const { data: plansData } = useGetAllPlans();

  const scheduleDowngrade = useScheduleDowngrade();
  const scheduleUpgrade = useScheduleUpgrade();
  const cancelScheduled = useCancelScheduledChange();
  const changeFrequency = useChangeBillingFrequency();
  const cancelAddon = useCancelAddon();
  const undoCancelAddon = useUndoCancelAddon();

  const [selectedDowngradeId, setSelectedDowngradeId] = useState("");
  const [selectedUpgradeId, setSelectedUpgradeId] = useState("");
  const router = useRouter();

  // Alternatives across ALL plan types, split by tier into upgrades / downgrades.
  // (Same-tier, different-type plans are treated as lateral moves and not shown.)
  const { upgradeOptions, downgradeOptions } = useMemo(() => {
    if (!plansData?.plans || !sub?.oiPackage)
      return { upgradeOptions: [], downgradeOptions: [] };
    const currentTier = sub.oiPackage?.tier_level; //tierFromName( ?? "");
    const others = plansData.plans.filter(
      (p) => p.is_active && p.id !== sub.oiPackage?.id,
    );
    return {
      upgradeOptions: others.filter((p) => p.tier_level > currentTier),
      downgradeOptions: others.filter((p) => p.tier_level < currentTier),
    };
  }, [plansData, sub?.oiPackage]);

  // Upgrades are immediate and need payment/billing/tax — route to checkout.
  const goToUpgradeCheckout = (planId: string) => {
    const cycle = state?.billingCycle === "YEARLY" ? "yearly" : "monthly";
    router.push(
      `/organization-details/${orgId}/billing/checkout/${planId}?billingCycle=${cycle}`,
    );
  };

  if (!sub || !orgId || isLoading || !state) return null;

  // Only relevant for live subscriptions.
  const isLive = state.status === "ACTIVE" || state.status === "PAST_DUE";
  const hasScheduledChange =
    state.planChangeScheduled || state.frequencyChangeScheduled;
  const canScheduleNew =
    isLive && !state.cancelAtPeriodEnd && !hasScheduledChange;

  const handleScheduleDowngrade = () => {
    if (!selectedDowngradeId) return;
    const payload = {
      orgId,
      subscriptionId: sub.id,
      packageId: selectedDowngradeId,
    };

    scheduleDowngrade.mutate(payload, {
      onSuccess: () => {
        toast.success(
          "Downgrade scheduled",
          "Your plan will change at the end of the current billing period.",
        );
        setSelectedDowngradeId("");
      },
      onError: (err: any) => {
        // 409 -> incompatible add-ons require explicit confirmation.
        if (err instanceof ApiError && err.statusCode === 409) {
          const incompatible: { id: string; name: string }[] =
            err.response?.data?.incompatibleAddons ?? [];
          const names = incompatible.map((a) => a.name).join(", ");
          const confirmed = window.confirm(
            `The following add-ons are not compatible with the new plan and will be removed on the effective date (no refund):\n\n${names}\n\nDo you want to continue?`,
          );
          if (confirmed) {
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
          }
        } else {
          toast.error("Downgrade failed", err?.message || "Please try again");
        }
      },
    });
  };

  const handleScheduleUpgrade = () => {
    if (!selectedUpgradeId) return;
    scheduleUpgrade.mutate(
      { orgId, subscriptionId: sub.id, packageId: selectedUpgradeId },
      { onSuccess: () => setSelectedUpgradeId("") },
    );
  };

  const handleFrequencyChange = () => {
    const target = state.billingCycle === "MONTHLY" ? "YEARLY" : "MONTHLY";
    const message =
      target === "YEARLY"
        ? "Switch to yearly billing now? Unused time on your monthly plan will be credited."
        : "Switch to monthly billing? This takes effect at your next renewal date.";
    if (!window.confirm(message)) return;
    changeFrequency.mutate({
      orgId,
      subscriptionId: sub.id,
      billingCycle: target,
    });
  };

  const handleCancelAddon = (addonId: string, name: string) => {
    if (
      !window.confirm(
        `Cancel the "${name}" add-on? You keep access until the end of the current billing period. No refund is issued.`,
      )
    )
      return;
    cancelAddon.mutate({ orgId, subscriptionId: sub.id, addonId });
  };

  if (!isLive) return null;

  return (
    <section className="w-full mt-5">
      <div className="text-center w-full md:text-left mb-6">
        <h1 className="text-heading-1 font-bold pt-8">Manage your plan</h1>
      </div>

      {/* Scheduled plan-change banner (upgrade or downgrade) */}
      {state.planChangeScheduled && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl px-4 py-3 mb-4">
          <div className="flex items-center gap-2">
            <CalendarClock className="text-amber-500" size={20} />
            <p className="text-sm text-text">
              {state.scheduledChangeType === "UPGRADE"
                ? "Upgraded to "
                : "Downgraded to "}
              <strong>{state.scheduledPackage?.name ?? "another plan"}</strong>{" "}
              scheduled for{" "}
              <strong>{formatDate(state.planChangeEffectiveDate!)}</strong>. You
              keep your current plan until then.
            </p>
          </div>
          <Button
            variant="outline"
            disabled={cancelScheduled.isPending}
            isLoading={cancelScheduled.isPending}
            onClick={() =>
              cancelScheduled.mutate({ orgId, subscriptionId: sub.id })
            }
            className="text-foreground hover:bg-primary/10 hover:text-primary py-4 shrink-0"
            leftIcon={<RefreshCw size={16} className="mr-1.5" />}
          >
            Undo
          </Button>
        </div>
      )}

      {/* Scheduled frequency change banner */}
      {state.frequencyChangeScheduled && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl px-4 py-3 mb-4">
          <div className="flex items-center gap-2">
            <Repeat className="text-blue-500" size={20} />
            <p className="text-sm text-text">
              Billing will switch to{" "}
              <strong>
                {state.scheduledBillingCycle === "MONTHLY"
                  ? "Monthly"
                  : "Yearly"}
              </strong>{" "}
              on <strong>{formatDate(state.frequencyChangeDate!)}</strong>.
            </p>
          </div>
          <Button
            variant="outline"
            disabled={cancelScheduled.isPending}
            isLoading={cancelScheduled.isPending}
            onClick={() =>
              cancelScheduled.mutate({ orgId, subscriptionId: sub.id })
            }
            className="text-foreground hover:bg-primary/10 hover:text-primary py-2 shrink-0"
            leftIcon={<RefreshCw size={16} className="mr-1.5" />}
          >
            Undo
          </Button>
        </div>
      )}

      {/* Pending incompatible removals warning */}
      {state.pendingIncompatibleRemovals.length > 0 && (
        <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl px-4 py-3 mb-4">
          <AlertTriangle className="text-red-500 mt-0.5" size={18} />
          <p className="text-sm text-text">
            These add-ons will be removed when your downgrade takes effect:{" "}
            <strong>
              {state.pendingIncompatibleRemovals.map((a) => a.name).join(", ")}
            </strong>
            . No refund is issued.
          </p>
        </div>
      )}

      {/* Actions (only when no change is already scheduled) */}
      {canScheduleNew && (
        <div className="flex flex-col gap-4">
          {/* Billing frequency */}
          <div className="flex flex-col sm:flex-row justify-between items-center w-full h-full bg-bg-secondary rounded-lg border px-4 py-3 gap-3 sm:gap-0">
            <p className="text-body-small">
              Billing frequency:{" "}
              <strong>
                {state.billingCycle === "MONTHLY" ? "Monthly" : "Yearly"}
              </strong>
            </p>
            <Button
              variant="outline"
              disabled={changeFrequency.isPending}
              isLoading={changeFrequency.isPending}
              onClick={handleFrequencyChange}
              className="text-foreground hover:bg-primary/10 hover:text-primary py-2"
              leftIcon={<Repeat size={16} className="mr-1.5" />}
            >
              {state.billingCycle === "MONTHLY"
                ? "Switch to Yearly"
                : "Switch to Monthly"}
            </Button>
          </div>

          {/* Upgrade — immediate (now) or scheduled to next cycle */}
          {upgradeOptions.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center w-full h-full bg-bg-secondary rounded-lg border px-4 py-3 gap-3 sm:gap-0">
              <p className="text-body-small">
                Upgrade your plan{" "}
                <span className="text-xs text-text-secondary">
                  (now or at next cycle)
                </span>
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <Dropdown
                  options={upgradeOptions.map((p) => ({
                    value: p.id,
                    label: p.package_name,
                  }))}
                  value={selectedUpgradeId}
                  onChange={(value) => setSelectedUpgradeId(value)}
                  placeholder="Select a higher plan…"
                  className="w-full sm:w-[220px] !mt-0"
                />
                <Button
                  variant="outline"
                  disabled={!selectedUpgradeId}
                  onClick={() => goToUpgradeCheckout(selectedUpgradeId)}
                  className="text-foreground hover:bg-primary/10 hover:text-primary py-4.5"
                  leftIcon={<ArrowUpCircle size={16} className="mr-1.5" />}
                >
                  Upgrade now
                </Button>
                <Button
                  variant="primary"
                  disabled={!selectedUpgradeId || scheduleUpgrade.isPending}
                  isLoading={scheduleUpgrade.isPending}
                  onClick={handleScheduleUpgrade}
                  className="py-4.5"
                  leftIcon={<CalendarClock size={16} className="mr-1.5" />}
                >
                  Schedule
                </Button>
              </div>
            </div>
          )}

          {/* Downgrade — always scheduled to the end of the billing period */}
          {downgradeOptions.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center w-full h-full bg-bg-secondary rounded-lg border px-4 py-3 gap-3 sm:gap-0">
              <p className="text-body-small">
                Schedule a downgrade{" "}
                <span className="text-xs text-text-secondary">
                  (applies at next cycle)
                </span>
              </p>
              <div className="flex items-center gap-2">
                <Dropdown
                  options={downgradeOptions.map((p) => ({
                    value: p.id,
                    label: p.package_name,
                  }))}
                  value={selectedDowngradeId}
                  onChange={(value) => setSelectedDowngradeId(value)}
                  placeholder="Select a lower plan…"
                  className="w-full sm:w-[250px] !mt-0"
                />
                <Button
                  variant="primary"
                  disabled={!selectedDowngradeId || scheduleDowngrade.isPending}
                  isLoading={scheduleDowngrade.isPending}
                  onClick={handleScheduleDowngrade}
                  className="py-4.5"
                  leftIcon={<ArrowDownCircle size={16} className="mr-1.5" />}
                >
                  Schedule
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active add-ons with cancellation control */}
      {state.addons.length > 0 && (
        <div className="mt-8">
          <div className="text-center w-full md:text-left mb-4">
            <h2 className="text-heading-2 font-bold">Your add-ons</h2>
          </div>
          <div className="flex flex-col gap-4">
            {state.addons.map((a) => (
              <div
                key={a.id}
                className="flex flex-col sm:flex-row justify-between items-center w-full h-full bg-bg-secondary rounded-lg border px-4 py-3 gap-3 sm:gap-0"
              >
                <span className="text-body-small font-medium text-text">
                  {a.name}
                  {a.quantity > 1 ? ` ×${a.quantity}` : ""}
                </span>
                {a.cancellationRequested ? (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-amber-600">
                      Removing on {formatDate(a.cancellationEffectiveDate!)}
                    </span>
                    <button
                      onClick={() =>
                        undoCancelAddon.mutate({
                          orgId,
                          subscriptionId: sub.id,
                          addonId: a.id,
                        })
                      }
                      disabled={undoCancelAddon.isPending}
                      className="flex items-center gap-1 text-sm text-primary hover:opacity-80 cursor-pointer disabled:opacity-50"
                    >
                      {undoCancelAddon.isPending ? (
                        <Loader2 className="animate-spin" size={14} />
                      ) : (
                        <RefreshCw size={14} />
                      )}{" "}
                      Undo
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleCancelAddon(a.id, a.name)}
                    disabled={cancelAddon.isPending}
                    className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 cursor-pointer disabled:opacity-50"
                  >
                    {cancelAddon.isPending ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <X size={16} />
                    )}{" "}
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default SubscriptionPolicySection;
