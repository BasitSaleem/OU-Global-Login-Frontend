"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Zap, Users, Play, Clock, ExternalLink, AlertTriangle, Info, Repeat, FolderKanban, CalendarClock,
  Gauge,
} from "lucide-react";

import { OgOrganization } from "@/apiHooks.ts/organization/organization.types";
import {
  useOrBillingState,
  useOrResumePlan,
  useOrUndoDowngrade,
} from "@/apiHooks.ts/orBilling/orBilling.api";
import { OrBillingPlanOffer } from "@/apiHooks.ts/orBilling/orBilling.types";
import { generateOrSsoUrl } from "@/components/pages/Organizations/OrganizationOrItem";
import BillingCycleToggle, { BillingCycle } from "./BillingCycleToggle";
import InvoiceHistoryTable from "./InvoiceHistoryTable";
import OrCancelPlanModal from "@/components/modals/OrCancelPlanModal";
import OrDowngradePlanModal from "@/components/modals/OrDowngradePlanModal";
import { Button } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { SUBSCRIPTION_STATUS_COLOR } from "@/utils/ColorClasses";
import { formatDate } from "@/utils/helpers";

const TIER_ORDER = ["starter", "growth", "scale"] as const;

const TIER_STYLE: Record<string, { border: string; badge: string; text: string }> = {
  starter: {
    border: "border-gray-200 dark:border-gray-700",
    badge: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    text: "text-text",
  },
  growth: {
    border: "border-primary/40",
    badge: "bg-primary/10 text-primary",
    text: "text-primary",
  },
  scale: {
    border: "border-purple-400/40",
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    text: "text-purple-600 dark:text-purple-400",
  },
};

const usd = (minor: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(minor / 100);

interface OrBillingSectionProps {
  organization: OgOrganization;
  loading: boolean;
}

const OrBillingSection = ({ organization, loading }: OrBillingSectionProps) => {
  const router = useRouter();
  const orProduct = organization?.products?.find(
    (p) => p.product_name === "OR" && !p.is_blocked,
  );
  const {
    data: state,
    isLoading: stateLoading,
    error,
  } = useOrBillingState(organization?.id, !!orProduct);
  const { mutate: resumePlan, isPending: resuming } = useOrResumePlan(organization?.id);
  const { mutate: undoDowngrade, isPending: keeping } = useOrUndoDowngrade(organization?.id);
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [cancelOpen, setCancelOpen] = useState(false);
  const [downgradeTo, setDowngradeTo] = useState<string | null>(null);

  const subscription = state?.subscription ?? null;
  const isPaid =
    !!subscription &&
    !subscription.isTrial &&
    (subscription.status === "ACTIVE" || subscription.status === "PAST_DUE");
  const currentPlan = subscription?.plan ?? null;
  // A smaller plan that starts at the next renewal.
  const scheduled = isPaid ? (subscription!.scheduledChange ?? null) : null;

  // Show the customer's own billing cycle first once they are on a paid plan.
  useEffect(() => {
    if (isPaid && subscription)
      setCycle(subscription.billingCycle === "YEARLY" ? "yearly" : "monthly");
  }, [isPaid, subscription]);

  const plans = useMemo(
    () =>
      [...(state?.offers?.plans ?? [])].sort(
        (a, b) => TIER_ORDER.indexOf(a.code) - TIER_ORDER.indexOf(b.code),
      ),
    [state?.offers?.plans],
  );
  const yearlyAvailable = plans.some((p) => p.yearlyPriceMinor !== null);
  const bestSaving = Math.max(
    0,
    ...plans
      .filter((p) => p.yearlyPriceMinor !== null && p.monthlyPriceMinor > 0)
      .map((p) => Math.round((1 - p.yearlyPriceMinor! / (p.monthlyPriceMinor * 12)) * 100)),
  );

  const trialDaysLeft = subscription?.isTrial && subscription.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(subscription.trialEndsAt).getTime() - Date.now()) / 86400000))
    : null;

  const checkoutUrl = (query: string) =>
    `/organization-details/${organization.id}/billing/or-checkout?${query}`;

  const currentCycle: BillingCycle | null = isPaid
    ? subscription!.billingCycle === "YEARLY"
      ? "yearly"
      : "monthly"
    : null;
  // Viewing the other cycle's prices while on a paid plan: one note above the
  // plans explains it instead of a line on every card.
  const otherCycle = !!currentCycle && currentCycle !== cycle;

  function planAction(plan: OrBillingPlanOffer): {
    label: string;
    disabled: boolean;
    hint?: string;
    downgrade?: boolean;
  } {
    const wantsYearly = cycle === "yearly";
    if (wantsYearly && plan.yearlyPriceMinor === null)
      return { label: "Monthly only", disabled: true };
    if (!isPaid) return { label: "Choose plan", disabled: false };
    const currentRank = TIER_ORDER.indexOf((currentPlan?.code ?? "starter") as never);
    const rank = TIER_ORDER.indexOf(plan.code);
    if (currentPlan?.planId === plan.planId && !otherCycle)
      return { label: "Current plan", disabled: true };
    if (otherCycle) return { label: `Switch to ${cycle}`, disabled: true };
    if (rank === currentRank) return { label: "Current plan", disabled: true };
    if (rank < currentRank) {
      // Smaller plans start at the next renewal.
      if (scheduled?.code === plan.code)
        return { label: "Scheduled", disabled: true, hint: `Starts on ${formatDate(scheduled.effectiveDate)}.` };
      if (subscription!.cancelAtPeriodEnd)
        return { label: "Downgrade", disabled: true, hint: "Resume your plan to change it." };
      if (subscription!.status === "PAST_DUE")
        return { label: "Downgrade", disabled: true, hint: "Update your card to change plans." };
      return { label: "Downgrade", disabled: false, downgrade: true };
    }
    if (subscription!.cancelAtPeriodEnd)
      return { label: "Upgrade", disabled: true, hint: "Resume your plan to upgrade." };
    if (scheduled) return { label: "Upgrade", disabled: false, hint: "Replaces your scheduled downgrade." };
    return { label: "Upgrade", disabled: false };
  }

  if (loading || (orProduct && stateLoading)) {
    return (
      <div className="w-full mt-2 space-y-6">
        <Skeleton width="100%" height={120} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton width="100%" height={280} />
          <Skeleton width="100%" height={280} />
          <Skeleton width="100%" height={280} />
        </div>
      </div>
    );
  }

  if (!orProduct) {
    return (
      <div className="w-full bg-bg-secondary border border-border rounded-2xl p-6 mt-2">
        <p className="text-text-secondary">
          No active Owners Reach product found for this organization.
        </p>
      </div>
    );
  }

  if (error || !state) {
    return (
      <div className="w-full bg-bg-secondary border border-border rounded-2xl p-6 mt-2">
        <p className="text-text-secondary">
          {(error as Error)?.message || "Owners Reach billing is not available right now."}
        </p>
      </div>
    );
  }

  const anyHint = plans.some((plan) => !!planAction(plan).hint);

  return (
    <div className="w-full mt-2 space-y-6">
      {/* Current plan banner */}
      <div className="w-full bg-primary/10 border border-primary/20 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-text">
                {currentPlan ? currentPlan.name : "Owners Reach"}
              </h2>
              {subscription && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${SUBSCRIPTION_STATUS_COLOR[subscription.status] ?? "bg-gray-100 text-gray-600"}`}
                >
                  {subscription.isTrial ? "Trial" : subscription.status.toLowerCase().replace("_", " ")}
                </span>
              )}
            </div>
            {currentPlan && (
              <p className="text-text-secondary text-sm">
                {currentPlan.includedCredits.toLocaleString("en-US")} credits per month ·{" "}
                {currentPlan.seats} {currentPlan.seats === 1 ? "seat" : "seats"} ·{" "}
                {currentPlan.concurrentRuns} concurrent{" "}
                {currentPlan.concurrentRuns === 1 ? "run" : "runs"} · up to {currentPlan.maxPipelines} active{" "}
                {currentPlan.maxPipelines === 1 ? "campaign" : "campaigns"}
                {isPaid && ` · billed ${subscription!.billingCycle === "YEARLY" ? "yearly" : "monthly"}`}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2 text-sm">
              <Clock size={14} className="text-primary" />
              <span className="text-text-secondary">
                {subscription?.isTrial
                  ? trialDaysLeft && trialDaysLeft > 0
                    ? `${trialDaysLeft} trial ${trialDaysLeft === 1 ? "day" : "days"} remaining. Choose a plan to keep going.`
                    : "Your trial has ended. Choose a plan to keep using Owners Reach."
                  : isPaid && subscription!.cancelAtPeriodEnd
                    ? `Cancellation scheduled. Your plan ends on ${subscription!.cancellationEffectiveDate ? formatDate(subscription!.cancellationEffectiveDate) : "the end of the period"}.`
                    : isPaid && subscription!.currentPeriodEnd
                      ? `Renews on ${formatDate(subscription!.currentPeriodEnd)}`
                      : "Choose a plan to use Owners Reach."}
              </span>
            </div>
            {subscription?.status === "PAST_DUE" && (
              <div className="flex items-center gap-2 mt-2 text-sm text-red-500">
                <AlertTriangle size={14} />
                Your last payment failed. Update your card in Payment Methods.
              </div>
            )}
            {scheduled && (
              <div className="flex items-center gap-2 mt-2 text-sm text-amber-600 dark:text-amber-400">
                <CalendarClock size={14} />
                Moves to {scheduled.name} on {formatDate(scheduled.effectiveDate)}:{" "}
                {scheduled.includedCredits.toLocaleString("en-US")} credits per month, {scheduled.seats}{" "}
                {scheduled.seats === 1 ? "seat" : "seats"}.
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {scheduled && (
              <button
                type="button"
                disabled={keeping}
                onClick={() => undoDowngrade()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/40 bg-bg-secondary text-sm font-semibold text-primary hover:bg-primary/10 hover:border-primary transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {keeping ? "Keeping..." : `Keep ${currentPlan?.name ?? "current plan"}`}
              </button>
            )}
            {isPaid && !subscription!.cancelAtPeriodEnd && (
              <button
                type="button"
                onClick={() => setCancelOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/40 bg-bg-secondary text-sm font-semibold text-red-500 hover:bg-red-500/10 hover:border-red-500 transition-colors cursor-pointer"
              >
                Cancel plan
              </button>
            )}
            {isPaid && subscription!.cancelAtPeriodEnd && (
              <button
                type="button"
                disabled={resuming}
                onClick={() => resumePlan()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/40 bg-bg-secondary text-sm font-semibold text-primary hover:bg-primary/10 hover:border-primary transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {resuming ? "Resuming..." : "Resume plan"}
              </button>
            )}
            <button
              type="button"
              onClick={() =>
                window.open(
                  generateOrSsoUrl(organization.id, orProduct.id),
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/80 transition-colors text-sm cursor-pointer"
            >
              Open Owners Reach
              <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Available plans */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-text mb-1">Owners Reach Plans</h3>
            <p className="text-sm text-text-secondary">
              Prices in USD. Every plan includes monthly credits for lead discovery and enrichment.
            </p>
          </div>
          {yearlyAvailable && (
            <BillingCycleToggle
              value={cycle}
              onChange={setCycle}
              savingLabel={bestSaving > 0 ? `Save up to ${bestSaving}%` : "Yearly"}
            />
          )}
        </div>
        {otherCycle && plans.length > 0 && (
          <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
            <div className="bg-primary/10 p-2 rounded-lg shrink-0">
              <Repeat className="text-primary" size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-text">
                You are billed {currentCycle} today
              </h4>
              <p className="text-sm text-text-secondary mt-1">
                Switching to {cycle} billing will be available soon. {cycle === "yearly" ? "Yearly" : "Monthly"}{" "}
                prices are shown for reference.
              </p>
            </div>
          </div>
        )}
        {plans.length === 0 ? (
          <div className="bg-bg-secondary border border-border rounded-2xl p-6 text-center">
            <p className="text-text-secondary">Owners Reach plans are not available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => {
              const isCurrent = isPaid && currentPlan?.planId === plan.planId;
              const style = TIER_STYLE[plan.code] ?? TIER_STYLE.starter;
              const yearly = cycle === "yearly" && plan.yearlyPriceMinor !== null;
              const action = planAction(plan);
              return (
                <div
                  key={plan.planId}
                  className={`relative flex flex-col p-6 rounded-2xl border-2 transition-all ${
                    isCurrent
                      ? "border-primary bg-primary/5 shadow-sm"
                      : `${style.border} bg-bg-secondary hover:shadow-md`
                  }`}
                >
                  {plan.code === "growth" && !isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-[#1AD1B9] to-[#7C3AED] text-white text-[10px] font-bold px-4 py-1 rounded-lg shadow-md z-10">
                      Most Popular
                    </div>
                  )}
                  {isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-4 py-1 rounded-lg shadow-md z-10">
                      Current Plan
                    </div>
                  )}
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-text">{plan.name}</h4>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.badge}`}>
                      {plan.code.charAt(0).toUpperCase() + plan.code.slice(1)}
                    </span>
                  </div>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-3xl font-bold ${style.text}`}>
                        {usd(yearly ? plan.yearlyPriceMinor! : plan.monthlyPriceMinor)}
                      </span>
                      <span className="text-gray-400 text-sm font-medium">
                        {yearly ? "/year" : "/month"}
                      </span>
                    </div>
                    {yearly && (
                      <p className="text-xs text-text-secondary mt-1">
                        {usd(Math.round(plan.yearlyPriceMinor! / 12))}/month billed yearly
                      </p>
                    )}
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-text">
                      <Zap size={16} className="text-primary shrink-0" />
                      <span>{plan.includedCredits.toLocaleString("en-US")} credits every month</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text">
                      <Users size={16} className="text-primary shrink-0" />
                      <span>
                        {plan.seats} team {plan.seats === 1 ? "seat" : "seats"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text">
                      <Play size={16} className="text-primary shrink-0" />
                      <span>
                        {plan.concurrentRuns} concurrent {plan.concurrentRuns === 1 ? "run" : "runs"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text">
                      <FolderKanban size={16} className="text-primary shrink-0" />
                      <span>
                        Up to {plan.maxPipelines} active {plan.maxPipelines === 1 ? "campaign" : "campaigns"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text">
                      <Gauge size={16} className="text-primary shrink-0" />
                      <span>
                        Up to {plan.leadsPerRun.toLocaleString("en-US")} leads per run,{" "}
                        {plan.leadsPerDay.toLocaleString("en-US")} per day
                      </span>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <Button
                      variant={action.disabled ? "secondary" : "primary"}
                      className="w-full rounded-lg"
                      disabled={action.disabled}
                      onClick={() =>
                        action.downgrade
                          ? setDowngradeTo(plan.planId)
                          : router.push(
                              checkoutUrl(`plan=${plan.planId}&cycle=${yearly ? "yearly" : "monthly"}`),
                            )
                      }
                    >
                      {action.label}
                    </Button>
                    {/* Same height on every card so the buttons stay aligned. */}
                    {anyHint && (
                      <p className="flex items-center justify-center gap-1.5 min-h-4 mt-2 text-xs text-text-secondary">
                        {action.hint && (
                          <>
                            <Info size={12} className="shrink-0" />
                            {action.hint}
                          </>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Credit packs */}
      {(state.offers?.packs.length ?? 0) > 0 && (
        <div>
          <h3 className="text-lg font-bold text-text mb-1">Credit Packs</h3>
          <p className="text-sm text-text-secondary mb-4">
            {state.canBuyCredits
              ? "Need more this month? Purchased credits never expire and are used after your monthly credits. New credits can take up to a minute to appear in Owners Reach."
              : "Credit packs are available with a paid plan. You can add them when you choose a plan."}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {state.offers!.packs.map((pack) => (
              <div
                key={pack.packId}
                className="flex flex-col items-center p-4 bg-bg-secondary border border-border rounded-xl"
              >
                <Zap size={20} className="text-primary mb-2" />
                <span className="text-lg font-bold text-text">
                  {pack.credits.toLocaleString("en-US")}
                </span>
                <span className="text-xs text-text-secondary mb-1">credits</span>
                <span className="text-sm font-semibold text-primary mb-3">{usd(pack.priceMinor)}</span>
                <Button
                  variant="primary"
                  className="w-full rounded-lg"
                  disabled={!state.canBuyCredits}
                  onClick={() => router.push(checkoutUrl(`mode=credits&pack=${pack.packId}`))}
                >
                  Buy
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Owners Reach invoices */}
      <div>
        <h3 className="text-lg font-bold text-text">Invoices</h3>
        <InvoiceHistoryTable org={organization} product="OR" />
      </div>

      {isPaid && currentPlan && (
        <OrCancelPlanModal
          isOpen={cancelOpen}
          onClose={() => setCancelOpen(false)}
          orgId={organization.id}
          planName={currentPlan.name}
          periodEnd={subscription!.currentPeriodEnd}
          scheduledPlanName={scheduled?.name ?? null}
        />
      )}
      {isPaid && (
        <OrDowngradePlanModal
          isOpen={!!downgradeTo}
          onClose={() => setDowngradeTo(null)}
          orgId={organization.id}
          planId={downgradeTo}
        />
      )}
    </div>
  );
};

export default OrBillingSection;
